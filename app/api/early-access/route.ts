/**
 * POST /api/early-access
 *
 * Receives the early-access form submission, inserts it into Supabase,
 * and sends a notification email via Resend to the admin.
 *
 * Body shape: see EarlyAccessForm.tsx FormState + submittedAt
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendSignupNotification, sendSignupWelcome } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface EarlyAccessPayload {
  fullName: string
  email: string
  phone?: string
  persona: string
  specialty?: string
  otherSpecialty?: string
  institution?: string
  city: string
  nmcNumber?: string
  useCase?: string
  referral?: string
  agreeTerms: boolean
  newsletter?: boolean
  submittedAt: string
}

const PERSONAS = ['doctor', 'student', 'professional'] as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: EarlyAccessPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ─── Server-side validation (never trust the client) ───────────────────
  const errors: string[] = []
  if (!body.fullName?.trim()) errors.push('Full name is required')
  if (!body.email?.trim()) errors.push('Email is required')
  else if (!EMAIL_RE.test(body.email)) errors.push('Invalid email format')
  if (!body.persona || !PERSONAS.includes(body.persona as any)) {
    errors.push('Persona must be doctor, student, or professional')
  }
  if (!body.city?.trim()) errors.push('City is required')
  if (!body.agreeTerms) errors.push('You must agree to the Terms and Privacy Policy')
  // NMC optional, but validate format if provided
  if (body.nmcNumber && body.nmcNumber.trim() && !/^\d{4,8}$/.test(body.nmcNumber.trim())) {
    errors.push('NMC number must be 4–8 digits')
  }
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 422 })
  }

  // ─── Insert into Supabase ──────────────────────────────────────────────
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Backend not configured. Please try again later.' },
      { status: 503 }
    )
  }

  const row = {
    full_name: body.fullName.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone?.trim() || null,
    persona: body.persona,
    specialty: body.specialty || null,
    other_specialty: body.otherSpecialty?.trim() || null,
    institution: body.institution?.trim() || null,
    city: body.city.trim(),
    nmc_number: body.nmcNumber?.trim() || null,
    use_case: body.useCase?.trim() || null,
    referral_source: body.referral || null,
    newsletter_opt_in: body.newsletter !== false,
    ip_country: req.headers.get('x-vercel-ip-country') || null,
    user_agent: req.headers.get('user-agent')?.slice(0, 500) || null,
  }

  const { data, error: dbError } = await supabase
    .from('early_access_submissions')
    .insert(row)
    .select('id, created_at')
    .single()

  if (dbError) {
    console.error('[api/early-access] supabase insert failed:', dbError)
    // Don't leak DB error details to the client
    return NextResponse.json(
      { error: 'Could not save your request. Please try again.' },
      { status: 500 }
    )
  }

  // ─── Send emails (non-blocking — don't fail the request if email breaks) ─
  // We fire both in parallel and catch errors so a Resend hiccup doesn't
  // reject the user's submission.
  try {
    await Promise.allSettled([
      sendSignupNotification({ ...row, id: data.id, createdAt: data.created_at }),
      sendSignupWelcome({ fullName: row.full_name, email: row.email }),
    ])
  } catch (e) {
    console.error('[api/early-access] email send failed:', e)
    // Still return success — the row is in the DB, which is what matters
  }

  return NextResponse.json(
    { ok: true, id: data.id },
    { status: 201 }
  )
}

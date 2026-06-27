/**
 * POST /api/contact
 *
 * Receives the contact form submission, inserts it into Supabase,
 * and sends two emails:
 *   1. Admin notification (from hello@openinsight.in → admin inbox)
 *   2. Auto-reply to the user (from adii@openinsight.in → user inbox)
 *
 * Both emails are best-effort — the DB row is the source of truth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendContactNotification, sendContactAutoReply } from '@/lib/resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  submittedAt: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: ContactPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ─── Server-side validation ────────────────────────────────────────────
  const errors: string[] = []
  if (!body.name?.trim()) errors.push('Name is required')
  if (!body.email?.trim()) errors.push('Email is required')
  else if (!EMAIL_RE.test(body.email)) errors.push('Invalid email format')
  if (!body.subject?.trim()) errors.push('Subject is required')
  if (!body.message?.trim()) errors.push('Message is required')
  else if (body.message.trim().length < 10) errors.push('Message must be at least 10 characters')
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
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    subject: body.subject.trim(),
    message: body.message.trim(),
  }

  const { data, error: dbError } = await supabase
    .from('contact_messages')
    .insert(row)
    .select('id, created_at')
    .single()

  if (dbError) {
    console.error('[api/contact] supabase insert failed:', dbError)
    return NextResponse.json(
      { error: 'Could not send your message. Please try again.' },
      { status: 500 }
    )
  }

  // ─── Send emails (non-blocking — don't fail the request if email breaks) ─
  try {
    await Promise.allSettled([
      sendContactNotification(row),
      sendContactAutoReply({ name: row.name, email: row.email }),
    ])
  } catch (e) {
    console.error('[api/contact] email send failed:', e)
    // Still return success — the row is in the DB, which is what matters
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 })
}

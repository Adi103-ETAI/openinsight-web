/**
 * POST /api/contact
 *
 * Receives the contact form submission, inserts it into Supabase,
 * and sends a notification email via Resend to the admin.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

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

  // ─── Send admin notification email (best-effort) ───────────────────────
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'OpenInsight <hello@openinsight.in>'
  const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL

  if (RESEND_API_KEY && ADMIN_NOTIFY_EMAIL) {
    try {
      const resend = new Resend(RESEND_API_KEY)
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_NOTIFY_EMAIL,
        subject: `📩 Contact: ${row.subject}`,
        text: `
New contact form message.

Name:    ${row.name}
Email:   ${row.email}
Subject: ${row.subject}

Message:
${row.message}

— OpenInsight contact form
        `.trim(),
        html: `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #C56B4A; margin-bottom: 16px;">📩 New Contact Message</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 6px 12px 6px 0; color: #8A8884; font-weight: 500;">Name</td><td style="padding: 6px 0;">${escapeHtml(row.name)}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #8A8884; font-weight: 500;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(row.email)}" style="color: #C56B4A;">${escapeHtml(row.email)}</a></td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #8A8884; font-weight: 500;">Subject</td><td style="padding: 6px 0;">${escapeHtml(row.subject)}</td></tr>
  </table>
  <h3 style="margin-top: 24px; color: #1C1B1A;">Message</h3>
  <p style="color: #1C1B1A; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(row.message)}</p>
</div>
        `.trim(),
      })
    } catch (e) {
      console.error('[api/contact] email send failed:', e)
    }
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

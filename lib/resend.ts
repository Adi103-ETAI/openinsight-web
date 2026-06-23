/**
 * Resend email helpers.
 *
 * sendSignupNotification  → emails the admin team instantly when someone signs up
 * sendSignupWelcome       → emails the doctor/student a confirmation
 *
 * All emails are best-effort: if RESEND_API_KEY is unset or the request
 * fails, we log and move on. The DB row is the source of truth, not email.
 */

import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'OpenInsight <hello@openinsight.in>'
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL

function getResend(): Resend | null {
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[resend] RESEND_API_KEY not set — emails will not be sent')
    }
    return null
  }
  return new Resend(RESEND_API_KEY)
}

interface SignupRow {
  id: string
  createdAt: string
  full_name: string
  email: string
  phone: string | null
  persona: string
  specialty: string | null
  other_specialty: string | null
  institution: string | null
  city: string
  nmc_number: string | null
  use_case: string | null
  referral_source: string | null
  ip_country?: string | null
}

const PERSONA_LABEL: Record<string, string> = {
  doctor: 'Doctor (MBBS+)',
  student: 'Medical Student',
  professional: 'Other Healthcare Professional',
}

export async function sendSignupNotification(row: SignupRow) {
  const resend = getResend()
  if (!resend || !ADMIN_NOTIFY_EMAIL) return

  const subject = `🎉 New OpenInsight signup: ${row.full_name} (${PERSONA_LABEL[row.persona] || row.persona})`

  const text = `
New early access request received.

Name:        ${row.full_name}
Email:       ${row.email}
Phone:       ${row.phone || '—'}
Persona:     ${PERSONA_LABEL[row.persona] || row.persona}
Specialty:   ${row.specialty || '—'}${row.other_specialty ? ` (${row.other_specialty})` : ''}
Institution: ${row.institution || '—'}
City:        ${row.city}
NMC number:  ${row.nmc_number || '— (not provided)'}
Use case:    ${row.use_case || '—'}
Referral:    ${row.referral_source || '—'}
Country:     ${row.ip_country || '—'}

Submitted:   ${new Date(row.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

— OpenInsight validation backend
`.trim()

  const html = `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #C56B4A; margin-bottom: 4px;">🎉 New Early Access Signup</h2>
  <p style="color: #5A5955; margin-top: 0;">${row.full_name} — ${PERSONA_LABEL[row.persona] || row.persona}</p>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
    ${[
      ['Email', row.email],
      ['Phone', row.phone || '—'],
      ['Persona', PERSONA_LABEL[row.persona] || row.persona],
      ['Specialty', row.specialty ? (row.other_specialty ? `${row.specialty} (${row.other_specialty})` : row.specialty) : '—'],
      ['Institution', row.institution || '—'],
      ['City', row.city],
      ['NMC number', row.nmc_number || '— (not provided)'],
      ['Use case', row.use_case || '—'],
      ['Referral', row.referral_source || '—'],
      ['Country', row.ip_country || '—'],
      ['Submitted', new Date(row.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'],
    ].map(([k, v]) => `
      <tr>
        <td style="padding: 6px 12px 6px 0; color: #8A8884; font-weight: 500; vertical-align: top; white-space: nowrap;">${k}</td>
        <td style="padding: 6px 0; color: #1C1B1A;">${escapeHtml(String(v))}</td>
      </tr>
    `).join('')}
  </table>
  <p style="margin-top: 24px; font-size: 12px; color: #8A8884;">
    — Sent by OpenInsight validation backend
  </p>
</div>
  `.trim()

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_NOTIFY_EMAIL,
    subject,
    text,
    html,
  })
}

export async function sendSignupWelcome({ fullName, email }: { fullName: string; email: string }) {
  const resend = getResend()
  if (!resend) return

  const firstName = fullName.split(' ')[0]
  const subject = `You're on the list, ${firstName} 🩺`

  const text = `
Hi ${firstName},

Thanks for requesting early access to OpenInsight.

We're building clinical decision support specifically for Indian medical
practice — grounded in ICMR guidelines, CDSCO approvals, and NTEP protocols,
built for the realities of Indian healthcare.

We'll review your request and get back to you within 48 hours.

Meanwhile:
  • Follow us on Instagram: https://www.instagram.com/sentarc.ai/
  • Reply to this email with anything specific you'd want OpenInsight to do for you

— SentArc Labs team
https://openinsight.in
`.trim()

  const html = `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p style="font-size: 13px; color: #C56B4A; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">SENTARC LABS</p>
  <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1C1B1A; margin: 8px 0 16px;">You're on the list, ${escapeHtml(firstName)} 🩺</h1>
  <p style="color: #1C1B1A; line-height: 1.6;">Hi ${escapeHtml(firstName)},</p>
  <p style="color: #1C1B1A; line-height: 1.6;">
    Thanks for requesting early access to <strong>OpenInsight</strong>.
  </p>
  <p style="color: #5A5955; line-height: 1.6;">
    We're building clinical decision support specifically for Indian medical practice —
    grounded in ICMR guidelines, CDSCO approvals, and NTEP protocols, built for the
    realities of Indian healthcare.
  </p>
  <p style="color: #5A5955; line-height: 1.6;">
    We'll review your request and get back to you within <strong>48 hours</strong>.
  </p>
  <p style="color: #5A5955; line-height: 1.6; margin-top: 24px;">Meanwhile:</p>
  <ul style="color: #5A5955; line-height: 1.8;">
    <li>Follow us on <a href="https://www.instagram.com/sentarc.ai/" style="color: #C56B4A;">Instagram @sentarc.ai</a></li>
    <li>Reply to this email with anything specific you'd want OpenInsight to do for you</li>
  </ul>
  <p style="margin-top: 32px; color: #8A8884; font-size: 13px;">
    — SentArc Labs team<br/>
    <a href="https://openinsight.in" style="color: #C56B4A;">openinsight.in</a>
  </p>
</div>
  `.trim()

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject,
    text,
    html,
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

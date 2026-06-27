/**
 * Resend email helpers.
 *
 * Email architecture:
 *   ┌─────────────────────────┬──────────────────────────────────────────────┐
 *   │ Email type              │ FROM address                                 │
 *   ├─────────────────────────┼──────────────────────────────────────────────┤
 *   │ Admin notifications     │ OpenInsight <hello@openinsight.in>           │
 *   │ (signup alert, contact) │ (system/brand — internal)                    │
 *   ├─────────────────────────┼──────────────────────────────────────────────┤
 *   │ Early-access welcome    │ Adii <adii@openinsight.in>                   │
 *   │ (doctor-facing)         │ (founder — builds trust)                     │
 *   ├─────────────────────────┼──────────────────────────────────────────────┤
 *   │ Contact auto-reply      │ Adii <adii@openinsight.in>                   │
 *   │ (user-facing)           │ (founder — personal touch)                   │
 *   └─────────────────────────┴──────────────────────────────────────────────┘
 *
 * All emails are best-effort: if RESEND_API_KEY is unset or the request
 * fails, we log and move on. The DB row is the source of truth, not email.
 */

import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

// System/brand address — for internal admin notifications
const SYSTEM_FROM = process.env.RESEND_FROM_EMAIL || 'OpenInsight <hello@openinsight.in>'

// Founder address — for user-facing emails that build trust
// (Adii personally welcoming doctors & replying to contact messages)
const FOUNDER_FROM = process.env.RESEND_FOUNDER_EMAIL || 'Adii <adii@openinsight.in>'

// Where admin notification emails get sent (your inbox)
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

// ─── Early Access: Admin Notification ──────────────────────────────────

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
    from: SYSTEM_FROM,
    to: ADMIN_NOTIFY_EMAIL,
    subject,
    text,
    html,
  })
}

// ─── Early Access: Founder Welcome (doctor-facing) ─────────────────────

export async function sendSignupWelcome({ fullName, email }: { fullName: string; email: string }) {
  const resend = getResend()
  if (!resend) return

  const firstName = fullName.split(' ')[0]
  const subject = `Thanks for signing up, ${firstName} — I'll be in touch soon`

  const text = `
Hi ${firstName},

I'm Adii — I founded OpenInsight, and I wanted to personally thank you for
requesting early access.

A bit about why we're building this: I've seen firsthand how hard it is for
doctors in India to get quick, evidence-backed answers at the point of care.
Drug interactions, ICMR guideline lookups, differential diagnosis support —
it shouldn't take 20 minutes of Googling. That's the problem we're solving.

Your request is in, and I'll review it personally. You'll hear back from me
within 48 hours with your access details.

A couple of things in the meantime:
  • If there's a specific feature or use-case you'd love OpenInsight to
    handle, just reply to this email — I read every one.
  • Follow our journey on Instagram: https://www.instagram.com/sentarc.ai/

Looking forward to having you on board.

— Adii
Founder, OpenInsight
https://openinsight.in
`.trim()

  const html = `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p style="font-size: 13px; color: #C56B4A; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">FROM THE FOUNDER</p>
  <h1 style="font-family: Georgia, serif; font-size: 22px; color: #1C1B1A; margin: 8px 0 20px;">Thanks for signing up, ${escapeHtml(firstName)}</h1>

  <p style="color: #1C1B1A; line-height: 1.7;">Hi ${escapeHtml(firstName)},</p>

  <p style="color: #1C1B1A; line-height: 1.7;">
    I'm <strong>Adii</strong> — I founded OpenInsight, and I wanted to personally thank you for
    requesting early access.
  </p>

  <div style="background-color: #FAF6F1; border-left: 3px solid #C56B4A; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <p style="color: #5A5955; line-height: 1.7; margin: 0; font-size: 14px;">
      A bit about why we're building this: I've seen firsthand how hard it is for
      doctors in India to get quick, evidence-backed answers at the point of care.
      Drug interactions, ICMR guideline lookups, differential diagnosis support —
      it shouldn't take 20 minutes of Googling. <strong style="color: #1C1B1A;">That's the problem we're solving.</strong>
    </p>
  </div>

  <p style="color: #5A5955; line-height: 1.7;">
    Your request is in, and I'll review it personally. You'll hear back from me
    within <strong style="color: #1C1B1A;">48 hours</strong> with your access details.
  </p>

  <p style="color: #5A5955; line-height: 1.7; margin-top: 20px;">A couple of things in the meantime:</p>
  <ul style="color: #5A5955; line-height: 1.8; padding-left: 20px;">
    <li>If there's a specific feature or use-case you'd love OpenInsight to handle, just <strong style="color: #1C1B1A;">reply to this email</strong> — I read every one.</li>
    <li>Follow our journey on <a href="https://www.instagram.com/sentarc.ai/" style="color: #C56B4A;">Instagram @sentarc.ai</a></li>
  </ul>

  <p style="margin-top: 28px; color: #1C1B1A; line-height: 1.6;">
    Looking forward to having you on board.
  </p>

  <p style="margin-top: 24px; color: #8A8884; font-size: 13px; line-height: 1.6;">
    — Adii<br/>
    Founder, OpenInsight<br/>
    <a href="https://openinsight.in" style="color: #C56B4A;">openinsight.in</a>
  </p>
</div>
  `.trim()

  return resend.emails.send({
    from: FOUNDER_FROM,
    to: email,
    subject,
    text,
    html,
  })
}

// ─── Contact: Admin Notification ───────────────────────────────────────

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const resend = getResend()
  if (!resend || !ADMIN_NOTIFY_EMAIL) return

  return resend.emails.send({
    from: SYSTEM_FROM,
    to: ADMIN_NOTIFY_EMAIL,
    subject: `📩 Contact: ${subject}`,
    text: `
New contact form message.

Name:    ${name}
Email:   ${email}
Subject: ${subject}

Message:
${message}

— OpenInsight contact form
    `.trim(),
    html: `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #C56B4A; margin-bottom: 16px;">📩 New Contact Message</h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 6px 12px 6px 0; color: #8A8884; font-weight: 500;">Name</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #8A8884; font-weight: 500;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #C56B4A;">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding: 6px 12px 6px 0; color: #8A8884; font-weight: 500;">Subject</td><td style="padding: 6px 0;">${escapeHtml(subject)}</td></tr>
  </table>
  <h3 style="margin-top: 24px; color: #1C1B1A;">Message</h3>
  <p style="color: #1C1B1A; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
  <p style="margin-top: 24px; font-size: 12px; color: #8A8884;">
    — OpenInsight contact form
  </p>
</div>
    `.trim(),
  })
}

// ─── Contact: Auto-Reply (user-facing, from founder) ───────────────────

export async function sendContactAutoReply({
  name,
  email,
}: {
  name: string
  email: string
}) {
  const resend = getResend()
  if (!resend) return

  const firstName = name.split(' ')[0]
  const subject = `Got your message, ${firstName} — I'll get back to you soon`

  const text = `
Hi ${firstName},

Thanks for reaching out to OpenInsight. I'm Adii, the founder — I just saw
your message come in and wanted to let you know it's in the right hands.

I personally read every message that comes through our contact form, and I'll
get back to you within 1–2 business days. If it's urgent (especially if it's
related to onboarding or clinical content), feel free to reply to this email
or reach me at support@openinsight.in.

Talk soon.

— Adii
Founder, OpenInsight
https://openinsight.in
`.trim()

  const html = `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p style="font-size: 13px; color: #C56B4A; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">FROM THE FOUNDER</p>
  <h1 style="font-family: Georgia, serif; font-size: 22px; color: #1C1B1A; margin: 8px 0 20px;">Got your message, ${escapeHtml(firstName)}</h1>

  <p style="color: #1C1B1A; line-height: 1.7;">Hi ${escapeHtml(firstName)},</p>

  <p style="color: #1C1B1A; line-height: 1.7;">
    Thanks for reaching out to OpenInsight. I'm <strong>Adii</strong>, the founder —
    I just saw your message come in and wanted to let you know it's in the right hands.
  </p>

  <p style="color: #5A5955; line-height: 1.7;">
    I personally read every message that comes through our contact form, and I'll get
    back to you within <strong style="color: #1C1B1A;">1–2 business days</strong>.
  </p>

  <div style="background-color: #FAF6F1; border-left: 3px solid #C56B4A; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <p style="color: #5A5955; line-height: 1.7; margin: 0; font-size: 14px;">
      If it's urgent — especially if it's related to onboarding or clinical content —
      feel free to <strong style="color: #1C1B1A;">reply to this email</strong> or reach
      me at <a href="mailto:support@openinsight.in" style="color: #C56B4A;">support@openinsight.in</a>.
    </p>
  </div>

  <p style="margin-top: 20px; color: #1C1B1A; line-height: 1.6;">Talk soon.</p>

  <p style="margin-top: 24px; color: #8A8884; font-size: 13px; line-height: 1.6;">
    — Adii<br/>
    Founder, OpenInsight<br/>
    <a href="https://openinsight.in" style="color: #C56B4A;">openinsight.in</a>
  </p>
</div>
  `.trim()

  return resend.emails.send({
    from: FOUNDER_FROM,
    to: email,
    subject,
    text,
    html,
  })
}

// ─── Utility ───────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

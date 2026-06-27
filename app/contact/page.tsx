import type { Metadata } from 'next'
import SectionReveal from '@/components/SectionReveal'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | OpenInsight',
  description:
    'Get in touch with the OpenInsight team. Sales, support, partnerships, and feedback for the AI clinical decision support platform for healthcare professionals.',
  alternates: { canonical: '/contact' },
}

const contactInfo = [
  {
    label: 'General Enquiries',
    email: 'hello@openinsight.in',
    description: 'Partnerships, press, and product questions.',
  },
  {
    label: 'Doctor Support',
    email: 'support@openinsight.in',
    description: 'Onboarding help, NMC verification, and clinical content feedback.',
  },
]

const officeHours = [
  { day: 'Monday – Friday', hours: '10:00 – 18:00 IST' },
  { day: 'Saturday', hours: '10:00 – 14:00 IST' },
  { day: 'Sunday & Public Holidays', hours: 'Closed' },
]

export default function ContactPage() {
  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container text-center">
          <SectionReveal>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4">Talk to the OpenInsight team.</h1>
            <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto">
              Whether you&apos;re a doctor with a question, a hospital evaluating
              clinical AI, or a researcher interested in our evidence pipeline —
              we&apos;d love to hear from you.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Main content: form + info grid */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Form */}
            <SectionReveal>
              <div className="form-card">
                <h2>Send us a message</h2>
                <p className="form-subtitle">
                  We typically reply within 1–2 business days. Your message is
                  saved locally on this device until we connect you with the
                  right team.
                </p>
                <ContactForm />
              </div>
            </SectionReveal>

            {/* Right: Contact info + office hours + map */}
            <SectionReveal>
              <div className="info-stack">
                <div className="info-card">
                  <h3 className="info-heading">Get in touch</h3>
                  <ul className="info-list">
                    {contactInfo.map((item) => (
                      <li key={item.label} className="info-item">
                        <div className="info-label">{item.label}</div>
                        <a
                          href={
                            item.email.includes('@')
                              ? `mailto:${item.email}`
                              : `tel:${item.email.replace(/\s+/g, '')}`
                          }
                          className="info-value"
                        >
                          {item.email}
                        </a>
                        <p className="info-desc">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="info-card">
                  <h3 className="info-heading">Office hours</h3>
                  <ul className="hours-list">
                    {officeHours.map((row) => (
                      <li key={row.day} className="hours-row">
                        <span className="hours-day">{row.day}</span>
                        <span className="hours-time">{row.hours}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="info-note">
                    All times are Indian Standard Time (IST, UTC+5:30).
                  </p>
                </div>

                <div className="info-card">
                  <h3 className="info-heading">Office</h3>
                  <address className="address">
                    SentArc Labs<br />
                    Pune, Maharashtra<br />
                    India
                  </address>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="contact-cta">
        <div className="container text-center">
          <SectionReveal>
            <h2 className="text-white">Ready to try OpenInsight?</h2>
            <p className="text-white opacity-75 text-lg mt-4 max-w-2xl mx-auto">
              Request early access and join the closed beta for verified healthcare
              professionals.
            </p>
            <a href="/early-access" className="btn btn-primary mt-8">
              Request Early Access →
            </a>
          </SectionReveal>
        </div>
      </section>

      <style>{`
        .contact-page {
          background-color: var(--color-bg);
        }

        .contact-hero {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6) var(--spacing-8);
          border-bottom: 1px solid var(--color-border);
        }

        .eyebrow {
          color: var(--color-accent);
          font-weight: 600;
          font-size: var(--text-sm);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0;
        }

        .contact-hero h1 {
          margin: 0;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        .contact-main {
          padding: var(--spacing-12) var(--spacing-6);
          background-color: var(--color-bg);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: var(--spacing-8);
          align-items: start;
        }

        .form-card {
          background-color: var(--color-surface);
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
        }

        .form-card h2 {
          margin: 0 0 var(--spacing-1) 0;
          font-size: var(--text-2xl);
        }

        .form-subtitle {
          color: var(--color-text-2);
          font-size: var(--text-base);
          margin: 0 0 var(--spacing-4) 0;
          line-height: var(--lh-base);
        }

        .info-stack {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .info-card {
          background-color: var(--color-surface);
          padding: var(--spacing-4) var(--spacing-6);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
        }

        .info-heading {
          margin: 0 0 var(--spacing-3) 0;
          font-family: var(--font-display);
          font-size: var(--text-xl);
          color: var(--color-text);
          font-weight: 400;
        }

        .info-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .info-item {
          padding-bottom: var(--spacing-3);
          border-bottom: 1px solid var(--color-border);
        }

        .info-item:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .info-label {
          font-size: var(--text-xs);
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-3);
          font-weight: 600;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: var(--text-lg);
          color: var(--color-accent);
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          word-break: break-word;
        }

        .info-value:hover {
          color: var(--color-accent-2);
          text-decoration: underline;
        }

        .info-desc {
          font-size: var(--text-sm);
          color: var(--color-text-2);
          margin: 6px 0 0 0;
          line-height: var(--lh-base);
        }

        .hours-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .hours-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: var(--spacing-1) 0;
          border-bottom: 1px dashed var(--color-border);
        }

        .hours-row:last-child {
          border-bottom: none;
        }

        .hours-day {
          font-size: var(--text-base);
          color: var(--color-text);
          font-weight: 500;
        }

        .hours-time {
          font-size: var(--text-sm);
          color: var(--color-text-2);
          font-variant-numeric: tabular-nums;
        }

        .info-note {
          margin: var(--spacing-2) 0 0 0;
          font-size: var(--text-xs);
          color: var(--color-text-3);
        }

        .address {
          font-style: normal;
          font-size: var(--text-base);
          color: var(--color-text-2);
          line-height: var(--lh-base);
          margin: 0 0 var(--spacing-3) 0;
        }

        .contact-cta {
          background-color: var(--color-dark);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .contact-cta .btn {
          margin-top: var(--spacing-4);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .contact-hero {
            padding: var(--spacing-8) var(--spacing-3) var(--spacing-6);
          }

          .contact-main {
            padding: var(--spacing-6) var(--spacing-2);
          }

          .form-card,
          .info-card {
            padding: var(--spacing-4);
          }

          .hours-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
        }

      `}</style>
    </div>
  )
}

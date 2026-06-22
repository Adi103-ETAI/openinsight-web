import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import EarlyAccessForm from '@/components/EarlyAccessForm'

export const metadata: Metadata = {
  title: 'For Doctors | OpenInsight',
  description: 'How OpenInsight fits into your clinical practice. Evidence at the point of care, free for verified practitioners.',
}

export default function ForDoctorsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="doctors-hero">
        <div className="container text-center">
          <h1>Evidence at the point of care.</h1>
          <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto opacity-75">
            One answer. Structured. Sourced. Ready for your decision.
          </p>
        </div>
      </section>

      {/* Scenario 1 */}
      <section className="scenario-section">
        <div className="container">
          <SectionReveal>
            <div className="scenario-grid scenario-reverse">
              <div className="scenario-text">
                <h3>The busy OPD</h3>
                <p className="text-text-2 text-lg leading-relaxed mt-3">
                  You have 5 minutes per patient. You can't open three guidelines and a pharmacology reference. OpenInsight gives you one answer with the sources attached.
                </p>
                <p className="text-text-3 text-sm mt-4">
                  <strong>Traditional lookup:</strong> 12 minutes | <strong>OpenInsight:</strong> 40 seconds
                </p>
              </div>
              <div className="scenario-visual">
                <div className="scenario-card">
                  <div className="scenario-icon">⏱</div>
                  <p>From 5 different references to one answer in less than a minute.</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Scenario 2 */}
      <section className="scenario-section scenario-alt">
        <div className="container">
          <SectionReveal>
            <div className="scenario-grid">
              <div className="scenario-visual">
                <div className="scenario-card">
                  <div className="scenario-icon">🔗</div>
                  <p>Drug interactions checked against CDSCO schedules and NTEP comorbidity protocols automatically.</p>
                </div>
              </div>
              <div className="scenario-text">
                <h3>The unusual case</h3>
                <p className="text-text-2 text-lg leading-relaxed mt-3">
                  A 42-year-old with both Type 2 DM and active TB needs a tailored regimen. OpenInsight flags drug interactions, checks NTEP's DM-TB comorbidity protocol, and suggests monitoring parameters.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Scenario 3 */}
      <section className="scenario-section">
        <div className="container">
          <SectionReveal>
            <div className="scenario-grid scenario-reverse">
              <div className="scenario-text">
                <h3>Staying current</h3>
                <p className="text-text-2 text-lg leading-relaxed mt-3">
                  ICMR updates a guideline. You'll know — OpenInsight's corpus is updated weekly, and responses reflect the most recent evidence.
                </p>
              </div>
              <div className="scenario-visual">
                <div className="scenario-card">
                  <div className="scenario-icon">📅</div>
                  <p>Weekly evidence updates ensure you're always working with current guidelines.</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Free Section */}
      <section className="free-section">
        <div className="container text-center max-w-2xl mx-auto">
          <SectionReveal>
            <h2 className="mb-6">It's free</h2>
            <ul className="free-list">
              <li>✓ Free for all verified MBBS/MD/MS practitioners</li>
              <li>✓ Verify once with your NMC registration number</li>
              <li>✓ No subscriptions, no paywalls, no pharmaceutical sponsorship in your results</li>
            </ul>
            <p className="text-text-3 text-sm mt-8 leading-relaxed">
              <strong>Transparency note:</strong> OpenInsight may show sponsored educational content from pharmaceutical partners in a clearly labelled section — never in the clinical answer itself.
            </p>
            <div className="mt-8">
              <Link href="/evidence" className="btn btn-ghost-accent">
                See our evidence sources →
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA / Form */}
      <section className="cta-form-section">
        <div className="container max-w-2xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-8">
              <h2>Get Early Access</h2>
              <p className="text-text-2 mt-2">
                Join the beta. We'll verify your registration and send access details within 48 hours.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <EarlyAccessForm />
          </SectionReveal>
        </div>
      </section>

      <style>{`
        .doctors-hero {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
          text-align: center;
        }

        .doctors-hero h1 {
          max-width: 600px;
          margin: 0 auto;
        }

        .scenario-section {
          padding: var(--spacing-12) var(--spacing-6);
          background-color: var(--color-surface);
        }

        .scenario-alt {
          background-color: var(--color-surface-2);
        }

        .scenario-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-8);
          align-items: center;
        }

        .scenario-reverse {
          direction: rtl;
        }

        .scenario-reverse > * {
          direction: ltr;
        }

        .scenario-text h3 {
          margin: 0;
          margin-bottom: 8px;
          font-size: var(--text-2xl);
        }

        .scenario-visual .scenario-card {
          background-color: var(--color-surface-2);
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-3);
          min-height: 200px;
        }

        .scenario-icon {
          font-size: 48px;
          line-height: 1;
        }

        .scenario-card p {
          color: var(--color-text-2);
          font-size: var(--text-base);
          margin: 0;
        }

        .free-section {
          background-color: var(--color-surface-2);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .free-section h2 {
          margin: 0 0 var(--spacing-6) 0;
        }

        .free-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
          font-size: var(--text-lg);
          color: var(--color-text-2);
        }

        .free-list li {
          text-align: left;
        }

        .cta-form-section {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .cta-form-section h2 {
          margin: 0;
        }

        @media (max-width: 1024px) {
          .scenario-grid {
            grid-template-columns: 1fr;
          }

          .scenario-reverse {
            direction: ltr;
          }

          .scenario-visual {
            order: 2;
          }

          .scenario-text {
            order: 1;
          }
        }

        @media (max-width: 640px) {
          .scenario-card {
            min-height: 160px;
          }

          .scenario-icon {
            font-size: 36px;
          }

          .free-list {
            font-size: var(--text-base);
          }
        }
      `}</style>
    </div>
  )
}

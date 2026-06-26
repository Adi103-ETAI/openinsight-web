import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern your use of OpenInsight — eligibility, the clinical disclaimer, acceptable use, and limitations of liability.',
}

const lastUpdated = 'June 2026'

const sections = [
  { id: 'acceptance', label: 'Acceptance of terms' },
  { id: 'the-service', label: 'The service' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'clinical-disclaimer', label: 'Clinical disclaimer' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'accounts', label: 'Accounts & verification' },
  { id: 'ip', label: 'Intellectual property' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'fees', label: 'Fees' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'indemnity', label: 'Indemnity' },
  { id: 'termination', label: 'Termination' },
  { id: 'law', label: 'Governing law' },
  { id: 'changes', label: 'Changes' },
  { id: 'contact', label: 'Contact' },
]

export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="legal-hero">
        <div className="container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">
            Terms of Service
          </p>
          <h1 className="mt-4">The agreement between you and OpenInsight.</h1>
          <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto">
            Plain-language terms covering eligibility, the clinical disclaimer, acceptable use, and
            liability. Please read the clinical disclaimer carefully — it matters.
          </p>
          <p className="text-sm text-text-3 mt-6">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Body */}
      <section className="legal-body">
        <div className="container legal-layout">
          {/* Table of contents */}
          <aside className="legal-toc">
            <p className="legal-toc-label">On this page</p>
            <nav>
              <ul>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="legal-content">
            <SectionReveal>
              <h2 id="acceptance">Acceptance of terms</h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
                OpenInsight platform, website, and related services (the &ldquo;Service&rdquo;)
                operated by SentArc Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account,
                requesting access, or using the Service, you agree to these Terms. If you do not
                agree, you may not use the Service.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="the-service">The service</h2>
              <p>
                OpenInsight is a clinical decision-support tool that retrieves, synthesises, and
                cites medical evidence in response to de-identified clinical questions. It offers a
                Fast Search mode for quick lookups and a DeepInsight mode for complex multi-agent
                reasoning. The Service is intended to support — not replace — the clinical judgment
                of a licensed practitioner.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="eligibility">Eligibility</h2>
              <p>
                OpenInsight is available only to verified medical practitioners. To access the
                Service you must:
              </p>
              <ul className="legal-list">
                <li>Hold a valid <strong>NMC</strong> or <strong>State Medical Council</strong> registration.</li>
                <li>Be at least 18 years of age.</li>
                <li>Provide accurate verification information and keep it current.</li>
              </ul>
              <p>
                We may refuse or revoke access if verification cannot be confirmed, or if the
                information provided is inaccurate.
              </p>
            </SectionReveal>

            <SectionReveal>
              <div className="legal-callout">
                <h2 id="clinical-disclaimer">Clinical disclaimer</h2>
                <p>
                  <strong>OpenInsight is a decision-support tool, not a decision-maker.</strong> Every
                  response is a synthesised brief grounded in cited evidence. The treating physician
                  remains solely responsible for the final clinical decision, including diagnosis,
                  treatment, prescribing, and follow-up.
                </p>
                <p>
                  Evidence may be incomplete, outdated, or misapplied. Responses can reflect errors in
                  retrieval or synthesis. You must independently verify any answer against the cited
                  primary source and your own clinical judgment before acting on it.
                </p>
                <p className="legal-callout-note">
                  OpenInsight is not a medical device under the CDSCO framework and does not
                  diagnose, treat, or cure. It does not constitute medical advice and does not
                  create a doctor-patient relationship.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal>
              <h2 id="acceptable-use">Acceptable use</h2>
              <p>You agree not to:</p>
              <ul className="legal-list">
                <li>Use the Service to obtain clinical information for non-practitioners, or to circumvent practitioner verification.</li>
                <li>Enter patient-identifying data (names, hospital IDs, contact details) into clinical queries.</li>
                <li>Reverse-engineer, scrape, or attempt to extract the underlying evidence corpus or model outputs at scale.</li>
                <li>Resell, sublicense, or redistribute answers as a paid service without our written consent.</li>
                <li>Use the Service in any manner that could harm patients, violate applicable law, or infringe third-party rights.</li>
                <li>Attempt to disrupt, overload, or bypass the Service&rsquo;s rate limits and security controls.</li>
              </ul>
            </SectionReveal>

            <SectionReveal>
              <h2 id="accounts">Accounts &amp; verification</h2>
              <p>
                You are responsible for keeping your account credentials secure and for all activity
                under your account. You must not share access with non-verified individuals. If you
                suspect unauthorised access, notify us immediately at{' '}
                <a href="mailto:support@openinsight.in">support@openinsight.in</a>.
              </p>
              <p>
                We may suspend or terminate access if we believe verification was obtained
                fraudulently or the account is being misused.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="ip">Intellectual property</h2>
              <p>
                The Service — including the OpenInsight name, logo, software, retrieval pipeline,
                and interface — is owned by SentArc Labs and protected by intellectual-property
                laws. Cited evidence (guidelines, papers, drug labels) remains the property of its
                respective publishers; we surface it under fair use and licence.
              </p>
              <p>
                You retain ownership of the clinical queries you submit. By submitting a query, you
                grant us a limited licence to process it solely to provide and improve the Service,
                as described in our <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="feedback">Feedback</h2>
              <p>
                If you provide feedback, suggestions, or error reports (&ldquo;Feedback&rdquo;), you
                grant us a non-exclusive, royalty-free licence to use that Feedback to improve the
                Service. We will not share your identity in connection with Feedback without your
                consent.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="fees">Fees</h2>
              <p>
                OpenInsight is free for verified individual practitioners. Institutional plans (for
                hospitals, medical colleges, and NGOs) may be priced per seat under a separate
                agreement. We may introduce paid features in the future; existing free access for
                verified practitioners will not be revoked without notice.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="liability">Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, OpenInsight and SentArc Labs are provided
                &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind —
                express or implied — including accuracy, completeness, fitness for a particular
                purpose, or non-infringement.
              </p>
              <p>
                SentArc Labs shall not be liable for any indirect, incidental, special, or
                consequential damages, or for any loss arising from clinical decisions made in
                reliance on the Service. The Service is a support tool; the responsibility for
                patient outcomes rests with the treating physician.
              </p>
              <p>
                Our aggregate liability for any claim arising out of these Terms is limited to the
                amount you have paid us in the preceding twelve months, or one hundred rupees (₹100),
                whichever is greater.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="indemnity">Indemnity</h2>
              <p>
                You agree to indemnify and hold harmless SentArc Labs and its affiliates from any
                claim, loss, or damage arising from your misuse of the Service, your violation of
                these Terms, or your reliance on Service outputs in clinical decisions.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="termination">Termination</h2>
              <p>
                You may stop using the Service and request account deletion at any time. We may
                suspend or terminate your access if you breach these Terms, if your verification
                lapses, or if we discontinue the Service. Upon termination, your right to use the
                Service ends immediately.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="law">Governing law</h2>
              <p>
                These Terms are governed by the laws of India. Any dispute arising out of or
                relating to these Terms shall be subject to the exclusive jurisdiction of the courts
                at Pune, Maharashtra.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="changes">Changes</h2>
              <p>
                We may update these Terms as the Service evolves. Material changes will be announced
                via the early-access mailing list and reflected in the &ldquo;Last updated&rdquo;
                date. Continued use after a change constitutes acceptance of the revised Terms.
              </p>
            </SectionReveal>

            <SectionReveal>
              <div className="legal-contact">
                <h2 id="contact">Contact</h2>
                <p>
                  Questions about these Terms? Reach the SentArc Labs team:
                </p>
                <p className="legal-contact-detail">
                  <strong>SentArc Labs</strong><br />
                  Pune, Maharashtra, India<br />
                  <a href="mailto:hello@openinsight.in">hello@openinsight.in</a>
                </p>
                <p className="text-text-2">
                  See also our <Link href="/privacy">Privacy Policy</Link>.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      <style>{`
        .legal-hero {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
          text-align: center;
          border-bottom: 1px solid var(--color-border);
        }

        .legal-hero h1 {
          max-width: 720px;
          margin: 0 auto;
        }

        .legal-body {
          background-color: var(--color-surface-2);
          padding-top: var(--spacing-12);
          padding-bottom: var(--spacing-12);
        }

        .legal-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: var(--spacing-12);
          align-items: start;
        }

        .legal-toc {
          position: sticky;
          top: 96px;
        }

        .legal-toc-label {
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-3);
          margin: 0 0 var(--spacing-3) 0;
        }

        .legal-toc nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
          border-left: 2px solid var(--color-border);
        }

        .legal-toc nav li a {
          display: block;
          padding: 4px 0 4px var(--spacing-3);
          margin-left: -2px;
          font-size: var(--text-sm);
          color: var(--color-text-2);
          border-left: 2px solid transparent;
          transition: color var(--transition-fast), border-color var(--transition-fast);
        }

        .legal-toc nav li a:hover {
          color: var(--color-accent);
          border-left-color: var(--color-accent);
        }

        .legal-content {
          max-width: 760px;
        }

        .legal-content h2 {
          font-size: var(--text-2xl);
          margin: var(--spacing-10) 0 var(--spacing-4) 0;
          scroll-margin-top: 96px;
        }

        .legal-content h2:first-child {
          margin-top: 0;
        }

        .legal-content p {
          color: var(--color-text-2);
          font-size: var(--text-base);
          line-height: var(--lh-base);
          margin: 0 0 var(--spacing-4) 0;
        }

        .legal-content a {
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .legal-content a:hover {
          color: var(--color-accent-2);
        }

        .legal-list {
          list-style: none;
          padding: 0;
          margin: 0 0 var(--spacing-4) 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .legal-list li {
          position: relative;
          padding-left: var(--spacing-5);
          color: var(--color-text-2);
          font-size: var(--text-base);
          line-height: var(--lh-base);
        }

        .legal-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-accent);
        }

        .legal-list li strong {
          color: var(--color-text);
        }

        .legal-callout {
          background-color: var(--color-accent-pale);
          border-left: 4px solid var(--color-accent);
          border-radius: var(--radius-lg);
          padding: var(--spacing-5) var(--spacing-6);
          margin: var(--spacing-6) 0;
        }

        .legal-callout h2 {
          margin-top: 0;
        }

        .legal-callout p {
          color: var(--color-text);
        }

        .legal-callout-note {
          margin-top: var(--spacing-3) !important;
          font-size: var(--text-sm) !important;
          color: var(--color-text-2) !important;
          font-style: italic;
        }

        .legal-contact {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          margin-top: var(--spacing-6);
        }

        .legal-contact h2 {
          margin-top: 0;
        }

        .legal-contact-detail {
          background-color: var(--color-surface-2);
          border-radius: var(--radius-md);
          padding: var(--spacing-4);
          margin: var(--spacing-4) 0;
        }

        @media (max-width: 900px) {
          .legal-layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
          }

          .legal-toc {
            position: static;
          }

          .legal-toc nav ul {
            flex-direction: row;
            flex-wrap: wrap;
            border-left: none;
            border-top: 2px solid var(--color-border);
            padding-top: var(--spacing-3);
          }

          .legal-toc nav li a {
            border-left: none;
            padding: 4px var(--spacing-2);
          }
        }

        @media (max-width: 640px) {
          .legal-content h2 {
            font-size: var(--text-xl);
          }
        }
      `}</style>
    </div>
  )
}

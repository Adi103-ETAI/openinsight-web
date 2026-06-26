import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How OpenInsight and SentArc Labs handle data — what we collect, why, how long we keep it, and the rights you have over it.',
}

const lastUpdated = 'June 2026'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'what-we-collect', label: 'What we collect' },
  { id: 'how-we-use', label: 'How we use it' },
  { id: 'patient-data', label: 'Patient data' },
  { id: 'storage', label: 'Storage & security' },
  { id: 'cookies', label: 'Cookies & analytics' },
  { id: 'third-parties', label: 'Third-party services' },
  { id: 'your-rights', label: 'Your rights' },
  { id: 'retention', label: 'Data retention' },
  { id: 'children', label: 'Children' },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact' },
]

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="legal-hero">
        <div className="container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">
            Privacy Policy
          </p>
          <h1 className="mt-4">Your data, handled with clinical care.</h1>
          <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto">
            OpenInsight is a clinical decision-support tool. We hold ourselves to a higher
            standard than a typical web app — because the questions asked here are clinical.
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
              <h2 id="overview">Overview</h2>
              <p>
                SentArc Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;OpenInsight&rdquo;) operates a
                clinical decision-support platform that helps medical practitioners find
                evidence-backed answers at the point of care. This policy explains what data we
                collect, why we collect it, how long we keep it, and the choices you have.
              </p>
              <p>
                We follow the principles of the <strong>Digital Personal Data Protection Act,
                2023</strong> (India) and align with recognized health-data best practices. Where this
                policy refers to &ldquo;clinical queries&rdquo;, it means the de-identified questions you
                ask OpenInsight — not patient records.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="what-we-collect">What we collect</h2>
              <p>We keep data collection deliberately narrow. There are three categories:</p>

              <div className="legal-cards">
                <div className="legal-card">
                  <h4>Account & verification</h4>
                  <p>
                    Name, email, NMC / State Medical Council registration number, and specialty.
                    Collected only when you request early access, and used solely to verify that
                    you are a licensed practitioner before access is granted.
                  </p>
                </div>
                <div className="legal-card">
                  <h4>Clinical queries</h4>
                  <p>
                    The de-identified questions you ask OpenInsight (&ldquo;45-year-old male, HbA1c
                    9.2%, on metformin&hellip;&rdquo;). We <strong>do not require</strong> and
                    <strong> do not want</strong> patient names, hospital IDs, or contact details in
                    these queries.
                  </p>
                </div>
                <div className="legal-card">
                  <h4>Usage & technical</h4>
                  <p>
                    Pages visited, features used, browser type, device, and approximate region.
                    Collected in aggregate to improve the product. IP addresses are transient and
                    not linked to your clinical queries.
                  </p>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal>
              <h2 id="how-we-use">How we use it</h2>
              <ul className="legal-list">
                <li><strong>Verification</strong> — to confirm you are a licensed medical practitioner before granting access.</li>
                <li><strong>Service delivery</strong> — to answer your clinical queries and generate citation-ready summaries.</li>
                <li><strong>Quality improvement</strong> — to evaluate answer quality, fix errors, and improve retrieval.</li>
                <li><strong>Security</strong> — to detect abuse, rate-limit, and protect the service.</li>
                <li><strong>Communication</strong> — to send early-access updates and respond to support requests.</li>
              </ul>
              <p>
                We do <strong>not</strong> sell your data. We do <strong>not</strong> use clinical
                queries to train pharmaceutical-advertising models. Sponsored educational content,
                when present, is kept strictly separate from clinical responses.
              </p>
            </SectionReveal>

            <SectionReveal>
              <div className="legal-callout">
                <h2 id="patient-data">Patient data</h2>
                <p>
                  OpenInsight is not a patient-records system. No patient-identifying data is
                  required or stored through the search interface. We actively encourage — and our
                  UX prompts — de-identified clinical questions.
                </p>
                <p className="legal-callout-note">
                  If you accidentally include a patient&rsquo;s name or identifiers in a query,
                  contact us and we will purge that query from our logs.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal>
              <h2 id="storage">Storage &amp; security</h2>
              <p>
                Account and query data are stored on encrypted infrastructure. Access is
                role-restricted, logged, and reviewed. Clinical query logs are separated from
                account-identifying records wherever practical, so a query cannot be trivially
                traced back to a named individual.
              </p>
              <p>
                We use TLS in transit and encryption at rest. Internal access requires
                multi-factor authentication. Despite these measures, no system is perfectly secure
                — if a breach occurs, we will notify affected users promptly and in line with
                applicable law.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="cookies">Cookies &amp; analytics</h2>
              <p>
                We use a small set of cookies for session continuity and privacy-respecting
                analytics. We do not run advertising networks on OpenInsight and do not share
                identifiers with ad brokers.
              </p>
              <ul className="legal-list">
                <li><strong>Essential</strong> — login session, consent banner state. Required for the service to function.</li>
                <li><strong>Analytics</strong> — aggregate usage patterns (PostHog / Clarity). Used to improve the product. You can decline these.</li>
                <li><strong>Functional</strong> — preferred mode (Fast Search / DeepInsight), theme preferences.</li>
              </ul>
              <p>
                The cookie-consent banner lets you accept or decline non-essential cookies. You
                can change your choice at any time.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="third-parties">Third-party services</h2>
              <p>We rely on a small number of trusted processors:</p>
              <ul className="legal-list">
                <li><strong>Cloud infrastructure</strong> — to host the application and vector store.</li>
                <li><strong>Email delivery</strong> — to send early-access and support communications.</li>
                <li><strong>Analytics</strong> — aggregate product analytics, configured to minimise personal data.</li>
              </ul>
              <p>
                Each processor is bound by data-processing agreements and is only permitted to use
                data on our instructions. We do not transfer clinical query data outside the
                jurisdictions required to operate the service.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="your-rights">Your rights</h2>
              <p>Under the DPDP Act 2023 and equivalent protections, you have the right to:</p>
              <ul className="legal-list">
                <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
                <li><strong>Correct</strong> — fix inaccurate or outdated information.</li>
                <li><strong>Erase</strong> — request deletion of your account and associated query logs.</li>
                <li><strong>Withdraw consent</strong> — turn off non-essential cookies or analytics.</li>
                <li><strong>Data portability</strong> — receive your data in a structured, machine-readable format.</li>
                <li><strong>Grievance</strong> — raise a concern with our Grievance Officer (see Contact).</li>
              </ul>
              <p>
                To exercise any of these rights, email{' '}
                <a href="mailto:support@openinsight.in">support@openinsight.in</a>. We respond
                within 30 days.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="retention">Data retention</h2>
              <p>We keep data only as long as necessary:</p>
              <ul className="legal-list">
                <li><strong>Account data</strong> — retained while your account is active; deleted within 90 days of account closure.</li>
                <li><strong>Clinical query logs</strong> — anonymised and retained for up to 24 months for quality improvement, then aggregated and purged.</li>
                <li><strong>Verification records</strong> — kept for the duration of access to demonstrate practitioner verification.</li>
                <li><strong>Analytics</strong> — aggregated and retained per our analytics provider&rsquo;s policy; raw event data is rotated.</li>
              </ul>
            </SectionReveal>

            <SectionReveal>
              <h2 id="children">Children</h2>
              <p>
                OpenInsight is intended exclusively for licensed medical practitioners and is not
                directed at children. We do not knowingly collect data from anyone under 18. If you
                believe a minor has provided us information, contact us and we will delete it.
              </p>
            </SectionReveal>

            <SectionReveal>
              <h2 id="changes">Changes to this policy</h2>
              <p>
                We may update this policy as the product evolves. Material changes will be
                announced via the early-access mailing list and reflected in the &ldquo;Last
                updated&rdquo; date above. Continued use after a change constitutes acceptance.
              </p>
            </SectionReveal>

            <SectionReveal>
              <div className="legal-contact">
                <h2 id="contact">Contact</h2>
                <p>
                  SentArc Labs is the data controller. For privacy questions, data requests, or
                  grievances:
                </p>
                <p className="legal-contact-detail">
                  <strong>Grievance Officer, SentArc Labs</strong><br />
                  Pune, Maharashtra, India<br />
                  <a href="mailto:support@openinsight.in">support@openinsight.in</a>
                </p>
                <p className="text-text-2">
                  See also our <Link href="/terms">Terms of Service</Link>.
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

        /* Sticky table of contents */
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

        /* Content */
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

        /* Cards grid for the "what we collect" section */
        .legal-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-4);
          margin: var(--spacing-6) 0;
        }

        .legal-card {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .legal-card h4 {
          margin: 0;
          color: var(--color-accent);
          font-size: var(--text-base);
        }

        .legal-card p {
          margin: 0;
          font-size: var(--text-sm);
          color: var(--color-text-2);
        }

        /* Patient-data callout */
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

        /* Contact block */
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

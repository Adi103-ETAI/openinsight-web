import type { Metadata } from 'next'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'About | OpenInsight',
  description: 'Meet SentArc Labs. Built by someone who couldn\'t get in. Changing how Indian doctors access clinical evidence.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="about-hero">
        <div className="container text-center">
          <h1 style={{ fontStyle: 'italic' }}>
            Built by someone who couldn't get in.
          </h1>
          <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto">
            A genuine founder story — not a corporate pitch.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="story-section">
        <div className="container max-w-3xl mx-auto">
          <SectionReveal>
            <div className="story-text">
              <p>
                OpenInsight was started by Aditya Singh, a first-year BCA student and founder of SentArc Labs in Pune, who came to medicine as a NEET non-qualifier. He couldn't enter the domain as a practitioner — so he built a tool for the people who did.
              </p>
              <p>
                The medical representative has been the primary information channel for Indian doctors for decades. OpenInsight is the AI alternative: faster, more accurate, always available, and free from pharmaceutical incentives.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Company */}
      <section className="company-section">
        <div className="container max-w-2xl mx-auto text-center">
          <SectionReveal>
            <h2 className="company-title">
              <img
                src="/logos/sentarc-symbol.svg"
                alt=""
                aria-hidden="true"
                className="company-title-symbol"
              />
              <span>SentArc Labs</span>
            </h2>
            <div className="company-details">
              <div className="company-detail">
                <h4>Location</h4>
                <p>Pune, India</p>
              </div>
              <div className="company-detail">
                <h4>Focus</h4>
                <p>Applied AI for Indian healthcare</p>
              </div>
              <div className="company-detail">
                <h4>Mission</h4>
                <p>Make world-class clinical tools accessible to every Indian doctor</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Vision */}
      <section className="vision-section">
        <div className="container max-w-3xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2>What we're building toward</h2>
              <p className="text-text-2 mt-4">The six-layer vision</p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="vision-stack">
              {[
                {
                  number: 1,
                  title: 'Free clinical tool for doctors',
                  subtitle: 'Distribution',
                },
                {
                  number: 2,
                  title: 'Pharma intelligence platform',
                  subtitle: 'Understanding prescription patterns',
                },
                {
                  number: 3,
                  title: 'Sponsored CME content',
                  subtitle: 'Sustainable revenue',
                },
                {
                  number: 4,
                  title: 'CME / certification engine',
                  subtitle: 'Structured medical education',
                },
                {
                  number: 5,
                  title: 'Clinical trial recruitment',
                  subtitle: 'Connecting researchers to patients',
                },
                {
                  number: 6,
                  title: 'Hospital formulary management',
                  subtitle: 'Institutional layer',
                },
              ].map((item, idx) => (
                <div key={idx} className="vision-item">
                  <div className="vision-number">{item.number}</div>
                  <div className="vision-content">
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <style>{`
        .about-hero {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
          text-align: center;
        }

        .about-hero h1 {
          max-width: 700px;
          margin: 0 auto;
        }

        .story-section {
          background-color: var(--color-surface-2);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .story-text {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .story-text p {
          font-size: var(--text-lg);
          line-height: var(--lh-base);
          color: var(--color-text-2);
          margin: 0;
        }

        .company-section {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .company-section h2 {
          margin: 0;
        }

        /* SentArc symbol mark placed before the wordmark, matching the
           sentarc-labs-wordmark-alt.svg layout. The whole wordmark is scaled
           up (1.4x the h2 fluid size) and the symbol is sized larger than
           the text so it reads as the dominant brand mark. */
        .company-title {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.22em;
          color: var(--color-text);
          font-size: 1.4em;
          line-height: 1.1;
        }

        .company-title-symbol {
          width: 1.15em;
          height: 1.15em;
          flex-shrink: 0;
          display: block;
          /* Nudge the symbol down slightly so its optical centre aligns
             with the text's cap-height midline, like the reference wordmark. */
          transform: translateY(0.03em);
        }

        .company-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-6);
          /* Generous separation from the "SentArc Labs" title above so the
             column headers read as belonging to their own content, not the
             title. (Fixes "too close to sentarclabs".) */
          margin-top: var(--spacing-12);
        }

        .company-detail {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-1);
        }

        .company-detail h4 {
          color: var(--color-accent);
          margin: 0;
          font-size: var(--text-lg);
        }

        .company-detail p {
          color: var(--color-text-2);
          margin: 0;
          font-size: var(--text-base);
        }

        .vision-section {
          background-color: var(--color-surface-2);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .vision-stack {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .vision-item {
          display: flex;
          gap: var(--spacing-4);
          align-items: start;
          padding: var(--spacing-4);
          background-color: var(--color-surface);
          border-radius: var(--radius-lg);
          border-left: 4px solid var(--color-accent);
        }

        .vision-number {
          min-width: 40px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-accent-pale);
          color: var(--color-accent);
          border-radius: 50%;
          font-weight: 600;
          font-size: var(--text-lg);
          flex-shrink: 0;
        }

        .vision-content h4 {
          margin: 0 0 4px 0;
          color: var(--color-text);
          font-size: var(--text-lg);
        }

        .vision-content p {
          margin: 0;
          color: var(--color-text-2);
          font-size: var(--text-sm);
        }

        @media (max-width: 768px) {
          .company-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

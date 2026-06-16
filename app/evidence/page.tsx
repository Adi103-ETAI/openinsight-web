import type { Metadata } from 'next'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Evidence | OpenInsight',
  description: 'Explore the data sources, evidence quality markers, and transparency behind OpenInsight clinical answers.',
}

const evidenceSources = [
  { name: 'ICMR Guidelines', type: 'National protocols', frequency: 'Monthly', coverage: 'All major diseases' },
  { name: 'CDSCO Drug Database', type: 'Regulatory', frequency: 'Bi-weekly', coverage: 'Approved drugs & schedules' },
  { name: 'NTEP (TB)', type: 'National programme', frequency: 'Quarterly', coverage: 'Drug-resistant TB, PMDT' },
  { name: 'NVBDCP', type: 'Vector-borne disease', frequency: 'Quarterly', coverage: 'Malaria, Dengue, Filariasis' },
  { name: 'State STGs', type: 'State guidelines', frequency: 'Variable', coverage: 'State-specific protocols' },
  { name: 'PubMed Central (OA)', type: 'Research literature', frequency: 'Weekly', coverage: 'Open-access journals' },
  { name: 'WHO India', type: 'Global-regional', frequency: 'Monthly', coverage: 'International guidance' },
  { name: 'Cochrane Reviews', type: 'Meta-analyses', frequency: 'Quarterly', coverage: 'High-evidence syntheses' },
]

export default function EvidencePage() {
  return (
    <div>
      {/* Hero */}
      <section className="evidence-hero">
        <div className="container text-center">
          <h1>India's clinical knowledge, organised.</h1>
          <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto">
            OpenInsight is only as good as its sources. Here's exactly what we include — and why.
          </p>
        </div>
      </section>

      {/* Sources Table */}
      <section className="sources-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                Our Data Sources
              </p>
              <h2 className="mt-4">Curated, prioritised, India-first</h2>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="sources-table">
              <div className="table-header">
                <div className="table-cell">Source</div>
                <div className="table-cell">Type</div>
                <div className="table-cell">Update Frequency</div>
                <div className="table-cell">Coverage</div>
              </div>
              {evidenceSources.map((source, idx) => (
                <div key={idx} className={`table-row ${idx % 2 === 0 ? 'even' : ''}`}>
                  <div className="table-cell font-semibold">{source.name}</div>
                  <div className="table-cell text-sm">{source.type}</div>
                  <div className="table-cell text-sm">{source.frequency}</div>
                  <div className="table-cell text-sm">{source.coverage}</div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="what-we-dont-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2>What we don't do</h2>
              <p className="text-text-2 mt-4">Honest about our limits</p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="dont-list">
              <div className="dont-item">
                <div className="dont-number">1</div>
                <div className="dont-content">
                  <h4>We don't replace clinical judgment</h4>
                  <p>OpenInsight is a decision support tool, not a diagnostic engine. The final clinical decision always rests with the doctor.</p>
                </div>
              </div>

              <div className="dont-item">
                <div className="dont-number">2</div>
                <div className="dont-content">
                  <h4>We don't hide our sources</h4>
                  <p>Every response shows where the information came from. If you disagree with the synthesis, the raw evidence is always visible.</p>
                </div>
              </div>

              <div className="dont-item">
                <div className="dont-number">3</div>
                <div className="dont-content">
                  <h4>We don't accept payments to influence clinical answers</h4>
                  <p>Sponsored content is always clearly separated from clinical responses. Your clinical answer is never influenced by pharmaceutical incentives.</p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Evidence Quality */}
      <section className="quality-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2>Evidence quality markers</h2>
              <p className="text-text-2 mt-4">Each response shows which tier of evidence it's drawing from</p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="quality-grid">
              {[
                { level: 'RCT', description: 'Randomised Controlled Trial — highest quality for intervention evidence' },
                { level: 'Meta-analysis', description: 'Systematic review of multiple studies — comprehensive synthesis' },
                { level: 'National Guideline', description: 'ICMR, NTEP, CDSCO — authoritative for India' },
                { level: 'Expert Consensus', description: 'Specialist panel recommendation — when evidence is limited' },
                { level: 'Case Series', description: 'Observational data — lower evidence but valuable for rare conditions' },
              ].map((item, idx) => (
                <div key={idx} className="quality-card">
                  <div className="quality-badge">{item.level}</div>
                  <p className="text-sm text-text-2">{item.description}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <style>{`
        .evidence-hero {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
          text-align: center;
        }

        .evidence-hero h1 {
          max-width: 700px;
          margin: 0 auto;
        }

        .sources-section {
          background-color: var(--color-surface-2);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .sources-table {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: var(--color-surface);
        }

        .table-header {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background-color: var(--color-dark);
          color: white;
          font-weight: 600;
          font-size: var(--text-sm);
          gap: var(--spacing-2);
          padding: var(--spacing-3);
        }

        .table-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-2);
          padding: var(--spacing-3);
          border-bottom: 1px solid var(--color-border);
          align-items: start;
        }

        .table-row.even {
          background-color: var(--color-surface-2);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-cell {
          font-size: var(--text-sm);
          color: var(--color-text-2);
          line-height: var(--lh-base);
        }

        .table-cell.font-semibold {
          font-weight: 600;
          color: var(--color-text);
        }

        .what-we-dont-section {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .dont-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
          max-width: 800px;
          margin: 0 auto;
        }

        .dont-item {
          display: flex;
          gap: var(--spacing-4);
        }

        .dont-number {
          min-width: 48px;
          width: 48px;
          height: 48px;
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

        .dont-content h4 {
          margin: 0 0 8px 0;
          font-size: var(--text-lg);
        }

        .dont-content p {
          margin: 0;
          color: var(--color-text-2);
          font-size: var(--text-base);
          line-height: var(--lh-base);
        }

        .quality-section {
          background-color: var(--color-surface-2);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .quality-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-4);
        }

        .quality-card {
          background-color: var(--color-surface);
          padding: var(--spacing-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .quality-badge {
          display: inline-block;
          background-color: var(--color-accent-pale);
          color: var(--color-accent);
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        @media (max-width: 1024px) {
          .table-header,
          .table-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .table-header {
            display: none;
          }

          .table-row {
            grid-template-columns: 1fr;
            gap: var(--spacing-2);
          }

          .table-row::before {
            content: '';
            display: block;
            font-weight: 600;
            color: var(--color-text);
            margin-bottom: var(--spacing-1);
          }
        }
      `}</style>
    </div>
  )
}

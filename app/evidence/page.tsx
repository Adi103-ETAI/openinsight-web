import type { Metadata } from 'next'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Evidence | OpenInsight',
  description: 'Explore the data sources, evidence quality markers, and transparency behind OpenInsight clinical answers.',
}

const evidenceSources = [
  { name: 'ICMR Guidelines', type: 'National protocols', frequency: 'Monthly', coverage: 'All major diseases', status: 'Live' },
  { name: 'CDSCO Drug Database', type: 'Regulatory', frequency: 'Bi-weekly', coverage: 'Approved drugs & schedules', status: 'Live' },
  { name: 'NTEP (TB)', type: 'National programme', frequency: 'Quarterly', coverage: 'Drug-resistant TB, PMDT', status: 'Live' },
  { name: 'NVBDCP', type: 'Vector-borne disease', frequency: 'Quarterly', coverage: 'Malaria, Dengue, Filariasis', status: 'Live' },
  { name: 'State STGs', type: 'State guidelines', frequency: 'Variable', coverage: 'State-specific protocols', status: 'Live' },
  { name: 'PubMed Central (OA)', type: 'Research literature', frequency: 'Weekly', coverage: 'Open-access journals', status: 'Live' },
  { name: 'WHO India', type: 'Global-regional', frequency: 'Monthly', coverage: 'International guidance', status: 'Live' },
  { name: 'Cochrane Reviews', type: 'Meta-analyses', frequency: 'Quarterly', coverage: 'High-evidence syntheses', status: 'Live' },
]

interface SourceGroup {
  group: string
  items: string[]
}

interface SourceCategory {
  category: string
  count: number
  status: 'Live' | 'Abstracts'
  description: string
  sources: SourceGroup[]
}

const sourceRegistry: SourceCategory[] = [
  {
    category: 'Peer-Reviewed Indian Medical Journals',
    count: 17,
    status: 'Live',
    description: 'Core and specialty journals from India’s leading medical institutions and societies — indexed via IndMED and PubMed Central’s India collection.',
    sources: [
      { group: 'Core General Medicine', items: [
        'Indian Journal of Medical Research (IJMR)',
        'The National Medical Journal of India (NMJI)',
        'Journal of the Association of Physicians of India (JAPI)',
        'Journal of the Indian Medical Association (JIMA)',
        'Indian Journal of Medical Sciences (IJMS)',
      ]},
      { group: 'Specialty Journals', items: [
        'Indian Journal of Anaesthesia (IJA)',
        'Indian Journal of Dermatology, Venereology and Leprology (IJDVL)',
        'Indian Journal of Ophthalmology (IJO)',
        'Indian Journal of Pediatrics (IJP)',
        'Indian Journal of Psychiatry (IJP)',
        'Indian Journal of Surgery (IJS)',
        'Indian Heart Journal (IHJ)',
        'Journal of Postgraduate Medicine (JPGM)',
        'Journal of Medical and Allied Sciences (JMAS)',
      ]},
      { group: 'Aggregators & Databases', items: [
        'IndMED (National Informatics Centre)',
        'Medknow Publications (Wolters Kluwer India)',
        'PubMed Central — India collection',
      ]},
    ],
  },
  {
    category: 'Clinical Guidelines & Regulatory Bodies',
    count: 17,
    status: 'Live',
    description: 'Apex regulatory bodies, specialty society consensus statements, and national health programme guidelines.',
    sources: [
      { group: 'Apex Bodies', items: [
        'Indian Council of Medical Research (ICMR)',
        'National Medical Commission (NMC)',
        'Central Drugs Standard Control Organization (CDSCO)',
        'Directorate General of Health Services (DGHS)',
      ]},
      { group: 'Specialty Societies', items: [
        'Cardiological Society of India (CSI)',
        'Endocrine Society of India',
        'Research Society for the Study of Diabetes in India (RSSDI)',
        'Indian Radiological and Imaging Association (IRIA)',
        'Association of Physicians of India (API)',
        'Indian Association of Gastrointestinal Endosurgeons (IAGES)',
        'Indian Society of Nephrology (ISN)',
        'Indian Society of Critical Care Medicine (ISCCM)',
        'Indian Academy of Pediatrics (IAP)',
      ]},
      { group: 'National Health Programs', items: [
        'National Tuberculosis Elimination Programme (NTEP)',
        'National Vector Borne Disease Control Programme (NVBDCP)',
        'National AIDS Control Organisation (NACO)',
        'National Health Mission (NHM) — program guidelines',
      ]},
    ],
  },
  {
    category: 'Drug Information & Pharmacopoeia',
    count: 9,
    status: 'Live',
    description: 'Official pharmacopoeia, national formularies, pharmacovigilance data, and clinical trial registries.',
    sources: [
      { group: 'Official Pharmacopoeia & Formularies', items: [
        'Indian Pharmacopoeia Commission (IPC)',
        'Indian Pharmacopoeia (IP)',
        'National Formulary of India (NFI)',
        'CDSCO — SUGAM Portal',
        'New Drugs & Clinical Trials Rules, 2019',
      ]},
      { group: 'Pharmacovigilance', items: [
        'Pharmacovigilance Programme of India (PvPI)',
        'National Coordination Centre (NCC) — IPC',
        'VigiFlow / VigiBase (WHO-Uppsala Monitoring Centre)',
      ]},
      { group: 'Clinical Trials', items: [
        'Clinical Trials Registry — India (CTRI)',
      ]},
    ],
  },
  {
    category: 'Epidemiological & Public Health Data',
    count: 7,
    status: 'Live',
    description: 'National surveys, disease registries, and surveillance data grounding answers in local epidemiology.',
    sources: [
      { group: 'Surveys & Registries', items: [
        'National Family Health Survey (NFHS)',
        'National Centre for Disease Informatics and Research (NCDIR)',
        'National Cancer Registry Programme (NCRP)',
        'Integrated Disease Surveillance Programme (IDSP)',
      ]},
      { group: 'Health Portals', items: [
        'National Health Portal (NHP) — MoHFW',
        'AYUSH Ministry — traditional medicine guidelines',
        'Census of India — health demographics',
      ]},
    ],
  },
  {
    category: 'International Sources',
    count: 9,
    status: 'Abstracts',
    description: 'Global literature and guidelines layered on top of India-deep coverage. Full text where open access; abstracts and metadata indexed via PubMed/MEDLINE otherwise.',
    sources: [
      { group: 'Literature Databases', items: [
        'PubMed / MEDLINE',
        'Cochrane Library',
        'Directory of Open Access Journals (DOAJ)',
      ]},
      { group: 'Flagship Journals', items: [
        'The Lancet',
        'The New England Journal of Medicine (NEJM)',
        'JAMA Network',
        'BMJ (British Medical Journal)',
      ]},
      { group: 'Guidelines', items: [
        'WHO Guidelines',
        'NICE Guidelines (UK) — adapted where relevant',
      ]},
    ],
  },
]

export default function EvidencePage() {
  return (
    <div>
      {/* Hero */}
      <section className="evidence-hero">
        <div className="container text-center">
          <h1>Clinical knowledge, organised.</h1>
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
              <h2 className="mt-4">Curated, prioritised, clinically relevant</h2>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="sources-table">
              <div className="table-header">
                <div className="table-cell">Source</div>
                <div className="table-cell">Type</div>
                <div className="table-cell">Update Frequency</div>
                <div className="table-cell">Coverage</div>
                <div className="table-cell">Status</div>
              </div>
              {evidenceSources.map((source, idx) => (
                <div key={idx} className={`table-row ${idx % 2 === 0 ? 'even' : ''}`}>
                  <div className="table-cell font-semibold">{source.name}</div>
                  <div className="table-cell text-sm">{source.type}</div>
                  <div className="table-cell text-sm">{source.frequency}</div>
                  <div className="table-cell text-sm">{source.coverage}</div>
                  <div className="table-cell text-sm">
                    <span className="status-pill status-live">{source.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Full Source Registry */}
      <section className="registry-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                Full Source Registry
              </p>
              <h2 className="mt-4">India-deep, global-broad</h2>
              <p className="text-text-2 text-lg mt-4 max-w-2xl mx-auto">
                59 sources across 5 categories — the complete corpus behind every OpenInsight answer. Click a category to expand.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="registry-grid">
              {sourceRegistry.map((cat, idx) => (
                <details key={idx} className="registry-card" open={idx === 0}>
                  <summary className="registry-summary">
                    <div className="registry-summary-left">
                      <span className="registry-count">{cat.count}</span>
                      <span className="registry-title">{cat.category}</span>
                    </div>
                    <span className={`status-pill status-${cat.status.toLowerCase()}`}>{cat.status}</span>
                  </summary>
                  <div className="registry-body">
                    <p className="registry-desc">{cat.description}</p>
                    {cat.sources.map((group, gidx) => (
                      <div key={gidx} className="registry-group">
                        <h5 className="registry-group-title">{group.group}</h5>
                        <ul className="registry-list">
                          {group.items.map((item, iidx) => (
                            <li key={iidx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="what-we-dont-section bg-dot-grid">
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
                { level: 'National Guideline', description: 'ICMR, NTEP, CDSCO — authoritative national & regulatory sources' },
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
          grid-template-columns: 2fr 1.3fr 1fr 1.5fr 0.8fr;
          background-color: var(--color-dark);
          color: white;
          font-weight: 600;
          font-size: var(--text-sm);
          gap: var(--spacing-2);
          padding: var(--spacing-3);
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.3fr 1fr 1.5fr 0.8fr;
          gap: var(--spacing-2);
          padding: var(--spacing-3);
          border-bottom: 1px solid var(--color-border);
          align-items: center;
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

        .status-pill {
          display: inline-block;
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          white-space: nowrap;
        }

        .status-live {
          background-color: var(--color-accent-pale);
          color: var(--color-accent);
        }

        .status-abstracts {
          background-color: var(--color-surface);
          color: var(--color-text-2);
          border: 1px solid var(--color-border);
        }

        .registry-section {
          background-color: var(--color-surface);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .registry-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          max-width: 900px;
          margin: 0 auto;
        }

        .registry-card {
          background-color: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .registry-card[open] {
          border-color: var(--color-accent);
        }

        .registry-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4) var(--spacing-5);
          cursor: pointer;
          list-style: none;
          gap: var(--spacing-3);
          user-select: none;
        }

        .registry-summary::-webkit-details-marker {
          display: none;
        }

        .registry-summary::after {
          content: '+';
          font-size: var(--text-xl);
          font-weight: 300;
          color: var(--color-text-2);
          transition: transform 0.2s ease;
          margin-left: var(--spacing-2);
        }

        .registry-card[open] .registry-summary::after {
          transform: rotate(45deg);
        }

        .registry-summary-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          flex: 1;
          min-width: 0;
        }

        .registry-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          background-color: var(--color-accent-pale);
          color: var(--color-accent);
          border-radius: var(--radius-pill);
          font-size: var(--text-sm);
          font-weight: 600;
          flex-shrink: 0;
        }

        .registry-title {
          font-weight: 600;
          font-size: var(--text-lg);
          color: var(--color-text);
          line-height: 1.3;
        }

        .registry-body {
          padding: 0 var(--spacing-5) var(--spacing-5);
          border-top: 1px solid var(--color-border);
        }

        .registry-desc {
          color: var(--color-text-2);
          font-size: var(--text-sm);
          margin: var(--spacing-4) 0;
          line-height: var(--lh-base);
        }

        .registry-group {
          margin-bottom: var(--spacing-4);
        }

        .registry-group:last-child {
          margin-bottom: 0;
        }

        .registry-group-title {
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-text-2);
          margin: 0 0 var(--spacing-2) 0;
        }

        .registry-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--spacing-1) var(--spacing-4);
        }

        .registry-list li {
          font-size: var(--text-sm);
          color: var(--color-text);
          padding-left: var(--spacing-4);
          position: relative;
          line-height: var(--lh-base);
          padding-top: 4px;
          padding-bottom: 4px;
        }

        .registry-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--color-accent);
          opacity: 0.6;
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
            grid-template-columns: 1.5fr 1fr 1fr;
          }

          .table-header .table-cell:nth-child(4),
          .table-header .table-cell:nth-child(5),
          .table-row .table-cell:nth-child(4),
          .table-row .table-cell:nth-child(5) {
            display: none;
          }

          .registry-list {
            grid-template-columns: 1fr;
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

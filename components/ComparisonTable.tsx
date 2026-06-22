'use client'

import styles from './ComparisonTable.module.css'

type CellStatus = 'yes' | 'no' | 'partial' | 'text'

interface Cell {
  status: CellStatus
  text?: string
}

interface Row {
  feature: string
  generic: Cell
  uptodate: Cell
  openinsight: Cell
}

const ROWS: Row[] = [
  {
    feature: 'India-first evidence (ICMR / NTEP / NVBDCP)',
    generic: { status: 'no', text: 'Defaults to FDA / Western sources' },
    uptodate: { status: 'partial', text: 'Limited India coverage' },
    openinsight: { status: 'yes', text: 'Ground-up ICMR / NTEP / NVBDCP' },
  },
  {
    feature: 'CDSCO drug database',
    generic: { status: 'no', text: 'FDA / EMA labels only' },
    uptodate: { status: 'no', text: 'Lexicomp, not CDSCO' },
    openinsight: { status: 'yes', text: 'Full CDSCO-approved generics' },
  },
  {
    feature: 'Drug interactions (Indian generics)',
    generic: { status: 'no', text: 'Western brand names' },
    uptodate: { status: 'partial', text: 'Generic name only' },
    openinsight: { status: 'yes', text: 'Indian brand + Jan Aushadhi aware' },
  },
  {
    feature: 'Cost for Indian doctors',
    generic: { status: 'text', text: '₹2,000+ / month or USD-denominated' },
    uptodate: { status: 'text', text: '~₹18,000+ / year (institutional)' },
    openinsight: { status: 'yes', text: 'Free for verified NMC-registered doctors' },
  },
  {
    feature: 'Offline capability',
    generic: { status: 'no', text: 'Online only' },
    uptodate: { status: 'partial', text: 'Limited cached content' },
    openinsight: { status: 'partial', text: 'On-device cache — pilot rollout' },
  },
  {
    feature: 'Citation export (PDF for patient records)',
    generic: { status: 'no', text: 'No clinical PDF export' },
    uptodate: { status: 'partial', text: 'Print-friendly topics' },
    openinsight: { status: 'yes', text: 'Citation-ready PDF + Vault' },
  },
  {
    feature: 'Hindi language support',
    generic: { status: 'partial', text: 'Auto-translate, lossy' },
    uptodate: { status: 'no', text: 'English-only' },
    openinsight: { status: 'yes', text: 'Native Hindi + 4 regional languages (roadmap)' },
  },
  {
    feature: 'NMC / MCI verification & compliance',
    generic: { status: 'no', text: 'No practitioner verification' },
    uptodate: { status: 'partial', text: 'Institutional licensing' },
    openinsight: { status: 'yes', text: 'NMC registration verified at sign-up' },
  },
  {
    feature: 'DeepInsight multi-agent mode',
    generic: { status: 'no', text: 'Single-pass generation' },
    uptodate: { status: 'no', text: 'Static topic articles' },
    openinsight: { status: 'yes', text: 'RAG + Web + Synthesis + Validator agents' },
  },
]

function StatusIcon({ status }: { status: CellStatus }) {
  if (status === 'yes') {
    return (
      <svg className={styles.iconYes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }
  if (status === 'no') {
    return (
      <svg className={styles.iconNo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    )
  }
  if (status === 'partial') {
    return (
      <svg className={styles.iconPartial} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )
  }
  return null
}

const STATUS_LABEL: Record<CellStatus, string> = {
  yes: 'Yes',
  no: 'No',
  partial: 'Partial',
  text: 'Note',
}

export default function ComparisonTable() {
  return (
    <div className={styles.wrap} role="region" aria-label="OpenInsight comparison table">
      {/* Desktop / tablet: table */}
      <table className={styles.table}>
        <caption className={styles.caption}>
          How OpenInsight compares to other clinical reference tools
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.featureCol}>
              <span className={styles.featureHeader}>Capability</span>
            </th>
            <th scope="col" className={styles.col}>
              <span className={styles.colTitle}>Generic AI Tools</span>
              <span className={styles.colSubtitle}>ChatGPT, Gemini, etc.</span>
            </th>
            <th scope="col" className={styles.col}>
              <span className={styles.colTitle}>UpToDate / Western</span>
              <span className={styles.colSubtitle}>Established references</span>
            </th>
            <th scope="col" className={`${styles.col} ${styles.colHighlight}`}>
              <span className={styles.badge}>Recommended</span>
              <span className={styles.colTitle}>OpenInsight</span>
              <span className={styles.colSubtitle}>Built for India</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, idx) => (
            <tr key={idx} className={styles.row}>
              <th scope="row" className={styles.featureCell}>
                {row.feature}
              </th>
              <td className={`${styles.cell} ${styles[`status_${row.generic.status}`]}`}>
                <span className={styles.cellIcon} aria-hidden="true">
                  <StatusIcon status={row.generic.status} />
                </span>
                <span className={styles.cellText}>{row.generic.text ?? STATUS_LABEL[row.generic.status]}</span>
                <span className={styles.srOnly}>{STATUS_LABEL[row.generic.status]}</span>
              </td>
              <td className={`${styles.cell} ${styles[`status_${row.uptodate.status}`]}`}>
                <span className={styles.cellIcon} aria-hidden="true">
                  <StatusIcon status={row.uptodate.status} />
                </span>
                <span className={styles.cellText}>{row.uptodate.text ?? STATUS_LABEL[row.uptodate.status]}</span>
                <span className={styles.srOnly}>{STATUS_LABEL[row.uptodate.status]}</span>
              </td>
              <td className={`${styles.cell} ${styles.cellHighlight} ${styles[`status_${row.openinsight.status}`]}`}>
                <span className={styles.cellIcon} aria-hidden="true">
                  <StatusIcon status={row.openinsight.status} />
                </span>
                <span className={styles.cellText}>{row.openinsight.text ?? STATUS_LABEL[row.openinsight.status]}</span>
                <span className={styles.srOnly}>{STATUS_LABEL[row.openinsight.status]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards */}
      <div className={styles.cards} aria-hidden="true">
        {ROWS.map((row, idx) => (
          <div key={idx} className={styles.card}>
            <h4 className={styles.cardTitle}>{row.feature}</h4>
            <div className={styles.cardRows}>
              <div className={styles.cardRow}>
                <span className={styles.cardRowLabel}>Generic AI</span>
                <span className={styles.cardRowValue}>
                  <StatusIcon status={row.generic.status} />
                  <span>{row.generic.text ?? STATUS_LABEL[row.generic.status]}</span>
                </span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardRowLabel}>UpToDate</span>
                <span className={styles.cardRowValue}>
                  <StatusIcon status={row.uptodate.status} />
                  <span>{row.uptodate.text ?? STATUS_LABEL[row.uptodate.status]}</span>
                </span>
              </div>
              <div className={`${styles.cardRow} ${styles.cardRowHighlight}`}>
                <span className={styles.cardRowLabel}>OpenInsight</span>
                <span className={styles.cardRowValue}>
                  <StatusIcon status={row.openinsight.status} />
                  <span>{row.openinsight.text ?? STATUS_LABEL[row.openinsight.status]}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className={styles.legend}>
        <span className={styles.legendItem}><StatusIcon status="yes" /> Full support</span>
        <span className={styles.legendItem}><StatusIcon status="partial" /> Partial / on roadmap</span>
        <span className={styles.legendItem}><StatusIcon status="no" /> Not available</span>
      </p>
    </div>
  )
}

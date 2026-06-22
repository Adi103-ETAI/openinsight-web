'use client'

import { useMemo, useState } from 'react'
import styles from './FAQAccordion.module.css'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'clinical-judgment',
    category: 'Clinical Use',
    question: 'Is OpenInsight a substitute for clinical judgment?',
    answer:
      'No. OpenInsight is a decision-support tool, not a decision-maker. Every response is a synthesised brief grounded in cited evidence — the treating physician remains responsible for the final call. We surface the evidence and the source; you apply the judgment.',
  },
  {
    id: 'indian-guidelines',
    category: 'Coverage',
    question: 'Which Indian guidelines does it cover?',
    answer:
      'OpenInsight indexes ICMR guidelines (including ICMR DR-TB and stroke management), NTEP (National TB Elimination Programme) protocols, NVBDCP (malaria, dengue, filariasis, kala-azar), CDSCO-approved drug labels, and select State Treatment Guidelines. We also layer PubMed Central and WHO India references on top.',
  },
  {
    id: 'evidence-recency',
    category: 'Coverage',
    question: 'How current is the evidence base?',
    answer:
      'The vector store is refreshed on a rolling basis. Major guideline documents (ICMR, NTEP, NVBDCP) are re-indexed within 7 days of publication. The DeepInsight web-search agent can also pull the most recent PubMed preprints and CDSCO approvals in real time during a query.',
  },
  {
    id: 'patient-data',
    category: 'Privacy',
    question: 'Is my patient data stored?',
    answer:
      'No patient-identifying data is required or stored. We encourage doctors to query with de-identified clinical questions ("45-year-old male, HbA1c 9.2%, on metformin…"). Queries are logged anonymously for quality improvement; no name, hospital ID, or contact information is collected through the search interface.',
  },
  {
    id: 'offline',
    category: 'Access',
    question: 'Can I use it offline?',
    answer:
      'A limited offline mode is on our roadmap. The core RAG search requires network access to the vector store. We are piloting an on-device cache of the 200 most-used ICMR/NTEP protocols for rural practitioners with intermittent connectivity. Subscribe to early-access updates to be notified when this ships.',
  },
  {
    id: 'cost',
    category: 'Pricing',
    question: 'How much does it cost?',
    answer:
      'OpenInsight is free for verified Indian medical practitioners holding a valid NMC / State Medical Council registration. Institutional plans (for hospitals, medical colleges, and NGOs) are priced per seat — contact us for a quote. There is no credit card required for the individual tier.',
  },
  {
    id: 'specialties',
    category: 'Clinical Use',
    question: 'Which specialties is it best for?',
    answer:
      'OpenInsight is strongest in Internal Medicine, General Practice, Pulmonology, Infectious Diseases, Paediatrics, and Obstetrics & Gynaecology — areas with rich ICMR/NTEP/NVBDCP coverage. We are expanding Oncology, Psychiatry, Dermatology, and Emergency Medicine in 2024. Surgical sub-specialties have lighter coverage today.',
  },
  {
    id: 'vs-uptodate',
    category: 'Comparison',
    question: 'How is it different from UpToDate?',
    answer:
      'UpToDate is excellent for Western guidelines and FDA-approved drugs. OpenInsight is built ground-up for India: ICMR/NTEP/NVBDCP protocols, CDSCO-approved generics, Jan Aushadhi equivalents, drug interactions across Indian brands, and tropical disease workflows. Where ICMR has a protocol, we cite it — we never default to a Western source when an Indian one exists.',
  },
  {
    id: 'export-reports',
    category: 'Clinical Use',
    question: 'Can I export reports for patient records?',
    answer:
      'Yes. Every response can be exported as a citation-ready PDF with the question, synthesised answer, source list (ICMR / NTEP / CDSCO / PubMed IDs), and a timestamp. The export is suitable for attaching to an EMR or printing for the patient file. A "Save to Vault" feature lets you bookmark queries for follow-up.',
  },
  {
    id: 'compliance',
    category: 'Compliance',
    question: 'Is it CDSCO / NMC compliant?',
    answer:
      'OpenInsight is a clinical decision-support tool, not a medical device, and does not fall under CDSCO device regulation. We verify NMC / State Medical Council registration before granting access, so only licensed practitioners can use it. Our data handling follows the Digital Personal Data Protection Act 2023 and we do not store identifiable patient information.',
  },
]

export default function FAQAccordion() {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>('clinical-judgment')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return FAQ_ITEMS
    return FAQ_ITEMS.filter(item => {
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
    })
  }, [query])

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.searchWrap}>
        <label htmlFor="faq-search" className={styles.searchLabel}>
          Search questions
        </label>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="faq-search"
            type="search"
            className={styles.searchInput}
            placeholder="Search FAQs — e.g. 'data', 'cost', 'offline'"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search frequently asked questions"
          />
          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {filtered.length === 0
            ? 'No matching questions. Try a different term.'
            : `Showing ${filtered.length} of ${FAQ_ITEMS.length} questions`}
        </p>
      </div>

      <div className={styles.list}>
        {filtered.map(item => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} className={styles.item} data-open={isOpen}>
              <h3 className={styles.itemHeading}>
                <button
                  type="button"
                  className={styles.trigger}
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  id={`faq-trigger-${item.id}`}
                >
                  <span className={styles.category}>{item.category}</span>
                  <span className={styles.question}>{item.question}</span>
                  <span className={styles.chevron} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-trigger-${item.id}`}
                className={styles.panel}
                data-open={isOpen}
              >
                <div className={styles.panelInner}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

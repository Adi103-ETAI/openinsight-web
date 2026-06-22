'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './InteractiveDemo.module.css'

type Mode = 'fast' | 'deep'

interface Citation {
  label: string
  type: 'icmr' | 'pubmed' | 'who' | 'cdsco' | 'ntep'
}

interface SampleQuery {
  id: string
  mode: Mode
  question: string
  response: string
  citations: Citation[]
  duration: number
}

const SAMPLES: SampleQuery[] = [
  {
    id: 'fast-tb',
    mode: 'fast',
    question: 'First-line treatment for drug-resistant TB per NTEP?',
    response:
      'Per NTEP 2022, pre-XDR-TB is treated with BPaLM (Bedaquiline + Pretomanid + Linezolid + Moxifloxacin) for 6 months. Avoid injecting agents. Confirm with drug-susceptibility testing and refer to a DR-TB centre.',
    citations: [
      { label: 'NTEP 2022', type: 'ntep' },
      { label: 'ICMR DR-TB', type: 'icmr' },
      { label: 'PMID 35675831', type: 'pubmed' },
    ],
    duration: 1800,
  },
  {
    id: 'fast-ddi',
    mode: 'fast',
    question: 'Can I co-prescribe clarithromycin with atorvastatin in a 62-year-old?',
    response:
      'Caution. Clarithromycin inhibits CYP3A4 and markedly raises atorvastatin levels, increasing rhabdomyolysis risk. Prefer azithromycin (no CYP3A4 inhibition) or temporarily hold statin during the antibiotic course. Monitor CPK if co-administration is unavoidable.',
    citations: [
      { label: 'CDSCO PI', type: 'cdsco' },
      { label: 'PMID 27147890', type: 'pubmed' },
    ],
    duration: 1600,
  },
  {
    id: 'deep-fever',
    mode: 'deep',
    question: '26-year-old in Bihar with undifferentiated fever for 10 days — workup?',
    response:
      'Differential in this region: scrub typhus (Orientia tsutsugamushi), dengue, enteric fever, malaria (P. vivax), and leptospirosis. Order: NS1Ag + dengue IgM, scrub typhus IgM (Weil-Felix is insensitive), blood culture for Salmonella Typhi, malarial smear, and leptospira IgM. Empirically start doxycycline 100 mg BD once scrub typhus is suspected — delays >5 days increase mortality. Avoid blind antibiotics without testing. Refer if bleeding, AKI, or breathlessness develops.',
    citations: [
      { label: 'ICMR 2023', type: 'icmr' },
      { label: 'NVBDCP', type: 'icmr' },
      { label: 'WHO India', type: 'who' },
      { label: 'PMID 31801245', type: 'pubmed' },
    ],
    duration: 3200,
  },
]

const MODE_META: Record<Mode, { label: string; tag: string; description: string }> = {
  fast: {
    label: 'Fast Search',
    tag: '~3s',
    description: 'Quick lookups — DDI, dosing, differential lists.',
  },
  deep: {
    label: 'DeepInsight',
    tag: '20–60s',
    description: 'Multi-agent reasoning for complex clinical cases.',
  },
}

export default function InteractiveDemo() {
  const [activeMode, setActiveMode] = useState<Mode>('fast')
  const [activeQueryId, setActiveQueryId] = useState<string>('fast-tb')
  const [displayed, setDisplayed] = useState('')
  const [showCitations, setShowCitations] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduceMotionRef = useRef(false)

  const activeQuery = SAMPLES.find(s => s.id === activeQueryId) as SampleQuery
  const visibleSamples = SAMPLES.filter(s => s.mode === activeMode)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      reduceMotionRef.current = mq.matches
    }
  }, [])

  const runTypewriter = useCallback(
    (sample: SampleQuery) => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setDisplayed('')
      setShowCitations(false)
      setIsTyping(true)

      if (reduceMotionRef.current) {
        setDisplayed(sample.response)
        setShowCitations(true)
        setIsTyping(false)
        return
      }

      const step = Math.max(1, Math.ceil(sample.response.length / (sample.duration / 20)))
      let i = 0
      intervalRef.current = setInterval(() => {
        i += step
        setDisplayed(sample.response.slice(0, i))
        if (i >= sample.response.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setDisplayed(sample.response)
          setIsTyping(false)
          timeoutRef.current = setTimeout(() => setShowCitations(true), 250)
        }
      }, 20)
    },
    []
  )

  // Trigger animation whenever the active query changes
  useEffect(() => {
    runTypewriter(activeQuery)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQueryId])

  const switchMode = (mode: Mode) => {
    if (mode === activeMode) return
    const firstInMode = SAMPLES.find(s => s.mode === mode) as SampleQuery
    setActiveMode(mode)
    setActiveQueryId(firstInMode.id)
  }

  const selectQuery = (id: string) => {
    if (id === activeQueryId) {
      // Replay the typewriter
      runTypewriter(activeQuery)
    } else {
      setActiveQueryId(id)
    }
  }

  return (
    <div className={styles.demo}>
      {/* Tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Demo modes">
        {(Object.keys(MODE_META) as Mode[]).map(mode => {
          const isActive = mode === activeMode
          return (
            <button
              key={mode}
              role="tab"
              id={`demo-tab-${mode}`}
              aria-selected={isActive}
              aria-controls="demo-panel"
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => switchMode(mode)}
            >
              <span className={styles.tabLabel}>{MODE_META[mode].label}</span>
              <span className={styles.tabTag}>{MODE_META[mode].tag}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.layout}>
        {/* Sample queries */}
        <aside className={styles.samples} aria-label="Sample clinical queries">
          <p className={styles.samplesHeading}>Try a sample query</p>
          <p className={styles.samplesDesc}>{MODE_META[activeMode].description}</p>
          <ul className={styles.samplesList}>
            {visibleSamples.map(sample => {
              const isActive = sample.id === activeQueryId
              return (
                <li key={sample.id}>
                  <button
                    type="button"
                    className={`${styles.sampleBtn} ${isActive ? styles.sampleBtnActive : ''}`}
                    onClick={() => selectQuery(sample.id)}
                    aria-pressed={isActive}
                  >
                    <span className={styles.sampleIcon} aria-hidden="true">▸</span>
                    <span>{sample.question}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <a
            href="https://app.openinsight.in"
            className={styles.launchLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Try the live demo →
          </a>
        </aside>

        {/* Chat panel */}
        <div
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={`demo-tab-${activeMode}`}
          className={styles.panel}
        >
          <div className={styles.panelHeader}>
            <span className={styles.panelDot} aria-hidden="true" />
            <span className={styles.panelTitle}>OpenInsight · {MODE_META[activeMode].label}</span>
            <span className={styles.panelBadge} data-mode={activeMode}>
              {MODE_META[activeMode].tag}
            </span>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.queryRow}>
              <span className={styles.queryAvatar} aria-hidden="true">Q</span>
              <p className={styles.queryText}>{activeQuery.question}</p>
            </div>

            <div className={styles.responseRow}>
              <span className={styles.responseAvatar} aria-hidden="true">OI</span>
              <div className={styles.responseBody}>
                {isTyping && displayed.length === 0 && (
                  <div className={styles.thinking} aria-label="OpenInsight is thinking">
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingLabel}>Retrieving evidence…</span>
                  </div>
                )}
                <p className={styles.responseText} aria-live="polite">
                  {displayed}
                  {isTyping && <span className={styles.cursor} aria-hidden="true" />}
                </p>
                {showCitations && (
                  <div className={styles.citations} aria-label="Citations">
                    <span className={styles.citationsLabel}>Sources</span>
                    <div className={styles.citationChips}>
                      {activeQuery.citations.map((c, idx) => (
                        <span
                          key={idx}
                          className={`${styles.chip} ${styles[`chip_${c.type}`] ?? ''}`}
                          data-source={c.type}
                        >
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

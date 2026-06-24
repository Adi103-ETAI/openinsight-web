'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './TestimonialsCarousel.module.css'

interface Testimonial {
  id: string
  name: string
  credential: string
  specialty: string
  institution: string
  location: string
  quote: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'priya',
    name: 'Dr. Priya Sharma',
    credential: 'MD, DM',
    specialty: 'Internal Medicine',
    institution: 'AIIMS Delhi',
    location: 'New Delhi, DL',
    quote:
      'During a complicated dengue with AKI, OpenInsight pulled ICMR fluid-management guidance and the latest KDIGO conflict notes in seconds. It now sits open on my OPD desktop every morning — the citations give me the confidence to act faster.',
    rating: 5,
  },
  {
    id: 'rajesh',
    name: 'Dr. Rajesh Kumar',
    credential: 'MBBS',
    specialty: 'General Practice',
    institution: 'Rural PHC, Latur district',
    location: 'Maharashtra, MH',
    quote:
      'I am the only doctor for 14 villages. The offline cache of NTEP and NVBDCP protocols has saved three scrub-typhus cases this monsoon alone. ICMR guidance plus Jan Aushadhi generics together — no other tool gives me that for rural practice.',
    rating: 5,
  },
  {
    id: 'anjali',
    name: 'Dr. Anjali Menon',
    credential: 'MD, DCH',
    specialty: 'Paediatrics',
    institution: 'Aster Medcity',
    location: 'Kochi, KL',
    quote:
      'For a 4-year-old with refractory febrile seizures, OpenInsight laid out ICMR paediatric fever evaluation, drug doses by weight, and red-flag referrals in one structured brief. Parents left with a printed PDF and the references attached to the file.',
    rating: 5,
  },
  {
    id: 'vikram',
    name: 'Dr. Vikram Singh',
    credential: 'MD, DM',
    specialty: 'Pulmonology',
    institution: 'PGIMER',
    location: 'Chandigarh, CH',
    quote:
      'For pre-XDR TB, BPaLM is in the NTEP 2022 document but easy to forget mid-OPD. OpenInsight surfaces the exact regimen, daily dosing, and LPA interpretation in one structured brief — every line cited to NTEP or ICMR. DeepInsight mode is a game-changer for complex cases.',
    rating: 5,
  },
  {
    id: 'meera',
    name: 'Dr. Meera Iyer',
    credential: 'MS, MCh',
    specialty: 'Obstetrics & Gynaecology',
    institution: 'Cloudnine Hospital',
    location: 'Bengaluru, KA',
    quote:
      'The drug-interaction check flagged a CDSCO-labelled generic that the international tools missed entirely. The citation export lets me attach the source list straight to the discharge summary. It has quietly become part of every high-risk antenatal consult.',
    rating: 5,
  },
]

const ROTATE_MS = 5000

function Stars({ rating, accent }: { rating: number; accent?: boolean }) {
  return (
    <div
      className={`${styles.stars} ${accent ? styles.starsAccent : ''}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          className={`${styles.star} ${i <= rating ? styles.starFilled : styles.starEmpty}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l2.94 6.36 6.97.61-5.27 4.6 1.6 6.83L12 17.77l-6.21 3.23 1.6-6.83-5.27-4.6 6.97-.61z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler)
    }
  }, [])

  const goTo = useCallback((i: number) => {
    const n = TESTIMONIALS.length
    setIndex(((i % n) + n) % n)
  }, [])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Auto-rotate
  useEffect(() => {
    if (isPaused || reduceMotion) return
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % TESTIMONIALS.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [isPaused, reduceMotion])

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
  }

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Doctor testimonials"
    >
      <div
        ref={trackRef}
        className={styles.viewport}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-live="polite"
      >
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.id}
              className={styles.slide}
              aria-hidden={i !== index}
              aria-label={`${i + 1} of ${TESTIMONIALS.length}`}
              role="group"
            >
              <div className={styles.card}>
                <svg
                  className={styles.quoteMark}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9 7H5c-1.66 0-3 1.34-3 3v6c0 1.66 1.34 3 3 3h2c1.66 0 3-1.34 3-3v-2c0-1.66-1.34-3-3-3H6V9h3V7zm12 0h-4c-1.66 0-3 1.34-3 3v6c0 1.66 1.34 3 3 3h2c1.66 0 3-1.34 3-3v-2c0-1.66-1.34-3-3-3h-1V9h3V7z" />
                </svg>
                <Stars rating={t.rating} accent />
                <blockquote className={styles.quote}>
                  “{t.quote}”
                </blockquote>
                <div className={styles.author}>
                  <div className={styles.avatar} aria-hidden="true">
                    {t.name.split(' ').slice(-2, -1).join(' ').charAt(0)}
                    {t.name.split(' ').slice(-1)[0].charAt(0)}
                  </div>
                  <div className={styles.authorMeta}>
                    <p className={styles.authorName}>
                      {t.name} <span className={styles.credential}>{t.credential}</span>
                    </p>
                    <p className={styles.authorRole}>
                      {t.specialty} · {t.institution}
                    </p>
                    <p className={styles.authorLocation}>{t.location}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={prev}
          aria-label="Previous testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.dots} role="tablist" aria-label="Select testimonial">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to testimonial ${i + 1}: ${t.name}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={next}
          aria-label="Next testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

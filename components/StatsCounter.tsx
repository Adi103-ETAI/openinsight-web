'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StatsCounter.module.css'

interface Stat {
  id: string
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  isLessThan?: boolean
}

const STATS: Stat[] = [
  {
    id: 'queries',
    label: 'Clinical queries answered',
    value: 10000,
    suffix: '+',
  },
  {
    id: 'guidelines',
    label: 'ICMR guidelines indexed',
    value: 500,
    suffix: '+',
  },
  {
    id: 'specialties',
    label: 'Specialties supported',
    value: 15,
    suffix: '+',
  },
  {
    id: 'latency',
    label: 'Average response time',
    value: 3,
    prefix: '<',
    suffix: 's',
  },
]

function formatNumber(n: number, decimals = 0): string {
  if (decimals > 0) {
    return n.toFixed(decimals)
  }
  return n.toLocaleString('en-IN')
}

function Counter({ stat, animate }: { stat: Stat; animate: boolean }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!animate) {
      setDisplay(0)
      return
    }

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setDisplay(stat.value)
      return
    }

    startRef.current = null
    const duration = 1800

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(stat.value * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(stat.value)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [animate, stat.value])

  const renderValue = () => {
    const isFloat = stat.decimals && stat.decimals > 0
    const num = isFloat ? display : Math.round(display)
    return formatNumber(num, stat.decimals ?? 0)
  }

  return (
    <div className={styles.stat}>
      <div className={styles.valueWrap}>
        {stat.isLessThan && <span className={styles.valuePrefix}>&lt;</span>}
        {!stat.isLessThan && stat.prefix && (
          <span className={styles.valuePrefix}>{stat.prefix}</span>
        )}
        <span className={styles.value} aria-hidden="true">
          {renderValue()}
        </span>
        {stat.suffix && <span className={styles.valueSuffix}>{stat.suffix}</span>}
      </div>
      <p className={styles.label}>{stat.label}</p>
      <span className={styles.srOnly}>
        {stat.prefix ?? ''}
        {stat.isLessThan ? 'less than ' : ''}
        {formatNumber(stat.value, stat.decimals ?? 0)}
        {stat.suffix ?? ''} {stat.label}
      </span>
    </div>
  )
}

export default function StatsCounter() {
  const [animate, setAnimate] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setAnimate(true)
          observer.unobserve(entries[0].target)
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={styles.grid} role="list" aria-label="OpenInsight impact statistics">
      {STATS.map(stat => (
        <div key={stat.id} role="listitem" className={styles.cell}>
          <Counter stat={stat} animate={animate} />
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './AnnouncementBanner.module.css'

const STORAGE_KEY = 'announcement_dismissed'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

// Set a CSS custom property on :root so the fixed Nav can offset its `top`
// when the announcement banner is visible. Default is 0px when banner is gone.
function setAnnouncementHeight(value: string) {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty('--announcement-h', value)
}

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let shouldShow = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const dismissedAt = Number.parseInt(raw, 10)
        if (!Number.isNaN(dismissedAt) && Date.now() - dismissedAt <= SEVEN_DAYS_MS) {
          shouldShow = false
        }
      }
    } catch {
      // localStorage unavailable — show by default
    }

    if (shouldShow) {
      // Defer to next tick so the slide-down animation has a starting state
      const t = window.setTimeout(() => setVisible(true), 50)
      return () => window.clearTimeout(t)
    }
  }, [])

  // Sync CSS variable with visibility so the fixed Nav can offset below the banner.
  useEffect(() => {
    if (visible) {
      setAnnouncementHeight('44px')
    } else {
      setAnnouncementHeight('0px')
    }
    return () => setAnnouncementHeight('0px')
  }, [visible])

  const handleDismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // ignore
    }
  }

  if (!mounted || !visible) return null

  return (
    <div
      className={styles.banner}
      role="region"
      aria-label="Announcement"
    >
      <div className={styles.content}>
        <span className={styles.pulse} aria-hidden="true" />
        <p className={styles.text}>
          OpenInsight is now accepting early access applications from
          NMC-registered doctors.{' '}
          <Link href="/early-access" className={styles.link}>
            Apply today →
          </Link>
        </p>
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        title="Dismiss"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

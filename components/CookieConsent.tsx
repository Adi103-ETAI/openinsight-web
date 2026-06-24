'use client'

import { useState, useEffect } from 'react'
import styles from './CookieConsent.module.css'

const STORAGE_KEY = 'cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const consent = localStorage.getItem(STORAGE_KEY)
      if (!consent) {
        // Slight delay so the banner slides in after first paint
        const t = window.setTimeout(() => setVisible(true), 600)
        return () => window.clearTimeout(t)
      }
    } catch {
      // localStorage unavailable — show the banner as a fallback
      const t = window.setTimeout(() => setVisible(true), 600)
      return () => window.clearTimeout(t)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, ts: Date.now() }))
    } catch {
      // ignore
    }
    setVisible(false)
  }

  const handleDismiss = () => {
    // "Learn more" / dismiss also closes the banner but does NOT persist acceptance.
    setVisible(false)
  }

  if (!mounted || !visible) return null

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent notice"
    >
      <div className={styles.content}>
        <p className={styles.text}>
          We use cookies to improve your experience. By continuing to browse,
          you agree to our use of cookies.
        </p>
        <div className={styles.actions}>
          <a
            href="/contact"
            className={styles.learnMore}
            onClick={handleDismiss}
          >
            Learn more
          </a>
          <button
            type="button"
            className={styles.accept}
            onClick={handleAccept}
            autoFocus
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

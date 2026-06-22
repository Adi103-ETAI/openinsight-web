'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'
import styles from './Footer.module.css'

const APP_URL = 'https://app.openinsight.in'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('err')
      return
    }
    // Persist newsletter signup locally (no backend in static export)
    try {
      const raw = localStorage.getItem('openinsight_newsletter_signups')
      const arr = raw ? JSON.parse(raw) : []
      const next = Array.isArray(arr) ? [...arr, { email: trimmed, at: new Date().toISOString() }] : [{ email: trimmed, at: new Date().toISOString() }]
      localStorage.setItem('openinsight_newsletter_signups', JSON.stringify(next))
    } catch {
      /* ignore storage errors */
    }
    setStatus('ok')
    setEmail('')
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.left}>
          <Logo variant="footer" theme="light" />
          <p className={styles.tagline}>
            Clinical knowledge, when it matters most.
          </p>

          {/* Prominent Launch App CTA */}
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.launchApp}
            aria-label="Launch OpenInsight App (opens in a new tab)"
          >
            <span className={styles.launchAppLabel}>Launch the App</span>
            <span className={styles.launchAppArrow} aria-hidden="true">↗</span>
          </a>

          <div className={styles.socials}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              Twitter
            </a>
            <span className={styles.divider}>·</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              LinkedIn
            </a>
            <span className={styles.divider}>·</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              GitHub
            </a>
          </div>

          {/* Newsletter signup */}
          <form className={styles.newsletter} onSubmit={handleNewsletter} noValidate>
            <label htmlFor="newsletter-email" className={styles.newsletterLabel}>
              Clinical evidence updates, monthly
            </label>
            <div className={styles.newsletterRow}>
              <input
                id="newsletter-email"
                type="email"
                className={styles.newsletterInput}
                placeholder="your.email@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (status !== 'idle') setStatus('idle')
                }}
                aria-invalid={status === 'err'}
                aria-describedby="newsletter-status"
                autoComplete="email"
              />
              <button type="submit" className={styles.newsletterBtn}>
                Subscribe
              </button>
            </div>
            <p
              id="newsletter-status"
              className={`${styles.newsletterStatus} ${status === 'ok' ? styles.newsletterOk : ''} ${status === 'err' ? styles.newsletterErr : ''}`}
              role="status"
              aria-live="polite"
            >
              {status === 'ok' && '✓ Thanks — you\u2019re on the list.'}
              {status === 'err' && 'Please enter a valid email address.'}
              {status === 'idle' && 'No spam. Unsubscribe anytime.'}
            </p>
          </form>
        </div>

        {/* Right Columns */}
        <div className={styles.right}>
          <div className={styles.column}>
            <h4 className={styles.heading}>Product</h4>
            <Link href="/product">Features</Link>
            <Link href="/product">Fast Search</Link>
            <Link href="/product">DeepInsight</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/about">Team</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Resources</h4>
            <Link href="/evidence">Evidence</Link>
            <Link href="/for-doctors">For Doctors</Link>
            <Link href="/early-access">Early Access</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Legal</h4>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="/contact">Support</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <p>© 2025 SentArc Labs · Made in Pune, India</p>
      </div>
    </footer>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Nav.module.css'

const APP_URL = 'https://app.openinsight.in'

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 80)

      // Compute scroll progress as percentage of the document that has been scrolled
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100))
        setScrollProgress(pct)
      } else {
        setScrollProgress(0)
      }
    }

    // Throttle via requestAnimationFrame for smoothness
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    handleScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
        {/* Scroll progress bar — terracotta, 3px thin, fills as user scrolls */}
        <div
          className={styles.scrollProgress}
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image
              src={isScrolled ? '/logos/LightYellow.png' : '/logos/DarkGrey.png'}
              alt="OpenInsight"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className={styles.menu}>
            <Link href="/for-doctors" className={styles.navLink}>
              For Doctors
            </Link>
            <Link href="/product" className={styles.navLink}>
              Product
            </Link>
            <Link href="/evidence" className={styles.navLink}>
              Evidence
            </Link>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className={styles.ctaGroup}>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-ghost ${styles.launchBtn}`}
              aria-label="Launch OpenInsight App (opens in a new tab)"
            >
              Launch App
            </a>
            <Link href="/early-access" className="btn btn-primary">
              Early Access
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <Link href="/for-doctors" onClick={() => setIsMobileMenuOpen(false)}>
              For Doctors
            </Link>
            <Link href="/product" onClick={() => setIsMobileMenuOpen(false)}>
              Product
            </Link>
            <Link href="/evidence" onClick={() => setIsMobileMenuOpen(false)}>
              Evidence
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Launch App ↗
            </a>
            <Link
              href="/early-access"
              className="btn btn-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Early Access
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

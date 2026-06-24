'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import styles from './Nav.module.css'

const APP_URL = 'https://app.openinsight.in'

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()

  // Home page has a dark hero at the top, so the nav starts transparent with
  // light text/logo and switches to glass + dark text once scrolled.
  // Every other page has a LIGHT surface at the top — if we kept the light
  // text/logo it would be invisible. So we force the "light-on-glass" theme
  // on all non-home pages from the very top.
  const isHome = pathname === '/'
  const useLight = isScrolled || !isHome // dark text/logo on a light surface

  const navLinks = [
    { href: '/for-doctors', label: 'For Doctors' },
    { href: '/product', label: 'Product' },
    { href: '/evidence', label: 'Evidence' },
    { href: '/about', label: 'About' },
  ]

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

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
      <nav className={`${styles.nav} ${useLight ? styles.scrolled : ''}`}>
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
          {/* Logo — code-first SVG, adapts color to scroll state & page bg */}
          <Link href="/" className={styles.logo} aria-label="OpenInsight home">
            <Logo
              variant="header"
              theme={useLight ? 'light' : 'dark'}
            />
          </Link>

          {/* Desktop Menu */}
          <div className={styles.menu}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons — compact sizing */}
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
            <Link href="/early-access" className={`btn btn-primary ${styles.earlyBtn}`}>
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

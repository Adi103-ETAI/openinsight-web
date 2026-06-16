'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Nav.module.css'

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
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

          {/* CTA Button */}
          <Link href="/early-access" className="btn btn-primary">
            Early Access
          </Link>

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

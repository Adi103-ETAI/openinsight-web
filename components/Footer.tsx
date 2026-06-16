import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.left}>
          <Image
            src="/logos/DarkGrey.png"
            alt="OpenInsight"
            width={120}
            height={40}
          />
          <p className={styles.tagline}>
            Clinical knowledge, when it matters most.
          </p>
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
            <Link href="#">Blog</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Resources</h4>
            <Link href="/evidence">Evidence</Link>
            <Link href="#">Documentation</Link>
            <Link href="#">API Docs</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Legal</h4>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact</Link>
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

import type { Metadata } from 'next'
import SectionReveal from '@/components/SectionReveal'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About | OpenInsight',
  description: 'Meet SentArc Labs. Built by someone who couldn\'t get in. Changing how clinicians access clinical evidence at the point of care.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className={styles['about-hero']}>
        <div className="container text-center">
          <h1 style={{ fontStyle: 'italic' }}>
            Built by someone who couldn't get in.
          </h1>
          <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto">
            A genuine founder story — not a corporate pitch.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={styles['story-section']}>
        <div className="container max-w-3xl mx-auto">
          <SectionReveal>
            <div className={styles['story-text']}>
              <p>
                OpenInsight was started by Aditya Singh, a first-year BCA student and founder of SentArc Labs in Pune, who came to medicine as a NEET non-qualifier. He couldn't enter the domain as a practitioner — so he built a tool for the people who did.
              </p>
              <p>
                The medical representative has been the primary information channel for Indian doctors for decades. OpenInsight is the AI alternative: faster, more accurate, always available, and free from pharmaceutical incentives.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Company */}
      <section className={styles['company-section']}>
        <div className="container max-w-2xl mx-auto text-center">
          <SectionReveal>
            <h2 className={styles['company-title']}>
              <img
                src="/logos/sentarc-symbol.svg"
                alt=""
                aria-hidden="true"
                className={styles['company-title-symbol']}
              />
              <span>SentArc Labs</span>
            </h2>
            <div className={styles['company-details']}>
              <div className={styles['company-detail']}>
                <h4>Location</h4>
                <p>Pune, India</p>
              </div>
              <div className={styles['company-detail']}>
                <h4>Focus</h4>
                <p>Applied AI for Indian healthcare</p>
              </div>
              <div className={styles['company-detail']}>
                <h4>Mission</h4>
                <p>Make world-class clinical tools accessible to every Indian doctor</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Vision */}
      <section className={styles['vision-section']}>
        <div className="container max-w-3xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2>What we're building toward</h2>
              <p className="text-text-2 mt-4">The six-layer vision</p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className={styles['vision-stack']}>
              {[
                {
                  number: 1,
                  title: 'Free clinical tool for doctors',
                  subtitle: 'Distribution',
                },
                {
                  number: 2,
                  title: 'Pharma intelligence platform',
                  subtitle: 'Understanding prescription patterns',
                },
                {
                  number: 3,
                  title: 'Sponsored CME content',
                  subtitle: 'Sustainable revenue',
                },
                {
                  number: 4,
                  title: 'CME / certification engine',
                  subtitle: 'Structured medical education',
                },
                {
                  number: 5,
                  title: 'Clinical trial recruitment',
                  subtitle: 'Connecting researchers to patients',
                },
                {
                  number: 6,
                  title: 'Hospital formulary management',
                  subtitle: 'Institutional layer',
                },
              ].map((item, idx) => (
                <div key={idx} className={styles['vision-item']}>
                  <div className={styles['vision-number']}>{item.number}</div>
                  <div className={styles['vision-content']}>
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}

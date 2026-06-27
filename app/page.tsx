import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/Logo'
import SectionReveal from '@/components/SectionReveal'
import InteractiveDemo from '@/components/InteractiveDemo'
import FeatureCard from '@/components/FeatureCard'
import StatsCounter from '@/components/StatsCounter'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import FAQAccordion from '@/components/FAQAccordion'

export const metadata: Metadata = {
  title: 'OpenInsight | AI Medical Search for Clinicians',
  description: 'Clinical knowledge, when it matters most. AI-powered medical search engine and clinical decision-support tool for healthcare professionals.',
}

const features = [
  {
    title: 'Context-aware evidence',
    description: 'ICMR, NTEP, NVBDCP, CDSCO drug data, plus global literature. No blind default to a single reference when a more relevant one applies.',
  },
  {
    title: 'DeepInsight mode',
    description: 'Multi-agent pipeline that retrieves, cross-checks, and synthesises across sources for complex queries.',
  },
  {
    title: 'Fast Search mode',
    description: 'Quick lookups for DDI checks, drug dosing, differential diagnosis. Instant, no multi-agent overhead.',
  },
  {
    title: 'Drug interaction checker',
    description: 'Cross-reference CDSCO-approved generics and global drug labels. Catches interactions other tools miss.',
  },
  {
    title: 'Follow-up questions',
    description: 'Continue the clinical conversation. Refine the differential. Ask about comorbidities.',
  },
  {
    title: 'Citable & shareable',
    description: 'Every response generates a shareable citation-ready summary. Print for the patient or attach to notes.',
  },
]

const problemCards = [
  {
    title: 'Generic tools, wrong context',
    description: 'Most AI tools cite FDA approvals and UpToDate. Regional generics, national drug schedules, and local protocols are often missing.',
  },
  {
    title: 'No time to read papers',
    description: 'A busy OPD leaves no time for literature review. Doctors need a synthesised answer in seconds, not citations to chase.',
  },
  {
    title: 'MR-driven information',
    description: 'In many regions, the medical representative is still the primary information channel for clinicians. OpenInsight replaces that with evidence.',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Animated gradient mesh background */}
        <div className="hero-mesh-bg" aria-hidden="true" />

        {/* Floating decorative medical crosses (left) */}
        <svg className="hero-cross-deco tl" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M16 4 H24 V16 H36 V24 H24 V36 H16 V24 H4 V16 H16 Z" fill="var(--color-accent)" />
        </svg>
        <svg className="hero-cross-deco br" width="28" height="28" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M16 4 H24 V16 H36 V24 H24 V36 H16 V24 H4 V16 H16 Z" fill="var(--color-accent)" />
        </svg>

        {/* Floating decorative EKG / pulse line (right) */}
        <svg className="hero-ekg" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="hero-ekg-path"
            d="M0 100 L80 100 L100 100 L110 90 L120 110 L130 60 L140 140 L150 100 L200 100 L220 100 L240 100 L260 70 L270 130 L280 50 L290 150 L300 100 L360 100 L380 100 L400 80 L410 120 L420 100 L470 100 L490 100 L520 90 L530 110 L540 100 L600 100"
          />
        </svg>

        <div className="container flex flex-col items-center justify-center gap-8 hero-content">
          <div className="animate-fade-in hero-logo-wrap" style={{ animationDuration: '600ms' }}>
            <Logo variant="home" theme="dark" />
          </div>
          <h1 className="text-white text-center max-w-2xl animate-fade-in text-balance mx-auto" style={{ animationDelay: '150ms' }}>
            Clinical knowledge,{' '}
            <span className="hero-gradient-text">when it matters most.</span>
          </h1>
          <p
            className="text-center max-w-2xl animate-fade-in mx-auto hero-subhead"
            style={{ animationDelay: '300ms' }}
          >
            <span className="hero-subhead-highlight">OpenInsight</span> is an{' '}
            <span className="hero-subhead-highlight">AI-powered medical search engine</span> and clinical decision-support tool built specifically for{' '}
            <span className="hero-subhead-highlight">healthcare professionals</span>.
          </p>
          <div className="flex flex-center gap-4 animate-fade-in hero-cta-row" style={{ animationDelay: '450ms' }}>
            <Link href="/early-access" className="btn btn-accent-glow">
              Request Early Access
            </Link>
            <a href="#features" className="btn btn-secondary">
              See how it works ↓
            </a>
          </div>

          {/* Grounded-in-literature sliding marquee */}
          <div className="hero-grounded animate-fade-in" style={{ animationDelay: '600ms' }}>
            <p className="hero-grounded-label">Grounded in the literature clinicians already trust</p>
            <div className="hero-grounded-marquee" aria-hidden="false">
              <div className="hero-grounded-track">
                {[
                  'ICMR guidelines', 'CDSCO', 'WHO', 'NICE',
                  'Cochrane Library', 'NEJM', 'The Lancet', 'JAMA',
                  'BMJ', 'PubMed',
                  'ICMR guidelines', 'CDSCO', 'WHO', 'NICE',
                  'Cochrane Library', 'NEJM', 'The Lancet', 'JAMA',
                  'BMJ', 'PubMed',
                ].map((src, i) => (
                  <span className="hero-grounded-item" key={i}>
                    <svg
                      className="hero-grounded-icon"
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="scroll-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="problem-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                The Challenge
              </p>
              <h2 className="mt-4">
                Clinicians deserve tools built for their context.
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="prose max-w-4xl mx-auto mb-12">
              <p className="text-center text-text-2 text-lg leading-relaxed mb-6">
                Most clinical AI tools are trained on Western populations, Western guidelines, and Western drug formularies. They reference UpToDate, NEJM, and FDA approvals — all useful, but incomplete for a clinician seeing a patient with regional disease patterns or prescribing locally available generics.
              </p>
              <p className="text-center text-text-2 text-lg leading-relaxed">
                OpenInsight is built ground-up for clinical context: regional disease patterns, local drug availability, national guidelines, and the realities of everyday practice.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal staggerChildren className="grid grid-3">
            {problemCards.map((card, idx) => (
              <div key={idx} className="problem-card card-lift">
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </div>
            ))}
          </SectionReveal>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="demo-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                How It Works
              </p>
              <h2 className="mt-4">
                Ask a clinical question. Get a structured, cited answer.
              </h2>
              <p className="text-text-2 text-lg mt-4 max-w-2xl mx-auto">
                Switch between Fast Search for quick lookups and DeepInsight for complex multi-agent
                reasoning. Try a sample query — watch the response build in real time.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <InteractiveDemo />
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="demo-cta">
              <a
                href="https://app.openinsight.in"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try the live demo →
              </a>
              <Link href="/product" className="btn btn-ghost">
                See how it works
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="stats-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                Built for Impact
              </p>
              <h2 className="mt-4">
                Trusted by clinicians, every day.
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal>
            <StatsCounter />
          </SectionReveal>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                What OpenInsight Does
              </p>
              <h2 className="mt-4">
                Everything a clinical consultation needs.
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="grid grid-3">
              {features.map((feature, idx) => (
                <div key={idx} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in-up">
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={<span>◆</span>}
                  />
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonial-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                Voices from the Field
              </p>
              <h2 className="mt-4">
                Clinicians, in their own words.
              </h2>
              <p className="text-text-2 text-lg mt-4 max-w-2xl mx-auto">
                From teaching hospitals to rural clinics — clinicians use OpenInsight to make
                faster, better-cited clinical decisions.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <TestimonialsCarousel />
          </SectionReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                Frequently Asked
              </p>
              <h2 className="mt-4">
                Questions clinicians ask us.
              </h2>
              <p className="text-text-2 text-lg mt-4 max-w-2xl mx-auto">
                Clinical safety, data privacy, compliance, pricing. Honest answers from the
                OpenInsight team.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <FAQAccordion />
          </SectionReveal>

          <SectionReveal delay={100}>
            <div className="faq-footer">
              <p>Still have a question?</p>
              <Link href="/contact" className="btn btn-ghost">
                Talk to us →
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2 className="text-white mb-4">
            Built for clinicians. Free to use.
          </h2>
          <p className="text-white opacity-75 text-lg mb-8">
            OpenInsight is free for verified healthcare professionals. Request early access and be among the first to use it.
          </p>
          <Link href="/early-access" className="btn btn-shimmer">
            Request Early Access →
          </Link>
          <p className="text-white opacity-50 text-sm mt-4">
            No credit card. No subscription. Professional registration required.
          </p>
        </div>
      </section>

      <style>{`
        .hero-section {
          background-color: var(--color-dark);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 2px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 2px
            );
          background-size: 20px 20px;
          pointer-events: none;
        }

        .hero-section > .container,
        .hero-section > .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          /* Reserve space below the last flex child (the marquee) so the
             absolutely-positioned scroll-indicator chevron sits BELOW the
             marquee instead of overlapping it. */
          padding-bottom: 64px;
        }

        /* Center the hero logo explicitly so it sits in the middle. */
        .hero-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        /* Buttons share equal height & are centered as a group. */
        .hero-content .btn {
          min-height: 44px;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          animation: chevronBounce 2s infinite;
          color: white;
        }

        .problem-section {
          background-color: var(--color-surface-2);
          padding-top: var(--spacing-12);
          padding-bottom: var(--spacing-12);
        }

        .problem-card {
          background-color: var(--color-surface);
          padding: var(--spacing-4);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .problem-card h4 {
          color: var(--color-text);
          margin: 0;
        }

        .problem-card p {
          color: var(--color-text-2);
          font-size: var(--text-base);
          margin: 0;
        }

        .demo-section {
          padding-top: var(--spacing-12);
          padding-bottom: var(--spacing-12);
          background-color: var(--color-surface);
        }

        .demo-cta {
          display: flex;
          gap: var(--spacing-2);
          justify-content: center;
          margin-top: var(--spacing-6);
          flex-wrap: wrap;
        }

        .stats-section {
          padding-top: calc(var(--spacing-12) + var(--spacing-4));
          padding-bottom: var(--spacing-12);
          background-color: var(--color-surface-2);
        }

        .faq-section {
          padding-top: var(--spacing-12);
          padding-bottom: var(--spacing-12);
          background-color: var(--color-surface-2);
        }

        .faq-footer {
          margin-top: var(--spacing-6);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-2);
          text-align: center;
        }

        .faq-footer p {
          color: var(--color-text-2);
          font-size: var(--text-base);
          margin: 0;
        }

        .features-section {
          padding-top: var(--spacing-8);
          padding-bottom: var(--spacing-12);
          background-color: var(--color-surface-2);
        }

        .testimonial-section {
          padding-top: var(--spacing-12);
          padding-bottom: var(--spacing-12);
          background-color: var(--color-surface);
        }

        .testimonial-quote {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          line-height: var(--lh-3xl);
          color: var(--color-text);
          font-style: italic;
          max-width: 800px;
          text-align: center;
          margin: 0;
        }

        .testimonial-attribution {
          font-size: var(--text-sm);
          color: var(--color-text-2);
          text-align: center;
          margin: 0;
        }

        .cta-banner {
          background-color: var(--color-dark);
          padding: var(--spacing-12) var(--spacing-6);
        }

        .prose {
          font-size: var(--text-lg);
          line-height: var(--lh-base);
        }

        .prose p {
          margin: 0;
        }

        @media (max-width: 1024px) {
          .demo-cta {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 640px) {
          .hero-section {
            min-height: auto;
            padding: var(--spacing-8) 0;
          }

          .hero-section img {
            width: 140px !important;
            height: auto !important;
          }

          .hero-section h1 {
            font-size: var(--text-4xl);
          }

          .hero-section p {
            font-size: 18px !important;
          }

          .scroll-indicator {
            display: none;
          }

          .testimonial-quote {
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </div>
  )
}

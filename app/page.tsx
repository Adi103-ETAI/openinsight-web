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
  title: 'OpenInsight | AI Clinical Decision Support for Indian Doctors',
  description: 'Clinical knowledge, when it matters most. AI-powered clinical decision support built on ICMR guidelines, CDSCO approvals, and Indian clinical evidence.',
}

const features = [
  {
    title: 'India-first evidence',
    description: 'ICMR guidelines, NTEP, NVBDCP, CDSCO drug database, State Treatment Guidelines. No default to UpToDate when an ICMR protocol exists.',
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
    description: 'Cross-reference India\'s CDSCO-approved generics. Catches interactions that Western tools miss.',
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
    description: 'Most AI tools cite FDA approvals and UpToDate. Indian generics, CDSCO schedules, and NTEP protocols are missing.',
  },
  {
    title: 'No time to read papers',
    description: 'A busy OPD leaves no time for literature review. Doctors need a synthesised answer in seconds, not citations to chase.',
  },
  {
    title: 'MR-driven information',
    description: 'The medical representative is still the primary information channel for many Indian doctors. OpenInsight replaces that with evidence.',
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
          <div className="animate-fade-in" style={{ animationDuration: '600ms' }}>
            <Logo variant="home" theme="dark" />
          </div>
          <h1 className="text-white text-center max-w-2xl animate-fade-in text-balance" style={{ animationDelay: '150ms' }}>
            Clinical knowledge,{' '}
            <span className="hero-gradient-text">when it matters most.</span>
          </h1>
          <p
            className="text-white text-center max-w-2xl opacity-75 text-lg animate-fade-in"
            style={{ fontSize: '20px', fontWeight: 300, animationDelay: '300ms' }}
          >
            OpenIns<span className="brand-i">ı</span>ght gives Indian doctors instant answers grounded in ICMR guidelines, CDSCO approvals, and India-specific clinical evidence — right at the point of care.
          </p>
          <div className="flex gap-4 justify-center items-center flex-wrap animate-fade-in" style={{ animationDelay: '450ms' }}>
            <Link href="/early-access" className="btn btn-accent-glow">
              Request Early Access
            </Link>
            <a href="#features" className="btn btn-secondary">
              See how it works ↓
            </a>
          </div>

          {/* Trust badge row */}
          <div className="hero-trust-row animate-fade-in" style={{ animationDelay: '600ms' }}>
            <span className="hero-trust-item">Backed by ICMR guidelines</span>
            <span className="hero-trust-item">CDSCO compliant</span>
            <span className="hero-trust-item">NMC registered</span>
            <span className="hero-trust-item">NTEP protocols</span>
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
                Indian doctors deserve tools built for India.
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="prose max-w-4xl mx-auto mb-12">
              <p className="text-center text-text-2 text-lg leading-relaxed mb-6">
                Most clinical AI tools are trained on Western populations, Western guidelines, and Western drug formularies. They reference UpToDate, NEJM, and FDA approvals — all useful, but incomplete for a doctor in Pune seeing a patient with tropical fever or prescribing a Jan Aushadhi generic.
              </p>
              <p className="text-center text-text-2 text-lg leading-relaxed">
                OpenInsight is built ground-up for the Indian clinical context: disease burden, drug availability, ICMR protocols, and the realities of Indian healthcare.
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
                Trusted by Indian doctors, every day.
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
                What OpenIns<span className="brand-i">ı</span>ght Does
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
                Indian doctors, in their own words.
              </h2>
              <p className="text-text-2 text-lg mt-4 max-w-2xl mx-auto">
                From AIIMS Delhi to a PHC in Latur — physicians across India use OpenInsight to make
                faster, better-cited clinical decisions.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal>
            <TestimonialsCarousel />
          </SectionReveal>

          <SectionReveal>
            <div className="trust-badges">
              <span className="trust-badge">ICMR Guidelines</span>
              <span className="trust-badge-sep">·</span>
              <span className="trust-badge">CDSCO Drug Data</span>
              <span className="trust-badge-sep">·</span>
              <span className="trust-badge">PubMed Central</span>
              <span className="trust-badge-sep">·</span>
              <span className="trust-badge">WHO India</span>
              <span className="trust-badge-sep">·</span>
              <span className="trust-badge">NTEP Protocols</span>
            </div>
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
                Questions Indian doctors ask us.
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
              <Link href="/early-access" className="btn btn-ghost">
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
            Built for Indian doctors. Free to use.
          </h2>
          <p className="text-white opacity-75 text-lg mb-8">
            OpenInsight is free for verified medical practitioners. Request early access and be among the first Indian doctors to use it.
          </p>
          <Link href="/early-access" className="btn btn-shimmer">
            Request Early Access →
          </Link>
          <p className="text-white opacity-50 text-sm mt-4">
            No credit card. No subscription. NMC registration number required.
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
        }

        /* Hero content block — centered as a cohesive group.
           Buttons share equal height & are perfectly centered. */
        .hero-content > .animate-fade-in {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .hero-content .btn {
          min-height: 44px;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 32px;
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
          padding-top: var(--spacing-12);
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
          padding-top: var(--spacing-12);
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

        .trust-badges {
          display: flex;
          gap: var(--spacing-2);
          justify-content: center;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: inline-block;
          background-color: var(--color-accent-pale);
          color: var(--color-accent);
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .trust-badge-sep {
          color: var(--color-accent);
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

          .trust-badges {
            gap: var(--spacing-1);
          }

          .trust-badge {
            font-size: 10px;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  )
}

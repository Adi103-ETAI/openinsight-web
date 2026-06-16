import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SectionReveal from '@/components/SectionReveal'
import MockChatUI from '@/components/MockChatUI'
import FeatureCard from '@/components/FeatureCard'

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
        <div className="container flex flex-col items-center justify-center gap-8">
          <Image
            src="/logos/DarkGrey.png"
            alt="OpenInsight"
            width={200}
            height={70}
            priority
            className="animate-fade-in"
            style={{ animationDuration: '600ms' }}
          />
          <h1 className="text-white text-center max-w-2xl animate-fade-in" style={{ animationDelay: '150ms' }}>
            Clinical knowledge, when it matters most.
          </h1>
          <p
            className="text-white text-center max-w-2xl opacity-75 text-lg animate-fade-in"
            style={{ fontSize: '20px', fontWeight: 300, animationDelay: '300ms' }}
          >
            OpenInsight gives Indian doctors instant answers grounded in ICMR guidelines, CDSCO approvals, and India-specific clinical evidence — right at the point of care.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{ animationDelay: '450ms' }}>
            <Link href="/early-access" className="btn btn-primary">
              Request Early Access
            </Link>
            <a href="#features" className="btn btn-secondary">
              See how it works ↓
            </a>
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

          <SectionReveal>
            <div className="grid grid-3">
              {problemCards.map((card, idx) => (
                <div key={idx} className="problem-card" style={{ animationDelay: `${idx * 100}ms` }}>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
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
            </div>
          </SectionReveal>

          <SectionReveal>
            <div className="demo-content">
              <div className="demo-left">
                <MockChatUI
                  question="What is the first-line treatment for drug-resistant tuberculosis in an adult per NTEP guidelines?"
                  response="According to NTEP 2022 guidelines, the preferred regimen for pre-XDR TB is BPaLM (Bedaquiline, Pretomanid, Linezolid, Moxifloxacin) for 6 months, followed by Levofloxacin for a total duration of 20 months. For XDR-TB, consider newer regimens based on drug susceptibility testing."
                  sources={['NTEP 2022', 'ICMR DR-TB Guidelines', 'Lancet 2022']}
                />
              </div>
              <div className="demo-right">
                <div className="demo-steps">
                  <div className="demo-step">
                    <div className="demo-step-number">1</div>
                    <div className="demo-step-content">
                      <h4>Ask in plain language</h4>
                      <p>Type your clinical question exactly as you'd ask a colleague. No special syntax.</p>
                    </div>
                  </div>
                  <div className="demo-step">
                    <div className="demo-step-number">2</div>
                    <div className="demo-step-content">
                      <h4>AI retrieves and synthesises</h4>
                      <p>DeepInsight searches ICMR, CDSCO, PubMed, and licensed Indian clinical content, then synthesises a structured answer.</p>
                    </div>
                  </div>
                  <div className="demo-step">
                    <div className="demo-step-number">3</div>
                    <div className="demo-step-content">
                      <h4>Verified, cited response</h4>
                      <p>Every claim is linked to its source. Disagree with the synthesis? See the raw evidence yourself.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container flex flex-col items-center justify-center gap-6">
          <SectionReveal>
            <blockquote className="testimonial-quote">
              "Exactly what I needed during a complicated TB case. NTEP and ICMR, all in one place."
            </blockquote>
          </SectionReveal>

          <SectionReveal>
            <p className="testimonial-attribution">
              Dr. [Name], Internal Medicine, Pune — <em>Beta tester</em>
            </p>
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

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2 className="text-white mb-4">
            Built for Indian doctors. Free to use.
          </h2>
          <p className="text-white opacity-75 text-lg mb-8">
            OpenInsight is free for verified medical practitioners. Request early access and be among the first Indian doctors to use it.
          </p>
          <Link href="/early-access" className="btn btn-primary">
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

        .hero-section > .container {
          position: relative;
          z-index: 1;
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

        .demo-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-8);
          align-items: center;
        }

        .demo-steps {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .demo-step {
          display: flex;
          gap: var(--spacing-3);
        }

        .demo-step-number {
          min-width: 40px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-accent-pale);
          color: var(--color-accent);
          border-radius: 50%;
          font-weight: 600;
          flex-shrink: 0;
        }

        .demo-step-content h4 {
          margin: 0 0 8px 0;
          color: var(--color-text);
        }

        .demo-step-content p {
          margin: 0;
          color: var(--color-text-2);
          font-size: var(--text-base);
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
          .demo-content {
            grid-template-columns: 1fr;
          }

          .demo-left {
            order: 2;
          }

          .demo-right {
            order: 1;
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

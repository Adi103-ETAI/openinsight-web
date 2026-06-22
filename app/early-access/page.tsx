import type { Metadata } from 'next'
import Logo from '@/components/Logo'
import EarlyAccessForm from '@/components/EarlyAccessForm'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Early Access | OpenInsight',
  description: 'Request early access to OpenInsight. Join the beta for verified Indian medical practitioners.',
}

export default function EarlyAccessPage() {
  return (
    <div className="early-access-page">
      <div className="early-access-container">
        {/* Left Side */}
        <div className="early-access-left">
          <div className="early-access-content">
            <Logo variant="header" theme="dark" />
            <h1 className="text-white mt-8">Be among the first.</h1>
            <p className="text-white text-lg opacity-75 mt-4">
              OpenInsight is in closed beta for verified Indian medical practitioners. Request access and we'll be in touch within 48 hours.
            </p>

            <div className="trust-signals mt-8">
              <div className="trust-signal">
                <span className="checkmark">✓</span>
                <span>Free for verified practitioners</span>
              </div>
              <div className="trust-signal">
                <span className="checkmark">✓</span>
                <span>NMC registration required for access</span>
              </div>
              <div className="trust-signal">
                <span className="checkmark">✓</span>
                <span>No pharmaceutical sponsorship in clinical answers</span>
              </div>
              <div className="trust-signal">
                <span className="checkmark">✓</span>
                <span>Built on ICMR, CDSCO, and NTEP guidelines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="early-access-right">
          <SectionReveal>
            <EarlyAccessForm />
          </SectionReveal>
        </div>
      </div>

      <style>{`
        .early-access-page {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
        }

        .early-access-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
        }

        .early-access-left {
          background-color: var(--color-dark);
          padding: var(--spacing-8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .early-access-content {
          max-width: 400px;
        }

        .early-access-right {
          background-color: var(--color-surface);
          padding: var(--spacing-8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trust-signals {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .trust-signal {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-2);
          font-size: var(--text-sm);
          color: white;
          line-height: 1.5;
        }

        .checkmark {
          color: var(--color-accent);
          font-weight: 600;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .early-access-container {
            grid-template-columns: 1fr;
          }

          .early-access-left {
            min-height: 300px;
          }

          .early-access-right {
            min-height: auto;
          }
        }

        @media (max-width: 640px) {
          .early-access-left {
            padding: var(--spacing-4);
          }

          .early-access-right {
            padding: var(--spacing-4);
          }

          .early-access-content {
            max-width: 100%;
          }

          .early-access-left h1 {
            font-size: var(--text-3xl);
          }
        }
      `}</style>
    </div>
  )
}

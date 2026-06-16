import type { Metadata } from 'next'
import SectionReveal from '@/components/SectionReveal'
import Accordion from '@/components/Accordion'

export const metadata: Metadata = {
  title: 'Product | OpenInsight',
  description: 'Explore OpenInsight features: Fast Search for quick lookups and DeepInsight for complex clinical reasoning.',
}

const architectureItems = [
  {
    title: 'Orchestrator',
    content: 'Receives the query, decides which agents to invoke and in what order. Manages escalation signals and coordinates the entire pipeline for optimal response quality.',
  },
  {
    title: 'RAG Agent',
    content: 'Retrieves relevant chunks from the Zilliz vector store using hybrid dense+sparse search with evidence-level boosting to prioritize high-quality sources.',
  },
  {
    title: 'Web Search Agent',
    content: 'Queries live web for recent publications, drug approvals, and guideline updates not yet in the corpus for real-time information.',
  },
  {
    title: 'Synthesis Agent',
    content: 'Receives outputs from RAG and Web Search agents, synthesises a coherent, structured clinical response ready for physician review.',
  },
  {
    title: 'Citation Validator',
    content: 'Verifies every claim against its source. Flags unverified statements to maintain clinical credibility and safety.',
  },
]

export default function ProductPage() {
  return (
    <div>
      {/* Hero */}
      <section className="product-hero">
        <div className="container text-center">
          <h1>Two modes. One goal — the right answer.</h1>
          <p className="text-lg text-text-2 mt-4 max-w-2xl mx-auto">
            OpenInsight has two query modes, optimised for how doctors actually think: fast lookups and deep clinical reasoning.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="product-comparison">
        <div className="container">
          <div className="comparison-grid">
            <SectionReveal>
              <div className="comparison-card">
                <h3 className="text-accent">Fast Search</h3>
                <p className="text-sm text-text-2 mt-2">The quick clinical colleague</p>
                
                <div className="comparison-details mt-6">
                  <div className="comparison-detail">
                    <strong>Response time:</strong> ~3 seconds
                  </div>
                  <div className="comparison-detail">
                    <strong>Best for:</strong> DDI checks, dosing, differential lists, quick protocol lookups
                  </div>
                  <div className="comparison-detail">
                    <strong>Process:</strong> Embed query → hybrid retrieval → reranking → LLM synthesis
                  </div>
                </div>
              </div>
            </SectionReveal>

            <div className="comparison-divider"></div>

            <SectionReveal>
              <div className="comparison-card">
                <h3 className="text-accent">DeepInsight</h3>
                <p className="text-sm text-text-2 mt-2">The thorough consultant</p>
                
                <div className="comparison-details mt-6">
                  <div className="comparison-detail">
                    <strong>Response time:</strong> 20–60 seconds
                  </div>
                  <div className="comparison-detail">
                    <strong>Best for:</strong> Complex cases, treatment planning, rare disease workup
                  </div>
                  <div className="comparison-detail">
                    <strong>Process:</strong> Multi-agent orchestration with RAG, web search, synthesis, and validation
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="product-architecture">
        <div className="container">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                Behind the Scenes
              </p>
              <h2 className="mt-4">How DeepInsight thinks</h2>
            </div>
          </SectionReveal>

          <SectionReveal>
            <Accordion items={architectureItems} />
          </SectionReveal>
        </div>
      </section>

      <style>{`
        .product-hero {
          background-color: var(--color-surface-2);
          padding: var(--spacing-12) var(--spacing-6);
          text-align: center;
        }

        .product-hero h1 {
          max-width: 800px;
          margin: 0 auto;
        }

        .product-comparison {
          padding: var(--spacing-12) var(--spacing-6);
          background-color: var(--color-surface);
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--spacing-6);
          max-width: 1000px;
          margin: 0 auto;
        }

        .comparison-card {
          background-color: var(--color-surface-2);
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }

        .comparison-card h3 {
          margin: 0;
        }

        .comparison-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .comparison-detail {
          font-size: var(--text-sm);
          line-height: var(--lh-base);
          color: var(--color-text-2);
        }

        .comparison-detail strong {
          color: var(--color-text);
          display: block;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .comparison-divider {
          width: 1px;
          background-color: var(--color-border);
          opacity: 0.5;
        }

        .product-architecture {
          padding: var(--spacing-12) var(--spacing-6);
          background-color: var(--color-surface-2);
        }

        @media (max-width: 1024px) {
          .comparison-grid {
            grid-template-columns: 1fr;
          }

          .comparison-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

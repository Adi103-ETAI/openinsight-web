'use client'

import { useEffect, useRef, useState } from 'react'

interface MockChatUIProps {
  question: string
  response: string
  sources: string[]
}

export default function MockChatUI({ question, response, sources }: MockChatUIProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isAnimating) {
          setIsAnimating(true)
        }
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isAnimating])

  useEffect(() => {
    if (!isAnimating) return

    let index = 0
    const interval = setInterval(() => {
      setDisplayedText(response.slice(0, index + 1))
      index++

      if (index >= response.length) {
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [isAnimating, response])

  return (
    <div ref={containerRef} className="mock-chat-ui">
      <style>{`
        .mock-chat-ui {
          background-color: var(--color-dark);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border-dark);
          overflow: hidden;
        }

        .mock-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4);
          border-bottom: 1px solid var(--color-border-dark);
        }

        .mock-chat-title {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mock-chat-body {
          padding: var(--spacing-4);
          max-height: 400px;
          overflow-y: auto;
        }

        .mock-chat-query {
          color: var(--color-text-3);
          font-size: var(--text-sm);
          margin-bottom: var(--spacing-3);
          line-height: var(--lh-base);
        }

        .mock-chat-loading {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          color: var(--color-accent);
          font-size: var(--text-sm);
          margin-bottom: var(--spacing-3);
        }

        .mock-chat-loading-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--color-accent);
          animation: blink 1s infinite;
        }

        .mock-chat-response {
          color: white;
          font-size: var(--text-sm);
          line-height: var(--lh-base);
          margin-bottom: var(--spacing-3);
          border-left: 2px solid var(--color-accent);
          padding-left: var(--spacing-2);
        }

        .mock-chat-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: var(--color-accent);
          animation: blink 500ms infinite;
          margin-left: 2px;
        }

        .mock-chat-sources {
          font-size: var(--text-xs);
          color: var(--color-text-3);
          border-top: 1px solid var(--color-border-dark);
          padding-top: var(--spacing-2);
          padding-bottom: var(--spacing-2);
        }

        .mock-chat-source-label {
          display: block;
          margin-bottom: var(--spacing-1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-text-2);
        }

        .mock-chat-source {
          display: inline-block;
          background-color: var(--color-accent-pale);
          color: var(--color-accent);
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          font-size: var(--text-xs);
          margin-right: var(--spacing-1);
          margin-bottom: var(--spacing-1);
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>

      <div className="mock-chat-header">
        <span className="mock-chat-title">openInsight</span>
      </div>

      <div className="mock-chat-body">
        <div className="mock-chat-query">
          <strong>Q:</strong> {question}
        </div>

        {!isAnimating && (
          <div className="mock-chat-loading">
            <span>Generating response</span>
            <span className="mock-chat-loading-dot"></span>
          </div>
        )}

        {isAnimating && (
          <div className="mock-chat-response">
            {displayedText}
            {displayedText.length < response.length && (
              <span className="mock-chat-cursor"></span>
            )}
          </div>
        )}

        {isAnimating && displayedText.length === response.length && (
          <div className="mock-chat-sources">
            <span className="mock-chat-source-label">Sources</span>
            {sources.map((source, idx) => (
              <span key={idx} className="mock-chat-source">
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function SectionReveal({
  children,
  delay = 0,
  className = '',
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            entries[0].target.classList.add('animate-fade-in-up')
          }, delay)
          observer.unobserve(entries[0].target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}

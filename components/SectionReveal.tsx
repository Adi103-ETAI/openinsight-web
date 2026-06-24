'use client'

import { useEffect, useRef } from 'react'

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  /** When true, direct children receive staggered transition-delay (0ms, 80ms, 160ms, ...).
   *  Requires the parent to also have the global `.stagger-children` utility class. */
  staggerChildren?: boolean
  /** Tag name to render. Defaults to 'div'. */
  as?: keyof React.JSX.IntrinsicElements
}

export default function SectionReveal({
  children,
  delay = 0,
  className = '',
  staggerChildren = false,
  as: Tag = 'div',
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            if (staggerChildren) {
              node.classList.add('is-revealed')
            } else {
              node.classList.add('animate-fade-in-up')
            }
          }, delay)
          observer.unobserve(node)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [delay, staggerChildren])

  const composedClassName = [
    className,
    staggerChildren ? 'stagger-children' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Type-safe-ish rendering: cast to any to satisfy TS for polymorphic tag.
  const Component = Tag as any

  return (
    <Component
      ref={ref as any}
      className={composedClassName}
      style={staggerChildren ? undefined : { opacity: 0 }}
    >
      {children}
    </Component>
  )
}

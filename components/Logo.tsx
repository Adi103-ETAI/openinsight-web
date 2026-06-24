'use client'

/**
 * OpenInsight Logo — code-first, vector-only brand mark.
 *
 * Renders "openInsight" as an inline SVG using Futura typography:
 *   - "open" in Futura Light (300), lowercase
 *   - "Insight" in Futura Medium (500), capital I
 *   - A terracotta dot sits above the "ı" (dotless i) — the brand's signature accent
 *
 * Adapted from the official openinsight-logo brand system (oi-logo-component.ts).
 * No PNG/image dependencies — pure SVG so it scales crisply at any size.
 */

interface LogoProps {
  /** Visual size context controls the rendered width. */
  variant?: 'home' | 'header' | 'footer'
  /** "dark" = logo sits on a dark background (renders light text).
   *  "light" = logo sits on a light background (renders dark text). */
  theme?: 'dark' | 'light'
  className?: string
}

const SIZES: Record<NonNullable<LogoProps['variant']>, number> = {
  home: 260,
  header: 150,
  footer: 180,
}

export default function Logo({
  variant = 'header',
  theme = 'light',
  className = '',
}: LogoProps) {
  const isDark = theme === 'dark'
  const textColor = isDark ? '#F5F4EF' : '#2B2B2B'
  const dotColor = '#C56B4A' // terracotta — matches --color-accent
  const width = SIZES[variant]
  const aspectRatio = 520 / 140
  const height = width / aspectRatio

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 520 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="openInsight"
      role="img"
    >
      {/* "open" — Futura Light 300, lowercase */}
      <text
        x="0"
        y="100"
        fontFamily="FuturaLTPro-Light, Futura, Jost, SF Pro Display, Helvetica Neue, Arial, sans-serif"
        fontSize="100"
        fontWeight="300"
        fill={textColor}
      >
        open
      </text>
      {/* "I" — Futura Medium 500, capital */}
      <text
        x="210.7"
        y="100"
        fontFamily="FuturaLTPro-Medium, Futura, Jost, SF Pro Display, Helvetica Neue, Arial, sans-serif"
        fontSize="100"
        fontWeight="500"
        fill={textColor}
      >
        I
      </text>
      {/* "ns" — Futura Medium 500 */}
      <text
        x="233.9"
        y="100"
        fontFamily="FuturaLTPro-Medium, Futura, Jost, SF Pro Display, Helvetica Neue, Arial, sans-serif"
        fontSize="100"
        fontWeight="500"
        fill={textColor}
      >
        ns
      </text>
      {/* The dotless-i stem (the vertical bar that replaces the "i" body) */}
      <rect x="334" y="53" width="10" height="46" fill={textColor} />
      {/* "ght" — Futura Medium 500 */}
      <text
        x="350.0"
        y="100"
        fontFamily="FuturaLTPro-Medium, Futura, Jost, SF Pro Display, Helvetica Neue, Arial, sans-serif"
        fontSize="100"
        fontWeight="500"
        fill={textColor}
      >
        ght
      </text>
      {/* The signature terracotta dot above the ı */}
      <circle cx="339.0" cy="28" r="8" fill={dotColor} />
    </svg>
  )
}

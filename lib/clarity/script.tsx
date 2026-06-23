'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

/**
 * Loads Microsoft Clarity for session recordings + heatmaps.
 * Free, GDPR/CCPA compliant, doesn't capture form field values.
 *
 * If NEXT_PUBLIC_CLARITY_PROJECT_ID is unset, this renders nothing.
 */
export function ClarityScript() {
  useEffect(() => {
    if (!CLARITY_ID) return
    // Clarity's snippet, adapted for Next.js
    ;(function (c: any, l: any, a: any, r: any, i: any) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
      const t = l.createElement(r) as HTMLScriptElement
      t.async = true
      t.src = 'https://www.clarity.ms/tag/' + i
      const y = l.getElementsByTagName(r)[0]
      y.parentNode?.insertBefore(t, y)
    })(window, document, 'clarity', 'script', CLARITY_ID)
  }, [])

  if (!CLARITY_ID) return null

  // Mark that Clarity is active (the script is injected by the effect above)
  return (
    <Script
      id="clarity-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: `window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};` }}
    />
  )
}

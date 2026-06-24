'use client'

import Script from 'next/script'

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

/**
 * Loads Microsoft Clarity for session recordings + heatmaps.
 * Free, GDPR/CCPA compliant, doesn't capture form field values.
 *
 * If NEXT_PUBLIC_CLARITY_PROJECT_ID is unset, this renders nothing.
 *
 * IMPORTANT: Clarity only collects data from PUBLICLY ACCESSIBLE URLs.
 * It will NOT record sessions on localhost or private network addresses.
 * Deploy to Vercel (or any public domain) and visit the live URL — data
 * will start flowing into the Clarity dashboard within a few minutes.
 */
export function ClarityScript() {
  if (!CLARITY_ID) return null

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_ID}");
        `,
      }}
    />
  )
}

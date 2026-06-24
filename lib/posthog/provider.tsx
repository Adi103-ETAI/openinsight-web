'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, useState } from 'react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Only init if we have a key — lets the site work before analytics is wired
    if (!POSTHOG_KEY || initialized) return

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only', // only identify after email submit
      persistence: 'localStorage+cookie',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false, // we fire events manually for precision
    })
    setInitialized(true)
  }, [initialized])

  if (!POSTHOG_KEY) {
    // No key = no PostHog. Render children normally; analytics just won't fire.
    return <>{children}</>
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

/** Convenience helper for firing events from any client component. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return
  posthog.capture(event, properties)
}

/** Identify the user after they submit the form (links future events to them). */
export function identifyUser(email: string, traits?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return
  posthog.identify(email, traits)
}

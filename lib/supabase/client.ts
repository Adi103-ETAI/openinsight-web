/**
 * Browser-side Supabase client.
 *
 * Uses the anon key (public, safe to expose) — all data access is protected
 * by Row-Level Security policies defined in supabase/migrations/.
 *
 * For server-side operations (API routes, admin dashboard) use
 * lib/supabase/server.ts which uses the service role key.
 */

import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Form submissions will fail until these are set in .env.local'
    )
  }
}

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

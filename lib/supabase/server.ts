/**
 * Server-side Supabase client.
 *
 * Uses the SERVICE ROLE key which bypasses RLS — never expose this in the browser.
 * Used only inside Vercel API route handlers and server components.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[supabase/server] Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }
}

export function createServerClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

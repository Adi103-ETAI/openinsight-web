/**
 * Server-side admin auth helper.
 *
 * Uses @supabase/ssr cookies to read the auth session in server components
 * and route handlers. The service-role client is used for data access
 * (bypasses RLS), but we still check that the logged-in user's email is in
 * the ADMIN_EMAILS allowlist.
 */

import { createServerClient as createSupabaseBrowser } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || ''
  return raw
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.trim().toLowerCase())
}

/**
 * Returns the logged-in admin user's email, or null if not logged in.
 * Throws if Supabase env is missing.
 */
export async function getAdminSession(): Promise<{ email: string } | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null

  const cookieStore = cookies()
  const supabase = createSupabaseBrowser(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null
  if (!isAdminEmail(user.email)) return null

  return { email: user.email }
}

/**
 * Server-component guard. Redirects to /admin/login if not authenticated.
 */
export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}

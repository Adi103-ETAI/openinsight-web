/**
 * Next.js Middleware — protects /admin routes.
 *
 * Checks for a Supabase auth session cookie. If no valid session is found,
 * redirects to /admin/login. This prevents the admin dashboard from
 * rendering (even briefly) for unauthenticated visitors.
 *
 * The client-side page.tsx also has its own guard, but this middleware
 * ensures the page never even loads HTML without auth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin (but NOT /admin/login — that page must be accessible)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  // If Supabase isn't configured, let the request through
  // (the page-level guard will handle it)
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  // Create a Supabase client that reads cookies from the request
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
      set() {
        // We don't need to set cookies in middleware
      },
      remove() {
        // We don't need to remove cookies in middleware
      },
    },
  })

  // Check if there's an authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    // Not authenticated → redirect to login
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated — but also check ADMIN_EMAILS allowlist
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  if (adminEmails.length > 0 && !adminEmails.includes(user.email.toLowerCase())) {
    // Logged in but not an admin → redirect to login with error
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('error', 'not_admin')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

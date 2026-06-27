/**
 * GET /api/admin/stats
 *   Returns aggregated analytics for the admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/supabase/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('early_access_submissions')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[api/admin/stats] fetch failed:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }

  const submissions = data || []

  // ─── Persona distribution ───────────────────────────
  const personaCounts: Record<string, number> = { doctor: 0, student: 0, professional: 0 }
  submissions.forEach(s => {
    if (personaCounts[s.persona] !== undefined) personaCounts[s.persona]++
  })

  // ─── Status distribution ────────────────────────────
  const statusCounts: Record<string, number> = { new: 0, contacted: 0, approved: 0, rejected: 0 }
  submissions.forEach(s => {
    if (statusCounts[s.status] !== undefined) statusCounts[s.status]++
  })

  // ─── Top cities ─────────────────────────────────────
  const cityCounts: Record<string, number> = {}
  submissions.forEach(s => {
    const c = s.city?.trim()
    if (c) cityCounts[c] = (cityCounts[c] || 0) + 1
  })
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([city, count]) => ({ city, count }))

  // ─── Referral sources ──────────────────────────────
  const referralCounts: Record<string, number> = {}
  submissions.forEach(s => {
    const r = s.referral_source?.trim()
    if (r) referralCounts[r] = (referralCounts[r] || 0) + 1
  })
  const topReferrals = Object.entries(referralCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([source, count]) => ({ source, count }))

  // ─── Specialty distribution ────────────────────────
  const specialtyCounts: Record<string, number> = {}
  submissions.forEach(s => {
    const spec = s.other_specialty?.trim() || s.specialty?.trim()
    if (spec) specialtyCounts[spec] = (specialtyCounts[spec] || 0) + 1
  })
  const topSpecialties = Object.entries(specialtyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([specialty, count]) => ({ specialty, count }))

  // ─── Signups timeline (daily, last 30 days) ────────
  const dailyCounts: Record<string, number> = {}
  const now = new Date()
  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    dailyCounts[key] = 0
  }
  submissions.forEach(s => {
    const key = s.created_at?.slice(0, 10)
    if (key && dailyCounts[key] !== undefined) dailyCounts[key]++
  })
  const signupTimeline = Object.entries(dailyCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }))

  // ─── Weekly signups ────────────────────────────────
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = submissions.filter(s => new Date(s.created_at) >= weekAgo).length

  // ─── Newsletter opt-in rate ────────────────────────
  const newsletterOptIn = submissions.filter(s => s.newsletter_opt_in).length

  // ─── Country distribution ──────────────────────────
  const countryCounts: Record<string, number> = {}
  submissions.forEach(s => {
    const c = s.ip_country?.trim()
    if (c) countryCounts[c] = (countryCounts[c] || 0) + 1
  })
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }))

  return NextResponse.json({
    total: submissions.length,
    thisWeek,
    newsletterOptIn,
    newsletterOptInRate: submissions.length > 0 ? Math.round((newsletterOptIn / submissions.length) * 100) : 0,
    personaCounts,
    statusCounts,
    topCities,
    topReferrals,
    topSpecialties,
    signupTimeline,
    topCountries,
  })
}

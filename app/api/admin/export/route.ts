/**
 * GET /api/admin/export
 *   Returns all submissions as a CSV download (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/supabase/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

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
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }

  const headers = [
    'created_at',
    'full_name',
    'email',
    'phone',
    'persona',
    'specialty',
    'other_specialty',
    'institution',
    'city',
    'nmc_number',
    'use_case',
    'referral_source',
    'newsletter_opt_in',
    'status',
    'ip_country',
  ]

  const rows = (data || []).map(r => [
    r.created_at,
    r.full_name,
    r.email,
    r.phone,
    r.persona,
    r.specialty,
    r.other_specialty,
    r.institution,
    r.city,
    r.nmc_number,
    r.use_case,
    r.referral_source,
    r.newsletter_opt_in,
    r.status,
    r.ip_country,
  ].map(csvEscape).join(','))

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="openinsight-signups-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  })
}

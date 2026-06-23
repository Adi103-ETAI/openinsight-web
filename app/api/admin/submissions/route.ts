/**
 * GET /api/admin/submissions
 *   Returns all early-access submissions (admin only)
 *
 * PATCH /api/admin/submissions
 *   Updates a submission's status (admin only)
 *   Body: { id: string, status: 'new'|'contacted'|'approved'|'rejected' }
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

  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const persona = url.searchParams.get('persona')

  let query = supabase
    .from('early_access_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && ['new', 'contacted', 'approved', 'rejected'].includes(status)) {
    query = query.eq('status', status)
  }
  if (persona && ['doctor', 'student', 'professional'].includes(persona)) {
    query = query.eq('persona', persona)
  }

  const { data, error } = await query
  if (error) {
    console.error('[api/admin/submissions] fetch failed:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }

  return NextResponse.json({ submissions: data || [] })
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 })
  }

  let body: { id?: string; status?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.id || !body.status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 422 })
  }
  if (!['new', 'contacted', 'approved', 'rejected'].includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 422 })
  }

  const { error } = await supabase
    .from('early_access_submissions')
    .update({ status: body.status })
    .eq('id', body.id)

  if (error) {
    console.error('[api/admin/submissions] update failed:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

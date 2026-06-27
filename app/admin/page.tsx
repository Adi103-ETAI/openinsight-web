'use client'

import { useEffect, useState, useCallback, Fragment, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Types ──────────────────────────────────────────────
interface Submission {
  id: string; created_at: string; full_name: string; email: string
  phone: string | null; persona: string; specialty: string | null
  other_specialty: string | null; institution: string | null; city: string
  nmc_number: string | null; use_case: string | null; referral_source: string | null
  newsletter_opt_in: boolean; status: string; ip_country: string | null
}

interface Stats {
  total: number; thisWeek: number; newsletterOptIn: number; newsletterOptInRate: number
  personaCounts: Record<string, number>; statusCounts: Record<string, number>
  topCities: { city: string; count: number }[]; topReferrals: { source: string; count: number }[]
  topSpecialties: { specialty: string; count: number }[]
  signupTimeline: { date: string; count: number }[]
  topCountries: { country: string; count: number }[]
}

// ─── Constants ──────────────────────────────────────────
const PERSONA_LABEL: Record<string, string> = { doctor: 'Doctor', student: 'Student', professional: 'Professional' }
const PERSONA_COLORS: Record<string, string> = { doctor: '#10B981', student: '#3B82F6', professional: '#8B5CF6' }
const STATUS_COLORS: Record<string, string> = { new: '#3B82F6', contacted: '#F59E0B', approved: '#10B981', rejected: '#EF4444' }
const STATUS_LABELS: Record<string, string> = { new: 'New', contacted: 'Contacted', approved: 'Approved', rejected: 'Rejected' }
const MULTI_COLORS = ['#C56B4A', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#EC4899']

// ─── Shared inline styles ───────────────────────────────
const cardStyle: React.CSSProperties = { backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '16px' }

// ─── Main Component ─────────────────────────────────────
export default function AdminDashboard() {
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const [authState, setAuthState] = useState<'checking' | 'authenticated'>('checking')
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions'>('overview')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterPersona, setFilterPersona] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [adminEmail, setAdminEmail] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }, [])

  const fetchSubmissions = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      if (filterPersona) params.set('persona', filterPersona)
      if (filterStatus) params.set('status', filterStatus)
      const res = await fetch(`/api/admin/submissions?${params}`)
      if (res.status === 401) { window.location.href = '/admin/login'; return }
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed') }
      setSubmissions((await res.json()).submissions || [])
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }, [filterPersona, filterStatus])

  const fetchStats = useCallback(async () => {
    try { const res = await fetch('/api/admin/stats'); if (res.ok) setStats(await res.json()) } catch {}
  }, [])

  useEffect(() => {
    getSupabase().auth.getUser().then(({ data: { user } }) => {
      if (!user?.email) { window.location.href = '/admin/login'; return }
      setAdminEmail(user.email); setAuthState('authenticated')
      Promise.all([fetchSubmissions(), fetchStats()])
    })
  }, [fetchSubmissions, fetchStats, getSupabase])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/submissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    fetchStats()
  }

  const handleSignOut = async () => { await getSupabase().auth.signOut(); window.location.href = '/admin/login' }

  const filteredSubmissions = submissions.filter(s => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return [s.full_name, s.email, s.city, s.specialty, s.institution].some(v => v?.toLowerCase().includes(q))
  })
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize))
  const paginated = filteredSubmissions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (authState === 'checking') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1C1B1A' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '2px solid #C56B4A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#8A8884', fontSize: '14px', marginTop: '12px' }}>Verifying access…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F0E8' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#1C1B1A', borderBottom: '1px solid #2F2E2C' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #C56B4A, #A5573A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C56B4A', margin: 0 }}>OpenInsight</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#FAFAF8', margin: 0 }}>Validation Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', backgroundColor: '#2B2B29' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399' }} />
              <span style={{ color: '#8A8884', fontSize: '11px' }}>{adminEmail}</span>
            </div>
            <button onClick={handleSignOut} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500, border: '1px solid #3F3E3C', color: '#A5A49E', backgroundColor: 'transparent', cursor: 'pointer' }}>Sign out</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 20px 0' }}>
        <div style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '8px', backgroundColor: '#E8E4DC' }}>
          {(['overview', 'submissions'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer',
                border: 'none', backgroundColor: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#1C1B1A' : '#8A8884',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 20px 32px' }}>
        {error && <div style={{ padding: '10px', borderRadius: '8px', fontSize: '13px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', marginBottom: '12px' }}>{error}</div>}
        {activeTab === 'overview' ? <OverviewTab stats={stats} submissions={submissions} loading={loading} /> : (
          <SubmissionsTab submissions={filteredSubmissions} paginated={paginated} loading={loading}
            filterPersona={filterPersona} setFilterPersona={setFilterPersona} filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} expandedId={expandedId} setExpandedId={setExpandedId}
            updateStatus={updateStatus} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} fetchSubmissions={fetchSubmissions} />
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════
function OverviewTab({ stats, submissions, loading }: { stats: Stats | null; submissions: Submission[]; loading: boolean }) {
  if (loading && !stats) return <Spinner />
  if (!stats) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <KpiCard label="Total Signups" value={stats.total} color="#C56B4A" sub="All time" />
        <KpiCard label="This Week" value={stats.thisWeek} color="#3B82F6" sub="Last 7 days" />
        <KpiCard label="Newsletter" value={`${stats.newsletterOptInRate}%`} color="#10B981" sub={`${stats.newsletterOptIn} of ${stats.total}`} />
        <KpiCard label="Conversion" value={`${stats.total > 0 ? Math.round(((stats.statusCounts.approved || 0) / stats.total) * 100) : 0}%`} color="#8B5CF6" sub={`${stats.statusCounts.approved || 0} approved`} />
      </div>

      {/* Donut Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <DonutCard title="Persona Distribution" data={Object.entries(stats.personaCounts).map(([k, v]) => ({ name: PERSONA_LABEL[k] || k, value: v, color: PERSONA_COLORS[k] || '#8A8884' }))} />
        <DonutCard title="Status Pipeline" data={Object.entries(stats.statusCounts).map(([k, v]) => ({ name: STATUS_LABELS[k] || k, value: v, color: STATUS_COLORS[k] || '#8A8884' }))} />
      </div>

      {/* Signup Timeline */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Signup Trend</h3>
        <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 12px' }}>Daily signups — last 30 days</p>
        {stats.signupTimeline.some(d => d.count > 0) ? <MiniAreaChart data={stats.signupTimeline} /> : <EmptyState />}
      </div>

      {/* Cities + Referrals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Top Cities</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 12px' }}>Signups by city</p>
          {stats.topCities.length > 0 ? <HBar items={stats.topCities} colors={MULTI_COLORS} /> : <EmptyState />}
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Referral Sources</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 12px' }}>How people discover OpenInsight</p>
          {stats.topReferrals.length > 0 ? <HBar items={stats.topReferrals} colors={['#3B82F6']} /> : <EmptyState />}
        </div>
      </div>

      {/* Specialties + Countries + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Specialties</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 12px' }}>Medical specialties</p>
          {stats.topSpecialties.length > 0 ? <HBar items={stats.topSpecialties} colors={MULTI_COLORS} /> : <EmptyState />}
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Countries</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 12px' }}>Signup origin</p>
          {stats.topCountries.length > 0 ? <PBar items={stats.topCountries} colors={MULTI_COLORS} /> : <EmptyState />}
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Recent Signups</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 12px' }}>Latest submissions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {submissions.slice(0, 5).map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '8px', backgroundColor: '#FAFAF8' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0, backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}18`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>
                  {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1C1B1A' }}>{s.full_name}</p>
                  <p style={{ fontSize: '10px', margin: 0, color: '#8A8884', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.city} · {PERSONA_LABEL[s.persona] || s.persona}</p>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap', backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}15`, color: STATUS_COLORS[s.status] || '#8A8884' }}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>
            ))}
            {submissions.length === 0 && <EmptyState />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// SUBMISSIONS TAB
// ═══════════════════════════════════════════════════════
function SubmissionsTab({ submissions, paginated, loading, filterPersona, setFilterPersona, filterStatus, setFilterStatus, searchQuery, setSearchQuery, expandedId, setExpandedId, updateStatus, currentPage, setCurrentPage, totalPages, fetchSubmissions }: {
  submissions: Submission[]; paginated: Submission[]; loading: boolean
  filterPersona: string; setFilterPersona: (v: string) => void; filterStatus: string; setFilterStatus: (v: string) => void
  searchQuery: string; setSearchQuery: (v: string) => void; expandedId: string | null; setExpandedId: (v: string | null) => void
  updateStatus: (id: string, status: string) => void; currentPage: number; setCurrentPage: (v: number) => void
  totalPages: number; fetchSubmissions: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <input type="text" placeholder="Search name, email, city…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '12px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#1C1B1A', width: '200px', outline: 'none' }} />
          <select value={filterPersona} onChange={e => setFilterPersona(e.target.value)} style={{ padding: '6px 8px', borderRadius: '8px', fontSize: '12px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#1C1B1A', cursor: 'pointer' }}>
            <option value="">All personas</option><option value="doctor">Doctors</option><option value="student">Students</option><option value="professional">Professionals</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '6px 8px', borderRadius: '8px', fontSize: '12px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#1C1B1A', cursor: 'pointer' }}>
            <option value="">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchSubmissions} style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '12px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955', cursor: 'pointer' }}>↻ Refresh</button>
        </div>
        <a href="/api/admin/export" style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#C56B4A', color: 'white' }}>↓ Export CSV</a>
      </div>

      <p style={{ fontSize: '11px', color: '#A5A49E', margin: 0 }}>{submissions.length} result{submissions.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', border: '1px solid #E8E4DC' }}>
        {loading ? <Spinner /> : submissions.length === 0 ? (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: '#A5A49E' }}><p style={{ fontSize: '14px', margin: 0 }}>No submissions yet</p></div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 100px 80px 60px', gap: '4px', padding: '8px 16px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#F5F0E8', color: '#8A8884', borderBottom: '1px solid #E8E4DC' }}>
              <span>Date</span><span>Name</span><span>Persona</span><span>City</span><span>Specialty</span><span>Status</span><span></span>
            </div>
            {paginated.map(s => (
              <Fragment key={s.id}>
                <div onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 100px 80px 60px', gap: '4px', padding: '10px 16px', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #F0ECE4', fontSize: '12px' }}>
                  <span style={{ color: '#8A8884', fontSize: '11px' }}>{new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0, backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}18`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>{s.full_name?.charAt(0)?.toUpperCase()}</div>
                    <span style={{ fontWeight: 600, color: '#1C1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name}</span>
                  </div>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}15`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>{PERSONA_LABEL[s.persona]}</span>
                  <span style={{ color: '#5A5955' }}>{s.city}</span>
                  <span style={{ color: '#8A8884', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.specialty || '—'}</span>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}15`, color: STATUS_COLORS[s.status] || '#8A8884' }}>{STATUS_LABELS[s.status]}</span>
                  <button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === s.id ? null : s.id) }} style={{ fontSize: '11px', fontWeight: 600, color: '#C56B4A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{expandedId === s.id ? '▲' : '▼'}</button>
                </div>
                {expandedId === s.id && (
                  <div style={{ backgroundColor: '#FAFAF8', borderBottom: '1px solid #E8E4DC', padding: '16px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px', fontSize: '11px' }}>
                      <Detail label="Email" value={<a href={`mailto:${s.email}`} style={{ color: '#C56B4A' }}>{s.email}</a>} />
                      <Detail label="Phone" value={s.phone || '—'} />
                      <Detail label="Institution" value={s.institution || '—'} />
                      <Detail label="NMC Number" value={s.nmc_number || '—'} />
                      <Detail label="Referral" value={s.referral_source || '—'} />
                      <Detail label="Country" value={s.ip_country || '—'} />
                      <Detail label="Newsletter" value={s.newsletter_opt_in ? '✓ Subscribed' : '✗ No'} />
                      <Detail label="Submitted" value={new Date(s.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'} />
                    </div>
                    {s.use_case && <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'white', border: '1px solid #E8E4DC', marginBottom: '10px' }}><p style={{ fontSize: '10px', fontWeight: 700, color: '#8A8884', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Use case</p><p style={{ fontSize: '12px', color: '#1C1B1A', margin: 0, lineHeight: 1.5 }}>{s.use_case}</p></div>}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {(['new', 'contacted', 'approved', 'rejected'] as const).map(st => (
                        <button key={st} onClick={() => updateStatus(s.id, st)}
                          style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                            border: `1.5px solid ${s.status === st ? STATUS_COLORS[st] : '#E8E4DC'}`,
                            backgroundColor: s.status === st ? `${STATUS_COLORS[st]}12` : 'white',
                            color: s.status === st ? STATUS_COLORS[st] : '#8A8884' }}>
                          {STATUS_LABELS[st]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderTop: '1px solid #F0ECE4' }}>
                <span style={{ fontSize: '11px', color: '#8A8884' }}>Page {currentPage} of {totalPages}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} style={{ width: '28px', height: '28px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: p === currentPage ? 'none' : '1px solid #E8E4DC', backgroundColor: p === currentPage ? '#C56B4A' : 'white', color: p === currentPage ? 'white' : '#5A5955' }}>{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955', cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>→</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// LIGHTWEIGHT CHARTS (Pure SVG/CSS, zero dependencies)
// ═══════════════════════════════════════════════════════

function DonutChart({ data, size = 120, stroke = 18 }: { data: { name: string; value: number; color: string }[]; size?: number; stroke?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <EmptyState />
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      {data.filter(d => d.value > 0).map((d, i) => {
        const pct = d.value / total
        const dash = pct * C
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth={stroke} strokeDasharray={`${Math.max(0, dash - 3)} ${C - dash + 3}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round" />
        offset += dash
        return el
      })}
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="800" fill="#1C1B1A">{total}</text>
    </svg>
  )
}

function DonutCard({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>{title}</h3>
      <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 12px' }}>Breakdown</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <DonutChart data={data.filter(d => d.value > 0)} size={110} stroke={16} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#5A5955' }}>{d.name}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1C1B1A' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MiniAreaChart({ data }: { data: { date: string; count: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.count), 1)
  const w = 600, h = 100, px = 25
  const chartW = w - px * 2, chartH = h - 16
  const points = data.map((d, i) => ({
    x: px + (i / Math.max(data.length - 1, 1)) * chartW,
    y: 8 + chartH - (d.count / maxVal) * chartH,
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${8 + chartH} L${points[0].x},${8 + chartH} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C56B4A" stopOpacity="0.25"/><stop offset="100%" stopColor="#C56B4A" stopOpacity="0.02"/></linearGradient></defs>
      {[0, 0.5, 1].map(pct => <line key={pct} x1={px} y1={8 + chartH * (1 - pct)} x2={w - px} y2={8 + chartH * (1 - pct)} stroke="#E8E4DC" strokeWidth="1"/>)}
      <path d={areaPath} fill="url(#aGrad)"/>
      <path d={linePath} fill="none" stroke="#C56B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {points.filter((_, i) => data[i]?.count > 0).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#C56B4A" stroke="white" strokeWidth="2"/>)}
      {data.filter((_, i) => i % 7 === 0 || i === data.length - 1).map((d, i) => {
        const idx = data.indexOf(d)
        const x = px + (idx / Math.max(data.length - 1, 1)) * chartW
        return <text key={i} x={x} y={h - 1} textAnchor="middle" fontSize="10" fill="#A5A49E">{d.date.slice(5)}</text>
      })}
    </svg>
  )
}

function HBar({ items, colors }: { items: Record<string, any>[]; colors: string[] }) {
  const max = Math.max(...items.map(i => i.count), 1)
  const getLabel = (item: any) => item.city || item.source || item.specialty || ''
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.slice(0, 8).map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 500, width: '70px', textAlign: 'right', color: '#5A5955', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{getLabel(item)}</span>
          <div style={{ flex: 1, height: '20px', borderRadius: '999px', backgroundColor: '#E8E4DC', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6px', minWidth: '28px', transition: 'width 0.5s', width: `${Math.max((item.count / max) * 100, 10)}%`, backgroundColor: colors[i % colors.length] }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'white' }}>{item.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PBar({ items, colors }: { items: { country: string; count: number }[]; colors: string[] }) {
  const max = Math.max(...items.map(i => i.count), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.slice(0, 5).map((item, i) => (
        <div key={item.country}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
            <span style={{ fontWeight: 500, color: '#5A5955' }}>{item.country}</span>
            <span style={{ fontWeight: 700, color: '#1C1B1A' }}>{item.count}</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#E8E4DC', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', width: `${(item.count / max) * 100}%`, backgroundColor: colors[i % colors.length], transition: 'width 0.5s' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════

function KpiCard({ label, value, color, sub }: { label: string; value: number | string; color: string; sub: string }) {
  return (
    <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A8884' }}>{label}</span>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
      </div>
      <span style={{ fontSize: '24px', fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '10px', color: '#A5A49E', marginTop: '4px' }}>{sub}</span>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A8884', margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: '12px', color: '#1C1B1A', margin: 0 }}>{value}</p>
    </div>
  )
}

function EmptyState() {
  return <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '12px', color: '#A5A49E' }}>No data yet</div>
}

function Spinner() {
  return (
    <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid #C56B4A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )
}

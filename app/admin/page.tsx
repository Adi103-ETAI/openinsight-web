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
    return <div className="min-h-screen flex items-center justify-center bg-[#1C1B1A]"><div className="text-center"><Spinner size={8} /><p className="text-[#8A8884] text-sm mt-3">Verifying access…</p></div></div>
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1C1B1A] border-b border-[#2F2E2C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C56B4A] to-[#A5573A] flex items-center justify-center shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div><p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C56B4A]">OpenInsight</p><p className="text-sm font-medium text-white">Validation Dashboard</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B2B29]"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-[#8A8884] text-[11px]">{adminEmail}</span></div>
            <button onClick={handleSignOut} className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-[#3F3E3C] text-[#A5A49E] bg-transparent hover:bg-[#2B2B29] transition-colors">Sign out</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
        <div className="flex gap-1 p-0.5 rounded-lg bg-[#E8E4DC] inline-flex">
          {(['overview', 'submissions'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-md text-[11px] font-semibold capitalize transition-all"
              style={{ backgroundColor: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? '#1C1B1A' : '#8A8884', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        {error && <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-800">{error}</div>}
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
  if (loading && !stats) return <div className="py-16 flex justify-center"><Spinner /></div>
  if (!stats) return null

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total Signups" value={stats.total} color="#C56B4A" sub="All time" />
        <KpiCard label="This Week" value={stats.thisWeek} color="#3B82F6" sub="Last 7 days" />
        <KpiCard label="Newsletter" value={`${stats.newsletterOptInRate}%`} color="#10B981" sub={`${stats.newsletterOptIn} of ${stats.total}`} />
        <KpiCard label="Conversion" value={`${stats.total > 0 ? Math.round(((stats.statusCounts.approved || 0) / stats.total) * 100) : 0}%`} color="#8B5CF6" sub={`${stats.statusCounts.approved || 0} approved`} />
      </div>

      {/* Charts Row 1: Donuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DonutCard title="Persona Distribution" data={Object.entries(stats.personaCounts).map(([k, v]) => ({ name: PERSONA_LABEL[k] || k, value: v, color: PERSONA_COLORS[k] || '#8A8884' }))} />
        <DonutCard title="Status Pipeline" data={Object.entries(stats.statusCounts).map(([k, v]) => ({ name: STATUS_LABELS[k] || k, value: v, color: STATUS_COLORS[k] || '#8A8884' }))} />
      </div>

      {/* Signup Timeline */}
      <Card title="Signup Trend" sub="Daily signups — last 30 days">
        {stats.signupTimeline.some(d => d.count > 0) ? (
          <MiniAreaChart data={stats.signupTimeline} />
        ) : <EmptyState />}
      </Card>

      {/* Row: Cities + Referrals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card title="Top Cities" sub="Signups by city">
          {stats.topCities.length > 0 ? <HorizontalBars items={stats.topCities} colors={MULTI_COLORS} /> : <EmptyState />}
        </Card>
        <Card title="Referral Sources" sub="How people discover OpenInsight">
          {stats.topReferrals.length > 0 ? <HorizontalBars items={stats.topReferrals} colors={['#3B82F6']} /> : <EmptyState />}
        </Card>
      </div>

      {/* Row: Specialties + Countries + Recent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card title="Specialties" sub="Medical specialties">
          {stats.topSpecialties.length > 0 ? <HorizontalBars items={stats.topSpecialties} colors={MULTI_COLORS} /> : <EmptyState />}
        </Card>
        <Card title="Countries" sub="Signup origin">
          {stats.topCountries.length > 0 ? <ProgressBar items={stats.topCountries} colors={MULTI_COLORS} /> : <EmptyState />}
        </Card>
        <Card title="Recent Signups" sub="Latest submissions">
          <div className="space-y-2">
            {submissions.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAFAF8]">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}18`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>
                  {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate text-[#1C1B1A]">{s.full_name}</p>
                  <p className="text-[10px] truncate text-[#8A8884]">{s.city} · {PERSONA_LABEL[s.persona] || s.persona}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}15`, color: STATUS_COLORS[s.status] || '#8A8884' }}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>
            ))}
            {submissions.length === 0 && <EmptyState />}
          </div>
        </Card>
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
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A5A49E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="pl-8 pr-2 py-1.5 rounded-lg text-xs border bg-white border-[#E8E4DC] text-[#1C1B1A] w-[180px] focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30" />
          </div>
          <select value={filterPersona} onChange={e => setFilterPersona(e.target.value)} className="px-2 py-1.5 rounded-lg text-xs border bg-white border-[#E8E4DC] text-[#1C1B1A] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30">
            <option value="">All personas</option><option value="doctor">Doctors</option><option value="student">Students</option><option value="professional">Professionals</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-2 py-1.5 rounded-lg text-xs border bg-white border-[#E8E4DC] text-[#1C1B1A] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30">
            <option value="">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchSubmissions} className="px-2 py-1.5 rounded-lg text-xs border bg-white border-[#E8E4DC] text-[#5A5955] hover:bg-[#FAFAF8]">↻</button>
        </div>
        <a href="/api/admin/export" className="px-3 py-1.5 rounded-lg text-[11px] font-semibold no-underline inline-flex items-center gap-1 bg-[#C56B4A] text-white hover:bg-[#A5573A] transition-colors">
          ↓ Export CSV
        </a>
      </div>

      <p className="text-[11px] text-[#A5A49E]">{submissions.length} result{submissions.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-white border border-[#E8E4DC]">
        {loading ? <div className="py-12 flex justify-center"><Spinner /></div> : submissions.length === 0 ? (
          <div className="py-16 text-center text-[#A5A49E]"><p className="text-sm">No submissions yet</p></div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-1 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider bg-[#F5F0E8] text-[#8A8884]">
              <div className="col-span-2">Date</div><div className="col-span-2">Name</div><div className="col-span-2">Persona</div><div className="col-span-2">City</div><div className="col-span-1">Specialty</div><div className="col-span-1">Status</div><div className="col-span-2 text-right">Action</div>
            </div>
            {paginated.map(s => (
              <Fragment key={s.id}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 px-4 py-2.5 items-center cursor-pointer hover:bg-[#FAFAF8] border-b border-[#F0ECE4] transition-colors"
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                  <div className="md:col-span-2 text-[11px] text-[#8A8884]">{new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}18`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>{s.full_name?.charAt(0)?.toUpperCase()}</div>
                    <span className="text-xs font-semibold truncate text-[#1C1B1A]">{s.full_name}</span>
                  </div>
                  <div className="md:col-span-2"><span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}15`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>{PERSONA_LABEL[s.persona]}</span></div>
                  <div className="md:col-span-2 text-xs text-[#5A5955]">{s.city}</div>
                  <div className="md:col-span-1 text-[11px] truncate text-[#8A8884]">{s.specialty || '—'}</div>
                  <div className="md:col-span-1"><span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}15`, color: STATUS_COLORS[s.status] || '#8A8884' }}>{STATUS_LABELS[s.status]}</span></div>
                  <div className="md:col-span-2 text-right"><button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === s.id ? null : s.id) }} className="text-[11px] font-semibold text-[#C56B4A] hover:underline">{expandedId === s.id ? '▲ Hide' : '▼ Details'}</button></div>
                </div>
                {expandedId === s.id && (
                  <div className="bg-[#FAFAF8] border-b border-[#E8E4DC] px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-[11px]">
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">Email</span><a href={`mailto:${s.email}`} className="text-[#C56B4A]">{s.email}</a></div>
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">Phone</span><span className="text-[#1C1B1A]">{s.phone || '—'}</span></div>
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">Institution</span><span className="text-[#1C1B1A]">{s.institution || '—'}</span></div>
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">NMC Number</span><span className="text-[#1C1B1A]">{s.nmc_number || '—'}</span></div>
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">Referral</span><span className="text-[#1C1B1A]">{s.referral_source || '—'}</span></div>
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">Country</span><span className="text-[#1C1B1A]">{s.ip_country || '—'}</span></div>
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">Newsletter</span><span className="text-[#1C1B1A]">{s.newsletter_opt_in ? '✓ Yes' : '✗ No'}</span></div>
                      <div><span className="font-bold text-[#8A8884] uppercase tracking-wider text-[9px] block mb-0.5">Submitted</span><span className="text-[#1C1B1A]">{new Date(s.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span></div>
                    </div>
                    {s.use_case && <div className="mb-3 p-3 rounded-lg bg-white border border-[#E8E4DC]"><p className="text-[9px] font-bold text-[#8A8884] uppercase tracking-wider mb-1">Use case</p><p className="text-xs text-[#1C1B1A] leading-relaxed">{s.use_case}</p></div>}
                    <div className="flex gap-1.5">
                      {(['new', 'contacted', 'approved', 'rejected'] as const).map(st => (
                        <button key={st} onClick={() => updateStatus(s.id, st)}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                          style={{ border: `1.5px solid ${s.status === st ? STATUS_COLORS[st] : '#E8E4DC'}`, backgroundColor: s.status === st ? `${STATUS_COLORS[st]}12` : 'white', color: s.status === st ? STATUS_COLORS[st] : '#8A8884' }}>
                          {STATUS_LABELS[st]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F0ECE4]">
                <p className="text-[11px] text-[#8A8884]">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-2 py-1 rounded text-[11px] border border-[#E8E4DC] bg-white text-[#5A5955] disabled:opacity-40">←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} className="w-6 h-6 rounded text-[11px] font-semibold" style={{ backgroundColor: p === currentPage ? '#C56B4A' : 'white', color: p === currentPage ? 'white' : '#5A5955', border: p === currentPage ? 'none' : '1px solid #E8E4DC' }}>{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-2 py-1 rounded text-[11px] border border-[#E8E4DC] bg-white text-[#5A5955] disabled:opacity-40">→</button>
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
// LIGHTWEIGHT CHART COMPONENTS (No recharts!)
// ═══════════════════════════════════════════════════════

// Donut chart using pure SVG
function DonutChart({ data, size = 140, strokeWidth = 24 }: { data: { name: string; value: number; color: string }[]; size?: number; strokeWidth?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) return <EmptyState />
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto block">
      {data.map((d, i) => {
        const pct = d.value / total
        const dashLength = pct * circumference
        const gap = 4 // small gap between segments
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={d.color} strokeWidth={strokeWidth}
            strokeDasharray={`${Math.max(0, dashLength - gap)} ${circumference - dashLength + gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="round"
          />
        )
        offset += dashLength
        return el
      })}
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="text-lg font-bold" fill="#1C1B1A">{total}</text>
    </svg>
  )
}

function DonutCard({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="rounded-xl p-4 bg-white border border-[#E8E4DC]">
      <h3 className="text-xs font-bold text-[#1C1B1A] mb-0.5">{title}</h3>
      <p className="text-[10px] text-[#A5A49E] mb-3">Breakdown</p>
      <div className="flex items-center gap-4">
        <DonutChart data={data.filter(d => d.value > 0)} size={120} strokeWidth={20} />
        <div className="flex flex-col gap-1.5">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[11px] text-[#5A5955]">{d.name}</span>
              <span className="text-[11px] font-bold text-[#1C1B1A]">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mini area chart using pure SVG
function MiniAreaChart({ data }: { data: { date: string; count: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.count), 1)
  const w = 600
  const h = 120
  const px = 30 // padding
  const chartW = w - px * 2
  const chartH = h - 20

  const points = data.map((d, i) => ({
    x: px + (i / Math.max(data.length - 1, 1)) * chartW,
    y: 10 + chartH - (d.count / maxVal) * chartH,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${10 + chartH} L${points[0].x},${10 + chartH} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C56B4A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C56B4A" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <line key={pct} x1={px} y1={10 + chartH * (1 - pct)} x2={w - px} y2={10 + chartH * (1 - pct)} stroke="#E8E4DC" strokeWidth="1" />
      ))}
      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#C56B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots on data points */}
      {points.filter((_, i) => data[i]?.count > 0).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#C56B4A" stroke="white" strokeWidth="2" />
      ))}
      {/* X axis labels */}
      {data.filter((_, i) => i % 7 === 0 || i === data.length - 1).map((d, i) => {
        const idx = data.indexOf(d)
        const x = px + (idx / Math.max(data.length - 1, 1)) * chartW
        return <text key={i} x={x} y={h - 2} textAnchor="middle" fontSize="10" fill="#A5A49E">{d.date.slice(5)}</text>
      })}
    </svg>
  )
}

// Horizontal bar chart using divs (most reliable!)
function HorizontalBars({ items, colors }: { items: { city?: string; source?: string; specialty?: string; count: number }[]; colors: string[] }) {
  const max = Math.max(...items.map(i => i.count), 1)
  const label = (item: any) => item.city || item.source || item.specialty || ''
  return (
    <div className="space-y-2">
      {items.slice(0, 8).map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[11px] font-medium w-20 truncate text-[#5A5955] text-right">{label(item)}</span>
          <div className="flex-1 h-5 rounded-full bg-[#E8E4DC] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
              style={{ width: `${Math.max((item.count / max) * 100, 12)}%`, backgroundColor: colors[i % colors.length] }}>
              <span className="text-[9px] font-bold text-white">{item.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Progress bars for countries
function ProgressBar({ items, colors }: { items: { country: string; count: number }[]; colors: string[] }) {
  const max = Math.max(...items.map(i => i.count), 1)
  return (
    <div className="space-y-2.5">
      {items.slice(0, 5).map((item, i) => (
        <div key={item.country}>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-medium text-[#5A5955]">{item.country}</span>
            <span className="font-bold text-[#1C1B1A]">{item.count}</span>
          </div>
          <div className="h-2 rounded-full bg-[#E8E4DC] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(item.count / max) * 100}%`, backgroundColor: colors[i % colors.length] }} />
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
    <div className="rounded-xl p-4 bg-white border border-[#E8E4DC]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8884]">{label}</p>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-[#A5A49E] mt-0.5">{sub}</p>
    </div>
  )
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 bg-white border border-[#E8E4DC]">
      <h3 className="text-xs font-bold text-[#1C1B1A]">{title}</h3>
      <p className="text-[10px] text-[#A5A49E] mb-3">{sub}</p>
      {children}
    </div>
  )
}

function EmptyState() {
  return <div className="py-8 text-center text-[11px] text-[#A5A49E]">No data yet</div>
}

function Spinner({ size = 6 }: { size?: number }) {
  return <div className={`inline-block w-${size} h-${size} border-2 border-[#C56B4A] border-t-transparent rounded-full animate-spin`} />
}

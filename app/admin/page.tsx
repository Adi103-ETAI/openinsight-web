'use client'

import { useEffect, useState, useCallback, Fragment, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer,
} from 'recharts'

// ─── Types ──────────────────────────────────────────────
interface Submission {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string | null
  persona: string
  specialty: string | null
  other_specialty: string | null
  institution: string | null
  city: string
  nmc_number: string | null
  use_case: string | null
  referral_source: string | null
  newsletter_opt_in: boolean
  status: string
  ip_country: string | null
}

interface Stats {
  total: number
  thisWeek: number
  newsletterOptIn: number
  newsletterOptInRate: number
  personaCounts: Record<string, number>
  statusCounts: Record<string, number>
  topCities: { city: string; count: number }[]
  topReferrals: { source: string; count: number }[]
  topSpecialties: { specialty: string; count: number }[]
  signupTimeline: { date: string; count: number }[]
  topCountries: { country: string; count: number }[]
}

// ─── Color palette ──────────────────────────────────────
const PERSONA_LABEL: Record<string, string> = { doctor: 'Doctor', student: 'Student', professional: 'Professional' }
const PERSONA_COLORS: Record<string, string> = { doctor: '#10B981', student: '#3B82F6', professional: '#8B5CF6' }
const STATUS_COLORS: Record<string, string> = { new: '#3B82F6', contacted: '#F59E0B', approved: '#10B981', rejected: '#EF4444' }
const STATUS_LABELS: Record<string, string> = { new: 'New', contacted: 'Contacted', approved: 'Approved', rejected: 'Rejected' }
const CHART_COLORS = ['#C56B4A', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#EC4899']

const tooltipStyle = {
  backgroundColor: 'rgba(28, 27, 26, 0.95)',
  border: 'none',
  borderRadius: '10px',
  color: '#FAFAF8',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
}

// ─── Main Component ─────────────────────────────────────
export default function AdminDashboard() {
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const [authState, setAuthState] = useState<'checking' | 'authenticated'>('checking')
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions'>('overview')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterPersona, setFilterPersona] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [adminEmail, setAdminEmail] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) supabaseRef.current = createClient()
    return supabaseRef.current
  }, [])

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterPersona) params.set('persona', filterPersona)
      if (filterStatus) params.set('status', filterStatus)
      const res = await fetch(`/api/admin/submissions?${params}`)
      if (res.status === 401) { window.location.href = '/admin/login'; return }
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to fetch') }
      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }, [filterPersona, filterStatus])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) setStats(await res.json())
    } catch { /* non-critical */ }
  }, [])

  useEffect(() => {
    const supabase = getSupabase()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user?.email) { window.location.href = '/admin/login'; return }
      setAdminEmail(user.email)
      setAuthState('authenticated')
      Promise.all([fetchSubmissions(), fetchStats()])
    })
  }, [fetchSubmissions, fetchStats, getSupabase])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setSubmissions(prev => prev.map(s => (s.id === id ? { ...s, status } : s)))
    fetchStats()
  }

  const handleSignOut = async () => {
    await getSupabase().auth.signOut()
    window.location.href = '/admin/login'
  }

  const filteredSubmissions = submissions.filter(s => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return s.full_name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.specialty?.toLowerCase().includes(q) || s.institution?.toLowerCase().includes(q)
  })

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize))
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C1B1A]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#C56B4A] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#8A8884] text-sm">Verifying access…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* ─── Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#1C1B1A] border-b border-[#2F2E2C] shadow-lg shadow-black/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C56B4A] to-[#A5573A] flex items-center justify-center shadow-md shadow-[#C56B4A]/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C56B4A] m-0">OpenInsight</p>
              <p className="text-[15px] font-medium text-[#FAFAF8] m-0">Validation Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B2B29]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#A5A49E] text-xs">{adminEmail}</span>
            </div>
            <button onClick={handleSignOut} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#3F3E3C] text-[#A5A49E] bg-transparent hover:bg-[#2B2B29] transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ─── Tab Bar ─────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6">
        <div className="flex gap-1 p-1 rounded-xl bg-[#E8E4DC] inline-flex">
          {([['overview', 'Overview'], ['submissions', 'Submissions']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: activeTab === key ? 'white' : 'transparent',
                color: activeTab === key ? '#1C1B1A' : '#8A8884',
                boxShadow: activeTab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content ─────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
        {error && <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-800">{error}</div>}
        {activeTab === 'overview' ? (
          <OverviewTab stats={stats} submissions={submissions} loading={loading} />
        ) : (
          <SubmissionsTab
            submissions={filteredSubmissions} paginatedSubmissions={paginatedSubmissions} loading={loading}
            filterPersona={filterPersona} setFilterPersona={setFilterPersona}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            expandedId={expandedId} setExpandedId={setExpandedId}
            updateStatus={updateStatus} currentPage={currentPage}
            setCurrentPage={setCurrentPage} totalPages={totalPages}
            fetchSubmissions={fetchSubmissions}
          />
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════
function OverviewTab({ stats, submissions, loading }: { stats: Stats | null; submissions: Submission[]; loading: boolean }) {
  if (loading && !stats) return <LoadingSpinner />
  if (!stats) return null

  const personaData = Object.entries(stats.personaCounts).map(([key, value]) => ({
    name: PERSONA_LABEL[key] || key, value, color: PERSONA_COLORS[key] || '#8A8884',
  }))
  const statusData = Object.entries(stats.statusCounts).map(([key, value]) => ({
    name: STATUS_LABELS[key] || key, value, color: STATUS_COLORS[key] || '#8A8884',
  }))
  const timelineData = stats.signupTimeline.map(d => ({ ...d, date: d.date.slice(5) }))

  return (
    <div className="space-y-6">
      {/* ─── KPI Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Signups" value={stats.total} accent="#C56B4A" bgFrom="#C56B4A" bgTo="#A5573A" sub="All time"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <KpiCard label="This Week" value={stats.thisWeek} accent="#3B82F6" bgFrom="#3B82F6" bgTo="#2563EB" sub="Last 7 days"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
        <KpiCard label="Newsletter" value={`${stats.newsletterOptInRate}%`} accent="#10B981" bgFrom="#10B981" bgTo="#059669" sub={`${stats.newsletterOptIn} of ${stats.total} opted in`}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
        />
        <KpiCard label="Conversion" value={`${stats.total > 0 ? Math.round(((stats.statusCounts.approved || 0) / stats.total) * 100) : 0}%`} accent="#8B5CF6" bgFrom="#8B5CF6" bgTo="#7C3AED" sub={`${stats.statusCounts.approved || 0} approved`}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>}
        />
      </div>

      {/* ─── Row 2: Charts ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Persona Distribution" subtitle="Signup breakdown by role">
          {personaData.some(d => d.value > 0) ? (
            <div>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={personaData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={4} dataKey="value" stroke="none">
                    {personaData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-2">
                {personaData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-semibold" style={{ color: '#5A5955' }}>{d.name}</span>
                    <span className="text-xs font-bold" style={{ color: '#1C1B1A' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Status Pipeline" subtitle="Current status of all signups">
          {statusData.some(d => d.value > 0) ? (
            <div>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={4} dataKey="value" stroke="none">
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-semibold" style={{ color: '#5A5955' }}>{d.name}</span>
                    <span className="text-xs font-bold" style={{ color: '#1C1B1A' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Signup Trend" subtitle="Daily signups — last 30 days">
          {timelineData.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={timelineData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSignup" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C56B4A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C56B4A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#A5A49E' }} tickLine={false} axisLine={{ stroke: '#E8E4DC' }} interval={6} />
                <YAxis tick={{ fontSize: 10, fill: '#A5A49E' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="count" stroke="#C56B4A" strokeWidth={2.5} fill="url(#gradSignup)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>
      </div>

      {/* ─── Row 3: Cities + Referrals ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top Cities" subtitle="Signups by city">
          {stats.topCities.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(180, stats.topCities.length * 38 + 20)}>
              <BarChart data={stats.topCities} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#A5A49E' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: '#5A5955', fontWeight: 500 }} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
                  {stats.topCities.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Referral Sources" subtitle="How people discover OpenInsight">
          {stats.topReferrals.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(180, stats.topReferrals.length * 38 + 20)}>
              <BarChart data={stats.topReferrals} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#A5A49E' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="source" tick={{ fontSize: 12, fill: '#5A5955', fontWeight: 500 }} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 8, 8, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>
      </div>

      {/* ─── Row 4: Specialties + Countries + Recent ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Specialty Distribution" subtitle="Medical specialties of signups">
          {stats.topSpecialties.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(180, stats.topSpecialties.length * 32 + 20)}>
              <BarChart data={stats.topSpecialties} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#A5A49E' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="specialty" tick={{ fontSize: 11, fill: '#5A5955', fontWeight: 500 }} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                  {stats.topSpecialties.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Countries" subtitle="Signup origin by country">
          {stats.topCountries.length > 0 ? (
            <div className="space-y-3 py-2">
              {stats.topCountries.map((c, i) => {
                const maxCount = stats.topCountries[0]?.count || 1
                return (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-xs font-semibold w-20 truncate text-[#5A5955]">{c.country}</span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden bg-[#E8E4DC]">
                      <div
                        className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.max((c.count / maxCount) * 100, 15)}%`,
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      >
                        <span className="text-[10px] font-bold text-white">{c.count}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Recent Signups" subtitle="Latest submissions">
          <div className="space-y-2.5">
            {submissions.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAFAF8] hover:bg-white transition-colors border border-transparent hover:border-[#E8E4DC]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}18`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>
                  {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-[#1C1B1A]">{s.full_name}</p>
                  <p className="text-[10px] truncate text-[#8A8884]">{s.city} &middot; {PERSONA_LABEL[s.persona] || s.persona}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}15`, color: STATUS_COLORS[s.status] || '#8A8884' }}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>
            ))}
            {submissions.length === 0 && <p className="text-xs text-center py-6 text-[#8A8884]">No signups yet</p>}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// SUBMISSIONS TAB
// ═══════════════════════════════════════════════════════
function SubmissionsTab({ submissions, paginatedSubmissions, loading, filterPersona, setFilterPersona, filterStatus, setFilterStatus, searchQuery, setSearchQuery, expandedId, setExpandedId, updateStatus, currentPage, setCurrentPage, totalPages, fetchSubmissions }: {
  submissions: Submission[]; paginatedSubmissions: Submission[]; loading: boolean
  filterPersona: string; setFilterPersona: (v: string) => void; filterStatus: string; setFilterStatus: (v: string) => void
  searchQuery: string; setSearchQuery: (v: string) => void; expandedId: string | null; setExpandedId: (v: string | null) => void
  updateStatus: (id: string, status: string) => void; currentPage: number; setCurrentPage: (v: number) => void
  totalPages: number; fetchSubmissions: () => void
}) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A5A49E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search name, email, city…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="pl-9 pr-3 py-2.5 rounded-xl text-sm border bg-white border-[#E8E4DC] text-[#1C1B1A] w-[220px] focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30 focus:border-[#C56B4A]/50 transition-all" />
          </div>
          <select value={filterPersona} onChange={e => setFilterPersona(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm border bg-white border-[#E8E4DC] text-[#1C1B1A] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30">
            <option value="">All personas</option><option value="doctor">Doctors</option><option value="student">Students</option><option value="professional">Professionals</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm border bg-white border-[#E8E4DC] text-[#1C1B1A] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30">
            <option value="">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchSubmissions} className="px-3 py-2.5 rounded-xl text-sm border bg-white border-[#E8E4DC] text-[#5A5955] cursor-pointer hover:bg-[#FAFAF8] transition-colors">↻ Refresh</button>
        </div>
        <a href="/api/admin/export" className="px-4 py-2.5 rounded-xl text-sm font-semibold no-underline inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C56B4A] to-[#A5573A] text-white shadow-md shadow-[#C56B4A]/20 hover:shadow-lg hover:shadow-[#C56B4A]/30 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </a>
      </div>

      <p className="text-xs text-[#A5A49E]">{submissions.length} result{submissions.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E4DC] shadow-sm">
        {loading ? <LoadingSpinner /> : submissions.length === 0 ? (
          <div className="py-20 text-center text-[#A5A49E]">
            <svg className="mx-auto mb-3" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4D0C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            <p className="text-sm font-medium">No submissions yet</p>
            <p className="text-xs mt-1">They will appear here once doctors start signing up.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider bg-[#F5F0E8] text-[#8A8884]">
              <div className="col-span-2">Date</div><div className="col-span-2">Name</div><div className="col-span-2">Persona</div><div className="col-span-2">City</div><div className="col-span-1">Specialty</div><div className="col-span-1">Status</div><div className="col-span-2 text-right">Actions</div>
            </div>
            {paginatedSubmissions.map(s => (
              <Fragment key={s.id}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-3.5 items-center cursor-pointer transition-colors hover:bg-[#FAFAF8] border-b border-[#F0ECE4]"
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                  <div className="md:col-span-2 text-xs font-medium text-[#8A8884]">
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}18`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>
                      {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-semibold truncate text-[#1C1B1A]">{s.full_name}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}15`, color: PERSONA_COLORS[s.persona] || '#8A8884' }}>
                      {PERSONA_LABEL[s.persona] || s.persona}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-sm text-[#5A5955]">{s.city}</div>
                  <div className="md:col-span-1 text-xs truncate text-[#8A8884]">{s.specialty || '—'}</div>
                  <div className="md:col-span-1">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}15`, color: STATUS_COLORS[s.status] || '#8A8884' }}>
                      {STATUS_LABELS[s.status] || s.status}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === s.id ? null : s.id) }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg text-[#C56B4A] hover:bg-[#C56B4A]/8 transition-colors">
                      {expandedId === s.id ? '▲ Hide' : '▼ Details'}
                    </button>
                  </div>
                </div>
                {expandedId === s.id && (
                  <div className="bg-[#FAFAF8] border-b border-[#E8E4DC]">
                    <div className="px-6 py-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <DetailItem label="Email" value={<a href={`mailto:${s.email}`} className="text-[#C56B4A] hover:underline">{s.email}</a>} />
                        <DetailItem label="Phone" value={s.phone || '—'} />
                        <DetailItem label="Institution" value={s.institution || '—'} />
                        <DetailItem label="NMC Number" value={s.nmc_number || '—'} />
                        <DetailItem label="Referral" value={s.referral_source || '—'} />
                        <DetailItem label="Country" value={s.ip_country || '—'} />
                        <DetailItem label="Newsletter" value={s.newsletter_opt_in ? '✓ Subscribed' : '✗ Not subscribed'} />
                        <DetailItem label="Submitted" value={new Date(s.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'} />
                      </div>
                      {s.use_case && (
                        <div className="mb-4 p-4 rounded-xl bg-white border border-[#E8E4DC]">
                          <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 text-[#8A8884]">Use case</p>
                          <p className="text-sm leading-relaxed text-[#1C1B1A]">{s.use_case}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(['new', 'contacted', 'approved', 'rejected'] as const).map(status => (
                          <button key={status} onClick={() => updateStatus(s.id, status)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              border: `1.5px solid ${s.status === status ? STATUS_COLORS[status] : '#E8E4DC'}`,
                              backgroundColor: s.status === status ? `${STATUS_COLORS[status]}12` : 'white',
                              color: s.status === status ? STATUS_COLORS[status] : '#8A8884',
                              boxShadow: s.status === status ? `0 0 0 3px ${STATUS_COLORS[status]}12` : 'none',
                            }}>
                            {STATUS_LABELS[status]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#F0ECE4]">
                <p className="text-xs text-[#8A8884]">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E8E4DC] bg-white text-[#5A5955] disabled:opacity-40 hover:bg-[#FAFAF8] transition-colors">← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
                      style={{ backgroundColor: page === currentPage ? '#C56B4A' : 'white', color: page === currentPage ? 'white' : '#5A5955', border: page === currentPage ? 'none' : '1px solid #E8E4DC' }}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E8E4DC] bg-white text-[#5A5955] disabled:opacity-40 hover:bg-[#FAFAF8] transition-colors">Next →</button>
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
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════

function KpiCard({ label, value, accent, bgFrom, bgTo, sub, icon }: {
  label: string; value: number | string; accent: string; bgFrom: string; bgTo: string; sub: string; icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E4DC] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between p-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A8884] mb-2">{label}</p>
          <p className="text-[28px] font-extrabold leading-none" style={{ color: accent }}>{value}</p>
          <p className="text-[11px] mt-1.5 text-[#A5A49E]">{sub}</p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-md" style={{
          backgroundImage: `linear-gradient(135deg, ${bgFrom}, ${bgTo})`,
          boxShadow: `0 4px 12px ${bgFrom}30`,
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-[#E8E4DC] shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#1C1B1A]">{title}</h3>
        <p className="text-[11px] text-[#A5A49E] mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A8884] mb-1">{label}</p>
      <p className="text-sm text-[#1C1B1A]">{value}</p>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4D0C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      <p className="text-xs mt-2 text-[#A5A49E]">No data yet</p>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="inline-block w-6 h-6 border-2 border-[#C56B4A] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback, Fragment, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer, Legend,
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

// ─── Constants ──────────────────────────────────────────
const PERSONA_LABEL: Record<string, string> = {
  doctor: 'Doctor',
  student: 'Student',
  professional: 'Professional',
}

const PERSONA_COLORS: Record<string, string> = {
  doctor: '#10B981',
  student: '#3B82F6',
  professional: '#8B5CF6',
}

const STATUS_COLORS: Record<string, string> = {
  new: '#3B82F6',
  contacted: '#F59E0B',
  approved: '#10B981',
  rejected: '#EF4444',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  approved: 'Approved',
  rejected: 'Rejected',
}

const CHART_COLORS = ['#C56B4A', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#EC4899']

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
    if (!supabaseRef.current) {
      supabaseRef.current = createClient()
    }
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
      if (res.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed to fetch')
      }
      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filterPersona, filterStatus])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // Stats are non-critical, fail silently
    }
  }, [])

  useEffect(() => {
    const supabase = getSupabase()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user?.email) {
        window.location.href = '/admin/login'
        return
      }
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
    setSubmissions(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    )
    fetchStats()
  }

  const handleSignOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  // ─── Filtered submissions for search ────────────────
  const filteredSubmissions = submissions.filter(s => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.specialty?.toLowerCase().includes(q) ||
      s.institution?.toLowerCase().includes(q)
    )
  })

  // ─── Pagination ─────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize))
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // ─── Auth checking screen ───────────────────────────
  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1C1B1A' }}>
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#C56B4A] border-t-transparent rounded-full animate-spin mb-4" />
          <p style={{ color: '#8A8884', fontSize: '14px' }}>Verifying access…</p>
        </div>
      </div>
    )
  }

  // ─── Main render ────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      {/* ─── Header ────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#1C1B1A',
          borderBottom: '1px solid #2F2E2C',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#C56B4A' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C56B4A', margin: 0 }}>
                OPENINSIGHT
              </p>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#FAFAF8', margin: 0 }}>
                Validation Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#2B2B29' }}>
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span style={{ color: '#8A8884', fontSize: '12px' }}>{adminEmail}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                border: '1px solid #3F3E3C',
                color: '#A5A49E',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2B2B29' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ─── Tab Navigation ────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-1 p-1 rounded-xl inline-flex" style={{ backgroundColor: '#E8E4DC' }}>
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Overview
          </TabButton>
          <TabButton
            active={activeTab === 'submissions'}
            onClick={() => setActiveTab('submissions')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            Submissions
          </TabButton>
        </div>
      </div>

      {/* ─── Content ─────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
            {error}
          </div>
        )}

        {activeTab === 'overview' ? (
          <OverviewTab stats={stats} submissions={submissions} loading={loading} />
        ) : (
          <SubmissionsTab
            submissions={filteredSubmissions}
            paginatedSubmissions={paginatedSubmissions}
            loading={loading}
            filterPersona={filterPersona}
            setFilterPersona={setFilterPersona}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            updateStatus={updateStatus}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            fetchSubmissions={fetchSubmissions}
          />
        )}
      </div>
    </div>
  )
}

// ─── Tab Button ────────────────────────────────────────
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
      style={{
        backgroundColor: active ? 'white' : 'transparent',
        color: active ? '#1C1B1A' : '#8A8884',
        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {children}
    </button>
  )
}

// ═══════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════
function OverviewTab({ stats, submissions, loading }: { stats: Stats | null; submissions: Submission[]; loading: boolean }) {
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block w-6 h-6 border-2 border-[#C56B4A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  // Prepare chart data
  const personaData = Object.entries(stats.personaCounts).map(([key, value]) => ({
    name: PERSONA_LABEL[key] || key,
    value,
    color: PERSONA_COLORS[key] || '#8A8884',
  }))

  const statusData = Object.entries(stats.statusCounts).map(([key, value]) => ({
    name: STATUS_LABELS[key] || key,
    value,
    color: STATUS_COLORS[key] || '#8A8884',
  }))

  const timelineData = stats.signupTimeline.map(d => ({
    ...d,
    date: d.date.slice(5), // MM-DD format
  }))

  return (
    <div className="space-y-5">
      {/* ─── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Signups"
          value={stats.total}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C56B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          accent="#C56B4A"
          sub="All time"
        />
        <KpiCard
          label="This Week"
          value={stats.thisWeek}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
          accent="#3B82F6"
          sub="Last 7 days"
        />
        <KpiCard
          label="Newsletter Opt-in"
          value={`${stats.newsletterOptInRate}%`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
          }
          accent="#10B981"
          sub={`${stats.newsletterOptIn} of ${stats.total}`}
        />
        <KpiCard
          label="Conversion"
          value={`${stats.total > 0 ? Math.round(((stats.statusCounts.approved || 0) / stats.total) * 100) : 0}%`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
            </svg>
          }
          accent="#8B5CF6"
          sub={`${stats.statusCounts.approved || 0} approved`}
        />
      </div>

      {/* ─── Charts Row 1: Pies + Timeline ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Persona Pie */}
        <ChartCard title="Persona Distribution" subtitle="Signup breakdown by role">
          {personaData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={personaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {personaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1B1A',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FAFAF8',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-1">
                {personaData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-medium" style={{ color: '#5A5955' }}>
                      {d.name}: {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Status Donut */}
        <ChartCard title="Status Pipeline" subtitle="Current status of all signups">
          {statusData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1B1A',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FAFAF8',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center flex-wrap gap-3 mt-1">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-medium" style={{ color: '#5A5955' }}>
                      {d.name}: {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Signups Timeline */}
        <ChartCard title="Signup Trend" subtitle="Daily signups (last 30 days)">
          {timelineData.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C56B4A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C56B4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#8A8884' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E8E4DC' }}
                  interval={6}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#8A8884' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1B1A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FAFAF8',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#C56B4A"
                  strokeWidth={2}
                  fill="url(#colorSignups)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>

      {/* ─── Charts Row 2: Cities + Referrals ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Cities */}
        <ChartCard title="Top Cities" subtitle="Signups by city">
          {stats.topCities.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, stats.topCities.length * 35 + 40)}>
              <BarChart data={stats.topCities} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8884' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: '#5A5955' }} tickLine={false} axisLine={false} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1B1A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FAFAF8',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#C56B4A" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Referral Sources */}
        <ChartCard title="Referral Sources" subtitle="How people find OpenInsight">
          {stats.topReferrals.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, stats.topReferrals.length * 35 + 40)}>
              <BarChart data={stats.topReferrals} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8884' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: '#5A5955' }} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1B1A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FAFAF8',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>

      {/* ─── Charts Row 3: Specialties + Countries + Recent ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Specialty Distribution */}
        <ChartCard title="Specialty Distribution" subtitle="Medical specialties of signups">
          {stats.topSpecialties.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, stats.topSpecialties.length * 30 + 40)}>
              <BarChart data={stats.topSpecialties} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: '#8A8884' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="specialty" tick={{ fontSize: 10, fill: '#5A5955' }} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1B1A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FAFAF8',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                  {stats.topSpecialties.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Country Distribution */}
        <ChartCard title="Countries" subtitle="Signup origin by country">
          {stats.topCountries.length > 0 ? (
            <div className="space-y-3 py-2">
              {stats.topCountries.map((c, i) => {
                const maxCount = stats.topCountries[0]?.count || 1
                return (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-20 truncate" style={{ color: '#5A5955' }}>{c.country}</span>
                    <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E4DC' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(c.count / maxCount) * 100}%`,
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right" style={{ color: '#1C1B1A' }}>{c.count}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Recent signups mini-list */}
        <ChartCard title="Recent Signups" subtitle="Latest 5 submissions">
          <div className="space-y-2">
            {submissions.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: '#FAFAF8' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}20`,
                    color: PERSONA_COLORS[s.persona] || '#8A8884',
                  }}
                >
                  {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: '#1C1B1A' }}>{s.full_name}</p>
                  <p className="text-[10px] truncate" style={{ color: '#8A8884' }}>{s.city} · {PERSONA_LABEL[s.persona] || s.persona}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{
                    backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}20`,
                    color: STATUS_COLORS[s.status] || '#8A8884',
                  }}
                >
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: '#8A8884' }}>No signups yet</p>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// SUBMISSIONS TAB
// ═══════════════════════════════════════════════════════
function SubmissionsTab({
  submissions,
  paginatedSubmissions,
  loading,
  filterPersona,
  setFilterPersona,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  expandedId,
  setExpandedId,
  updateStatus,
  currentPage,
  setCurrentPage,
  totalPages,
  fetchSubmissions,
}: {
  submissions: Submission[]
  paginatedSubmissions: Submission[]
  loading: boolean
  filterPersona: string
  setFilterPersona: (v: string) => void
  filterStatus: string
  setFilterStatus: (v: string) => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  expandedId: string | null
  setExpandedId: (v: string | null) => void
  updateStatus: (id: string, status: string) => void
  currentPage: number
  setCurrentPage: (v: number) => void
  totalPages: number
  fetchSubmissions: () => void
}) {
  return (
    <div className="space-y-4">
      {/* ─── Search + Filters ────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="#8A8884" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search name, email, city…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="pl-9 pr-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30"
              style={{
                backgroundColor: 'white',
                border: '1px solid #E8E4DC',
                color: '#1C1B1A',
                width: '220px',
              }}
            />
          </div>
          {/* Persona filter */}
          <select
            value={filterPersona}
            onChange={e => setFilterPersona(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30"
            style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', color: '#1C1B1A' }}
          >
            <option value="">All personas</option>
            <option value="doctor">Doctors</option>
            <option value="student">Students</option>
            <option value="professional">Professionals</option>
          </select>
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C56B4A]/30"
            style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', color: '#1C1B1A' }}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={fetchSubmissions}
            className="px-3 py-2 rounded-lg text-sm border cursor-pointer hover:bg-white/80 transition-colors"
            style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', color: '#5A5955' }}
          >
            ↻ Refresh
          </button>
        </div>
        <a
          href="/api/admin/export"
          className="px-4 py-2 rounded-lg text-sm font-medium no-underline inline-flex items-center gap-1.5 transition-colors"
          style={{ backgroundColor: '#C56B4A', color: 'white' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </a>
      </div>

      {/* ─── Results count ────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: '#8A8884' }}>
          {submissions.length} result{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ─── Submissions Table ────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC' }}>
        {loading ? (
          <div className="py-16 text-center" style={{ color: '#8A8884' }}>
            <div className="inline-block w-6 h-6 border-2 border-[#C56B4A] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading submissions…</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center" style={{ color: '#8A8884' }}>
            <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4D0C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            <p className="text-sm">No submissions yet</p>
            <p className="text-xs mt-1">Once doctors start signing up, they&apos;ll appear here.</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ backgroundColor: '#F5F0E8', color: '#5A5955' }}>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Persona</div>
              <div className="col-span-2">City</div>
              <div className="col-span-1">Specialty</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table rows */}
            {paginatedSubmissions.map(s => (
              <Fragment key={s.id}>
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 items-center cursor-pointer transition-colors hover:bg-[#FAFAF8]"
                  style={{ borderBottom: '1px solid #F0ECE4' }}
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                >
                  <div className="md:col-span-2 text-xs" style={{ color: '#8A8884' }}>
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{
                        backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}20`,
                        color: PERSONA_COLORS[s.persona] || '#8A8884',
                      }}
                    >
                      {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-medium truncate" style={{ color: '#1C1B1A' }}>{s.full_name}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}15`,
                        color: PERSONA_COLORS[s.persona] || '#8A8884',
                      }}
                    >
                      {PERSONA_LABEL[s.persona] || s.persona}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-sm" style={{ color: '#5A5955' }}>{s.city}</div>
                  <div className="md:col-span-1 text-xs truncate" style={{ color: '#8A8884' }}>{s.specialty || '—'}</div>
                  <div className="md:col-span-1">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}15`,
                        color: STATUS_COLORS[s.status] || '#8A8884',
                      }}
                    >
                      {STATUS_LABELS[s.status] || s.status}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === s.id ? null : s.id) }}
                      className="text-xs font-medium px-2 py-1 rounded-md transition-colors"
                      style={{ color: '#C56B4A' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C56B4A10' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      {expandedId === s.id ? '▲ Hide' : '▼ Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedId === s.id && (
                  <div style={{ backgroundColor: '#FAFAF8', borderBottom: '1px solid #E8E4DC' }}>
                    <div className="px-6 py-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <DetailItem label="Email" value={<a href={`mailto:${s.email}`} style={{ color: '#C56B4A' }}>{s.email}</a>} />
                        <DetailItem label="Phone" value={s.phone || '—'} />
                        <DetailItem label="Institution" value={s.institution || '—'} />
                        <DetailItem label="NMC Number" value={s.nmc_number || '— (not provided)'} />
                        <DetailItem label="Referral" value={s.referral_source || '—'} />
                        <DetailItem label="Country" value={s.ip_country || '—'} />
                        <DetailItem label="Newsletter" value={s.newsletter_opt_in ? '✓ Subscribed' : '✗ Not subscribed'} />
                        <DetailItem label="Submitted" value={new Date(s.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'} />
                      </div>
                      {s.use_case && (
                        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC' }}>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#8A8884' }}>Use case</p>
                          <p className="text-sm leading-relaxed" style={{ color: '#1C1B1A' }}>{s.use_case}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(['new', 'contacted', 'approved', 'rejected'] as const).map(status => (
                          <button
                            key={status}
                            onClick={() => updateStatus(s.id, status)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{
                              border: `1px solid ${s.status === status ? STATUS_COLORS[status] : '#E8E4DC'}`,
                              backgroundColor: s.status === status ? `${STATUS_COLORS[status]}15` : 'white',
                              color: s.status === status ? STATUS_COLORS[status] : '#5A5955',
                            }}
                          >
                            {STATUS_LABELS[status]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #F0ECE4' }}>
                <p className="text-xs" style={{ color: '#8A8884' }}>
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                    style={{ border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955' }}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: page === currentPage ? '#C56B4A' : 'white',
                        color: page === currentPage ? 'white' : '#5A5955',
                        border: page === currentPage ? 'none' : '1px solid #E8E4DC',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                    style={{ border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955' }}
                  >
                    Next →
                  </button>
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

function KpiCard({ label, value, icon, accent, sub }: {
  label: string; value: number | string; icon: React.ReactNode; accent: string; sub: string
}) {
  return (
    <div
      className="rounded-xl p-5 transition-shadow hover:shadow-md"
      style={{ backgroundColor: 'white', border: '1px solid #E8E4DC' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#8A8884' }}>
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}12` }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: accent }}>{value}</p>
      <p className="text-[11px] mt-1" style={{ color: '#8A8884' }}>{sub}</p>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: {
  title: string; subtitle: string; children: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: 'white', border: '1px solid #E8E4DC' }}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#1C1B1A' }}>{title}</h3>
        <p className="text-[11px]" style={{ color: '#8A8884' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#8A8884', margin: '0 0 2px' }}>{label}</p>
      <p className="text-sm" style={{ color: '#1C1B1A', margin: 0 }}>{value}</p>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4D0C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
      <p className="text-xs mt-2" style={{ color: '#8A8884' }}>No data yet</p>
    </div>
  )
}

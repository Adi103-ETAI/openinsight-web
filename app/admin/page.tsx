'use client'

import { useEffect, useState, useCallback, Fragment, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import Logo from '@/components/Logo'

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const pageSize = 10

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      try { supabaseRef.current = createClient() } catch { return null }
    }
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
    const sb = getSupabase()
    if (!sb) {
      setError('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      setAuthState('authenticated')
      setLoading(false)
      return
    }
    sb.auth.getUser().then(({ data: { user } }) => {
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

  const handleSignOut = async () => { const sb = getSupabase(); if (sb) await sb.auth.signOut(); window.location.href = '/admin/login' }

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
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #C56B4A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#8A8884', fontSize: '14px', marginTop: '16px' }}>Verifying access...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  const sidebarWidth = sidebarCollapsed ? 72 : 240

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F0E8', display: 'flex' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .admin-card { animation: fadeIn 0.3s ease-out; }
        .sidebar-nav-item:hover { background: rgba(197,107,74,0.12); }
        .sidebar-nav-item.active { background: rgba(197,107,74,0.15); color: #C56B4A; }
        .sidebar-nav-item { transition: background 0.15s, color 0.15s; }
        .kpi-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .kpi-card { transition: box-shadow 0.2s, transform 0.2s; }
        @media (max-width: 768px) {
          .admin-main { margin-left: 0 !important; }
          .admin-sidebar { transform: translateX(-100%); width: 260px !important; }
          .admin-sidebar.mobile-open { transform: translateX(0); }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div onClick={() => setMobileSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`} style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: sidebarWidth,
        backgroundColor: '#1C1B1A', display: 'flex', flexDirection: 'column',
        zIndex: mobileSidebarOpen ? 50 : 30,
        transition: 'width 0.2s ease, transform 0.2s ease',
        borderRight: '1px solid #2F2E2C',
      }}>
        {/* Logo Area */}
        <div style={{
          padding: sidebarCollapsed ? '20px 14px' : '20px 20px',
          borderBottom: '1px solid #2F2E2C',
          display: 'flex', alignItems: 'center', gap: '12px',
          minHeight: '72px',
        }}>
          {!sidebarCollapsed && <Logo variant="header" theme="dark" />}
          {sidebarCollapsed && (
            <div onClick={() => setSidebarCollapsed(false)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px' }}>
              <svg width="28" height="28" viewBox="0 0 520 140" fill="none">
                <circle cx="339" cy="28" r="14" fill="#C56B4A" />
                <text x="0" y="110" fontFamily="FuturaLTPro-Medium, Futura, sans-serif" fontSize="120" fontWeight="500" fill="#F5F4EF">O</text>
              </svg>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false) }}
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: sidebarCollapsed ? '10px 14px' : '10px 14px',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'overview' ? 'rgba(197,107,74,0.15)' : 'transparent',
              color: activeTab === 'overview' ? '#C56B4A' : '#A5A49E',
              fontSize: '13px', fontWeight: activeTab === 'overview' ? 600 : 500,
              textAlign: 'left', width: '100%',
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            {!sidebarCollapsed && <span>Overview</span>}
          </button>

          <button onClick={() => { setActiveTab('submissions'); setMobileSidebarOpen(false) }}
            className={`sidebar-nav-item ${activeTab === 'submissions' ? 'active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: sidebarCollapsed ? '10px 14px' : '10px 14px',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'submissions' ? 'rgba(197,107,74,0.15)' : 'transparent',
              color: activeTab === 'submissions' ? '#C56B4A' : '#A5A49E',
              fontSize: '13px', fontWeight: activeTab === 'submissions' ? 600 : 500,
              textAlign: 'left', width: '100%',
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {!sidebarCollapsed && <span>Submissions</span>}
          </button>

          <a href="/api/admin/export"
            className="sidebar-nav-item"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: sidebarCollapsed ? '10px 14px' : '10px 14px',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent', color: '#A5A49E',
              fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              textAlign: 'left', width: '100%',
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {!sidebarCollapsed && <span>Export CSV</span>}
          </a>
        </nav>

        {/* Collapse Toggle */}
        <div style={{ padding: '8px', borderTop: '1px solid #2F2E2C' }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '8px', borderRadius: '6px',
              border: 'none', cursor: 'pointer', backgroundColor: 'transparent',
              color: '#5A5955', transition: 'color 0.15s',
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
            </svg>
          </button>
        </div>

        {/* User Section */}
        <div style={{
          padding: sidebarCollapsed ? '12px 8px' : '16px',
          borderTop: '1px solid #2F2E2C',
          display: 'flex', flexDirection: sidebarCollapsed ? 'column' : 'row',
          alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #C56B4A, #A5573A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {adminEmail.charAt(0).toUpperCase()}
          </div>
          {!sidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#FAFAF8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</p>
              <p style={{ fontSize: '10px', color: '#5A5955', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminEmail}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={handleSignOut} title="Sign out"
              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#5A5955', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{
        flex: 1, marginLeft: sidebarWidth,
        transition: 'margin-left 0.2s ease',
        minHeight: '100vh',
      }}>
        {/* Top Bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 20,
          backgroundColor: 'rgba(245,240,232,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E8E4DC',
          padding: '0 28px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile menu button */}
            <button onClick={() => setMobileSidebarOpen(true)}
              style={{
                display: 'none', border: 'none', background: 'none',
                cursor: 'pointer', padding: '4px', color: '#5A5955',
              }}
              className="mobile-menu-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#1C1B1A', margin: 0 }}>
              {activeTab === 'overview' ? 'Dashboard Overview' : 'Submissions'}
            </h1>
            <span style={{ fontSize: '11px', color: '#A5A49E', fontWeight: 500 }}>
              {stats ? `${stats.total} total signups` : ''}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => { fetchSubmissions(); fetchStats(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955', cursor: 'pointer',
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Refresh
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '24px 28px 40px' }}>
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {activeTab === 'overview' ? (
            <OverviewTab stats={stats} submissions={submissions} loading={loading} />
          ) : (
            <SubmissionsTab submissions={filteredSubmissions} paginated={paginated} loading={loading}
              filterPersona={filterPersona} setFilterPersona={setFilterPersona} filterStatus={filterStatus} setFilterStatus={setFilterStatus}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery} expandedId={expandedId} setExpandedId={setExpandedId}
              updateStatus={updateStatus} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} fetchSubmissions={fetchSubmissions} />
          )}
        </div>
      </main>


    </div>
  )
}

// ═══════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════
function OverviewTab({ stats, submissions, loading }: { stats: Stats | null; submissions: Submission[]; loading: boolean }) {
  if (loading && !stats) return <Spinner />
  if (!stats) return null

  const approvalRate = stats.total > 0 ? Math.round(((stats.statusCounts.approved || 0) / stats.total) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C56B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Total Signups" value={stats.total} sub="All time" color="#C56B4A" bg="#FEF7F4"
        />
        <KpiCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
          label="This Week" value={stats.thisWeek} sub="Last 7 days" color="#3B82F6" bg="#EFF6FF"
        />
        <KpiCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>}
          label="Newsletter Opt-in" value={`${stats.newsletterOptInRate}%`} sub={`${stats.newsletterOptIn} of ${stats.total} opted in`} color="#10B981" bg="#ECFDF5"
        />
        <KpiCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          label="Approval Rate" value={`${approvalRate}%`} sub={`${stats.statusCounts.approved || 0} approved`} color="#8B5CF6" bg="#F5F3FF"
        />
      </div>

      {/* Charts Row: Donuts + Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.6fr', gap: '16px' }}>
        <DonutCard title="Persona Distribution" subtitle="User types breakdown"
          data={Object.entries(stats.personaCounts).map(([k, v]) => ({ name: PERSONA_LABEL[k] || k, value: v, color: PERSONA_COLORS[k] || '#8A8884' }))} total={stats.total} />

        <DonutCard title="Status Pipeline" subtitle="Review progress"
          data={Object.entries(stats.statusCounts).map(([k, v]) => ({ name: STATUS_LABELS[k] || k, value: v, color: STATUS_COLORS[k] || '#8A8884' }))} total={stats.total} />

        <div className="admin-card" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B1A', margin: 0 }}>Signup Trend</h3>
            <span style={{ fontSize: '11px', color: '#A5A49E', fontWeight: 500 }}>Last 30 days</span>
          </div>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 16px' }}>Daily new signups over time</p>
          {stats.signupTimeline.some(d => d.count > 0) ? <MiniAreaChart data={stats.signupTimeline} /> : <EmptyState message="No signups recorded yet" />}
        </div>
      </div>

      {/* Bottom Row: Cities, Referrals, Specialties, Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr', gap: '16px' }}>
        <div className="admin-card" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Top Cities</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 14px' }}>Signups by location</p>
          {stats.topCities.length > 0 ? <HBar items={stats.topCities} colors={MULTI_COLORS} /> : <EmptyState />}
        </div>

        <div className="admin-card" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Referral Sources</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 14px' }}>How users found us</p>
          {stats.topReferrals.length > 0 ? <HBar items={stats.topReferrals} colors={['#3B82F6', '#60A5FA', '#93C5FD']} /> : <EmptyState />}
        </div>

        <div className="admin-card" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Specialties</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 14px' }}>Medical specialties</p>
          {stats.topSpecialties.length > 0 ? <HBar items={stats.topSpecialties} colors={MULTI_COLORS} /> : <EmptyState />}
        </div>

        <div className="admin-card" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Recent Signups</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 14px' }}>Latest submissions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {submissions.slice(0, 5).map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '8px', backgroundColor: '#FAFAF8',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, flexShrink: 0,
                  backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}15`,
                  color: PERSONA_COLORS[s.persona] || '#8A8884',
                }}>
                  {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1C1B1A' }}>
                    {s.full_name}
                  </p>
                  <p style={{ fontSize: '10px', margin: 0, color: '#8A8884', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.city} &middot; {PERSONA_LABEL[s.persona] || s.persona}
                  </p>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}12`,
                  color: STATUS_COLORS[s.status] || '#8A8884',
                }}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>
            ))}
            {submissions.length === 0 && <EmptyState />}
          </div>
        </div>
      </div>

      {/* Countries Row */}
      {stats.topCountries.length > 0 && (
        <div className="admin-card" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>Countries</h3>
          <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 14px' }}>Signup origin by country</p>
          <PBar items={stats.topCountries} colors={MULTI_COLORS} />
        </div>
      )}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Filters */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A5A49E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search name, email, city..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              style={{
                padding: '8px 10px 8px 32px', borderRadius: '8px', fontSize: '13px',
                border: '1px solid #E8E4DC', backgroundColor: '#FAFAF8', color: '#1C1B1A',
                width: '240px', outline: 'none',
              }} />
          </div>
          <select value={filterPersona} onChange={e => setFilterPersona(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#1C1B1A', cursor: 'pointer' }}>
            <option value="">All Personas</option><option value="doctor">Doctors</option><option value="student">Students</option><option value="professional">Professionals</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#1C1B1A', cursor: 'pointer' }}>
            <option value="">All Statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#8A8884', fontWeight: 500 }}>
            {submissions.length} result{submissions.length !== 1 ? 's' : ''}
          </span>
          <a href="/api/admin/export" style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: '#C56B4A', color: 'white',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </a>
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', border: '1px solid #E8E4DC' }}>
        {loading ? <Spinner /> : submissions.length === 0 ? (
          <div style={{ padding: '64px 16px', textAlign: 'center', color: '#A5A49E' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4D0C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <p style={{ fontSize: '14px', margin: 0, fontWeight: 500 }}>No submissions yet</p>
            <p style={{ fontSize: '12px', margin: '4px 0 0' }}>Submissions will appear here when users sign up</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr 110px 110px 130px 100px 50px',
              gap: '4px', padding: '12px 20px',
              fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              backgroundColor: '#F5F0E8', color: '#8A8884', borderBottom: '1px solid #E8E4DC',
            }}>
              <span>Date</span><span>Name</span><span>Persona</span><span>City</span><span>Specialty</span><span>Status</span><span></span>
            </div>

            {/* Table Rows */}
            {paginated.map(s => (
              <Fragment key={s.id}>
                <div onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr 110px 110px 130px 100px 50px',
                    gap: '4px', padding: '14px 20px', alignItems: 'center',
                    cursor: 'pointer', borderBottom: '1px solid #F0ECE4', fontSize: '13px',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAF8')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ color: '#8A8884', fontSize: '12px' }}>
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, flexShrink: 0,
                      backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}12`,
                      color: PERSONA_COLORS[s.persona] || '#8A8884',
                    }}>
                      {s.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontWeight: 600, color: '#1C1B1A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name}</span>
                      <span style={{ fontSize: '10px', color: '#A5A49E' }}>{s.email}</span>
                    </div>
                  </div>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '6px',
                    fontSize: '11px', fontWeight: 700,
                    backgroundColor: `${PERSONA_COLORS[s.persona] || '#8A8884'}12`,
                    color: PERSONA_COLORS[s.persona] || '#8A8884',
                  }}>
                    {PERSONA_LABEL[s.persona]}
                  </span>
                  <span style={{ color: '#5A5955', fontWeight: 500 }}>{s.city}</span>
                  <span style={{ color: '#8A8884', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.specialty || <span style={{ color: '#C8C4BC' }}>—</span>}
                  </span>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '6px',
                    fontSize: '11px', fontWeight: 700,
                    backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}12`,
                    color: STATUS_COLORS[s.status] || '#8A8884',
                  }}>
                    {STATUS_LABELS[s.status]}
                  </span>
                  <button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === s.id ? null : s.id) }}
                    style={{
                      fontSize: '11px', fontWeight: 600, color: '#C56B4A',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                      transition: 'transform 0.15s',
                      transform: expandedId === s.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>

                {expandedId === s.id && (
                  <div style={{ backgroundColor: '#FAFAF8', borderBottom: '1px solid #E8E4DC', padding: '20px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
                      <Detail label="Email" value={<a href={`mailto:${s.email}`} style={{ color: '#C56B4A', textDecoration: 'none' }}>{s.email}</a>} />
                      <Detail label="Phone" value={s.phone || '—'} />
                      <Detail label="Institution" value={s.institution || '—'} />
                      <Detail label="NMC Number" value={s.nmc_number || '—'} />
                      <Detail label="Referral" value={s.referral_source || '—'} />
                      <Detail label="Country" value={s.ip_country || '—'} />
                      <Detail label="Newsletter" value={s.newsletter_opt_in ? '✓ Subscribed' : '✗ No'} />
                      <Detail label="Submitted" value={new Date(s.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'} />
                    </div>
                    {s.use_case && (
                      <div style={{
                        padding: '12px 16px', borderRadius: '10px', backgroundColor: 'white',
                        border: '1px solid #E8E4DC', marginBottom: '14px',
                      }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#8A8884', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Use Case</p>
                        <p style={{ fontSize: '13px', color: '#1C1B1A', margin: 0, lineHeight: 1.6 }}>{s.use_case}</p>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A8884', display: 'flex', alignItems: 'center', marginRight: '8px' }}>Update status:</span>
                      {(['new', 'contacted', 'approved', 'rejected'] as const).map(st => (
                        <button key={st} onClick={() => updateStatus(s.id, st)}
                          style={{
                            padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                            border: `1.5px solid ${s.status === st ? STATUS_COLORS[st] : '#E8E4DC'}`,
                            backgroundColor: s.status === st ? `${STATUS_COLORS[st]}12` : 'white',
                            color: s.status === st ? STATUS_COLORS[st] : '#8A8884',
                            transition: 'all 0.15s',
                          }}>
                          {STATUS_LABELS[st]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 20px', borderTop: '1px solid #F0ECE4',
              }}>
                <span style={{ fontSize: '12px', color: '#8A8884' }}>Page {currentPage} of {totalPages}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                    style={{
                      padding: '6px 10px', borderRadius: '6px', fontSize: '12px',
                      border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1,
                    }}>
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer',
                        border: p === currentPage ? 'none' : '1px solid #E8E4DC',
                        backgroundColor: p === currentPage ? '#C56B4A' : 'white',
                        color: p === currentPage ? 'white' : '#5A5955',
                      }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                    style={{
                      padding: '6px 10px', borderRadius: '6px', fontSize: '12px',
                      border: '1px solid #E8E4DC', backgroundColor: 'white', color: '#5A5955',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1,
                    }}>
                    Next
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
// LIGHTWEIGHT CHARTS (Pure SVG/CSS, zero dependencies)
// ═══════════════════════════════════════════════════════

function DonutChart({ data, size = 130, stroke = 20 }: { data: { name: string; value: number; color: string }[]; size?: number; stroke?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <EmptyState />
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      {/* Background circle */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E8E4DC" strokeWidth={stroke} />
      {data.filter(d => d.value > 0).map((d, i) => {
        const pct = d.value / total
        const dash = pct * C
        const gap = Math.min(4, dash * 0.1)
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth={stroke}
          strokeDasharray={`${Math.max(0, dash - gap)} ${C - dash + gap}`}
          strokeDashoffset={-offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          strokeLinecap="round" />
        offset += dash
        return el
      })}
      <text x={size/2} y={size/2 - 6} textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="800" fill="#1C1B1A">{total}</text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="600" fill="#A5A49E">TOTAL</text>
    </svg>
  )
}

function DonutCard({ title, subtitle, data, total }: { title: string; subtitle: string; data: { name: string; value: number; color: string }[]; total: number }) {
  return (
    <div className="admin-card" style={{ backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B1A', margin: '0 0 2px' }}>{title}</h3>
      <p style={{ fontSize: '11px', color: '#A5A49E', margin: '0 0 16px' }}>{subtitle}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <DonutChart data={data.filter(d => d.value > 0)} size={120} stroke={18} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {data.map(d => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
            return (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#5A5955', flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C1B1A' }}>{d.value}</span>
                <span style={{ fontSize: '10px', color: '#A5A49E', width: '32px', textAlign: 'right' }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MiniAreaChart({ data }: { data: { date: string; count: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.count), 1)
  const w = 700, h = 140, px = 30, py = 12
  const chartW = w - px * 2, chartH = h - py * 2
  const points = data.map((d, i) => ({
    x: px + (i / Math.max(data.length - 1, 1)) * chartW,
    y: py + chartH - (d.count / maxVal) * chartH,
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${py + chartH} L${points[0].x},${py + chartH} Z`

  // Y-axis labels
  const yTicks = [0, Math.round(maxVal / 2), maxVal]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C56B4A" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#C56B4A" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.5, 1].map(pct => (
        <line key={pct} x1={px} y1={py + chartH * (1 - pct)} x2={w - px} y2={py + chartH * (1 - pct)}
          stroke="#E8E4DC" strokeWidth="1" strokeDasharray={pct === 0 ? 'none' : '4 4'} />
      ))}
      {/* Y-axis labels */}
      {yTicks.map((val, i) => {
        const y = py + chartH - (val / maxVal) * chartH
        return <text key={i} x={px - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#A5A49E" fontWeight="500">{val}</text>
      })}
      {/* Area fill */}
      <path d={areaPath} fill="url(#aGrad)"/>
      {/* Line */}
      <path d={linePath} fill="none" stroke="#C56B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Data points */}
      {points.filter((_, i) => data[i]?.count > 0).map((p, i) =>
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#C56B4A" stroke="white" strokeWidth="2"/>
      )}
      {/* X-axis date labels */}
      {data.filter((_, i) => i % 7 === 0 || i === data.length - 1).map((d, i) => {
        const idx = data.indexOf(d)
        const x = px + (idx / Math.max(data.length - 1, 1)) * chartW
        return <text key={i} x={x} y={h - 1} textAnchor="middle" fontSize="10" fill="#A5A49E" fontWeight="500">{d.date.slice(5)}</text>
      })}
    </svg>
  )
}

function HBar({ items, colors }: { items: Record<string, any>[]; colors: string[] }) {
  const max = Math.max(...items.map(i => i.count), 1)
  const getLabel = (item: any) => item.city || item.source || item.specialty || ''
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.slice(0, 6).map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '12px', fontWeight: 500, width: '80px', textAlign: 'right',
            color: '#5A5955', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {getLabel(item)}
          </span>
          <div style={{ flex: 1, height: '24px', borderRadius: '6px', backgroundColor: '#F0ECE4', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: '8px', minWidth: '32px', transition: 'width 0.5s',
              width: `${Math.max((item.count / max) * 100, 12)}%`,
              backgroundColor: colors[i % colors.length],
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'white' }}>{item.count}</span>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.slice(0, 6).map((item, i) => (
        <div key={item.country}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 500, color: '#5A5955' }}>{item.country}</span>
            <span style={{ fontWeight: 700, color: '#1C1B1A' }}>{item.count}</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#F0ECE4', overflow: 'hidden' }}>
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

function KpiCard({ icon, label, value, color, sub, bg }: { icon: React.ReactNode; label: string; value: number | string; color: string; sub: string; bg: string }) {
  return (
    <div className="kpi-card" style={{
      backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', cursor: 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: bg,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A5A49E' }}>{label}</span>
      </div>
      <span style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '11px', color: '#A5A49E', marginTop: '6px', fontWeight: 500 }}>{sub}</span>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A8884', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#1C1B1A', margin: 0, lineHeight: 1.4 }}>{value}</p>
    </div>
  )
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div style={{ padding: '32px 0', textAlign: 'center' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4D0C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p style={{ fontSize: '12px', color: '#A5A49E', margin: 0 }}>{message || 'No data yet'}</p>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ padding: '64px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '28px', height: '28px', border: '3px solid #E8E4DC', borderTopColor: '#C56B4A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: '12px', color: '#A5A49E', margin: 0 }}>Loading data...</p>
    </div>
  )
}

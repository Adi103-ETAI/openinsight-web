'use client'

import { useEffect, useState, useCallback, Fragment } from 'react'
import { createClient } from '@/lib/supabase/client'

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

const PERSONA_LABEL: Record<string, string> = {
  doctor: 'Doctor',
  student: 'Student',
  professional: 'Professional',
}

const STATUS_COLORS: Record<string, string> = {
  new: '#3B82F6',
  contacted: '#F59E0B',
  approved: '#10B981',
  rejected: '#EF4444',
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [authState, setAuthState] = useState<'checking' | 'authenticated'>('checking')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterPersona, setFilterPersona] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [adminEmail, setAdminEmail] = useState<string>('')

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

  useEffect(() => {
    // Guard: redirect to login if not authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user?.email) {
        window.location.href = '/admin/login'
        return
      }
      setAdminEmail(user.email)
      setAuthState('authenticated')
      fetchSubmissions()
    })
  }, [fetchSubmissions, supabase])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setSubmissions(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    )
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  // ─── Derived stats ──────────────────────────────────────
  const total = submissions.length
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = submissions.filter(s => new Date(s.created_at) >= weekAgo).length
  const byPersona = {
    doctor: submissions.filter(s => s.persona === 'doctor').length,
    student: submissions.filter(s => s.persona === 'student').length,
    professional: submissions.filter(s => s.persona === 'professional').length,
  }
  const byStatus = {
    new: submissions.filter(s => s.status === 'new').length,
    contacted: submissions.filter(s => s.status === 'contacted').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  }

  // Top cities
  const cityCounts: Record<string, number> = {}
  submissions.forEach(s => {
    const c = s.city.trim()
    if (c) cityCounts[c] = (cityCounts[c] || 0) + 1
  })
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // ─── Render ─────────────────────────────────────────────
  if (authState === 'checking') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1B1A',
        color: '#8A8884',
        fontSize: '14px',
      }}>
        Verifying access…
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', color: '#1C1B1A' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1C1B1A',
        color: '#FAFAF8',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C56B4A',
            margin: 0,
          }}>SENTARC LABS</p>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            fontWeight: 400,
            margin: '4px 0 0',
          }}>OpenInsight · Validation Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
          <span style={{ color: '#8A8884' }}>{adminEmail}</span>
          <button
            onClick={handleSignOut}
            style={{
              padding: '6px 14px',
              backgroundColor: 'transparent',
              border: '1px solid #5A5955',
              color: '#FAFAF8',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats cards */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <StatCard label="Total signups" value={total} accent="#1C1B1A" />
          <StatCard label="This week" value={thisWeek} accent="#C56B4A" />
          <StatCard label="Doctors" value={byPersona.doctor} accent="#10B981" sub={`${pct(byPersona.doctor, total)}%`} />
          <StatCard label="Students" value={byPersona.student} accent="#3B82F6" sub={`${pct(byPersona.student, total)}%`} />
          <StatCard label="Professionals" value={byPersona.professional} accent="#8B5CF6" sub={`${pct(byPersona.professional, total)}%`} />
          <StatCard label="New" value={byStatus.new} accent="#3B82F6" />
          <StatCard label="Contacted" value={byStatus.contacted} accent="#F59E0B" />
          <StatCard label="Approved" value={byStatus.approved} accent="#10B981" />
        </section>

        {/* Top cities */}
        {topCities.length > 0 && (
          <section style={{
            backgroundColor: 'white',
            border: '1px solid #E8E4DC',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', color: '#5A5955' }}>Top cities</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {topCities.map(([city, count]) => {
                const max = topCities[0][1]
                const w = (count / max) * 100
                return (
                  <div key={city} style={{ flex: '1 1 150px', minWidth: '150px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500 }}>{city}</span>
                      <span style={{ color: '#8A8884' }}>{count}</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#F5F0E8', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${w}%`, height: '100%', backgroundColor: '#C56B4A' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Filters + export */}
        <section style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={filterPersona}
              onChange={e => setFilterPersona(e.target.value)}
              style={selectStyle}
            >
              <option value="">All personas</option>
              <option value="doctor">Doctors</option>
              <option value="student">Students</option>
              <option value="professional">Professionals</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={fetchSubmissions} style={ghostBtn}>↻ Refresh</button>
          </div>
          <a
            href="/api/admin/export"
            style={{
              ...ghostBtn,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >⬇ Export CSV</a>
        </section>

        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '14px',
            marginBottom: '16px',
          }}>{error}</div>
        )}

        {/* Submissions table */}
        <section style={{
          backgroundColor: 'white',
          border: '1px solid #E8E4DC',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#8A8884' }}>Loading…</div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#8A8884' }}>
              No submissions yet. Once doctors start signing up, they&apos;ll appear here.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F5F0E8', textAlign: 'left' }}>
                  <Th>Date</Th>
                  <Th>Name</Th>
                  <Th>Persona</Th>
                  <Th>City</Th>
                  <Th>Specialty</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <Fragment key={s.id}>
                    <tr
                      style={{ borderBottom: '1px solid #E8E4DC', cursor: 'pointer' }}
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                    >
                      <Td>{new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</Td>
                      <Td><strong>{s.full_name}</strong></Td>
                      <Td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: `${personaColor(s.persona)}20`,
                          color: personaColor(s.persona),
                        }}>{PERSONA_LABEL[s.persona] || s.persona}</span>
                      </Td>
                      <Td>{s.city}</Td>
                      <Td>{s.specialty || '—'}</Td>
                      <Td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: `${STATUS_COLORS[s.status] || '#8A8884'}20`,
                          color: STATUS_COLORS[s.status] || '#8A8884',
                        }}>{s.status}</span>
                      </Td>
                      <Td>
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === s.id ? null : s.id) }}
                          style={{ background: 'none', border: 'none', color: '#C56B4A', cursor: 'pointer', fontSize: '12px' }}
                        >{expandedId === s.id ? '▲ Hide' : '▼ Details'}</button>
                      </Td>
                    </tr>
                    {expandedId === s.id && (
                      <tr>
                        <td colSpan={7} style={{ padding: '20px 24px', backgroundColor: '#FAFAF8', borderBottom: '1px solid #E8E4DC' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px', fontSize: '13px' }}>
                            <Detail label="Email" value={<a href={`mailto:${s.email}`} style={{ color: '#C56B4A' }}>{s.email}</a>} />
                            <Detail label="Phone" value={s.phone || '—'} />
                            <Detail label="Institution" value={s.institution || '—'} />
                            <Detail label="NMC number" value={s.nmc_number || '— (not provided)'} />
                            <Detail label="Referral" value={s.referral_source || '—'} />
                            <Detail label="Country" value={s.ip_country || '—'} />
                            <Detail label="Newsletter" value={s.newsletter_opt_in ? 'Yes' : 'No'} />
                            <Detail label="Submitted" value={new Date(s.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'} />
                          </div>
                          {s.use_case && (
                            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'white', border: '1px solid #E8E4DC', borderRadius: '8px' }}>
                              <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8884', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>Use case</p>
                              <p style={{ margin: 0, lineHeight: 1.5, color: '#1C1B1A' }}>{s.use_case}</p>
                            </div>
                          )}
                          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <StatusBtn current={s.status} value="new" onClick={() => updateStatus(s.id, 'new')} />
                            <StatusBtn current={s.status} value="contacted" onClick={() => updateStatus(s.id, 'contacted')} />
                            <StatusBtn current={s.status} value="approved" onClick={() => updateStatus(s.id, 'approved')} />
                            <StatusBtn current={s.status} value="rejected" onClick={() => updateStatus(s.id, 'rejected')} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}

// ─── Small components ─────────────────────────────────────
function StatCard({ label, value, accent, sub }: { label: string; value: number; accent: string; sub?: string }) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #E8E4DC',
      borderRadius: '12px',
      padding: '16px 20px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8884', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: 600, color: accent, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '11px', color: '#8A8884', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 600, color: '#5A5955', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</th>
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{children}</td>
}
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 600, color: '#8A8884', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>{label}</p>
      <p style={{ margin: 0, color: '#1C1B1A' }}>{value}</p>
    </div>
  )
}
function StatusBtn({ current, value, onClick }: { current: string; value: string; onClick: () => void }) {
  const active = current === value
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '6px',
        border: `1px solid ${active ? STATUS_COLORS[value] : '#E8E4DC'}`,
        backgroundColor: active ? `${STATUS_COLORS[value]}15` : 'white',
        color: active ? STATUS_COLORS[value] : '#5A5955',
        cursor: 'pointer',
      }}
    >{value}</button>
  )
}

// ─── Helpers ──────────────────────────────────────────────
function pct(n: number, total: number): number {
  if (total === 0) return 0
  return Math.round((n / total) * 100)
}
function personaColor(p: string): string {
  return p === 'doctor' ? '#10B981' : p === 'student' ? '#3B82F6' : '#8B5CF6'
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #E8E4DC',
  borderRadius: '8px',
  backgroundColor: 'white',
  fontSize: '13px',
  color: '#1C1B1A',
  cursor: 'pointer',
}
const ghostBtn: React.CSSProperties = {
  padding: '8px 14px',
  border: '1px solid #E8E4DC',
  borderRadius: '8px',
  backgroundColor: 'white',
  fontSize: '13px',
  color: '#1C1B1A',
  cursor: 'pointer',
}

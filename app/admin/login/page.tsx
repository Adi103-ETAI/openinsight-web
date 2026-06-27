'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1C1B1A',
          color: '#8A8884',
          fontSize: '14px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #C56B4A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) {
      try { supabaseRef.current = createClient() } catch { return null }
    }
    return supabaseRef.current
  }
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Show error if redirected from middleware (e.g. logged in but not in ADMIN_EMAILS)
  useEffect(() => {
    if (searchParams.get('error') === 'not_admin') {
      setError('Your account is not authorized for admin access. Contact the project owner to be added to the ADMIN_EMAILS allowlist.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    setError(null)

    const sb = getSupabase()
    if (!sb) {
      setError('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      setLoading(false)
      return
    }

    const { error } = await sb.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    setLoading(false)
    if (error) {
      // Supabase returns "Invalid login credentials" for wrong password OR
      // non-existent user. Give a helpful hint.
      if (/invalid login credentials/i.test(error.message)) {
        setError('Wrong email or password. If you don\u2019t have an account yet, ask the project owner to create one for you in Supabase \u2192 Authentication \u2192 Users.')
      } else {
        setError(error.message)
      }
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1C1B1A',
      color: '#FAFAF8',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Logo variant="header" theme="dark" />
        </div>

        {/* Login Card */}
        <div style={{
          padding: '32px',
          backgroundColor: '#2B2B29',
          borderRadius: '16px',
          border: '1px solid #2F2E2C',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C56B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <p style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C56B4A',
              margin: 0,
            }}>Admin Portal</p>
          </div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: 700,
            margin: '4px 0 24px',
            color: '#FAFAF8',
          }}>Sign in to Dashboard</h1>

          {error && (
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '10px',
              color: '#FECACA',
              fontSize: '13px',
              marginBottom: '20px',
              lineHeight: 1.5,
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
            }} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A5A49E', marginBottom: '6px' }}>Admin email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1C1B1A',
                border: '1px solid #2F2E2C',
                borderRadius: '10px',
                color: '#FAFAF8',
                fontSize: '14px',
                marginBottom: '16px',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#C56B4A')}
              onBlur={e => (e.target.style.borderColor = '#2F2E2C')}
            />

            <label htmlFor="password" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A5A49E', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  padding: '10px 52px 10px 12px',
                  backgroundColor: '#1C1B1A',
                  border: '1px solid #2F2E2C',
                  borderRadius: '10px',
                  color: '#FAFAF8',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#C56B4A')}
                onBlur={e => (e.target.style.borderColor = '#2F2E2C')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8A8884',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '4px 6px',
                }}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#C56B4A',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p style={{ fontSize: '11px', color: '#5A5955', marginTop: '24px', lineHeight: 1.6 }}>
            Admin access is password-protected. Accounts are created manually in Supabase → Authentication → Users, and the email must be in the <code style={{ color: '#8A8884', backgroundColor: '#1C1B1A', padding: '1px 4px', borderRadius: '3px', fontSize: '10px' }}>ADMIN_EMAILS</code> allowlist.
          </p>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#5A5955' }}>
          <a href="/" style={{ color: '#8A8884', textDecoration: 'none' }}>← Back to openinsight.in</a>
        </p>
      </div>
    </div>
  )
}

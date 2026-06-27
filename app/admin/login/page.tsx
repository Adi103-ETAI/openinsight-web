'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'

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
          Loading…
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
    if (!supabaseRef.current) supabaseRef.current = createClient()
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

    const { error } = await getSupabase().auth.signInWithPassword({
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
        maxWidth: '380px',
        padding: '32px',
        backgroundColor: '#2B2B29',
        borderRadius: '16px',
        border: '1px solid #2F2E2C',
      }}>
        <p style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C56B4A',
          margin: 0,
        }}>SENTARC LABS</p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          fontWeight: 400,
          margin: '8px 0 24px',
        }}>Admin Login</h1>

        {error && (
          <div style={{
            padding: '10px 12px',
            backgroundColor: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.4)',
            borderRadius: '8px',
            color: '#FECACA',
            fontSize: '13px',
            marginBottom: '16px',
            lineHeight: 1.45,
          }} role="alert">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="email" style={{ display: 'block', fontSize: '13px', color: '#8A8884', marginBottom: '6px' }}>Admin email</label>
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
              borderRadius: '8px',
              color: '#FAFAF8',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          />

          <label htmlFor="password" style={{ display: 'block', fontSize: '13px', color: '#8A8884', marginBottom: '6px' }}>Password</label>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
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
                padding: '10px 44px 10px 12px',
                backgroundColor: '#1C1B1A',
                border: '1px solid #2F2E2C',
                borderRadius: '8px',
                color: '#FAFAF8',
                fontSize: '14px',
              }}
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
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Signing in\u2026' : 'Sign in \u2192'}
          </button>
        </form>

        <p style={{ fontSize: '11px', color: '#5A5955', marginTop: '24px', lineHeight: 1.5 }}>
          Admin access is password-protected. Accounts are created manually in Supabase &rarr;
          Authentication &rarr; Users, and the email must be in the <code style={{ color: '#8A8884' }}>ADMIN_EMAILS</code> allowlist.
          If you can&apos;t log in, ask the project owner to set up your account.
        </p>
      </div>
    </div>
  )
}

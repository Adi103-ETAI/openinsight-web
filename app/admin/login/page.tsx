'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: false },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setInfo('Check your email — we sent a 6-digit code.')
    setStep('otp')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: 'email',
    })

    setLoading(false)
    if (error) {
      setError(error.message)
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
          }} role="alert">{error}</div>
        )}
        {info && !error && (
          <div style={{
            padding: '10px 12px',
            backgroundColor: 'rgba(197,107,74,0.15)',
            border: '1px solid rgba(197,107,74,0.4)',
            borderRadius: '8px',
            color: '#F4E6DF',
            fontSize: '13px',
            marginBottom: '16px',
          }}>{info}</div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp}>
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
              {loading ? 'Sending…' : 'Send login code →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label htmlFor="otp" style={{ display: 'block', fontSize: '13px', color: '#8A8884', marginBottom: '6px' }}>6-digit code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#1C1B1A',
                border: '1px solid #2F2E2C',
                borderRadius: '8px',
                color: '#FAFAF8',
                fontSize: '16px',
                letterSpacing: '0.3em',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            />
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
              {loading ? 'Verifying…' : 'Verify & enter →'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setInfo(null); setError(null) }}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: '#8A8884',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              ← Use a different email
            </button>
          </form>
        )}

        <p style={{ fontSize: '11px', color: '#5A5955', marginTop: '24px', lineHeight: 1.5 }}>
          Only emails in the ADMIN_EMAILS allowlist can access this dashboard.
          If you can&apos;t log in, ask the project owner to add your email.
        </p>
      </div>
    </div>
  )
}

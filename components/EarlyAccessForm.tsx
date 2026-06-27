'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './EarlyAccessForm.module.css'
import { track, identifyUser } from '@/lib/posthog/provider'

interface FormState {
  fullName: string
  email: string
  phone: string
  persona: string // 'doctor' | 'student' | 'professional'
  specialty: string
  otherSpecialty: string
  institution: string
  city: string
  nmcNumber: string
  useCase: string // free text: "what would make you use this daily?"
  referral: string
  agreeTerms: boolean
  newsletter: boolean
}

const STORAGE_KEY = 'openinsight_early_access_submissions'
const DRAFT_KEY = 'openinsight_early_access_draft'

// Phone, specialty, and institution are now REQUIRED for richer validation signal.
// NMC number remains OPTIONAL for validation phase — requested at beta verification.
const REQUIRED_FIELDS: (keyof FormState)[] = [
  'fullName',
  'email',
  'phone',
  'persona',
  'specialty',
  'institution',
  'city',
]

const EMPTY_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  persona: '',
  specialty: '',
  otherSpecialty: '',
  institution: '',
  city: '',
  nmcNumber: '',
  useCase: '',
  referral: '',
  agreeTerms: false,
  newsletter: true,
}

export default function EarlyAccessForm() {
  const [formState, setFormState] = useState<FormState>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [persistedCount, setPersistedCount] = useState(0)
  const [draftRestored, setDraftRestored] = useState(false)
  const [showSavedNote, setShowSavedNote] = useState(false)

  // Load count of existing submissions + restore draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const arr = raw ? JSON.parse(raw) : []
      if (Array.isArray(arr)) setPersistedCount(arr.length)
    } catch {
      setPersistedCount(0)
    }

    try {
      const draftRaw = localStorage.getItem(DRAFT_KEY)
      if (draftRaw) {
        const draft = JSON.parse(draftRaw)
        if (draft && typeof draft === 'object') {
          setFormState(prev => ({ ...prev, ...draft }))
          setDraftRestored(true)
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Auto-save draft (debounced via effect)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (submitted) return
    // Skip saving the very first render (before any user input)
    if (
      formState.fullName === '' &&
      formState.email === '' &&
      formState.persona === '' &&
      formState.city === ''
    ) {
      return
    }
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formState))
      } catch {
        /* ignore quota errors */
      }
    }, 400)
    return () => clearTimeout(id)
  }, [formState, submitted])

  // Compute completion %
  const completion = useMemo(() => {
    const fields: (keyof FormState)[] = [
      'fullName',
      'email',
      'phone',
      'persona',
      'specialty',
      'institution',
      'city',
      'nmcNumber',
      'useCase',
      'referral',
    ]
    let filled = 0
    fields.forEach(f => {
      const v = formState[f]
      if (typeof v === 'string' && v.trim() !== '') filled++
    })
    if (formState.agreeTerms) filled++
    if (formState.newsletter) filled++
    // Specialty "Other" requires otherSpecialty
    if (formState.specialty === 'other') {
      if (formState.otherSpecialty.trim() === '') filled--
    }
    const total = fields.length + 2
    return Math.round((filled / total) * 100)
  }, [formState])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target
    const { name, value } = target
    const isCheckbox = target.type === 'checkbox'
    const checked = isCheckbox ? (target as HTMLInputElement).checked : false
    setFormState(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {}
    if (!formState.fullName.trim()) next.fullName = 'Full name is required'
    if (!formState.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      next.email = 'Please enter a valid email address'
    }
    if (!formState.persona) {
      next.persona = 'Please tell us who you are (doctor, student, or professional)'
    }
    // Phone is now required — Indian mobile format (10 digits, or +91 prefixed)
    const phoneDigits = formState.phone.replace(/\D/g, '')
    if (!formState.phone.trim()) {
      next.phone = 'Phone number is required'
    } else if (
      !/^\+?\d{10,13}$/.test(formState.phone.trim()) ||
      !(phoneDigits.length === 10 || phoneDigits.length === 12)
    ) {
      next.phone = 'Enter a valid 10-digit mobile number (e.g., 9876543210 or +91 98765 43210)'
    }
    // Specialty is now required
    if (!formState.specialty) {
      next.specialty = 'Please select your specialty'
    } else if (formState.specialty === 'other' && !formState.otherSpecialty.trim()) {
      next.otherSpecialty = 'Please specify your specialty'
    }
    // Institution is now required
    if (!formState.institution.trim()) {
      next.institution = 'Institution / hospital / clinic name is required'
    }
    if (!formState.city.trim()) next.city = 'City is required'
    // NMC number is now OPTIONAL — only validate format if provided
    if (formState.nmcNumber.trim() && !/^\d{4,8}$/.test(formState.nmcNumber.trim())) {
      next.nmcNumber = 'Enter a valid NMC / State Medical Council number (4–8 digits)'
    }
    if (!formState.agreeTerms) {
      next.agreeTerms = 'You must agree to the Terms and Privacy Policy to continue'
    }
    return next
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const formStartedRef = useRef(false)

  // Fire form_started event once, on first field interaction
  const handleFirstInteraction = () => {
    if (formStartedRef.current) return
    formStartedRef.current = true
    track('form_started', { form: 'early_access' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const submission = {
      ...formState,
      submittedAt: new Date().toISOString(),
    }

    // Call the backend API (Vercel route handler → Supabase + Resend email).
    // On failure, show error so the user can retry — do NOT silently succeed.
    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSubmitError(data.error || 'Something went wrong on our end. Please try again.')
        setIsSubmitting(false)
        return
      }
    } catch {
      setSubmitError('Network error — please check your connection and try again.')
      setIsSubmitting(false)
      return
    }

    // Local audit trail (in addition to the DB row)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const arr = raw ? JSON.parse(raw) : []
      const next = Array.isArray(arr) ? [...arr, submission] : [submission]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setPersistedCount(next.length)
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* storage may be full or unavailable; still show success */
    }

    // Analytics: identify the user + fire submit event
    identifyUser(formState.email, {
      name: formState.fullName,
      persona: formState.persona,
      specialty: formState.specialty || undefined,
      city: formState.city,
    })
    track('form_submitted', {
      form: 'early_access',
      persona: formState.persona,
      has_specialty: !!formState.specialty,
      has_nmc: !!formState.nmcNumber,
      has_use_case: !!formState.useCase,
      referral_source: formState.referral || undefined,
    })

    setSubmitted(true)
  }

  const handleResetDraft = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(DRAFT_KEY)
    setFormState(EMPTY_FORM)
    setErrors({})
    setDraftRestored(false)
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <div className={styles.successIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="32" height="32">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3>Thank you, {formState.fullName.split(' ')[0]}!</h3>
        <p>
          Your early access request is in. We&apos;ll review it and send access details to{' '}
          <strong>{formState.email}</strong> within 48 hours.
        </p>
        {persistedCount > 0 && (
          <p className={styles.successNote}>
            Submission saved locally. {persistedCount}{' '}
            {persistedCount === 1 ? 'request' : 'requests'} recorded on this device.
          </p>
        )}
      </div>
    )
  }

  const showOtherSpecialty = formState.specialty === 'other'

  return (
    <div className={styles.formWrap}>
      {/* Progress indicator */}
      <div className={styles.progressWrap} aria-label={`Form ${completion}% complete`}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${completion}%` }}
            role="progressbar"
            aria-valuenow={completion}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <span className={styles.progressLabel}>{completion}% complete</span>
      </div>

      {draftRestored && (
        <div className={styles.draftNote} role="status">
          <span>📌 We restored your saved draft. <button type="button" className={styles.draftClear} onClick={handleResetDraft}>Start fresh</button></span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formState.fullName}
            onChange={handleChange}
            onFocus={handleFirstInteraction}
            placeholder="Dr. Your Name"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        {/* Persona — who is signing up? (critical for validation) */}
        <div className={styles.formGroup}>
          <label id="persona-label">I am a *</label>
          <div className={styles.personaCards} role="radiogroup" aria-labelledby="persona-label">
            {([
              { value: 'doctor', label: 'Doctor', emoji: '🩺', desc: 'MBBS & above' },
              { value: 'student', label: 'Medical Student', emoji: '📚', desc: 'MBBS / PG' },
              { value: 'professional', label: 'Other Professional', emoji: '🏥', desc: 'Nursing, pharmacy, etc.' },
            ] as const).map(opt => (
              <label
                key={opt.value}
                className={`${styles.personaCard} ${formState.persona === opt.value ? styles.personaCardActive : ''}`}
              >
                <input
                  type="radio"
                  name="persona"
                  value={opt.value}
                  checked={formState.persona === opt.value}
                  onChange={handleChange}
                  className={styles.srOnly}
                  aria-required="true"
                  aria-invalid={!!errors.persona}
                />
                <span className={styles.personaEmoji} aria-hidden="true">{opt.emoji}</span>
                <span className={styles.personaLabel}>{opt.label}</span>
                <span className={styles.personaDesc}>{opt.desc}</span>
              </label>
            ))}
          </div>
          {errors.persona && <span className={styles.error}>{errors.persona}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            onFocus={handleFirstInteraction}
            placeholder="+91 XXXXX XXXXX"
            autoComplete="tel"
            aria-required="true"
            aria-invalid={!!errors.phone}
          />
          {errors.phone ? (
            <span className={styles.error}>{errors.phone}</span>
          ) : (
            <span className={styles.hint}>We&apos;ll only use this to verify your registration and send beta access details.</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="specialty">Specialty *</label>
          <select
            id="specialty"
            name="specialty"
            value={formState.specialty}
            onChange={handleChange}
            onFocus={handleFirstInteraction}
            aria-required="true"
            aria-invalid={!!errors.specialty}
          >
            <option value="">Select your specialty</option>
            <option value="internal">Internal Medicine</option>
            <option value="general">General Practice</option>
            <option value="pediatrics">Paediatrics</option>
            <option value="gynecology">Gynaecology</option>
            <option value="surgery">Surgery</option>
            <option value="psychiatry">Psychiatry</option>
            <option value="dermatology">Dermatology</option>
            <option value="oncology">Oncology</option>
            <option value="pulmonology">Pulmonology</option>
            <option value="other">Other</option>
          </select>
          {errors.specialty && <span className={styles.error}>{errors.specialty}</span>}
        </div>

        {showOtherSpecialty && (
          <div className={`${styles.formGroup} ${styles.conditional}`}>
            <label htmlFor="otherSpecialty">Please specify your specialty *</label>
            <input
              type="text"
              id="otherSpecialty"
              name="otherSpecialty"
              value={formState.otherSpecialty}
              onChange={handleChange}
              placeholder="e.g. Nephrology, Emergency Medicine"
              aria-required="true"
              aria-invalid={!!errors.otherSpecialty}
            />
            {errors.otherSpecialty && <span className={styles.error}>{errors.otherSpecialty}</span>}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="institution">Institution *</label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formState.institution}
            onChange={handleChange}
            onFocus={handleFirstInteraction}
            placeholder="Hospital / Clinic / College Name"
            autoComplete="organization"
            aria-required="true"
            aria-invalid={!!errors.institution}
          />
          {errors.institution && <span className={styles.error}>{errors.institution}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formState.city}
            onChange={handleChange}
            placeholder="Your city"
            autoComplete="address-level2"
            aria-required="true"
            aria-invalid={!!errors.city}
          />
          {errors.city && <span className={styles.error}>{errors.city}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nmcNumber">NMC / MCI Registration Number (Optional)</label>
          <input
            type="text"
            id="nmcNumber"
            name="nmcNumber"
            value={formState.nmcNumber}
            onChange={handleChange}
            placeholder="e.g., 92501234"
            inputMode="numeric"
            pattern="\d{4,8}"
            aria-invalid={!!errors.nmcNumber}
          />
          {errors.nmcNumber ? (
            <span className={styles.error}>{errors.nmcNumber}</span>
          ) : (
            <span className={styles.hint}>Optional for now — we'll verify your registration before beta access.</span>
          )}
        </div>

        {/* Use case — qualitative gold for validation */}
        <div className={styles.formGroup}>
          <label htmlFor="useCase">What would make you use OpenInsight daily? (Optional)</label>
          <textarea
            id="useCase"
            name="useCase"
            value={formState.useCase}
            onChange={handleChange}
            placeholder="e.g., Quick drug interaction checks, ICMR guideline lookups, differential diagnosis help..."
            rows={3}
            maxLength={500}
          />
          <span className={styles.hint}>{formState.useCase.length}/500 characters</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="referral">How did you hear about OpenInsight?</label>
          <select
            id="referral"
            name="referral"
            value={formState.referral}
            onChange={handleChange}
          >
            <option value="">Select an option</option>
            <option value="twitter">Twitter / X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="colleague">Colleague recommendation</option>
            <option value="press">Press / Media</option>
            <option value="search">Search engine</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formState.agreeTerms}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.agreeTerms}
            />
            <span className={styles.checkboxMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className={styles.checkboxText}>
              I agree to the <a href="#" className={styles.inlineLink}>Terms of Service</a> and{' '}
              <a href="#" className={styles.inlineLink}>Privacy Policy</a>. *
            </span>
          </label>
          {errors.agreeTerms && <span className={styles.error}>{errors.agreeTerms}</span>}
        </div>

        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="newsletter"
              checked={formState.newsletter}
              onChange={handleChange}
            />
            <span className={styles.checkboxMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className={styles.checkboxText}>
              Send me product updates and clinical evidence digests. (optional)
            </span>
          </label>
        </div>

        {/* Review note */}
        <div className={styles.reviewNote} role="note">
          <span className={styles.reviewIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </span>
          <span>
            <strong>We review every request personally</strong> and respond within 48 hours.
            Your data is stored securely and never shared.
          </span>
        </div>

        {submitError && (
          <div className={styles.submitError} role="alert">
            {submitError}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            disabled={isSubmitting}
            onClick={() => {
              try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(formState))
                setShowSavedNote(true)
                setTimeout(() => setShowSavedNote(false), 2500)
              } catch {
                /* ignore */
              }
            }}
          >
            Save &amp; continue later
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Request Early Access →'}
          </button>
        </div>

        {showSavedNote && (
          <p className={styles.savedToast} role="status" aria-live="polite">
            ✓ Draft saved to this device. You can return any time.
          </p>
        )}

      </form>
    </div>
  )
}

'use client'

import { useState, FormEvent } from 'react'
import styles from './ContactForm.module.css'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const STORAGE_KEY = 'openinsight_contact_submissions'

function validateEmail(email: string): boolean {
  // Simple but reasonable email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [storedCount, setStoredCount] = useState(0)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
    // Clear field error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const newErrors: FormErrors = {}
    if (!formState.name.trim()) {
      newErrors.name = 'Please enter your name.'
    }
    if (!formState.email.trim()) {
      newErrors.email = 'Please enter your email.'
    } else if (!validateEmail(formState.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!formState.subject.trim()) {
      newErrors.subject = 'Please add a subject.'
    }
    if (!formState.message.trim()) {
      newErrors.message = 'Please enter your message.'
    } else if (formState.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Persist to localStorage (no backend on static export)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const existing = raw ? (JSON.parse(raw) as Array<unknown>) : []
      const entry = {
        ...formState,
        submittedAt: new Date().toISOString(),
      }
      const updated = [entry, ...existing].slice(0, 50) // keep last 50
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setStoredCount(updated.length)
    } catch {
      // localStorage may be unavailable (private mode / SSR) — silently ignore
    }

    setSubmitted(true)
    setFormState({ name: '', email: '', subject: '', message: '' })
  }

  const handleReset = () => {
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <div className={styles.successIcon} aria-hidden="true">✓</div>
        <h3>Thank you for reaching out.</h3>
        <p>
          Your message has been saved. Our team typically replies within 1–2
          business days. For urgent clinical onboarding queries, email{' '}
          <a href="mailto:support@openinsight.in">support@openinsight.in</a>.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleReset}
          aria-label="Submit another message"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="name">
          Name <span className={styles.required} aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          placeholder="Dr. Your Name"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className={styles.error} role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">
          Email <span className={styles.required} aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className={styles.error} role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject">
          Subject <span className={styles.required} aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formState.subject}
          onChange={handleChange}
          placeholder="How can we help?"
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && (
          <span id="subject-error" className={styles.error} role="alert">
            {errors.subject}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">
          Message <span className={styles.required} aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          placeholder="Tell us more about your question or feedback…"
          rows={6}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span id="message-error" className={styles.error} role="alert">
            {errors.message}
          </span>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Send Message →
      </button>

      {storedCount > 0 && (
        <p className={styles.note}>
          You have {storedCount} saved message{storedCount === 1 ? '' : 's'} on this device.
        </p>
      )}
    </form>
  )
}

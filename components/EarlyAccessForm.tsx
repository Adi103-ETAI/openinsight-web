'use client'

import { useState } from 'react'
import styles from './EarlyAccessForm.module.css'

interface FormState {
  fullName: string
  email: string
  phone: string
  specialty: string
  institution: string
  city: string
  nmcNumber: string
  referral: string
}

export default function EarlyAccessForm() {
  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    institution: '',
    city: '',
    nmcNumber: '',
    referral: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formState.fullName) newErrors.fullName = 'Full name is required'
    if (!formState.email) newErrors.email = 'Email is required'
    if (!formState.specialty) newErrors.specialty = 'Specialty is required'
    if (!formState.city) newErrors.city = 'City is required'
    if (!formState.nmcNumber) newErrors.nmcNumber = 'NMC registration is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <h3>Thank you, Dr. {formState.fullName.split(' ')[0]}!</h3>
        <p>We'll review your registration and send access details to <strong>{formState.email}</strong> within 48 hours.</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formState.fullName}
          onChange={handleChange}
          placeholder="Dr. Your Name"
          required
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
          required
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone (Optional)</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formState.phone}
          onChange={handleChange}
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="specialty">Specialty *</label>
        <select
          id="specialty"
          name="specialty"
          value={formState.specialty}
          onChange={handleChange}
          required
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

      <div className={styles.formGroup}>
        <label htmlFor="institution">Institution (Optional)</label>
        <input
          type="text"
          id="institution"
          name="institution"
          value={formState.institution}
          onChange={handleChange}
          placeholder="Hospital / Clinic Name"
        />
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
          required
        />
        {errors.city && <span className={styles.error}>{errors.city}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="nmcNumber">NMC / MCI Registration Number *</label>
        <input
          type="text"
          id="nmcNumber"
          name="nmcNumber"
          value={formState.nmcNumber}
          onChange={handleChange}
          placeholder="e.g., 92501234"
          required
        />
        {errors.nmcNumber && <span className={styles.error}>{errors.nmcNumber}</span>}
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

      <button type="submit" className="btn btn-primary">
        Request Early Access →
      </button>
    </form>
  )
}

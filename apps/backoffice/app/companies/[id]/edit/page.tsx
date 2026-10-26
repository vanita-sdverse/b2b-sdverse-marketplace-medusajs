"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.scss"

const COMPANY_TYPES = [
  "OEM",
  "SUPPLIER",
  "ENGINEERING SERVICE PROVIDER",
  "SEMICONDUCTOR MANUFACTURER",
  "SOFTWARE VENDOR",
  "CLOUD PROVIDER",
]

const COMPANY_AGES = [
  "0-2 YEARS",
  "2-5 YEARS",
  "5-10 YEARS",
  "10+ YEARS",
]

const COMPANY_SIZES = [
  "0-100",
  "101-1,000",
  "1,001-5,000",
  "5,000-10,000",
  "10,000+",
]

const HQ_REGIONS = [
  "NORTH AMERICA",
  "SOUTH AMERICA",
  "EUROPE",
  "ASIA PACIFIC",
  "MIDDLE EAST AND AFRICA",
]

const AUTOMOTIVE_EXPERIENCES = [
  "ESTABLISHED",
  "EMERGING",
  "STARTUP",
]

export default function EditCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form Fields
  const [name, setName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [companyType, setCompanyType] = useState<string>("")
  const [companyAge, setCompanyAge] = useState<string>("")
  const [companySize, setCompanySize] = useState<string>("")
  const [hqRegion, setHqRegion] = useState<string>("")
  const [automotiveExperience, setAutomotiveExperience] = useState<string>("")
  const [notifyUsers, setNotifyUsers] = useState<boolean>(false)

  useEffect(() => {
    if (companyId) {
      loadCompany()
    }
  }, [companyId])

  const loadCompany = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/companies/${companyId}`)
      if (!res.ok) {
        throw new Error("Failed to load company details")
      }
      const data = await res.json()
      const c = data.company
      if (c) {
        setName(c.name || "")
        if (c.subscription_expiration_date) {
          try {
            const d = new Date(c.subscription_expiration_date)
            setExpirationDate(d.toISOString().split("T")[0])
          } catch (e) {
            setExpirationDate("")
          }
        }
        const attrs = c.attributes || {}
        setCompanyType(attrs.company_type || "")
        setCompanyAge(attrs.company_age || "")
        setCompanySize(attrs.company_size || "")
        setHqRegion(attrs.hq_region || "")
        setAutomotiveExperience(attrs.automotive_experience || "")
        setNotifyUsers(Boolean(attrs.notify_users))
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load company")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Company Name is required.")
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const payload = {
        name: name.trim(),
        subscription_expiration_date: expirationDate ? new Date(expirationDate).toISOString() : null,
        company_type: companyType || null,
        company_age: companyAge || null,
        company_size: companySize || null,
        hq_region: hqRegion || null,
        automotive_experience: automotiveExperience || null,
        notify_users: notifyUsers,
      }

      const res = await fetch(`/api/companies/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.message || "Failed to update company")
      }

      setSuccessMessage("Company updated successfully!")
      setTimeout(() => {
        router.push("/companies")
      }, 1200)
    } catch (err: any) {
      setError(err?.message || "Failed to save company")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
            Loading company details...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>EDIT COMPANY</h2>
        </div>

        {error && <div className={styles.alertError}>{error}</div>}
        {successMessage && <div className={styles.alertSuccess}>✓ {successMessage}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* 1. Name */}
          <div className={styles.fieldGroup}>
            <label htmlFor="companyName" className={styles.fieldLabel}>
              NAME <span className={styles.requiredStar}>*</span>
            </label>
            <input
              id="companyName"
              type="text"
              className={styles.textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* 2. Subscription Expiration Date */}
          <div className={styles.fieldGroup}>
            <label htmlFor="expDate" className={styles.fieldLabel}>
              SUBSCRIPTION EXPIRATION DATE <span className={styles.requiredStar}>*</span>
            </label>
            <input
              id="expDate"
              type="date"
              className={styles.dateInput}
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          {/* 3. Company type */}
          <div className={styles.radioSection}>
            <div className={styles.sectionTitle}>Company type</div>
            <div className={styles.optionsList}>
              {COMPANY_TYPES.map((type) => (
                <label key={type} className={styles.optionItem}>
                  <input
                    type="radio"
                    name="company_type"
                    value={type}
                    checked={companyType === type}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className={styles.optionInput}
                  />
                  <span className={styles.optionLabel}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Company age */}
          <div className={styles.radioSection}>
            <div className={styles.sectionTitle}>Company age</div>
            <div className={styles.optionsList}>
              {COMPANY_AGES.map((age) => (
                <label key={age} className={styles.optionItem}>
                  <input
                    type="radio"
                    name="company_age"
                    value={age}
                    checked={companyAge === age}
                    onChange={(e) => setCompanyAge(e.target.value)}
                    className={styles.optionInput}
                  />
                  <span className={styles.optionLabel}>{age}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Company size (employees) */}
          <div className={styles.radioSection}>
            <div className={styles.sectionTitle}>Company size (employees)</div>
            <div className={styles.optionsList}>
              {COMPANY_SIZES.map((size) => (
                <label key={size} className={styles.optionItem}>
                  <input
                    type="radio"
                    name="company_size"
                    value={size}
                    checked={companySize === size}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className={styles.optionInput}
                  />
                  <span className={styles.optionLabel}>{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. HQ region */}
          <div className={styles.radioSection}>
            <div className={styles.sectionTitle}>HQ region</div>
            <div className={styles.optionsList}>
              {HQ_REGIONS.map((region) => (
                <label key={region} className={styles.optionItem}>
                  <input
                    type="radio"
                    name="hq_region"
                    value={region}
                    checked={hqRegion === region}
                    onChange={(e) => setHqRegion(e.target.value)}
                    className={styles.optionInput}
                  />
                  <span className={styles.optionLabel}>{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 7. Automotive experience */}
          <div className={styles.radioSection}>
            <div className={styles.sectionTitle}>Automotive experience</div>
            <div className={styles.optionsList}>
              {AUTOMOTIVE_EXPERIENCES.map((exp) => (
                <label key={exp} className={styles.optionItem}>
                  <input
                    type="radio"
                    name="automotive_experience"
                    value={exp}
                    checked={automotiveExperience === exp}
                    onChange={(e) => setAutomotiveExperience(e.target.value)}
                    className={styles.optionInput}
                  />
                  <span className={styles.optionLabel}>{exp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 8. Notification checkbox */}
          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={notifyUsers}
              onChange={(e) => setNotifyUsers(e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxLabel}>
              IF CHECKED, AN EMAIL NOTIFICATION WILL BE SENT TO ALL USERS
            </span>
          </label>

          {/* Actions */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <Link href="/companies" className={styles.btnCancel}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

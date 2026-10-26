"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.scss"
import { useBackofficeAuth } from "../../context/BackofficeAuthContext"

export default function BackofficeLoginPage() {
  const router = useRouter()
  const { login } = useBackofficeAuth()
  const [email, setEmail] = useState("admin@sdverse.auto")
  const [password, setPassword] = useState("••••••••")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError("Please enter your administrator email address.")
      return
    }

    setLoading(true)
    setError(null)

    const res = await login(email.trim(), password)
    setLoading(false)

    if (res.success) {
      router.push("/")
    } else {
      setError(res.error || "Authentication failed. Please verify credentials.")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          {/*<div className={styles.badgeLogo}>BO</div>*/}
          <h1 className={styles.title}>Backoffice Login</h1>
          {/*<p className={styles.subtitle}>Marketplace Governance & Operators Portal</p>*/}
        </div>

        {error && <div className={styles.alertError}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Admin Email Address
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@sdverse.auto"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Backoffice"}
          </button>
        </form>

        {/*<div className={styles.footerNote}>*/}
        {/*  Independent session • Platform Operations & Administration*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

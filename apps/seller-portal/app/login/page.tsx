"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.scss"
import { useSellerAuth } from "../../context/SellerAuthContext"

export default function SellerLoginPage() {
  const router = useRouter()
  const { login } = useSellerAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    setLoading(true)
    setError(null)
    setInfo(null)

    const res = await login(email.trim(), password)
    setLoading(false)

    if (res.success) {
      router.push("/")
    } else {
      setError(res.error || "Authentication failed. Please verify credentials.")
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    setEmail("vanita.chaudhari.external@sdverse.auto")
    setPassword("password123")
    setInfo("Demo credentials populated: vanita.chaudhari.external@sdverse.auto")
    setError(null)
  }

  return (
    <div className={styles.container}>
      {/* SDVERSE SELLER PORTAL Header / Logo */}
      {/*<div className={styles.logoContainer}>*/}
      {/*  <div className={styles.logoBadge}>*/}
      {/*    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">*/}
      {/*      <path*/}
      {/*        d="M4.5 12.5L9.5 17.5L19.5 6.5"*/}
      {/*        stroke="#ffffff"*/}
      {/*        strokeWidth="3.5"*/}
      {/*        strokeLinecap="round"*/}
      {/*        strokeLinejoin="round"*/}
      {/*      />*/}
      {/*    </svg>*/}
      {/*  </div>*/}
      {/*  /!*<div className={styles.brandText}>*!/*/}
      {/*  /!*  <span className={styles.brandTitle}>SDVERSE</span>*!/*/}
      {/*  /!*  <span className={styles.brandSubtitle}>SELLER PORTAL</span>*!/*/}
      {/*  /!*</div>*!/*/}
      {/*</div>*/}

      {/* Login Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Login</h1>
        </div>

        <div className={styles.cardBody}>
          {error && <div className={styles.alertError}>{error}</div>}
          {info && <div className={styles.alertInfo}>{info}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                EMAIL *
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                PASSWORD *
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3.5" stroke="#6b7280" strokeWidth="1.8" fill="none" />
                    <circle cx="12" cy="12" r="1.5" fill="#6b7280" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className={styles.btnLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className={styles.forgotPasswordWrapper}>
            <button
              type="button"
              className={styles.forgotPasswordLink}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

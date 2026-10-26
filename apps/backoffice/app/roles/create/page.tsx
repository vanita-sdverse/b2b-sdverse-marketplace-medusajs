"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "./page.module.scss"
import { createRole } from "../operations/createRole"

export default function CreateRolePage() {
  const router = useRouter()
  const [roleName, setRoleName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) {
      setError("Role name is required.")
      return
    }

    setSubmitting(true)
    setError(null)

    // By default give standard seller/portal routes
    const defaultRoutes = ["/", "/products", "/inventory", "/orders", "/analytics", "/profile"]

    const res = await createRole({
      role_name: roleName.trim(),
      routes: defaultRoutes,
    })

    setSubmitting(false)

    if (res.error) {
      setError(res.error)
      return
    }

    setSuccess(`Role '${roleName}' created successfully! Redirecting...`)
    setTimeout(() => {
      router.push("/roles")
    }, 800)
  }

  return (
    <div className={styles.container}>
      {/* Action Row: Breadcrumbs & < List of roles */}
      <div className={styles.actionRow}>
        <div className={styles.breadcrumbs}>
          <Link href="/users">Users</Link>
          <span className={styles.separator}>/</span>
          <Link href="/roles">User Roles</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>Create new Role</span>
        </div>

        <Link href="/roles" className={styles.btnListRoles}>
          <span>‹</span> List of roles
        </Link>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>CREATE ROLE</h2>
          </div>

          <div className={styles.cardBody}>
            {error && <div className={styles.alertError}>{error}</div>}
            {success && <div className={styles.alertSuccess}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.innerSection}>
                <h3 className={styles.sectionHeading}>Role</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="roleName" className={styles.label}>
                    NAME *
                  </label>
                  <input
                    id="roleName"
                    type="text"
                    className={styles.input}
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder=""
                    required
                    autoFocus
                  />
                </div>

                <button type="submit" className={styles.btnCreate} disabled={submitting}>
                  {submitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

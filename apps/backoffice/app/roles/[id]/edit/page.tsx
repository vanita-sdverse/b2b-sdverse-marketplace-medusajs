"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import styles from "./page.module.scss"
import { AVAILABLE_ROUTES } from "../../constants"
import { updateRole } from "../../operations/updateRole"

export default function EditRolePage() {
  const params = useParams()
  const router = useRouter()
  const roleId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [roleName, setRoleName] = useState("")
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([])
  const [isFixed, setIsFixed] = useState(false)

  useEffect(() => {
    if (roleId) {
      loadRole()
    }
  }, [roleId])

  const loadRole = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/roles/${roleId}?_t=${Date.now()}`, { cache: "no-store" })
      if (!res.ok) {
        throw new Error("Failed to load role details.")
      }
      const data = await res.json()
      const r = data.role
      if (r) {
        setRoleName(r.role_name || "")
        setIsFixed(Boolean(r.isFixed))
        const routes = r.routes || r.permissions || []
        setSelectedRoutes(Array.isArray(routes) ? routes : [])
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load role.")
    } finally {
      setLoading(false)
    }
  }

  const toggleRoute = (path: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    )
  }

  const handleSelectAll = () => {
    setSelectedRoutes(AVAILABLE_ROUTES.map((r) => r.path))
  }

  const handleDeselectAll = () => {
    setSelectedRoutes([])
  }

  const handleSelectCategory = (category: "Seller Portal" | "Backoffice Management") => {
    const categoryPaths = AVAILABLE_ROUTES.filter((r) => r.category === category).map((r) => r.path)
    setSelectedRoutes((prev) => Array.from(new Set([...prev, ...categoryPaths])))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) {
      setError("Role name is required.")
      return
    }

    setSubmitting(true)
    setError(null)

    const res = await updateRole(roleId, {
      role_name: roleName.trim(),
      routes: selectedRoutes,
      permissions: selectedRoutes,
    })

    setSubmitting(false)

    if (res.error) {
      setError(res.error)
      return
    }

    setSuccess(`Role '${roleName}' updated successfully! Redirecting...`)
    setTimeout(() => {
      router.push("/roles")
    }, 800)
  }

  const sellerRoutes = AVAILABLE_ROUTES.filter((r) => r.category === "Seller Portal")
  const backofficeRoutes = AVAILABLE_ROUTES.filter((r) => r.category === "Backoffice Management")

  return (
    <div className={styles.container}>
      {/* Action Row: Breadcrumbs & < List of roles */}
      <div className={styles.actionRow}>
        <div className={styles.breadcrumbs}>
          <Link href="/users">Users</Link>
          <span className={styles.separator}>/</span>
          <Link href="/roles">User Roles</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>Edit Role</span>
        </div>

        <Link href="/roles" className={styles.btnListRoles}>
          <span>‹</span> List of roles
        </Link>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>EDIT ROLE</h2>
          </div>

          <div className={styles.cardBody}>
            {error && <div className={styles.alertError}>{error}</div>}
            {success && <div className={styles.alertSuccess}>{success}</div>}

            {loading ? (
              <div className={styles.loadingBox}>Loading role and permissions...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* 1. Role Name Section */}
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
                      required
                    />
                  </div>
                </div>

                {/* 2. Routes Permission Section */}
                <div className={styles.routesSection}>
                  <div className={styles.routesHeader}>
                    <div className={styles.routesTitleGroup}>
                      <h4>Routes Permission</h4>
                      <p>Select which routes this role has access to. Only selected routes are accessible to the customer.</p>
                    </div>

                    <div className={styles.quickActions}>
                      <button type="button" className={styles.btnQuick} onClick={handleSelectAll}>
                        Select All
                      </button>
                      <button type="button" className={styles.btnQuick} onClick={handleDeselectAll}>
                        Deselect All
                      </button>
                      <button
                        type="button"
                        className={styles.btnQuick}
                        onClick={() => handleSelectCategory("Seller Portal")}
                      >
                        Seller Portal Routes
                      </button>
                      <button
                        type="button"
                        className={styles.btnQuick}
                        onClick={() => handleSelectCategory("Backoffice Management")}
                      >
                        Backoffice Routes
                      </button>
                    </div>
                  </div>

                  {/* Seller Portal Routes */}
                  <div className={styles.categoryGroup}>
                    <div className={styles.categoryTitle}>
                      <span>📦</span> Seller Portal Routes
                    </div>
                    <div className={styles.routesGrid}>
                      {sellerRoutes.map((r) => {
                        const isChecked = selectedRoutes.includes(r.path)
                        return (
                          <label
                            key={r.path}
                            className={`${styles.routeItem} ${isChecked ? styles.routeItemActive : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleRoute(r.path)}
                              className={styles.checkboxInput}
                            />
                            <div className={styles.routeDetails}>
                              <div>
                                <span className={styles.routePath}>{r.path}</span>
                                <span className={styles.routeLabel}>{r.label.replace(` (${r.path})`, "")}</span>
                              </div>
                              <div className={styles.routeDescription}>{r.description}</div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Backoffice Management Routes */}
                  <div className={styles.categoryGroup}>
                    <div className={styles.categoryTitle}>
                      <span>⚙️</span> Backoffice Management Routes
                    </div>
                    <div className={styles.routesGrid}>
                      {backofficeRoutes.map((r) => {
                        const isChecked = selectedRoutes.includes(r.path)
                        return (
                          <label
                            key={r.path}
                            className={`${styles.routeItem} ${isChecked ? styles.routeItemActive : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleRoute(r.path)}
                              className={styles.checkboxInput}
                            />
                            <div className={styles.routeDetails}>
                              <div>
                                <span className={styles.routePath}>{r.path}</span>
                                <span className={styles.routeLabel}>{r.label.replace(` (${r.path})`, "")}</span>
                              </div>
                              <div className={styles.routeDescription}>{r.description}</div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div>
                  <button type="submit" className={styles.btnSave} disabled={submitting}>
                    {submitting ? "Saving..." : "Save"}
                  </button>
                  <Link href="/roles" className={styles.btnCancel}>
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

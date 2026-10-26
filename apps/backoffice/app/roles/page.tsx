"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import styles from "./page.module.scss"
import { RoleRecord } from "./constants"
import { listRoles } from "./operations/listRoles"
import { deleteRole } from "./operations/deleteRole"

export default function BackofficeRolesPage() {
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    setLoading(true)
    try {
      const fetched = await listRoles()
      setRoles(fetched)
    } catch (err: any) {
      console.error("Failed to load roles:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (role: RoleRecord) => {
    if (role.isFixed) {
      alert("System roles cannot be deleted.")
      return
    }

    if (!window.confirm(`Are you sure you want to delete role '${role.role_name}'?`)) {
      return
    }

    setDeletingId(role.id)
    try {
      const res = await deleteRole(role.id)
      if (res.success) {
        setNotification({ type: "success", message: `Role '${role.role_name}' deleted successfully.` })
        setRoles((prev) => prev.filter((r) => r.id !== role.id))
      } else {
        setNotification({ type: "error", message: res.error || "Failed to delete role." })
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err?.message || "Failed to delete role." })
    } finally {
      setDeletingId(null)
    }
  }

  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return roles

    return roles.filter((r) => {
      return (
        r.role_name.toLowerCase().includes(q) ||
        (r.company_name || "").toLowerCase().includes(q) ||
        (r.customer_email || "").toLowerCase().includes(q) ||
        (r.routes || []).some((route) => route.toLowerCase().includes(q))
      )
    })
  }, [roles, searchQuery])

  return (
    <div className={styles.container}>
      {/* Action Row: Breadcrumbs & + Create new Role */}
      <div className={styles.actionRow}>
        <div className={styles.breadcrumbs}>
          <Link href="/users">Users</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>User Roles</span>
        </div>

        <Link href="/roles/create" className={styles.btnCreateRole}>
          + Create new Role
        </Link>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentWrapper}>
        {notification && (
          <div
            className={notification.type === "success" ? styles.alertSuccess : styles.alertError}
            onClick={() => setNotification(null)}
            style={{ cursor: "pointer" }}
          >
            {notification.message}
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>LIST OF USER ROLES</h2>
          </div>

          <div className={styles.topControls}>
            <div className={styles.entriesCount}>
              Showing {filteredRoles.length} of {roles.length} role entries
            </div>

            <div className={styles.searchBox}>
              <label htmlFor="roleSearch" className={styles.searchLabel}>
                Search:
              </label>
              <input
                id="roleSearch"
                type="text"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, company, or route..."
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Company</th>
                  <th>Customer / User</th>
                  <th>Allowed Routes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyState}>
                      Loading roles & permissions...
                    </td>
                  </tr>
                ) : filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyState}>
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => {
                    const routes = role.routes || role.permissions || []
                    const displayedRoutes = routes.slice(0, 4)
                    const remainingCount = routes.length - displayedRoutes.length
                    const isDeleting = deletingId === role.id

                    return (
                      <tr key={role.id}>
                        <td>
                          <div className={styles.roleNameCell}>
                            <span className={styles.roleTitle}>{role.role_name}</span>
                            <div className={styles.roleMeta}>
                              {role.isFixed ? (
                                <span className={styles.systemBadge}>🔒 System Role</span>
                              ) : (
                                <span className={styles.companyBadge}>Company Specific</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          {role.company_name ? (
                            <span className={styles.companyBadge}>{role.company_name}</span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>—</span>
                          )}
                        </td>

                        <td>
                          {role.customer_email ? (
                            <span className={styles.userCell}>{role.customer_email}</span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>All Users</span>
                          )}
                        </td>

                        <td>
                          <div className={styles.routesCell}>
                            {displayedRoutes.map((rt) => (
                              <span key={rt} className={styles.routeBadge}>
                                {rt}
                              </span>
                            ))}
                            {remainingCount > 0 && (
                              <span className={styles.routeMore}>+{remainingCount} more</span>
                            )}
                            {routes.length === 0 && (
                              <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>No routes allowed</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className={styles.actionsCell}>
                            <Link
                              href={`/roles/${role.id}/edit`}
                              className={`${styles.actionPillBtn} ${styles.btnEdit}`}
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className={`${styles.actionPillBtn} ${styles.btnDelete}`}
                              onClick={() => handleDelete(role)}
                              disabled={role.isFixed || isDeleting}
                              title={role.isFixed ? "Fixed system role cannot be deleted" : "Delete role"}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

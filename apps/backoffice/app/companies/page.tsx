"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import styles from "./page.module.scss"

export interface CompanyRow {
  id: string
  id_company: number | null
  name: string
  is_active: boolean
  status: "Subscribed" | "Unsubscribed" | "Expired"
  subscription_end_date: string | null
  subscription_expiration_date: string | null
  attributes?: Record<string, any>
}

export default function CompaniesListPage() {
  const [companies, setCompanies] = useState<CompanyRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortKey, setSortKey] = useState<keyof CompanyRow>("id_company")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`/api/companies?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.companies)) {
          setCompanies(data.companies)
        }
      }
    } catch (err: any) {
      console.error("Failed to load companies:", err)
    } finally {
      setLoading(false)
    }
  }

  // Deactivate or activate company and users
  const handleToggleDeactivate = async (company: CompanyRow) => {
    const nextState = !company.is_active
    const actionName = nextState ? "activate" : "deactivate"
    if (!window.confirm(`Are you sure you want to ${actionName} '${company.name}' and all its users?`)) {
      return
    }

    // Optimistically update the UI immediately
    setCompanies((prev) =>
      prev.map((c) => (c.id === company.id ? { ...c, is_active: nextState } : c))
    )

    setActionLoadingId(company.id)
    try {
      const res = await fetch(`/api/companies/${company.id}/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextState }),
      })

      if (res.ok) {
        const data = await res.json()
        setNotification({
          type: "success",
          message: data.message || `Company '${company.name}' ${actionName}d successfully.`,
        })
        if (data.company) {
          setCompanies((prev) =>
            prev.map((c) => (c.id === company.id ? { ...c, ...data.company } : c))
          )
        }
      } else {
        const err = await res.json().catch(() => ({}))
        setNotification({ type: "error", message: err.message || `Failed to ${actionName} company.` })
        await fetchCompanies()
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err?.message || `Network error.` })
      await fetchCompanies()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Toggle Subscription (Unsubscribe or Subscribe)
  const handleToggleSubscription = async (company: CompanyRow) => {
    const isCurrentlySubscribed = company.status === "Subscribed"
    const nextStatus: "Subscribed" | "Unsubscribed" = isCurrentlySubscribed ? "Unsubscribed" : "Subscribed"
    const nextActive = !isCurrentlySubscribed
    const actionName = isCurrentlySubscribed ? "unsubscribe" : "subscribe"
    const confirmMessage = isCurrentlySubscribed
      ? `Are you sure you want to unsubscribe '${company.name}'? This will deactivate the company and all its users.`
      : `Are you sure you want to subscribe '${company.name}'? This will activate the company, its subscription, and all its users.`

    if (!window.confirm(confirmMessage)) {
      return
    }

    // Optimistically update button & status immediately
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === company.id
          ? {
              ...c,
              status: nextStatus,
              is_active: nextActive,
            }
          : c
      )
    )

    setActionLoadingId(company.id)
    try {
      const endpoint = isCurrentlySubscribed
        ? `/api/companies/${company.id}/unsubscribe`
        : `/api/companies/${company.id}/subscribe`

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        const data = await res.json()
        setNotification({
          type: "success",
          message: data.message || `Company '${company.name}' ${actionName}d successfully.`,
        })
        if (data.company) {
          setCompanies((prev) =>
            prev.map((c) => (c.id === company.id ? { ...c, ...data.company } : c))
          )
        }
      } else {
        const err = await res.json().catch(() => ({}))
        setNotification({ type: "error", message: err.message || `Failed to ${actionName} company.` })
        await fetchCompanies()
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err?.message || `Network error.` })
      await fetchCompanies()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Sorting Handler
  const handleSort = (key: keyof CompanyRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
    setPage(1)
  }

  // Filter & Sort
  const filteredCompanies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    let list = companies

    if (q) {
      list = list.filter((c) => {
        return (
          String(c.id_company || "").toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.is_active ? "active" : "inactive").includes(q) ||
          c.status.toLowerCase().includes(q) ||
          String(c.subscription_end_date || "").includes(q)
        )
      })
    }

    return [...list].sort((a, b) => {
      let aVal: any = a[sortKey]
      let bVal: any = b[sortKey]

      if (sortKey === "id_company") {
        aVal = Number(aVal) || 0
        bVal = Number(bVal) || 0
      } else {
        aVal = String(aVal || "").toLowerCase()
        bVal = String(bVal || "").toLowerCase()
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [companies, searchQuery, sortKey, sortOrder])

  // Pagination
  const totalEntries = filteredCompanies.length
  const totalPages = Math.ceil(totalEntries / pageSize) || 1
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalEntries)
  const currentEntries = filteredCompanies.slice(startIndex, endIndex)

  return (
    <div className={styles.container}>
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
        {/* Header */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>LIST OF COMPANIES</h2>
        </div>

        {/* Top Controls: Showing info & Search input */}
        <div className={styles.topControls}>
          <div className={styles.entriesCount}>
            Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of {totalEntries} entries
          </div>

          <div className={styles.searchBox}>
            <label htmlFor="companySearch" className={styles.searchLabel}>
              Search:
            </label>
            <input
              id="companySearch"
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              placeholder=""
            />
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort("id_company")}>
                  Company Id
                  <span className={`${styles.sortArrow} ${sortKey === "id_company" ? styles.sortArrowActive : ""}`}>
                    {sortKey === "id_company" ? (sortOrder === "asc" ? "▲" : "▼") : "⬍"}
                  </span>
                </th>
                <th onClick={() => handleSort("name")}>
                  Name
                  <span className={`${styles.sortArrow} ${sortKey === "name" ? styles.sortArrowActive : ""}`}>
                    {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : "⬍"}
                  </span>
                </th>
                <th onClick={() => handleSort("is_active")}>
                  Active
                  <span className={`${styles.sortArrow} ${sortKey === "is_active" ? styles.sortArrowActive : ""}`}>
                    {sortKey === "is_active" ? (sortOrder === "asc" ? "▲" : "▼") : "⬍"}
                  </span>
                </th>
                <th onClick={() => handleSort("status")}>
                  Status
                  <span className={`${styles.sortArrow} ${sortKey === "status" ? styles.sortArrowActive : ""}`}>
                    {sortKey === "status" ? (sortOrder === "asc" ? "▲" : "▼") : "⬍"}
                  </span>
                </th>
                <th>Subscription end date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    Loading companies...
                  </td>
                </tr>
              ) : currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No companies found.
                  </td>
                </tr>
              ) : (
                currentEntries.map((company) => {
                  const isLoading = actionLoadingId === company.id
                  return (
                    <tr key={company.id}>
                      <td className={styles.companyId}>{company.id_company ?? "—"}</td>
                      <td className={styles.companyName}>{company.name}</td>
                      <td>
                        <span className={company.is_active ? styles.activeBadge : styles.inactiveBadge}>
                          {company.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${
                            company.status === "Expired"
                              ? styles.statusExpired
                              : company.status === "Unsubscribed"
                              ? styles.statusUnsubscribed
                              : ""
                          }`}
                        >
                          {company.status}
                        </span>
                      </td>
                      <td>{company.subscription_end_date || "—"}</td>
                      <td>
                        <div className={styles.actionsCell}>
                          <Link
                            href={`/companies/${company.id}/edit`}
                            className={`${styles.actionPillBtn} ${styles.btnEdit}`}
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className={`${styles.actionPillBtn} ${
                              company.is_active ? styles.btnDeactivate : styles.btnActivate
                            }`}
                            onClick={() => handleToggleDeactivate(company)}
                            disabled={isLoading}
                          >
                            {company.is_active ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            type="button"
                            className={`${styles.actionPillBtn} ${
                              company.status === "Subscribed" ? styles.btnUnsubscribe : styles.btnSubscribe
                            }`}
                            onClick={() => handleToggleSubscription(company)}
                            disabled={isLoading}
                          >
                            {company.status === "Subscribed" ? "Unsubscribe" : "Subscribe"}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <span>
              Page {page} of {totalPages}
            </span>
            <div className={styles.paginationButtons}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

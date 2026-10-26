"use client"

import React, { useState, useMemo } from "react"
import styles from "./DataTable.module.scss"

export interface DataTableColumn<T> {
  key: string
  header: React.ReactNode
  accessor?: (row: T) => any
  sortable?: boolean
  width?: string
  align?: "left" | "center" | "right"
  render?: (row: T, index: number) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyField?: keyof T | ((row: T, index: number) => string)
  searchPlaceholder?: string
  defaultSortKey?: string
  defaultSortDir?: "asc" | "desc"
  pageSizeOptions?: number[]
  defaultPageSize?: number
  loading?: boolean
  emptyMessage?: string
  actions?: React.ReactNode
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = "id",
  searchPlaceholder = "Search records...",
  defaultSortKey,
  defaultSortDir = "asc",
  pageSizeOptions = [5, 10, 25, 50],
  defaultPageSize = 10,
  loading = false,
  emptyMessage = "No matching records found.",
  actions,
  className = "",
}: DataTableProps<T>): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir)
  const [pageSize, setPageSize] = useState<number>(defaultPageSize)
  const [currentPage, setCurrentPage] = useState<number>(1)

  // 1. Filtering / Search
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data
    }
    const query = searchTerm.toLowerCase().trim()
    return data.filter((row) => {
      return columns.some((col) => {
        const value = col.accessor ? col.accessor(row) : row[col.key]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(query)
      })
    })
  }, [data, columns, searchTerm])

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) {
      return filteredData
    }

    const col = columns.find((c) => c.key === sortKey)
    const accessor = col?.accessor || ((row: T) => row[sortKey])

    return [...filteredData].sort((a, b) => {
      const valA = accessor(a)
      const valB = accessor(b)

      if (valA === valB) return 0
      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1

      // Number comparison
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA
      }

      // String comparison
      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      const comp = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: "base" })
      return sortDir === "asc" ? comp : -comp
    })
  }, [filteredData, sortKey, sortDir, columns])

  // Reset to page 1 if query changes or data changes
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  // 3. Pagination Slicing
  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, safeCurrentPage, pageSize])

  const handleSort = (key: string, isSortable: boolean = true) => {
    if (!isSortable) return

    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc")
      } else {
        setSortKey(null)
        setSortDir("asc")
      }
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const startIndex = (safeCurrentPage - 1) * pageSize + 1
  const endIndex = Math.min(safeCurrentPage * pageSize, sortedData.length)

  const getRowKey = (row: T, index: number): string => {
    if (typeof keyField === "function") {
      return keyField(row, index)
    }
    return String(row[keyField] ?? index)
  }

  return (
    <div className={`${styles.datatableContainer} ${className}`}>
      {/* Controls Bar: Search & Page Limit Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setSearchTerm("")
                setCurrentPage(1)
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.controlsRight}>
          <div className={styles.pageSizeSelector}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {actions && <div className={styles.actionsSlot}>{actions}</div>}
        </div>
      </div>

      {/* Table Container */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => {
                const isSortable = col.sortable !== false
                const isSorted = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width, textAlign: col.align || "left" }}
                    className={isSortable ? styles.sortable : ""}
                    onClick={() => handleSort(col.key, isSortable)}
                  >
                    <div className={styles.headerContent}>
                      <span>{col.header}</span>
                      {isSortable && (
                        <span
                          className={`${styles.sortIndicator} ${
                            isSorted ? styles.active : ""
                          }`}
                        >
                          {isSorted ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState}>
                  Loading records...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={getRowKey(row, index)}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || "left" }}
                    >
                      {col.render
                        ? col.render(row, (safeCurrentPage - 1) * pageSize + index)
                        : col.accessor
                        ? col.accessor(row)
                        : (row as any)[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className={styles.paginationBar}>
        <div className={styles.paginationInfo}>
          {sortedData.length === 0 ? (
            "0 entries"
          ) : (
            <>
              Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of{" "}
              <strong>{sortedData.length}</strong> entries
              {filteredData.length !== data.length && (
                <span> (filtered from {data.length} total)</span>
              )}
            </>
          )}
        </div>

        <div className={styles.paginationNav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage <= 1}
            title="First Page"
          >
            «
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
            title="Previous Page"
          >
            ‹
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 5) return true
              return Math.abs(p - safeCurrentPage) <= 1 || p === 1 || p === totalPages
            })
            .map((p, idx, arr) => {
              const prev = arr[idx - 1]
              const showEllipsis = prev && p - prev > 1

              return (
                <React.Fragment key={p}>
                  {showEllipsis && <span style={{ padding: "0 0.25rem" }}>...</span>}
                  <button
                    type="button"
                    className={`${styles.navBtn} ${
                      safeCurrentPage === p ? styles.active : ""
                    }`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                </React.Fragment>
              )
            })}

          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
            title="Next Page"
          >
            ›
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage >= totalPages}
            title="Last Page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable

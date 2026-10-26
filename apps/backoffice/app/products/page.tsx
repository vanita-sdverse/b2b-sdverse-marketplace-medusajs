"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export interface ProductVariant {
  id: string
  title: string
  sku: string
  price: number | string
  inventory_quantity: number
  options: Record<string, string>
  status?: string
  barcode?: string
}

export interface ProductItem {
  id: string
  title: string
  handle: string
  description: string
  category: string
  seller: string
  seller_id?: string
  sku: string
  price: string
  status: "published" | "draft" | "denied"
  marketplace_status: "approved" | "pending_review" | "denied"
  denial_reason?: string | null
  thumbnail?: string
  variants: ProductVariant[]
  created_at: string
  updated_at: string
}

export default function BackofficeProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "info" } | null>(null)

  // JSON modal state
  const [activeJsonProduct, setActiveJsonProduct] = useState<ProductItem | null>(null)
  const [activeVariantsPreview, setActiveVariantsPreview] = useState<ProductItem | null>(null)

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (e) {
      console.error("Error fetching products:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle marketplace deny / approve
  const handleToggleDeny = async (product: ProductItem) => {
    const isCurrentlyDenied = product.status === "denied" || product.marketplace_status === "denied"

    if (!isCurrentlyDenied) {
      const reason = window.prompt(
        `Enter marketplace denial reason for "${product.title}":`,
        "Failed regulatory compliance / technical audit by marketplace authority."
      )
      if (reason === null) return // cancelled

      try {
        const res = await fetch(`/api/products/${product.id}/deny`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason, action: "deny" }),
        })
        if (res.ok) {
          const result = await res.json()
          setActionMessage({
            text: `Product "${product.title}" has been DENIED by marketplace.`,
            type: "info",
          })
          fetchProducts()
        }
      } catch (e) {
        alert("Failed to deny product.")
      }
    } else {
      const confirmApprove = window.confirm(`Reinstate and approve "${product.title}" back into the marketplace?`)
      if (!confirmApprove) return

      try {
        const res = await fetch(`/api/products/${product.id}/deny`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "approve" }),
        })
        if (res.ok) {
          setActionMessage({
            text: `Product "${product.title}" has been approved and published to the marketplace.`,
            type: "success",
          })
          fetchProducts()
        }
      } catch (e) {
        alert("Failed to reinstate product.")
      }
    }
  }

  // Handle Get JSON export & download
  const handleGetJson = async (product: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${product.id}/json`)
      if (res.ok) {
        const data = await res.json()
        setActiveJsonProduct(product)

        // Trigger file download
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const downloadUrl = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = `${product.handle || product.id}-export.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(downloadUrl)

        setActionMessage({
          text: `JSON specification for "${product.title}" downloaded successfully.`,
          type: "success",
        })
      }
    } catch (e) {
      alert("Failed to export product JSON.")
    }
  }

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchSku = p.sku.toLowerCase().includes(q)
      const matchSeller = p.seller.toLowerCase().includes(q)
      const matchCategory = p.category.toLowerCase().includes(q)
      const matchVariant = p.variants?.some((v) => v.sku.toLowerCase().includes(q) || v.title.toLowerCase().includes(q))
      return matchTitle || matchSku || matchSeller || matchCategory || matchVariant
    }
    return true
  })

  // Metrics
  const totalCount = products.length
  const publishedCount = products.filter((p) => p.status === "published").length
  const deniedCount = products.filter((p) => p.status === "denied" || p.marketplace_status === "denied").length
  const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0)

  // Categories list
  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className={styles.container}>
      <PageHeader
        title="Global Product Master & Marketplace Governance"
        subtitle="Manage B2B automotive product catalog, variant hierarchies, and marketplace approval status."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Products" }]}
      />

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className={`${styles.alertBanner} ${actionMessage.type === "success" ? styles.alertSuccess : styles.alertInfo}`}>
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📦</div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Total Products</span>
            <span className={styles.metricValue}>{totalCount}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ color: "#16a34a", backgroundColor: "#f0fdf4" }}>
            ✓
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Approved & Active</span>
            <span className={styles.metricValue}>{publishedCount}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ color: "#dc2626", backgroundColor: "#fef2f2" }}>
            🛡
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Denied by Marketplace</span>
            <span className={styles.metricValue}>{deniedCount}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ color: "#2563eb", backgroundColor: "#eff6ff" }}>
            🧬
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Total Linked Variants</span>
            <span className={styles.metricValue}>{totalVariants}</span>
          </div>
        </div>
      </div>

      {/* Controls & Search Filter Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search products by title, SKU, merchant, variant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filtersGroup}>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Catalog Statuses</option>
            <option value="published">Published / Approved</option>
            <option value="draft">Draft Review</option>
            <option value="denied">Denied by Marketplace</option>
          </select>

          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Information</th>
                <th>Merchant / Vendor</th>
                <th>Variant Relation</th>
                <th>Primary SKU</th>
                <th>Base Price</th>
                <th>Marketplace Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    Loading products registry and variant structures...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    No products match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isDenied = p.status === "denied" || p.marketplace_status === "denied"
                  const isPublished = p.status === "published"

                  return (
                    <tr key={p.id}>
                      {/* Product Cell */}
                      <td>
                        <div className={styles.productCell}>
                          <img
                            src={p.thumbnail || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150&auto=format&fit=crop&q=80"}
                            alt={p.title}
                            className={styles.productThumb}
                          />
                          <div className={styles.productMeta}>
                            <Link href={`/products/${p.id}/view`} className={styles.productTitle}>
                              {p.title}
                            </Link>
                            <span className={styles.productCategory}>{p.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Merchant Cell */}
                      <td>
                        <span className={styles.sellerName}>{p.seller}</span>
                      </td>

                      {/* Variant Relation Cell */}
                      <td>
                        <button
                          type="button"
                          className={styles.variantPill}
                          onClick={() => setActiveVariantsPreview(p)}
                          title="Click to inspect variant tree"
                        >
                          <span>🧬</span>
                          <span>{p.variants?.length || 0} Variants</span>
                        </button>
                      </td>

                      {/* SKU Cell */}
                      <td>
                        <span className={styles.skuCode}>{p.sku}</span>
                      </td>

                      {/* Price Cell */}
                      <td>
                        <span className={styles.priceTag}>{p.price}</span>
                      </td>

                      {/* Marketplace Status Cell */}
                      <td>
                        {isDenied ? (
                          <span className={styles.statusDenied} title={p.denial_reason || "Denied by Marketplace"}>
                            <span>🛡✕</span> Denied by Marketplace
                          </span>
                        ) : isPublished ? (
                          <span className={styles.statusPublished}>
                            <span>✓</span> Published
                          </span>
                        ) : (
                          <span className={styles.statusDraft}>
                            <span>⏳</span> Draft Review
                          </span>
                        )}
                      </td>

                      {/* Actions Group */}
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.actionsGroup} style={{ justifyContent: "flex-end" }}>
                          {/* 1. View button */}
                          <Link href={`/products/${p.id}/view`} className={`${styles.btnAction} ${styles.btnView}`}>
                            <span>👁</span> View
                          </Link>

                          {/* 2. Edit button */}
                          <Link href={`/products/${p.id}/edit`} className={`${styles.btnAction} ${styles.btnEdit}`}>
                            <span>✏️</span> Edit
                          </Link>

                          {/* 3. Deny button (Denied by Marketplace) */}
                          <button
                            type="button"
                            className={`${styles.btnAction} ${isDenied ? styles.btnApprove : styles.btnDeny}`}
                            onClick={() => handleToggleDeny(p)}
                            title={isDenied ? "Approve product back into catalog" : "Deny product by marketplace"}
                          >
                            <span>{isDenied ? "✓" : "🚫"}</span>
                            <span>{isDenied ? "Reinstate" : "Deny"}</span>
                          </button>

                          {/* 4. Get JSON button */}
                          <button
                            type="button"
                            className={`${styles.btnAction} ${styles.btnJson}`}
                            onClick={() => handleGetJson(p)}
                            title="Export and inspect complete product JSON schema"
                          >
                            <span>📋</span> Get JSON
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

      {/* Variants Preview Modal */}
      {activeVariantsPreview && (
        <div className={styles.modalOverlay} onClick={() => setActiveVariantsPreview(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Product Variants Relation ({activeVariantsPreview.title})</h3>
              <button
                onClick={() => setActiveVariantsPreview(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "1.5rem", overflowY: "auto" }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Variant ID</th>
                    <th>Variant Title</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Inventory</th>
                    <th>Options Specifications</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVariantsPreview.variants.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <span className={styles.skuCode}>{v.id}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{v.title}</td>
                      <td>
                        <span className={styles.skuCode}>{v.sku}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{typeof v.price === "number" ? `$${v.price}` : v.price}</td>
                      <td>
                        <span style={{ color: v.inventory_quantity > 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                          {v.inventory_quantity} units
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                          {Object.entries(v.options || {}).map(([key, val]) => (
                            <span
                              key={key}
                              style={{
                                fontSize: "0.75rem",
                                background: "#f1f5f9",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              <strong>{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.modalFooter}>
              <Link
                href={`/products/${activeVariantsPreview.id}/edit`}
                className={`${styles.btnAction} ${styles.btnEdit}`}
                style={{ padding: "0.5rem 1rem" }}
              >
                ✏️ Edit Variants in Product Workbench
              </Link>
              <button className={styles.btnModalClose} onClick={() => setActiveVariantsPreview(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Viewer Modal */}
      {activeJsonProduct && (
        <div className={styles.modalOverlay} onClick={() => setActiveJsonProduct(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>JSON Schema Specification: {activeJsonProduct.title}</h3>
              <button
                onClick={() => setActiveJsonProduct(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <pre className={styles.jsonCode}>
                {JSON.stringify(
                  {
                    schema_version: "sdverse.b2b.product.v1",
                    exported_at: new Date().toISOString(),
                    product: activeJsonProduct,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnModalClose}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activeJsonProduct, null, 2))
                  alert("Copied JSON payload to clipboard!")
                }}
              >
                📋 Copy JSON
              </button>
              <button className={styles.btnModalDownload} onClick={() => handleGetJson(activeJsonProduct)}>
                💾 Download .json
              </button>
              <button className={styles.btnModalClose} onClick={() => setActiveJsonProduct(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.scss"
import { ProductItem } from "../../page"

export default function ViewProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string

  const [product, setProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`, { cache: "no-store" })
      if (!res.ok) {
        setError(`Product "${productId}" not found.`)
        return
      }
      const data = await res.json()
      setProduct(data.product)
    } catch (e: any) {
      setError(e.message || "Failed to load product.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleToggleDeny = async () => {
    if (!product) return
    const isCurrentlyDenied = product.status === "denied" || product.marketplace_status === "denied"

    if (!isCurrentlyDenied) {
      const reason = window.prompt(
        `Enter marketplace denial reason for "${product.title}":`,
        product.denial_reason || "Marketplace review failed: Missing OEM safety and emissions documentation."
      )
      if (reason === null) return

      await fetch(`/api/products/${product.id}/deny`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, action: "deny" }),
      })
      fetchProduct()
    } else {
      const confirmApprove = window.confirm(`Reinstate "${product.title}" into marketplace active catalog?`)
      if (!confirmApprove) return

      await fetch(`/api/products/${product.id}/deny`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
      fetchProduct()
    }
  }

  const handleDownloadJson = async () => {
    if (!product) return
    try {
      const res = await fetch(`/api/products/${product.id}/json`)
      if (res.ok) {
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const downloadUrl = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = `${product.handle || product.id}-details.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(downloadUrl)
      }
    } catch (e) {
      alert("Failed to export JSON.")
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
          Loading product view details...
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "2rem", background: "#fef2f2", color: "#b91c1c", borderRadius: "8px" }}>
          {error || "Product could not be loaded."}
        </div>
        <Link href="/products" className={styles.backLink}>
          ← Back to Products
        </Link>
      </div>
    )
  }

  const isDenied = product.status === "denied" || product.marketplace_status === "denied"

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/products" className={styles.backLink}>
          ← Back to Products Catalog
        </Link>

        <div className={styles.topActions}>
          <button
            type="button"
            className={`${styles.btnAction} ${isDenied ? styles.btnApprove : styles.btnDeny}`}
            onClick={handleToggleDeny}
          >
            <span>{isDenied ? "✓" : "🚫"}</span>
            <span>{isDenied ? "Reinstate Product" : "Deny by Marketplace"}</span>
          </button>

          <button
            type="button"
            className={`${styles.btnAction} ${styles.btnJson}`}
            onClick={handleDownloadJson}
          >
            <span>💾</span> Get JSON Spec
          </button>

          <Link href={`/products/${product.id}/edit`} className={`${styles.btnAction} ${styles.btnEdit}`}>
            <span>✏️</span> Edit Product
          </Link>
        </div>
      </div>

      {/* Denial Alert Banner if Denied */}
      {isDenied && (
        <div className={styles.alertDenial}>
          <span style={{ fontSize: "1.5rem" }}>🛡</span>
          <div>
            <strong>DENIED BY MARKETPLACE GOVERNANCE</strong>
            <span>{product.denial_reason || "This product listing has been rejected by marketplace auditors."}</span>
          </div>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className={styles.heroCard}>
        <img
          src={product.thumbnail || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150&auto=format&fit=crop&q=80"}
          alt={product.title}
          className={styles.heroThumb}
        />
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <div>
              <span className={styles.categoryBadge}>{product.category}</span>
              <h1 className={styles.heroTitle}>{product.title}</h1>
            </div>
            <div className={styles.heroPrice}>{product.price}</div>
          </div>
          <p className={styles.heroDescription}>{product.description}</p>
        </div>
      </div>

      {/* Key Commercial & Audit Info Tiles */}
      <div className={styles.infoGrid}>
        <div className={styles.infoTile}>
          <span>Merchant Vendor</span>
          <span>{product.seller}</span>
        </div>

        <div className={styles.infoTile}>
          <span>Primary SKU</span>
          <span className={styles.skuTag}>{product.sku}</span>
        </div>

        <div className={styles.infoTile}>
          <span>Marketplace Status</span>
          <span style={{ color: isDenied ? "#dc2626" : "#16a34a" }}>
            {isDenied ? "Denied by Marketplace" : "Approved & Active"}
          </span>
        </div>

        <div className={styles.infoTile}>
          <span>Total Variants</span>
          <span>{product.variants?.length || 0} Linked Variants</span>
        </div>

        <div className={styles.infoTile}>
          <span>Created Date</span>
          <span>{new Date(product.created_at).toLocaleDateString()}</span>
        </div>

        <div className={styles.infoTile}>
          <span>Last Governance Update</span>
          <span>{new Date(product.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Product & Variant Relationship Panel */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>🧬 Product & Variant Relations ({product.variants?.length || 0})</h2>
          <Link href={`/products/${product.id}/edit`} className={styles.btnAction} style={{ background: "#f1f5f9", color: "#334155" }}>
            ✏️ Manage Variants
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Variant ID</th>
                <th>Variant Title</th>
                <th>SKU</th>
                <th>Wholesale Price</th>
                <th>Inventory Stock</th>
                <th>Specifications / Attributes</th>
              </tr>
            </thead>
            <tbody>
              {product.variants?.map((v) => (
                <tr key={v.id}>
                  <td>
                    <span className={styles.skuTag}>{v.id}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{v.title}</td>
                  <td>
                    <span className={styles.skuTag}>{v.sku}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {typeof v.price === "number" ? `$${v.price}` : v.price}
                  </td>
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
      </div>
    </div>
  )
}

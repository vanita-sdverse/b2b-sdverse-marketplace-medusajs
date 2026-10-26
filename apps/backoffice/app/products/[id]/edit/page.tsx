"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.scss"
import { ProductItem, ProductVariant } from "../../page"

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Product state
  const [title, setTitle] = useState("")
  const [handle, setHandle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [sku, setSku] = useState("")
  const [seller, setSeller] = useState("")
  const [sellerId, setSellerId] = useState("")
  const [status, setStatus] = useState<"published" | "draft" | "denied">("published")
  const [marketplaceStatus, setMarketplaceStatus] = useState<"approved" | "pending_review" | "denied">("approved")
  const [denialReason, setDenialReason] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [variants, setVariants] = useState<ProductVariant[]>([])

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`, { cache: "no-store" })
        if (!res.ok) {
          setError(`Product "${productId}" not found.`)
          setLoading(false)
          return
        }
        const data = await res.json()
        const p: ProductItem = data.product

        setTitle(p.title || "")
        setHandle(p.handle || "")
        setCategory(p.category || "")
        setPrice(p.price || "")
        setSku(p.sku || "")
        setSeller(p.seller || "")
        setSellerId(p.seller_id || "")
        setStatus(p.status || "published")
        setMarketplaceStatus(p.marketplace_status || "approved")
        setDenialReason(p.denial_reason || "")
        setDescription(p.description || "")
        setThumbnail(p.thumbnail || "")
        setVariants(p.variants || [])
      } catch (err: any) {
        setError("Failed to load product details: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  // Variant editing handlers
  const handleVariantChange = (index: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: val }
    setVariants(updated)
  }

  const handleAddVariant = () => {
    const newIndex = variants.length + 1
    const newVariant: ProductVariant = {
      id: `var_${productId}_${newIndex}_${Date.now().toString().slice(-4)}`,
      title: `Variant ${newIndex}`,
      sku: `${sku || "SKU"}-V${newIndex}`,
      price: price || "$100.00",
      inventory_quantity: 25,
      options: { "Specification": "Standard" },
      status: "active",
      barcode: "",
    }
    setVariants([...variants, newVariant])
  }

  const handleDeleteVariant = (index: number) => {
    if (variants.length <= 1) {
      alert("A product must maintain at least one variant relation.")
      return
    }
    const updated = variants.filter((_, i) => i !== index)
    setVariants(updated)
  }

  const handleAddOptionToVariant = (vIndex: number) => {
    const key = window.prompt("Option name (e.g. Voltage, Thread, Size):", "Spec")
    if (!key) return
    const val = window.prompt(`Value for "${key}":`, "Standard")
    if (!val) return

    const updated = [...variants]
    updated[vIndex].options = { ...(updated[vIndex].options || {}), [key]: val }
    setVariants(updated)
  }

  const handleDeleteOptionFromVariant = (vIndex: number, optKey: string) => {
    const updated = [...variants]
    const opts = { ...updated[vIndex].options }
    delete opts[optKey]
    updated[vIndex].options = opts
    setVariants(updated)
  }

  // Handle Save
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const payload: Partial<ProductItem> = {
        title,
        handle,
        category,
        price,
        sku,
        seller,
        seller_id: sellerId,
        status,
        marketplace_status: marketplaceStatus,
        denial_reason: (status === "denied" || marketplaceStatus === "denied") ? denialReason : null,
        description,
        thumbnail,
        variants,
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSuccessMsg("Product and variant relations updated successfully.")
        setTimeout(() => {
          router.push("/products")
        }, 1200)
      } else {
        const data = await res.json()
        setError(data.message || "Failed to save product.")
      }
    } catch (err: any) {
      setError(err.message || "Network error while saving.")
    } finally {
      setSaving(false)
    }
  }

  // Quick Deny by Marketplace toggle
  const handleQuickDeny = async () => {
    const isDenied = status === "denied" || marketplaceStatus === "denied"
    if (!isDenied) {
      const reason = window.prompt(
        "Enter marketplace denial reason:",
        denialReason || "Denied by marketplace governance for non-compliance."
      )
      if (reason === null) return
      setStatus("denied")
      setMarketplaceStatus("denied")
      setDenialReason(reason)

      await fetch(`/api/products/${productId}/deny`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, action: "deny" }),
      })
      setSuccessMsg("Product marked as DENIED by Marketplace.")
    } else {
      setStatus("published")
      setMarketplaceStatus("approved")
      setDenialReason("")

      await fetch(`/api/products/${productId}/deny`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
      setSuccessMsg("Product reinstated and approved by Marketplace.")
    }
  }

  // Download JSON spec
  const handleExportJson = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/json`)
      if (res.ok) {
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const downloadUrl = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = `${handle || productId}-spec.json`
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
          Loading product workbench for ID: {productId}...
        </div>
      </div>
    )
  }

  const isDenied = status === "denied" || marketplaceStatus === "denied"

  return (
    <form onSubmit={handleSave} className={styles.container}>
      {/* Top Bar with Backlink and Actions */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <Link href="/products" className={styles.backLink}>
            ← Back to Products
          </Link>
          <div className={styles.titleArea}>
            <h1>Edit Product: {title}</h1>
            <span>SKU: {sku} • ID: {productId}</span>
          </div>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            className={isDenied ? styles.btnTopApprove : styles.btnTopDeny}
            onClick={handleQuickDeny}
          >
            {isDenied ? "✓ Reinstate Product" : "🚫 Deny by Marketplace"}
          </button>

          <button type="button" className={styles.btnTopJson} onClick={handleExportJson}>
            💾 Export JSON
          </button>

          <button type="submit" className={styles.btnSave} disabled={saving}>
            {saving ? "Saving Changes..." : "Save Product"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className={`${styles.alertBanner} ${styles.alertError}`}>{error}</div>}
      {successMsg && <div className={`${styles.alertBanner} ${styles.alertSuccess}`}>{successMsg}</div>}

      {/* Main Grid: Left Column (Details & Variants) and Right Column (Governance & Merchant) */}
      <div className={styles.grid}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Panel 1: Master Info */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>📦 Master Product Information</h2>
              <span>Core catalog attributes</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Product Title *</label>
              <input
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.twoCols}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Handle (Slug)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <input
                  type="text"
                  className={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.twoCols}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Base Price Display</label>
                <input
                  type="text"
                  className={styles.input}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="$345.00"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Thumbnail Image URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Technical Specification & Description</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Panel 2: Product & Variant Relation Management */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>🧬 Product & Variant Relations ({variants.length} linked)</h2>
              <span>Manage SKUs, wholesale pricing tiers, and attributes</span>
            </div>

            <div className={styles.variantsContainer}>
              {variants.map((v, idx) => (
                <div key={v.id || idx} className={styles.variantCard}>
                  <div className={styles.variantCardHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className={styles.variantBadge}>Variant #{idx + 1}</span>
                      <span style={{ fontSize: "0.8125rem", color: "#64748b", fontFamily: "monospace" }}>
                        {v.id}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.btnDeleteVariant}
                      onClick={() => handleDeleteVariant(idx)}
                    >
                      Delete Variant
                    </button>
                  </div>

                  <div className={styles.twoCols}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Variant Title</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={v.title}
                        onChange={(e) => handleVariantChange(idx, "title", e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Variant SKU *</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={v.sku}
                        onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.twoCols}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Wholesale Price</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={String(v.price)}
                        onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Stock Quantity (Units)</label>
                      <input
                        type="number"
                        className={styles.input}
                        value={v.inventory_quantity}
                        onChange={(e) => handleVariantChange(idx, "inventory_quantity", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Options / Spec attributes */}
                  <div className={styles.formGroup}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <label className={styles.label}>Variant Options & Attributes</label>
                      <button
                        type="button"
                        onClick={() => handleAddOptionToVariant(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        + Add Attribute Key
                      </button>
                    </div>

                    <div className={styles.optionsChipsGrid}>
                      {Object.entries(v.options || {}).map(([optKey, optVal]) => (
                        <div key={optKey} className={styles.optionChip}>
                          <strong>{optKey}:</strong> {optVal}
                          <button
                            type="button"
                            className={styles.btnDeleteOption}
                            onClick={() => handleDeleteOptionFromVariant(idx, optKey)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className={styles.btnAddVariant} onClick={handleAddVariant}>
                <span>+</span> Add New Variant Relation
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Governance & Merchant */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Panel 3: Marketplace Governance */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>🛡 Marketplace Governance</h2>
              <span>Compliance & Review</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Catalog Status</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="published">Published & Active</option>
                <option value="draft">Draft Review</option>
                <option value="denied">Denied by Marketplace</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Marketplace Review Status</label>
              <select
                className={styles.select}
                value={marketplaceStatus}
                onChange={(e) => setMarketplaceStatus(e.target.value as any)}
              >
                <option value="approved">Approved</option>
                <option value="pending_review">Pending Review</option>
                <option value="denied">Denied</option>
              </select>
            </div>

            {(status === "denied" || marketplaceStatus === "denied") && (
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "#dc2626" }}>
                  Marketplace Denial Reason *
                </label>
                <textarea
                  className={styles.textarea}
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                  placeholder="Explain why this product has been denied by the marketplace..."
                  style={{ borderColor: "#fca5a5" }}
                />
              </div>
            )}
          </div>

          {/* Panel 4: Merchant Ownership */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>🏢 Merchant & Vendor</h2>
              <span>Seller association</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Seller Company Name</label>
              <input
                type="text"
                className={styles.input}
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Seller Company ID</label>
              <input
                type="text"
                className={styles.input}
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                placeholder="comp_..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Primary SKU</label>
              <input
                type="text"
                className={styles.input}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className={styles.stickyFooter}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.875rem", color: "#64748b" }}>Editing product:</span>
          <strong style={{ fontSize: "0.875rem", color: "#0f172a" }}>{title}</strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/products" className={styles.backLink}>
            Cancel
          </Link>
          <button type="submit" className={styles.btnSave} disabled={saving}>
            {saving ? "Saving Changes..." : "Save Product & Variants"}
          </button>
        </div>
      </div>
    </form>
  )
}

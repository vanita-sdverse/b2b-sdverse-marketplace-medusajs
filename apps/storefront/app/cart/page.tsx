import React from "react"
import Link from "next/link"
import styles from "./page.module.scss"

export default function CartPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={`container ${styles.cartContainer}`}>
        <div className={styles.breadcrumbs}>
          <span>Marketplace</span> / <span className={styles.breadcrumbCurrent}>Commercial Order & RFQ</span>
        </div>

        <h1 className={styles.title}>
          Wholesale Order / Quote Basket
        </h1>
        <p className={styles.subtitle}>
          Consolidated items ready for wholesale checkout or Request for Quotation (RFQ) negotiation.
        </p>

        {/* Empty state / placeholder layout */}
        <div className={styles.card}>
          <div className={styles.icon}>🛒</div>
          <h2 className={styles.cardTitle}>
            Your Wholesale Basket is Currently Empty
          </h2>
          <p className={styles.cardDescription}>
            Search for replacement parts, browse verified supplier catalogs, or bulk import your procurement BOM list.
          </p>
          <div className={styles.actions}>
            <Link href="/products" className={styles.primaryBtn}>
              Browse Parts Catalog
            </Link>
            <Link href="/account" className={styles.outlineBtn}>
              View Saved RFQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

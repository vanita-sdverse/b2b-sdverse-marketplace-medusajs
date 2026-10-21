import React from "react"
import styles from "./ProductCard.module.scss"

export interface ProductItem {
  id: string
  name: string
  companyName: string
  matchScore: number
  oemRef: string
  price: number
  tierPrice?: string
  seller: string
  isVerifiedSeller?: boolean
  stockStatus: "In Stock" | "Low Stock" | "Lead Time (3-5d)"
  category: string
}

export interface ProductCardProps {
  product: ProductItem
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className={styles.card}>
      <div>
        {/* Technical Product Image / Visual Placeholder Area */}
        <div className={styles.imagePlaceholder}>
          <div className={styles.matchScoreBadge}>
            {product.matchScore}
          </div>

          <span className={styles.iconPlaceholder}>
            ⚙️
          </span>
        </div>

        {/* Content details */}
        <div className={styles.content}>
          <h4 className={styles.productName}>
            {product.name}
          </h4>

          <div className={styles.sellerInfo}>
            <span>Sold by:</span>
            <span className={styles.sellerName}>{product.companyName}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className={styles.footer}>
        <button className={styles.exploreButton}>
          <span>Explore</span>
        </button>
      </div>
    </div>
  )
}

import React from "react"
import { CategoryGrid } from "../../components/CategoryGrid"
import styles from "./page.module.scss"

export default function CategoriesPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <div className={styles.breadcrumbs}>
          <span>Home</span> / <span className={styles.breadcrumbCurrent}>Categories</span>
        </div>
        <h1 className={styles.title}>
          Automotive Classification & Taxonomy
        </h1>
        <p className={styles.subtitle}>
          Browse parts and commercial equipment structured by system assemblies, fleet applications, and engineering classifications.
        </p>
      </div>
      <CategoryGrid />
    </div>
  )
}

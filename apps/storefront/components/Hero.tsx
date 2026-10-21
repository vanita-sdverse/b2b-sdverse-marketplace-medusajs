import React from "react"
import Link from "next/link"
import styles from "./Hero.module.scss"

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>
            Created by the Industry, For the Industry
          </h1>

          <p className={styles.description}>
            SDVerse is redefining how the automotive industry builds, sources, and scales software.
            As the first B2B marketplace for automotive software, we bring engineering and procurement teams together with suppliers on a single trusted platform – enabling faster discovery, better alignment, and more confident execution.
            For suppliers, SDVerse offers earlier access to engaged buyers – streamlining collaboration and shortening the sales cycle.
          </p>

          <div className={styles.actions}>
            <Link href="/products" className={styles.exploreBtn}>
              Explore &rarr;
            </Link>
          </div>

          {/* Quick Technical Metric Strip */}
          <div className={styles.metricsGrid}>
            <div>
              <div className={styles.metricValue}>150,000+</div>
              <div className={styles.metricLabel}>SKUs with verified OEM specs</div>
            </div>
            <div>
              <div className={styles.metricValue}>99.4%</div>
              <div className={styles.metricLabel}>Fitment accuracy rate</div>
            </div>
            <div>
              <div className={styles.metricValue}>2,400+</div>
              <div className={styles.metricLabel}>Vetted commercial suppliers</div>
            </div>
            <div>
              <div className={styles.metricValue}>48hr</div>
              <div className={styles.metricLabel}>Critical part dispatch dispatch</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

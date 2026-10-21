import React from "react"
import { PageHeader, Card } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function SellerAnalyticsPage() {
  const KPIS = [
    { title: "Quarter-to-Date Volume", val: "$482,900", sub: "+14.2% YoY" },
    { title: "Average Order Value (AOV)", val: "$2,840", sub: "B2B Fleet Tier" },
    { title: "Fulfillment Velocity", val: "1.4 days", sub: "Order to carrier handover" },
    { title: "Order Defect Rate (ODR)", val: "0.12%", sub: "Target < 1.0%" },
  ]

  return (
    <div>
      <PageHeader
        title="Commercial Performance Analytics"
        subtitle="Wholesale turnover trends, customer reorder rates, and fulfillment velocity metrics."
        breadcrumbs={[{ label: "Seller Hub", href: "/" }, { label: "Analytics" }]}
      />

      <div className={styles.kpiGrid}>
        {KPIS.map((kpi, i) => (
          <Card key={i} padding="md">
            <div className={styles.kpiTitle}>{kpi.title}</div>
            <div className={styles.kpiValue}>{kpi.val}</div>
            <div className={styles.kpiSub}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      <Card padding="lg">
        <h3 className={styles.chartCardTitle}>Demand Distribution by Category</h3>
        <p className={styles.chartCardSubtitle}>
          Top revenue generators across commercial accounts in the last 90 days.
        </p>

        <div className={styles.distributionList}>
          <div>
            <div className={styles.distributionHeader}>
              <span>Air Brake & Pneumatics</span>
              <span>42% ($202,818)</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFillPneumatics} />
            </div>
          </div>

          <div>
            <div className={styles.distributionHeader}>
              <span>High-Pressure Common Rail Diesel Systems</span>
              <span>31% ($149,700)</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFillDiesel} />
            </div>
          </div>

          <div>
            <div className={styles.distributionHeader}>
              <span>Commercial Steer & Drive Tyres</span>
              <span>27% ($130,382)</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFillTyres} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

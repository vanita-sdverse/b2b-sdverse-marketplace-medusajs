import React from "react"
import { PageHeader, Card, TableShell, Badge, Button } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function BackofficeDashboardPage() {
  const METRICS = [
    { title: "Total Catalog SKUs", value: "148,290", note: "Across all vendors" },
    { title: "Onboarded Sellers", value: "248", note: "12 pending audit" },
    { title: "Corporate Buyer Accounts", value: "1,420", note: "98% verified" },
    { title: "Active Wholesale Orders", value: "186", note: "Total volume $1.82M" },
    { title: "Pending Seller Approvals", value: "7", isAlert: true, note: "KYB verification required" },
    { title: "Critical Stock Alerts", value: "19", isAlert: true, note: "Zero inventory items" },
  ]

  const RECENT_ACTIVITY = [
    { type: "Seller Application", entity: "EuroDiesel Systems GmbH", time: "10 mins ago", status: "Pending Review" },
    { type: "Bulk Catalog Ingestion", entity: "Apex Euro Truck Components (420 SKUs)", time: "45 mins ago", status: "Completed" },
    { type: "Tiered Pricing Rule", entity: "Fleet Net 60 Contract #489", time: "2 hours ago", status: "Active" },
    { type: "High-Value RFQ Order", entity: "Nordic Transport Logistics ($48,200.00)", time: "3 hours ago", status: "Under Review" },
  ]

  return (
    <div>
      <PageHeader
        title="Marketplace Operations Overview"
        subtitle="Global platform governance, multi-vendor auditing, and catalog synchronization."
        actions={
          <div className={styles.headerActions}>
            <Button variant="outline" size="sm">Audit Logs</Button>
            <Button variant="secondary" size="sm">System Health</Button>
          </div>
        }
      />

      {/* Operational Metric Grid */}
      <div className={styles.metricsGrid}>
        {METRICS.map((m, idx) => (
          <Card key={idx} padding="sm">
            <div className={styles.metricTitle}>
              {m.title}
            </div>
            <div className={`${styles.metricValue} ${m.isAlert ? styles.alert : ""}`}>
              {m.value}
            </div>
            <div className={`${styles.metricNote} ${m.isAlert ? styles.alert : ""}`}>
              {m.note}
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity Table */}
      <Card padding="md">
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>
              Platform Governance Activity
            </h3>
            <p className={styles.sectionSubtitle}>
              Audited operational actions across vendors, pricing policies, and buyer accounts.
            </p>
          </div>
          <Button variant="outline" size="sm">View Audit Trail</Button>
        </div>

        <TableShell>
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Entity / Target</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ACTIVITY.map((ev, i) => (
              <tr key={i}>
                <td className={styles.eventType}>{ev.type}</td>
                <td className={styles.entity}>{ev.entity}</td>
                <td className={styles.time}>{ev.time}</td>
                <td>
                  <Badge variant={ev.status === "Completed" ? "success" : ev.status === "Active" ? "brand" : "warning"} size="sm">
                    {ev.status}
                  </Badge>
                </td>
                <td>
                  <Button variant="ghost" size="sm">Inspect</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
    </div>
  )
}

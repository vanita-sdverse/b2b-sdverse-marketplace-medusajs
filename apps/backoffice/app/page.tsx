"use client"

import React from "react"
import { PageHeader, Card, Badge, Button } from "@marketplace/shared-ui"
import { DataTable, DataTableColumn } from "../components/DataTable"
import styles from "./page.module.scss"

interface ActivityRow {
  id: string
  type: string
  entity: string
  time: string
  status: string
}

export default function BackofficeDashboardPage() {
  const METRICS = [
    { title: "Total Catalog SKUs", value: "148,290", note: "Across all vendors" },
    { title: "Onboarded Sellers", value: "248", note: "12 pending audit" },
    { title: "Corporate Buyer Accounts", value: "1,420", note: "98% verified" },
    { title: "Active Wholesale Orders", value: "186", note: "Total volume $1.82M" },
    { title: "Pending Seller Approvals", value: "7", isAlert: true, note: "KYB verification required" },
    { title: "Critical Stock Alerts", value: "19", isAlert: true, note: "Zero inventory items" },
  ]

  const RECENT_ACTIVITY: ActivityRow[] = [
    { id: "act_01", type: "Seller Application", entity: "EuroDiesel Systems GmbH", time: "10 mins ago", status: "Pending Review" },
    { id: "act_02", type: "Bulk Catalog Ingestion", entity: "Apex Euro Truck Components (420 SKUs)", time: "45 mins ago", status: "Completed" },
    { id: "act_03", type: "Tiered Pricing Rule", entity: "Fleet Net 60 Contract #489", time: "2 hours ago", status: "Active" },
    { id: "act_04", type: "High-Value RFQ Order", entity: "Nordic Transport Logistics ($48,200.00)", time: "3 hours ago", status: "Under Review" },
    { id: "act_05", type: "Role Assignment", entity: "Buyer 'procurement@nordic-transport.se' granted Product Consumer", time: "4 hours ago", status: "Completed" },
    { id: "act_06", type: "KYB Verification", entity: "Bavaria Transmissions SpA audit documentation approved", time: "5 hours ago", status: "Completed" },
  ]

  const columns: DataTableColumn<ActivityRow>[] = [
    {
      key: "type",
      header: "Event Type",
      sortable: true,
      render: (ev) => <span className={styles.eventType}>{ev.type}</span>,
    },
    {
      key: "entity",
      header: "Entity / Target",
      sortable: true,
      render: (ev) => <span className={styles.entity}>{ev.entity}</span>,
    },
    {
      key: "time",
      header: "Timestamp",
      sortable: true,
      render: (ev) => <span className={styles.time}>{ev.time}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (ev) => (
        <Badge
          variant={
            ev.status === "Completed"
              ? "success"
              : ev.status === "Active"
              ? "brand"
              : "warning"
          }
          size="sm"
        >
          {ev.status}
        </Badge>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: false,
      render: () => (
        <Button variant="ghost" size="sm">Inspect</Button>
      ),
    },
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

        <DataTable
          columns={columns}
          data={RECENT_ACTIVITY}
          keyField="id"
          searchPlaceholder="Search governance activity by event, entity, or status..."
          defaultSortKey="time"
          pageSizeOptions={[5, 10, 25]}
          defaultPageSize={5}
        />
      </Card>
    </div>
  )
}

import React from "react"
import { PageHeader, Card, TableShell, Badge, Button } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function SellerDashboardPage() {
  const METRICS = [
    { title: "Total Catalog Products", value: "1,248", change: "+12 this month", isAlert: false },
    { title: "Active Live Listings", value: "1,180", change: "94.5% active", isAlert: false },
    { title: "Open RFQs & Orders", value: "34", change: "6 pending dispatch", isAlert: false },
    { title: "Critical Inventory Alerts", value: "9", change: "Below reorder threshold", isAlert: true },
    { title: "Monthly Gross Revenue", value: "$184,200", change: "+8.4% vs last period", isAlert: false },
  ]

  const RECENT_ORDERS = [
    { id: "ORD-9901", customer: "Scania Logistics Hub", items: "12x Air Brake Valves", total: "$3,720.00", status: "Processing", date: "2026-10-01" },
    { id: "ORD-9884", customer: "MAN Truck Repair Berlin", items: "4x High Pressure Pumps", total: "$4,160.00", status: "Shipped", date: "2026-09-30" },
    { id: "ORD-9872", customer: "Nordic Fleet Solutions", items: "40x Highway Steer Tyres", total: "$18,000.00", status: "Delivered", date: "2026-09-28" },
    { id: "ORD-9850", customer: "Rotterdam Freight Depot", items: "2x Industrial Turbochargers", total: "$1,650.00", status: "Processing", date: "2026-09-27" },
  ]

  return (
    <div>
      <PageHeader
        title="Seller Merchant Dashboard"
        subtitle="Real-time commercial catalog status, wholesale orders, and inventory velocity."
        actions={
          <div className={styles.headerActions}>
            <Button variant="outline" size="sm">Export Inventory CSV</Button>
            <Button variant="primary" size="sm">+ Add New Product</Button>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className={styles.metricsGrid}>
        {METRICS.map((m, idx) => (
          <Card key={idx} padding="md">
            <div className={styles.metricTitle}>
              {m.title}
            </div>
            <div className={`${styles.metricValue} ${m.isAlert ? styles.alert : ""}`}>
              {m.value}
            </div>
            <div className={`${styles.metricChange} ${m.isAlert ? styles.alert : ""}`}>
              {m.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders Section */}
      <Card padding="md">
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Recent Commercial Orders</h3>
            <p className={styles.sectionSubtitle}>Recent purchase orders assigned to your merchant account.</p>
          </div>
          <Button variant="outline" size="sm">View All Orders &rarr;</Button>
        </div>

        <TableShell>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Organization</th>
              <th>Items Summary</th>
              <th>Total (excl. VAT)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((o) => (
              <tr key={o.id}>
                <td className={styles.orderId}>{o.id}</td>
                <td className={styles.customer}>{o.customer}</td>
                <td className={styles.itemsSummary}>{o.items}</td>
                <td className={styles.totalPrice}>{o.total}</td>
                <td>
                  <Badge variant={o.status === "Delivered" ? "success" : o.status === "Shipped" ? "brand" : "warning"} size="sm">
                    {o.status}
                  </Badge>
                </td>
                <td className={styles.orderDate}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
    </div>
  )
}

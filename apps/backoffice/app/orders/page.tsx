import React from "react"
import { PageHeader, Card, TableShell, Badge } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function BackofficeOrdersPage() {
  const ORDERS = [
    { id: "ord_01", buyer: "Nordic Transport Logistics AB", seller: "Apex Euro Truck Components", amount: "$3,720.00", status: "Processing", date: "2026-10-01" },
    { id: "ord_02", buyer: "MAN Truck Repair Berlin", seller: "EuroDiesel Systems GmbH", amount: "$4,160.00", status: "Shipped", date: "2026-09-30" },
    { id: "ord_03", buyer: "Scania Logistics Hub", seller: "Global Fleet Tyre Distribution", amount: "$18,000.00", status: "Delivered", date: "2026-09-28" },
  ]

  return (
    <div>
      <PageHeader
        title="Platform Orders & Settlements"
        subtitle="Global cross-vendor orders, payment settlement status, and commission tracking."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Orders" }]}
      />

      <Card padding="md">
        <TableShell>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Company</th>
              <th>Merchant</th>
              <th>Gross Amount</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id}>
                <td className={styles.orderId}>{o.id}</td>
                <td className={styles.buyer}>{o.buyer}</td>
                <td className={styles.seller}>{o.seller}</td>
                <td className={styles.amount}>{o.amount}</td>
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

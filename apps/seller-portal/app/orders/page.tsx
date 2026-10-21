import React from "react"
import { PageHeader, Card, TableShell, Badge, Button } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function SellerOrdersPage() {
  const ORDERS = [
    { id: "ORD-9901", buyer: "Scania Logistics Hub", lines: 3, total: "$3,720.00", paymentStatus: "Paid (Net 30)", fulfillment: "Pending Dispatch", date: "2026-10-01" },
    { id: "ORD-9884", buyer: "MAN Truck Repair Berlin", lines: 1, total: "$4,160.00", paymentStatus: "Paid (Prepaid)", fulfillment: "Dispatched", date: "2026-09-30" },
    { id: "ORD-9872", buyer: "Nordic Fleet Solutions", lines: 8, total: "$18,000.00", paymentStatus: "Invoice Issued", fulfillment: "Delivered", date: "2026-09-28" },
  ]

  return (
    <div>
      <PageHeader
        title="Purchase Orders & Dispatch"
        subtitle="Process incoming B2B purchase orders, generate packing slips, and book freight pickups."
        breadcrumbs={[{ label: "Seller Hub", href: "/" }, { label: "Orders" }]}
      />

      <Card padding="md">
        <TableShell>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Account</th>
              <th>Line Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Fulfillment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id}>
                <td className={styles.orderId}>{o.id}</td>
                <td className={styles.buyer}>{o.buyer}</td>
                <td className={styles.lines}>{o.lines} items</td>
                <td className={styles.total}>{o.total}</td>
                <td className={styles.paymentStatus}>{o.paymentStatus}</td>
                <td>
                  <Badge variant={o.fulfillment === "Delivered" ? "success" : o.fulfillment === "Dispatched" ? "brand" : "warning"} size="sm">
                    {o.fulfillment}
                  </Badge>
                </td>
                <td className={styles.orderDate}>{o.date}</td>
                <td>
                  <Button variant="outline" size="sm">Manage</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
    </div>
  )
}

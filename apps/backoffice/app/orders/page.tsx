"use client"

import React from "react"
import { PageHeader, Card, Badge } from "@marketplace/shared-ui"
import { DataTable, DataTableColumn } from "../../components/DataTable"
import styles from "./page.module.scss"

interface OrderRow {
  id: string
  buyer: string
  seller: string
  amount: string
  status: string
  date: string
}

export default function BackofficeOrdersPage() {
  const ORDERS: OrderRow[] = [
    { id: "ord_01", buyer: "Nordic Transport Logistics AB", seller: "Apex Euro Truck Components", amount: "$3,720.00", status: "Processing", date: "2026-10-01" },
    { id: "ord_02", buyer: "MAN Truck Repair Berlin", seller: "EuroDiesel Systems GmbH", amount: "$4,160.00", status: "Shipped", date: "2026-09-30" },
    { id: "ord_03", buyer: "Scania Logistics Hub", seller: "Global Fleet Tyre Distribution", amount: "$18,000.00", status: "Delivered", date: "2026-09-28" },
    { id: "ord_04", buyer: "Volvo Truck Center Goteborg", seller: "EuroDiesel Systems GmbH", amount: "$9,450.00", status: "Shipped", date: "2026-09-25" },
    { id: "ord_05", buyer: "Daimler Truck Fleet Stuttgart", seller: "Bavaria Transmissions SpA", amount: "$24,100.00", status: "Processing", date: "2026-09-22" },
    { id: "ord_06", buyer: "DAF Netherlands Workshop", seller: "Apex Euro Truck Components", amount: "$1,850.00", status: "Delivered", date: "2026-09-18" },
  ]

  const columns: DataTableColumn<OrderRow>[] = [
    {
      key: "id",
      header: "Order ID",
      sortable: true,
      render: (o) => <span className={styles.orderId}>{o.id}</span>,
    },
    {
      key: "buyer",
      header: "Buyer Company",
      sortable: true,
      render: (o) => <span className={styles.buyer}>{o.buyer}</span>,
    },
    {
      key: "seller",
      header: "Merchant",
      sortable: true,
      render: (o) => <span className={styles.seller}>{o.seller}</span>,
    },
    {
      key: "amount",
      header: "Gross Amount",
      sortable: true,
      render: (o) => <span className={styles.amount}>{o.amount}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (o) => (
        <Badge
          variant={o.status === "Delivered" ? "success" : o.status === "Shipped" ? "brand" : "warning"}
          size="sm"
        >
          {o.status}
        </Badge>
      ),
    },
    {
      key: "date",
      header: "Order Date",
      sortable: true,
      render: (o) => <span className={styles.orderDate}>{o.date}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Platform Orders & Settlements"
        subtitle="Global cross-vendor orders, payment settlement status, and commission tracking."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Orders" }]}
      />

      <Card padding="md">
        <DataTable
          columns={columns}
          data={ORDERS}
          keyField="id"
          searchPlaceholder="Search orders by buyer, merchant, ID, or status..."
          defaultSortKey="date"
          defaultSortDir="desc"
          pageSizeOptions={[5, 10, 25, 50]}
          defaultPageSize={5}
        />
      </Card>
    </div>
  )
}

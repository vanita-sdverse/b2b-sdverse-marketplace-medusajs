"use client"

import React from "react"
import { PageHeader, Card, Badge, Button } from "@marketplace/shared-ui"
import { DataTable, DataTableColumn } from "../../components/DataTable"
import styles from "./page.module.scss"

interface SellerRow {
  id: string
  name: string
  handle: string
  status: string
  catalogSize: string
  country: string
  created: string
}

export default function BackofficeSellersPage() {
  const SELLERS: SellerRow[] = [
    { id: "sel_01HPX78", name: "Apex Euro Truck Components Ltd", handle: "apex-euro-truck", status: "active", catalogSize: "1,248 SKUs", country: "United Kingdom", created: "2026-09-12" },
    { id: "sel_01HPX82", name: "EuroDiesel Systems GmbH", handle: "eurodiesel-systems", status: "active", catalogSize: "4,820 SKUs", country: "Germany", created: "2026-09-15" },
    { id: "sel_01HPX90", name: "Global Fleet Tyre Distribution", handle: "global-fleet-tyres", status: "active", catalogSize: "610 SKUs", country: "Netherlands", created: "2026-09-20" },
    { id: "sel_01HPY11", name: "Bavaria Transmissions SpA", handle: "bavaria-transmissions", status: "pending", catalogSize: "180 SKUs", country: "Italy", created: "2026-10-01" },
    { id: "sel_01HPY45", name: "Iberian Brake Hydraulics", handle: "iberian-brake", status: "suspended", catalogSize: "94 SKUs", country: "Spain", created: "2026-08-04" },
    { id: "sel_01HPZ22", name: "Nordic Axle & Chassis AB", handle: "nordic-axle", status: "active", catalogSize: "320 SKUs", country: "Sweden", created: "2026-10-05" },
  ]

  const columns: DataTableColumn<SellerRow>[] = [
    {
      key: "id",
      header: "Seller ID",
      sortable: true,
      render: (s) => <span className={styles.sellerId}>{s.id}</span>,
    },
    {
      key: "name",
      header: "Organization Name",
      sortable: true,
      render: (s) => <span className={styles.sellerName}>{s.name}</span>,
    },
    {
      key: "handle",
      header: "Unique Handle",
      sortable: true,
      render: (s) => <span className={styles.handle}>{s.handle}</span>,
    },
    {
      key: "country",
      header: "Country",
      sortable: true,
      render: (s) => <span className={styles.country}>{s.country}</span>,
    },
    {
      key: "catalogSize",
      header: "Catalog SKUs",
      sortable: true,
      render: (s) => <span className={styles.catalogSize}>{s.catalogSize}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (s) => (
        <Badge
          variant={s.status === "active" ? "success" : s.status === "pending" ? "warning" : "danger"}
          size="sm"
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: "created",
      header: "Onboarded",
      sortable: true,
      render: (s) => <span className={styles.createdDate}>{s.created}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: () => (
        <div className={styles.rowActions}>
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="outline" size="sm">Catalog</Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Marketplace Sellers Management"
        subtitle="Manage multi-vendor organizations, seller handles, status controls, and catalog boundaries."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Sellers" }]}
        actions={<Button variant="secondary" size="sm">+ Onboard New Seller</Button>}
      />

      <Card padding="md">
        <DataTable
          columns={columns}
          data={SELLERS}
          keyField="id"
          searchPlaceholder="Search sellers by organization, handle, country, status..."
          defaultSortKey="name"
          pageSizeOptions={[5, 10, 25, 50]}
          defaultPageSize={5}
        />
      </Card>
    </div>
  )
}

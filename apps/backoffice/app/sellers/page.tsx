import React from "react"
import { PageHeader, Card, TableShell, Badge, Button } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function BackofficeSellersPage() {
  const SELLERS = [
    { id: "sel_01HPX78", name: "Apex Euro Truck Components Ltd", handle: "apex-euro-truck", status: "active", catalogSize: "1,248 SKUs", country: "United Kingdom", created: "2026-09-12" },
    { id: "sel_01HPX82", name: "EuroDiesel Systems GmbH", handle: "eurodiesel-systems", status: "active", catalogSize: "4,820 SKUs", country: "Germany", created: "2026-09-15" },
    { id: "sel_01HPX90", name: "Global Fleet Tyre Distribution", handle: "global-fleet-tyres", status: "active", catalogSize: "610 SKUs", country: "Netherlands", created: "2026-09-20" },
    { id: "sel_01HPY11", name: "Bavaria Transmissions SpA", handle: "bavaria-transmissions", status: "pending", catalogSize: "180 SKUs", country: "Italy", created: "2026-10-01" },
    { id: "sel_01HPY45", name: "Iberian Brake Hydraulics", handle: "iberian-brake", status: "suspended", catalogSize: "94 SKUs", country: "Spain", created: "2026-08-04" },
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
        <TableShell>
          <thead>
            <tr>
              <th>Seller ID</th>
              <th>Organization Name</th>
              <th>Unique Handle</th>
              <th>Country</th>
              <th>Catalog SKUs</th>
              <th>Status</th>
              <th>Onboarded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SELLERS.map((s) => (
              <tr key={s.id}>
                <td className={styles.sellerId}>{s.id}</td>
                <td className={styles.sellerName}>{s.name}</td>
                <td className={styles.handle}>{s.handle}</td>
                <td className={styles.country}>{s.country}</td>
                <td className={styles.catalogSize}>{s.catalogSize}</td>
                <td>
                  <Badge variant={s.status === "active" ? "success" : s.status === "pending" ? "warning" : "danger"} size="sm">
                    {s.status}
                  </Badge>
                </td>
                <td className={styles.createdDate}>{s.created}</td>
                <td>
                  <div className={styles.rowActions}>
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Catalog</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
    </div>
  )
}

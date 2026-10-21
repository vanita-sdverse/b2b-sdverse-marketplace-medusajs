import React from "react"
import { PageHeader, Card, TableShell, Badge } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function BackofficeProductsPage() {
  const PRODUCTS = [
    { id: "prod_01", title: "Commercial Dual Circuit Air Brake Valve", seller: "Apex Euro Truck Components Ltd", sku: "KB-BRK-9902", status: "published", price: "$345.00" },
    { id: "prod_02", title: "Common Rail Diesel Fuel Injection Pump", seller: "EuroDiesel Systems GmbH", sku: "BSH-CR-0445", status: "published", price: "$1,120.00" },
    { id: "prod_03", title: "Commercial Steer Axle Tyre 315/80 R22.5", seller: "Global Fleet Tyre Distribution", sku: "MCH-TYR-31580", status: "published", price: "$485.00" },
  ]

  return (
    <div>
      <PageHeader
        title="Global Product Master"
        subtitle="Medusa commerce products registry with seller ownership mapping."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Products" }]}
      />

      <Card padding="md">
        <TableShell>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Title</th>
              <th>Merchant / Vendor</th>
              <th>SKU</th>
              <th>Base Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id}>
                <td className={styles.productId}>{p.id}</td>
                <td className={styles.title}>{p.title}</td>
                <td className={styles.seller}>{p.seller}</td>
                <td className={styles.sku}>{p.sku}</td>
                <td className={styles.price}>{p.price}</td>
                <td>
                  <Badge variant="success" size="sm">{p.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
    </div>
  )
}

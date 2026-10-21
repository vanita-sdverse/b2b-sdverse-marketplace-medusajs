import React from "react"
import { PageHeader, Card, TableShell, Badge, Button } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function SellerProductsPage() {
  const PRODUCTS = [
    { sku: "KB-BRK-9902", name: "Commercial Heavy-Duty Dual Circuit Air Brake Valve", category: "Braking", price: "$345.00", stock: 120, status: "Active" },
    { sku: "BSH-CR-0445", name: "Common Rail Diesel Fuel Injection Pump 2500 Bar", category: "Powertrain", price: "$1,120.00", stock: 45, status: "Active" },
    { sku: "ZF-PSP-7691", name: "Hydraulic Power Steering Pump 150 Bar Direct Mount", category: "Steering", price: "$420.00", stock: 14, status: "Low Stock" },
    { sku: "WAB-ABS-1002", name: "Trailer ABS Sensor & Modulator Kit 24V", category: "Electronics", price: "$280.00", stock: 0, status: "Out of Stock" },
  ]

  return (
    <div>
      <PageHeader
        title="Seller Product Catalog"
        subtitle="Manage parts, wholesale tier pricing, and technical vehicle fitments."
        breadcrumbs={[{ label: "Seller Hub", href: "/" }, { label: "Products" }]}
        actions={<Button variant="primary" size="sm">+ Create Product Listing</Button>}
      />

      <Card padding="md">
        <TableShell>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Wholesale Price</th>
              <th>Stock Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.sku}>
                <td className={styles.sku}>{p.sku}</td>
                <td className={styles.name}>{p.name}</td>
                <td className={styles.category}>{p.category}</td>
                <td className={styles.price}>{p.price}</td>
                <td className={styles.stock}>{p.stock} units</td>
                <td>
                  <Badge variant={p.status === "Active" ? "success" : p.status === "Low Stock" ? "warning" : "danger"} size="sm">
                    {p.status}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
    </div>
  )
}

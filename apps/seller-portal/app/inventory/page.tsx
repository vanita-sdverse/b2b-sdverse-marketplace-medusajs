import React from "react"
import { PageHeader, Card, TableShell, Badge, Button } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function SellerInventoryPage() {
  const INVENTORY = [
    { sku: "KB-BRK-9902", location: "Warehouse North (Gothenburg)", available: 120, reserved: 15, reorderPoint: 30, health: "Optimal" },
    { sku: "BSH-CR-0445", location: "Warehouse Central (Hamburg)", available: 45, reserved: 8, reorderPoint: 20, health: "Optimal" },
    { sku: "ZF-PSP-7691", location: "Warehouse North (Gothenburg)", available: 14, reserved: 10, reorderPoint: 25, health: "Low Stock Warning" },
    { sku: "WAB-ABS-1002", location: "Warehouse West (Rotterdam)", available: 0, reserved: 0, reorderPoint: 15, health: "Replenishment Required" },
  ]

  return (
    <div>
      <PageHeader
        title="Inventory & Stock Management"
        subtitle="Multi-depot stock allocation, warehouse levels, and automated safety thresholds."
        breadcrumbs={[{ label: "Seller Hub", href: "/" }, { label: "Inventory" }]}
        actions={<Button variant="outline" size="sm">Sync ERP Stock</Button>}
      />

      <Card padding="md">
        <TableShell>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Depot / Location</th>
              <th>Available</th>
              <th>Reserved (Orders)</th>
              <th>Reorder Point</th>
              <th>Stock Health</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {INVENTORY.map((item) => (
              <tr key={item.sku}>
                <td className={styles.sku}>{item.sku}</td>
                <td className={styles.location}>{item.location}</td>
                <td className={styles.available}>{item.available}</td>
                <td className={styles.secondaryText}>{item.reserved}</td>
                <td className={styles.secondaryText}>{item.reorderPoint}</td>
                <td>
                  <Badge variant={item.health === "Optimal" ? "success" : item.health === "Low Stock Warning" ? "warning" : "danger"} size="sm">
                    {item.health}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline" size="sm">Adjust Qty</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Card>
    </div>
  )
}

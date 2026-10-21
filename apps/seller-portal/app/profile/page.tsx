import React from "react"
import { PageHeader, Card, Button, Input } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function SellerProfilePage() {
  return (
    <div>
      <PageHeader
        title="Merchant Organization Profile"
        subtitle="Manage supplier legal identity, warehouse addresses, and commercial billing."
        breadcrumbs={[{ label: "Seller Hub", href: "/" }, { label: "Profile" }]}
        actions={<Button variant="primary" size="sm">Save Changes</Button>}
      />

      <div className={styles.profileGrid}>
        <Card padding="lg">
          <h3 className={styles.cardTitle}>
            Company Credentials
          </h3>
          <div className={styles.formFields}>
            <Input label="Legal Company Name" defaultValue="Apex Euro Truck Components Ltd" />
            <Input label="Commercial Registry / Company Number" defaultValue="UK-09928172" />
            <Input label="VAT / EORI Identification Number" defaultValue="GB992817200" />
            <Input label="Certified Quality Standard" defaultValue="IATF 16949 / ISO 9001:2015" />
          </div>
        </Card>

        <Card padding="lg">
          <h3 className={styles.cardTitle}>
            Warehouse & Logistics Dispatch
          </h3>
          <div className={styles.formFields}>
            <Input label="Primary Logistics Hub" defaultValue="Apex Logistics Terminal 04" />
            <Input label="Dispatch Street Address" defaultValue="Port Way Industrial Park, Unit 12" />
            <Input label="Postal Code & City" defaultValue="B24 8DW, Birmingham" />
            <Input label="Direct Logistics Contact Phone" defaultValue="+44 121 496 0192" />
          </div>
        </Card>
      </div>
    </div>
  )
}

import React from "react"
import { PageHeader, Card, Button, Input } from "@marketplace/shared-ui"
import styles from "./page.module.scss"

export default function BackofficeSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Marketplace Platform Settings"
        subtitle="Configure commission structures, onboarding requirements, and global currency defaults."
        breadcrumbs={[{ label: "Backoffice", href: "/" }, { label: "Settings" }]}
        actions={<Button variant="secondary" size="sm">Save Configuration</Button>}
      />

      <div className={styles.settingsGrid}>
        <Card padding="lg">
          <h3 className={styles.cardTitle}>Marketplace Commission Defaults</h3>
          <div className={styles.fieldsList}>
            <Input label="Standard Merchant Commission (%)" defaultValue="6.5" />
            <Input label="High-Volume Tier Commission (%)" defaultValue="4.0" />
            <Input label="Minimum Payout Hold Period (days)" defaultValue="14" />
          </div>
        </Card>

        <Card padding="lg">
          <h3 className={styles.cardTitle}>Regional Compliance & Currencies</h3>
          <div className={styles.fieldsList}>
            <Input label="Default Settlement Currency" defaultValue="EUR (€)" />
            <Input label="Tax Calculation Provider" defaultValue="Internal EU VAT / Medusa Tax" />
            <Input label="Automated KYB Provider" defaultValue="SumSub Enterprise" />
          </div>
        </Card>
      </div>
    </div>
  )
}

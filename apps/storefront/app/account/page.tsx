import React from "react"
import styles from "./page.module.scss"

export default function AccountPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={`container ${styles.accountContainer}`}>
        <div className={styles.breadcrumbs}>
          <span>Home</span> / <span className={styles.breadcrumbCurrent}>Corporate Account</span>
        </div>

        <h1 className={styles.title}>
          Commercial Fleet Account
        </h1>
        <p className={styles.subtitle}>
          Manage purchasing authorization, spending limits, tax exemption certificates, and corporate billing.
        </p>

        <div className={styles.layout}>
          {/* Navigation sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.navList}>
              <div className={styles.navItemActive}>
                Company Profile
              </div>
              <div className={styles.navItem}>
                Purchase Orders & RFQs
              </div>
              <div className={styles.navItem}>
                Delivery Locations
              </div>
              <div className={styles.navItem}>
                Payment Terms & Invoices
              </div>
              <div className={styles.navItem}>
                Authorized Buyers
              </div>
            </div>
          </div>

          {/* Account Details Content */}
          <div className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  Commercial Enterprise Verification
                </h2>
                <span className={styles.statusVerified}>
                  Tier-1 Fleet Buyer Status: Verified
                </span>
              </div>
              <div className={styles.termsBadge}>
                NET 60 APPROVED
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div>
                <div className={styles.infoLabel}>Company Name</div>
                <div className={styles.infoValue}>Nordic Transport Logistics AB</div>
              </div>
              <div>
                <div className={styles.infoLabel}>VAT / Tax ID</div>
                <div className={styles.infoValue}>SE556123456701</div>
              </div>
              <div>
                <div className={styles.infoLabel}>Primary Fleet Depot</div>
                <div className={styles.infoValue}>Gothenburg Logistics Park, Gate 4</div>
              </div>
              <div>
                <div className={styles.infoLabel}>Assigned Account Manager</div>
                <div className={styles.infoValue}>Enterprise Automotive Fleet Desk</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

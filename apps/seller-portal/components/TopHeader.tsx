import React from "react"
import styles from "./TopHeader.module.scss"

export const TopHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.workspaceInfo}>
        <span className={styles.workspaceLabel}>Workspace:</span>
        <span className={styles.workspaceName}>
          Commercial Parts Catalog & Warehouse 01
        </span>
      </div>

      <div className={styles.rightActions}>
        <div className={styles.syncBadge}>
          <span>●</span> Active Storefront Sync
        </div>
        <div className={styles.userInfo}>
          Fleet Admin User
        </div>
      </div>
    </header>
  )
}

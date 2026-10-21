import React from "react"
import styles from "./TopBar.module.scss"

export const TopBar: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.platformInfo}>
        <span className={styles.platformLabel}>Platform:</span>
        <span className={styles.platformName}>
          SDVERSE Automotive Marketplace
        </span>
        <span className={styles.versionBadge}>
          v2.0-b2b
        </span>
      </div>

      <div className={styles.userContainer}>
        <div className={styles.userInfo}>
          Signed in as <strong>Master Administrator</strong>
        </div>
      </div>
    </header>
  )
}

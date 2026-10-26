"use client"

import React from "react"
import styles from "./TopBar.module.scss"
import { useBackofficeAuth } from "../context/BackofficeAuthContext"

export const TopBar: React.FC = () => {
  const { user, logout } = useBackofficeAuth()

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

      <div className={styles.userContainer} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div className={styles.userInfo}>
          Signed in as <strong>{user?.name || "Master Administrator"}</strong>
        </div>
        <button
          type="button"
          onClick={logout}
          style={{
            padding: "0.25rem 0.65rem",
            fontSize: "0.75rem",
            fontWeight: 500,
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            background: "#ffffff",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>
    </header>
  )
}

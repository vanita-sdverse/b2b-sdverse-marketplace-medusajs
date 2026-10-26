"use client"

import React from "react"
import styles from "./TopHeader.module.scss"
import { useSellerAuth } from "../context/SellerAuthContext"

export const TopHeader: React.FC = () => {
  const { user, logout } = useSellerAuth()

  return (
    <header className={styles.header}>
      <div className={styles.workspaceInfo}>
        <span className={styles.workspaceLabel}>Company:</span>
        <span className={styles.workspaceName}>
          {user?.company_name || "SDVerse"}
        </span>
      </div>

      <div className={styles.rightActions}>
        <div className={styles.syncBadge}>
          <span>●</span> Active Portal Sync
        </div>
        <div className={styles.userInfo}>
          Signed in as <strong>{user?.name || "Merchant User"}</strong>
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
          Sign Out
        </button>
      </div>
    </header>
  )
}

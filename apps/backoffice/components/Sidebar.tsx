"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Sidebar.module.scss"
import { useBackofficeAuth } from "../context/BackofficeAuthContext"

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { hasRouteAccess } = useBackofficeAuth()

  const CORE_COMMERCE: NavItem[] = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Companies", href: "/companies", icon: "🏢" },
    { label: "Customers", href: "/customers", icon: "👥" },
    { label: "Admin Users", href: "/users", icon: "👤" },
    { label: "Roles & Permissions", href: "/roles", icon: "🔐" },
  ]

  const permittedCommerce = CORE_COMMERCE.filter((item) => hasRouteAccess(item.href))

  const renderSection = (title: string, items: NavItem[]) => (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>
        {title}
      </div>
      <div className={styles.itemList}>
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.itemLink} ${isActive ? styles.active : ""}`}
            >
              <div className={styles.itemContent}>
                <span className={styles.itemIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {"badge" in item && (
                <span className={styles.badge}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <aside className={styles.sidebar}>
      <div>
        {/* Brand identity */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>
            <span className={styles.brandLogoText}>BO</span>
          </div>
          <div>
            <div className={styles.brandTitle}>Backoffice Admin</div>
            <div className={styles.brandSubtitle}>Marketplace Governance</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {renderSection("Commerce Operations", permittedCommerce)}
        </nav>
      </div>

      <div className={styles.footer}>
        <div>Medusa 2.0 Engine Active</div>
        <div className={styles.environment}>Environment: local-docker</div>
      </div>
    </aside>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Sidebar.module.scss"

export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Products", href: "/products", icon: "📦" },
    { label: "Inventory", href: "/inventory", icon: "📋" },
    { label: "Orders", href: "/orders", icon: "🚚" },
    { label: "Analytics", href: "/analytics", icon: "📈" },
    { label: "Profile", href: "/profile", icon: "🏢" },
  ]

  return (
    <aside className={styles.sidebar}>
      <div>
        {/* Brand identity */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>
            <span className={styles.brandLogoText}>SP</span>
          </div>
          <div>
            <div className={styles.brandTitle}>Seller Portal</div>
            <div className={styles.brandSubtitle}>SDVERSE Merchant Hub</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Seller info footer */}
      <div className={styles.footer}>
        <div className={styles.sellerName}>Apex Euro Truck Components</div>
        <div className={styles.sellerId}>Seller ID: sel_01HPX78</div>
        <div className={styles.verifiedTag}>
          <span className={styles.verifiedDot} />
          Verified Merchant
        </div>
      </div>
    </aside>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Sidebar.module.scss"
import { useSellerAuth } from "../context/SellerAuthContext"

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { user, hasRouteAccess } = useSellerAuth()

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Products", href: "/products", icon: "📦" },
    { label: "Inventory", href: "/inventory", icon: "📋" },
    { label: "Orders", href: "/orders", icon: "🚚" },
    { label: "Analytics", href: "/analytics", icon: "📈" },
    { label: "Profile", href: "/profile", icon: "🏢" },
  ]

  // Filter NAV_ITEMS to only display permitted routes
  const permittedNavItems = NAV_ITEMS.filter((item) => hasRouteAccess(item.href))

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

        {/* Navigation links - Only showing permitted routes */}
        <nav className={styles.nav}>
          {permittedNavItems.map((item) => {
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

      {/* Seller info footer with company & role info */}
      <div className={styles.footer}>
        <div className={styles.sellerName}>{user?.company_name || "SDVerse"}</div>
        <div className={styles.sellerId} title={user?.role_name || "Role"}>
          {user?.role_name || "Merchant User"}
        </div>
        <div className={styles.verifiedTag}>
          <span className={styles.verifiedDot} />
          Verified Merchant
        </div>
      </div>
    </aside>
  )
}

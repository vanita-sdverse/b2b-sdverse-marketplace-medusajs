"use client"

import React, { useState } from "react"
import Link from "next/link"
import styles from "./Header.module.scss"

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      {/* Top B2B utility bar */}
      <div className={styles.utilityBar}>
        <div className={`container ${styles.utilityContainer}`}>
            <div className={styles.utilityLinks}>
              <span className={styles.statusIndicator}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>100% INDEPENDENT</span>
              </span>
              <span className={styles.statusIndicator}>
                <span>STANDARD-AGNOSTIC</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </div>
            <div className={styles.utilityLinks}>
                <a href="http://seller.marketplace.local" className={styles.sellerPill} target={"_blank"}>
                    <span>Seller Portal</span>
                    <span>&rarr;</span>
                </a>
            </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className={`container ${styles.mainNav}`}>
        {/* Brand Logo */}
        <Link href="/" className={styles.brandLogo}>
          <div className={styles.brandBadge}>
            <span className={styles.brandBadgeText}>SD</span>
          </div>
          <div className={styles.brandTextContainer}>
            <div className={styles.brandName}>
              SDVERSE <span className={styles.brandTag}>B2B</span>
            </div>
            <div className={styles.brandSub}>Automotive Marketplace</div>
          </div>
        </Link>

        {/* Desktop Search bar */}
        <div className={styles.desktopSearch}>
          <div className={styles.searchBox}>
            <div className={styles.searchIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search parts by SKU, OEM number, or vehicle model..."
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>Search</button>
          </div>
        </div>

        {/* Quick Actions & Navigation */}
        <div className={styles.quickActions}>
          <div className={styles.desktopNavLinks}>
            <Link href="/products" className={styles.navLink}>
              Catalog
            </Link>
            <Link href="/categories" className={styles.navLink}>
              Categories
            </Link>
            <Link href="/account" className={styles.navLink}>
              Account
            </Link>
          </div>

          <Link href="/cart" className={styles.cartButton}>
            <span className={styles.cartIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </span>
            <span>Quote / Cart</span>
            <span className={styles.cartCount}>0</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuBtn}
            aria-label="Toggle menu"
          >
            <span>{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.mobileDrawerContent}>
            <div className={styles.mobileSearchBox}>
              <input
                type="text"
                placeholder="Search parts by SKU, OEM, or VIN..."
                className={styles.mobileSearchInput}
              />
              <button className={styles.mobileSearchBtn}>Search</button>
            </div>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className={styles.mobileDrawerLink}>
              <span>All Products & Parts Catalog</span>
              <span className={styles.mobileArrow}>&rarr;</span>
            </Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className={styles.mobileDrawerLink}>
              <span>System Categories & Taxonomy</span>
              <span className={styles.mobileArrow}>&rarr;</span>
            </Link>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className={styles.mobileDrawerLink}>
              <span>RFQ & Commercial Cart</span>
              <span className={styles.mobileArrow}>&rarr;</span>
            </Link>
            <Link href="/account" onClick={() => setMobileMenuOpen(false)} className={styles.mobileDrawerLink}>
              <span>Commercial Fleet Account</span>
              <span className={styles.mobileArrow}>&rarr;</span>
            </Link>
            <a href="http://seller.marketplace.local" className={styles.mobileSellerCard}>
              <span className={styles.mobileSellerText}>Seller Merchant Portal Login</span>
              <span className={styles.mobileSellerText}>&rarr;</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

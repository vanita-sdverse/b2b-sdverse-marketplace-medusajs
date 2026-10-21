import React from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./Footer.module.scss"

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.grid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <Image
                src="/sdverse_logo.png"
                alt="SDVERSE Automotive Marketplace"
                width={160}
                height={32}
                priority
                className={styles.logoImage}
              />
            </div>
            <p className={styles.brandDescription}>
              The digital wholesale marketplace for precision automotive parts, commercial fleet components, and industrial vehicle equipment.
            </p>
            <div className={styles.brandMeta}>
              <p className={styles.brandMetaText}>Wholesale Automotive B2B Network</p>
              <p className={styles.brandMetaText}>ISO 9001 / IATF 16949 Audited Vendors</p>
            </div>
          </div>

          {/* Catalog & Systems Col */}
          <div>
            <h4 className={styles.sectionTitle}>Catalog & Systems</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/products?category=powertrain-parts">Powertrain & Engine</Link>
              </li>
              <li>
                <Link href="/products?category=braking-systems">Braking & Suspension</Link>
              </li>
              <li>
                <Link href="/products?category=commercial-tyres">Commercial Tyres & Rims</Link>
              </li>
              <li>
                <Link href="/products?category=fleet-electronics">Fleet Electronics & ECUs</Link>
              </li>
              <li>
                <Link href="/categories">All Component Categories &rarr;</Link>
              </li>
            </ul>
          </div>

          {/* Procurement & Fleet Col */}
          <div>
            <h4 className={styles.sectionTitle}>Procurement & Fleet</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/cart">Request for Quotation (RFQ)</Link>
              </li>
              <li>
                <Link href="/account">Commercial Net 30/60 Terms</Link>
              </li>
              <li>
                <Link href="/account">Corporate Fleet Accounts</Link>
              </li>
              <li>
                <Link href="/products">Consolidated Freight Logistics</Link>
              </li>
              <li>
                <Link href="/account">Tax Exemption Certificates</Link>
              </li>
            </ul>
          </div>

          {/* Portals & Governance Col */}
          <div>
            <h4 className={styles.sectionTitle}>Portals & Governance</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="http://seller.marketplace.local" target="_blank" rel="noreferrer" className={styles.sellerPortalLink}>
                  <span>Seller Portal Login</span>
                  <span>&rarr;</span>
                </a>
              </li>
              <li>
                <a href="http://admin.marketplace.local" target="_blank" rel="noreferrer">
                  Backoffice Admin Portal
                </a>
              </li>
              <li>
                <a href="http://api.marketplace.local" target="_blank" rel="noreferrer">
                  Medusa Commerce Engine
                </a>
              </li>
              <li>
                <Link href="/terms">Terms of Commercial Supply</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy & Data Governance</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; 2026 SDVERSE Automotive Marketplace Inc. All rights reserved. Built with MedusaJS 2.0.
          </div>
          <div className={styles.trustList}>
            <div className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.trustIcon}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Security Verified</span>
            </div>
            <div className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.trustIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>PCI-DSS Compliant</span>
            </div>
            <div className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgb(255, 244, 81)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.trustIcon}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Enterprise SLA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

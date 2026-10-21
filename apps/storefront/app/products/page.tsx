import React from "react"
import { ProductCard, ProductItem } from "../../components/ProductCard"
import styles from "./page.module.scss"

const PRODUCTS_DATA: ProductItem[] = [
  {
    id: "prod-1",
    name: "Commercial Heavy-Duty Dual Circuit Air Brake Valve",
    companyName: "Knorr-Bremse OEM",
    matchScore: 100,
    oemRef: "A0044296444",
    price: 345.0,
    tierPrice: "$310.00 / unit (10+ units)",
    seller: "Apex Euro Truck Components",
    isVerifiedSeller: true,
    stockStatus: "In Stock",
    category: "braking-systems",
  },
  {
    id: "prod-2",
    name: "Common Rail Diesel Fuel Injection Pump 2500 Bar",
    companyName: "Bosch Industrial",
    matchScore: 90,
    oemRef: "0445020175",
    price: 1120.0,
    tierPrice: "$1,040.00 / unit (5+ units)",
    seller: "EuroDiesel Systems GmbH",
    isVerifiedSeller: true,
    stockStatus: "In Stock",
    category: "powertrain-parts",
  },
  {
    id: "prod-3",
    name: "Commercial Long-Haul Steer Axle Tyre 315/80 R22.5",
    companyName: "Michelin X-Line",
    matchScore: 80,
    oemRef: "TYR-80219",
    price: 485.0,
    tierPrice: "$450.00 / unit (20+ units)",
    seller: "Global Fleet Tyre Distribution",
    isVerifiedSeller: true,
    stockStatus: "In Stock",
    category: "commercial-tyres",
  },
  {
    id: "prod-4",
    name: "Variable Geometry Turbocharger with Electronic Actuator",
    companyName: "Garrett Motion",
    matchScore: 70,
    oemRef: "822088-5001S",
    price: 890.0,
    tierPrice: "$825.00 / unit (4+ units)",
    seller: "Turbocharger Direct UK",
    isVerifiedSeller: true,
    stockStatus: "Lead Time (3-5d)",
    category: "powertrain-parts",
  },
  {
    id: "prod-5",
    name: "Heavy Vehicle Electronic Control Module (ECM / ECU)",
    companyName: "Continental Automotive",
    matchScore: 60,
    oemRef: "5WK92019",
    price: 1450.0,
    tierPrice: "$1,380.00 / unit (3+ units)",
    seller: "AutoElec Diagnostics Europe",
    isVerifiedSeller: true,
    stockStatus: "In Stock",
    category: "fleet-electronics",
  },
  {
    id: "prod-6",
    name: "Hydraulic Power Steering Pump 150 Bar Direct Mount",
    companyName: "ZF Aftermarket",
    matchScore: 40,
    oemRef: "7691955142",
    price: 420.0,
    tierPrice: "$390.00 / unit (6+ units)",
    seller: "Apex Euro Truck Components",
    isVerifiedSeller: true,
    stockStatus: "Low Stock",
    category: "braking-systems",
  },
]

export default function ProductsPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        {/* Header Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <span>Home</span> / <span className={styles.breadcrumbCurrent}>Wholesale Catalog</span>
        </div>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Automotive Parts & Vehicle Catalog</h1>
            <p className={styles.subtitle}>
              Showing {PRODUCTS_DATA.length} verified commercial components available for wholesale ordering.
            </p>
          </div>
        </div>

        {/* Layout: Sidebar Filter & Products Grid */}
        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <h3 className={styles.filterHeading}>Filter By Specification</h3>

            {/* Category filter */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>System Category</div>
              <div className={styles.filterOptionsList}>
                <label className={styles.filterLabel}>
                  <input type="checkbox" defaultChecked /> Powertrain & Engine
                </label>
                <label className={styles.filterLabel}>
                  <input type="checkbox" defaultChecked /> Braking & Suspension
                </label>
                <label className={styles.filterLabel}>
                  <input type="checkbox" defaultChecked /> Commercial Tyres
                </label>
                <label className={styles.filterLabel}>
                  <input type="checkbox" /> Fleet Electronics & ECUs
                </label>
              </div>
            </div>

            {/* Availability */}
            <div className={styles.filterDivider}>
              <div className={styles.filterGroupTitle}>Availability</div>
              <div className={styles.filterOptionsList}>
                <label className={styles.filterLabel}>
                  <input type="radio" name="stock" defaultChecked /> All Active Stock
                </label>
                <label className={styles.filterLabel}>
                  <input type="radio" name="stock" /> Ready for Immediate Dispatch
                </label>
              </div>
            </div>

            {/* Supplier Grade */}
            <div className={styles.filterDividerLast}>
              <div className={styles.filterGroupTitle}>Vendor Tier</div>
              <div className={styles.filterOptionsList}>
                <label className={styles.filterLabel}>
                  <input type="checkbox" defaultChecked /> Verified OEM / Tier-1
                </label>
                <label className={styles.filterLabel}>
                  <input type="checkbox" /> Certified Remanufacturer
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main>
            <div className={styles.productsGrid}>
              {PRODUCTS_DATA.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

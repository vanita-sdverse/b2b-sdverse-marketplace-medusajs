"use client"

import React from "react"
import Link from "next/link"
import { ProductCard, ProductItem } from "./ProductCard"
import styles from "./ProductCollectionSection.module.scss"

const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    name: "Commercial Heavy-Duty Dual Circuit Air Brake Valve",
    companyName: "Knorr-Bremse OEM",
    matchScore: 96,
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
    matchScore: 80,
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
    matchScore: 75,
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
    matchScore: 60,
    oemRef: "822088-5001S",
    price: 890.0,
    tierPrice: "$825.00 / unit (4+ units)",
    seller: "Turbocharger Direct UK",
    isVerifiedSeller: true,
    stockStatus: "Lead Time (3-5d)",
    category: "powertrain-parts",
  },
]

interface ProductCollectionSectionProps {
  title?: string
}

export const ProductCollectionSection: React.FC<ProductCollectionSectionProps> = ({ title = "Featured Products" }) => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{title}</h2>
          </div>

          <Link href="/products" className={styles.viewAll}>
            View All &rarr;
          </Link>
        </div>

        <div className={styles.grid}>
          {SAMPLE_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

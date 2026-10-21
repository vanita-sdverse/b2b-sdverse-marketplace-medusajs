import React from "react"
import Link from "next/link"
import styles from "./CategoryGrid.module.scss"

export interface CategoryItem {
  id: string
  name: string
  description: string
  count: string
  icon?: string
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "onboard-software",
    name: "Onboard Software",
    description: "Light utility vans, heavy-duty cargo trucks, and chassis cabs",
    count: "420 models",
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17"></path></svg>',
  },
  {
    id: "offboard-software",
    name: "Offboard Software",
    description: "Diesel fuel injection, turbochargers, cylinder heads, gearboxes",
    count: "42,000+ SKUs",
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"></path></svg>',
  },
  {
    id: "tools",
    name: "Tools",
    description: "Pneumatic air brake valves, ceramic rotors, calipers, steering arms",
    count: "28,500+ SKUs",
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path></svg>',
  },
  {
    id: "services",
    name: "Services",
    description: "Long-haul highway tyres, off-road treads, alloy fleet rims",
    count: "6,100+ items",
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path></svg>',
  },
]

export const CategoryGrid: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Browse By Categories</h2>
          </div>
          <Link href="/categories" className={styles.viewAll}>
            View All &rarr;
          </Link>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className={styles.card}
            >
              <div>
                <div className={styles.iconWrapper}>
                  {cat.icon && (
                    <span dangerouslySetInnerHTML={{ __html: cat.icon }} />
                  )}
                </div>
                <h3 className={styles.categoryName}>{cat.name}</h3>
              </div>

              <div className={styles.footer}>
                <span className={styles.browseLink}>Browse &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

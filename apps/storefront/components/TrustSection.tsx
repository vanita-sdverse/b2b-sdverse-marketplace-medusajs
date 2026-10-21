import React from "react"
import styles from "./TrustSection.module.scss"

export const TrustSection: React.FC = () => {
  const PILLARS = [
    {
      icon: "🛡️",
      title: "Audited & Verified Suppliers",
      desc: "Every manufacturer and distributor undergoes strict verification for ISO 9001/IATF standards and supply chain provenance.",
    },
    {
      icon: "📐",
      title: "Direct VIN & OEM Validation",
      desc: "Integrated catalog compatibility algorithms cross-reference genuine factory schematics to prevent incorrect order dispatch.",
    },
    {
      icon: "💼",
      title: "Commercial Terms & Net 30/60",
      desc: "Automated RFQ negotiations, volume-tiered discounts, and flexible corporate credit lines for registered fleet accounts.",
    },
    {
      icon: "🚚",
      title: "Consolidated Freight Logistics",
      desc: "Multi-vendor order consolidation, hazardous material handling (ADR certified), and express pallet delivery.",
    },
  ]

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <div className={styles.eyebrow}>
            Enterprise B2B Reliability
          </div>
          <h2 className={styles.title}>
            Engineered For Industrial Fleet Operations
          </h2>
          <p className={styles.subtitle}>
            The dependability, compliance, and speed demanded by commercial transport operators, tier-1 workshops, and corporate fleet managers.
          </p>
        </div>

        <div className={styles.grid}>
          {PILLARS.map((pillar, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.iconWrapper}>
                {pillar.icon}
              </div>
              <h3 className={styles.cardTitle}>{pillar.title}</h3>
              <p className={styles.cardDescription}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

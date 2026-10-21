import React from "react"
import styles from "./PageHeader.module.scss"

export interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
}: PageHeaderProps): React.ReactElement => {
  return (
    <div className={styles.container}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className={styles.breadcrumbLink}>
                  {crumb.label}
                </a>
              ) : (
                <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  )
}

import React from "react"
import styles from "./TableShell.module.scss"

export interface TableShellProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode
  striped?: boolean
}

export const TableShell = ({
  children,
  striped = false,
  className = "",
  ...props
}: TableShellProps): React.ReactElement => {
  const tableClasses = [
    styles.table,
    striped ? styles.striped : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={styles.container}>
      <table className={tableClasses} {...props}>
        {children}
      </table>
    </div>
  )
}

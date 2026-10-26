import React from "react"
import styles from "./Badge.module.scss"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "brand"
  size?: "sm" | "md"
}

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps): React.ReactElement => {
  const classes = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}

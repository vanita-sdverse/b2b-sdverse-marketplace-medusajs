import React from "react"
import styles from "./Card.module.scss"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg"
  bordered?: boolean
}

export const Card = ({
  children,
  padding = "md",
  bordered = true,
  className = "",
  ...props
}: CardProps): React.ReactElement => {
  const classes = [
    styles.card,
    bordered ? styles.bordered : "",
    styles[`padding-${padding}`],
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

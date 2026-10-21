import React from "react"
import styles from "./Button.module.scss"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps): React.ReactElement => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    isLoading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading && <span className={styles.spinner} />}
      {children}
    </button>
  )
}

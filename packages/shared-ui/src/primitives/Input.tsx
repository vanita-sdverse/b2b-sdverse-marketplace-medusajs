import React from "react"
import styles from "./Input.module.scss"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

    const inputClasses = [
      styles.input,
      error ? styles.hasError : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error ? (
          <span className={styles.errorMessage}>{error}</span>
        ) : helperText ? (
          <span className={styles.helperMessage}>{helperText}</span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = "Input"

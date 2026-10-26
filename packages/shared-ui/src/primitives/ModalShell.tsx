import React from "react"
import styles from "./ModalShell.module.scss"

export interface ModalShellProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "wide"
  className?: string
}

export const ModalShell = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}: ModalShellProps): React.ReactElement | null => {
  if (!isOpen) return null

  const sizeClass = size === "wide"
    ? styles.sizeWide
    : size === "lg"
    ? styles.sizeLg
    : size === "sm"
    ? styles.sizeSm
    : styles.sizeMd

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.modal} ${sizeClass} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

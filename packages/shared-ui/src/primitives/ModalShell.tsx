import React from "react"
import styles from "./ModalShell.module.scss"

export interface ModalShellProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export const ModalShell = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalShellProps): React.ReactElement | null => {
  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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

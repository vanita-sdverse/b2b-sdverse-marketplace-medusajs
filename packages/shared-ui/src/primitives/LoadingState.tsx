import React from "react"
import styles from "./LoadingState.module.scss"

export interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps): React.ReactElement => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <span className={styles.message}>{message}</span>
    </div>
  )
}

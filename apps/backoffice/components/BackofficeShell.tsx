"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BackofficeAuthProvider, useBackofficeAuth } from "../context/BackofficeAuthContext"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import styles from "../app/layout.module.scss"

const BackofficeContentGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const { user, loading, hasRouteAccess } = useBackofficeAuth()

  // 1. Login page gets full viewport without sidebar/topbar
  if (pathname === "/login") {
    return <>{children}</>
  }

  // 2. Loading state while verifying admin session
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#64748b" }}>
        Verifying Backoffice Admin Authorization...
      </div>
    )
  }

  // 3. If unauthenticated, provider handles redirect
  if (!user) {
    return null
  }

  // 4. Check route access permission
  const isAllowed = hasRouteAccess(pathname)

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <main className={styles.content}>
          {isAllowed ? (
            children
          ) : (
            <div
              style={{
                maxWidth: "600px",
                margin: "4rem auto",
                padding: "2.5rem",
                background: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #fee2e2",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
              <h2 style={{ fontSize: "1.25rem", color: "#991b1b", marginBottom: "0.5rem" }}>
                Route Access Denied
              </h2>
              <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: "1.5", marginBottom: "1rem" }}>
                Your administrative role (<strong>{user.role}</strong>) does not have permission to view{" "}
                <code style={{ background: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: "4px", color: "#b91c1c" }}>
                  {pathname}
                </code>
                .
              </p>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "6px", fontSize: "0.75rem", color: "#64748b", marginBottom: "1.5rem" }}>
                Permitted Routes: <strong>{user.routes.join(", ") || "None"}</strong>
              </div>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1.25rem",
                  background: "#0f172a",
                  color: "#ffffff",
                  borderRadius: "6px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                ‹ Return to Dashboard
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export const BackofficeShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BackofficeAuthProvider>
      <BackofficeContentGuard>{children}</BackofficeContentGuard>
    </BackofficeAuthProvider>
  )
}

import type { Metadata } from "next"
import "../styles/globals.scss"
import styles from "./layout.module.scss"
import { Sidebar } from "../components/Sidebar"
import { TopHeader } from "../components/TopHeader"

export const metadata: Metadata = {
  title: "Seller Portal | SDVERSE Marketplace",
  description: "Operations and catalog management portal for verified automotive sellers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.layout}>
          <Sidebar />
          <div className={styles.main}>
            <TopHeader />
            <main className={styles.content}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import "../styles/globals.scss"
import styles from "./layout.module.scss"
import { Sidebar } from "../components/Sidebar"
import { TopBar } from "../components/TopBar"

export const metadata: Metadata = {
  title: "Backoffice Admin | SDVERSE B2B Marketplace",
  description: "Enterprise administration portal for platform operators.",
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
            <TopBar />
            <main className={styles.content}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

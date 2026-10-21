import type { Metadata } from "next"
import "../styles/globals.scss"
import styles from "./layout.module.scss"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"

export const metadata: Metadata = {
  title: "SDVERSE B2B | Automotive Marketplace & Commercial Fleet Wholesale",
  description: "Wholesale platform for precision automotive parts, commercial fleet vehicles, tyres, and industrial equipment.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

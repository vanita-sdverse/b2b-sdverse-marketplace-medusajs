import type { Metadata } from "next"
import "../styles/globals.scss"
import styles from "./layout.module.scss"
import { BackofficeShell } from "../components/BackofficeShell"

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
        <BackofficeShell>{children}</BackofficeShell>
      </body>
    </html>
  )
}

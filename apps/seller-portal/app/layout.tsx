import type { Metadata } from "next"
import "../styles/globals.scss"
import styles from "./layout.module.scss"
import { SellerPortalShell } from "../components/SellerPortalShell"

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
        <SellerPortalShell>{children}</SellerPortalShell>
      </body>
    </html>
  )
}

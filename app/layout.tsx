import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import { AuthProvider } from "@/lib/auth"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "FarmaProof - Private, Secure, Verified Medicine Access",
  description: "Zero-knowledge verification of prescription purchases on Midnight (Cardano)",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#6366f1", // Updated to match new primary blue color
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth"
import { MidnightProvider } from "@/components/providers/midnight-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FarmaProof - Private, Secure, Verified Medicine Access",
  description: "Zero-knowledge verification of prescription purchases on Midnight (Cardano)",
  generator: "v0.app",
  manifest: "/manifest.json",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#34d399", // Updated to emerald green primary color
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <MidnightProvider>
          <AuthProvider>{children}</AuthProvider>
        </MidnightProvider>
      </body>
    </html>
  )
}

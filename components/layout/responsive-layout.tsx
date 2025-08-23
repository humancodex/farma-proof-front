"use client"

import type React from "react"

import { useState } from "react"
import { DesktopSidebar } from "./desktop-sidebar"
import { DesktopHeader } from "./desktop-header"
import { BottomNavigation } from "./bottom-navigation"
import { TopHeader } from "./top-header"
import { FloatingCTA } from "./floating-cta"
import { useAuth } from "@/lib/auth"
import type { Language } from "@/lib/i18n"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  language: Language
  onLanguageChange: (lang: Language) => void
  onFloatingCTAClick: () => void
}

export function ResponsiveLayout({
  children,
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  onFloatingCTAClick,
}: ResponsiveLayoutProps) {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopSidebar activeTab={activeTab} onTabChange={onTabChange} language={language} />
        <DesktopHeader language={language} onLanguageChange={onLanguageChange} />
        <main className="lg:pl-64 pt-0">
          <div className="px-6 py-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <TopHeader language={language} onLanguageChange={onLanguageChange} />
        <main className="pb-20">
          <div className="px-4 py-6">{children}</div>
        </main>
        <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
        <FloatingCTA onClick={onFloatingCTAClick} />
      </div>
    </div>
  )
}

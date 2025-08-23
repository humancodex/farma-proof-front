"use client"

import { Globe, Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoleSwitcher } from "@/components/auth/role-switcher"
import { useTranslation, type Language } from "@/lib/i18n"
import { useAuth } from "@/lib/auth"

interface DesktopHeaderProps {
  language: Language
  onLanguageChange: (lang: Language) => void
  onMenuToggle?: () => void
}

export function DesktopHeader({ language, onLanguageChange, onMenuToggle }: DesktopHeaderProps) {
  const { t } = useTranslation(language)
  const { user } = useAuth()

  return (
    <header className="lg:pl-64 bg-background border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" onClick={onMenuToggle} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar - Desktop Only */}
        <div className="hidden lg:flex lg:flex-1 lg:max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("common.search")} className="pl-10 bg-muted/50 border-0 focus-visible:ring-1" />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Stats - Desktop Only */}
          {user && (
            <div className="hidden xl:flex items-center gap-6 mr-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-xs text-muted-foreground">{t("common.today")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">156</p>
                <p className="text-xs text-muted-foreground">{t("common.total")}</p>
              </div>
            </div>
          )}

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === "en" ? "es" : "en")}
            className="h-9 w-9 p-0"
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* Role Switcher */}
          <RoleSwitcher language={language} />
        </div>
      </div>
    </header>
  )
}

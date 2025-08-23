"use client"

import { Shield, Globe, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RoleSwitcher } from "@/components/auth/role-switcher"
import { useTranslation, type Language } from "@/lib/i18n"

interface TopHeaderProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function TopHeader({ language, onLanguageChange }: TopHeaderProps) {
  const { t } = useTranslation(language)

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 w-full">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-lg text-foreground truncate">{t("app.name")}</h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === "en" ? "es" : "en")}
            className="h-8 w-8 p-0"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          <RoleSwitcher language={language} />
        </div>
      </div>
    </header>
  )
}

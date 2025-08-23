"use client"

import { Home, Wallet, ShoppingBag, User, Scan, FileText, BarChart3, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { useTranslation, type Language } from "@/lib/i18n"

interface DesktopSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  language: Language
}

export function DesktopSidebar({ activeTab, onTabChange, language }: DesktopSidebarProps) {
  const { user } = useAuth()
  const { t } = useTranslation(language)

  if (!user) return null

  const getTabsForRole = () => {
    switch (user.role) {
      case "patient":
        return [
          { id: "home", label: t("nav.home"), icon: Home },
          { id: "wallet", label: t("nav.wallet"), icon: Wallet },
          { id: "orders", label: t("nav.orders"), icon: ShoppingBag },
          { id: "profile", label: t("nav.profile"), icon: User },
        ]
      case "doctor":
        return [
          { id: "home", label: t("nav.home"), icon: Home },
          { id: "prescriptions", label: t("nav.prescriptions"), icon: FileText },
          { id: "patients", label: t("nav.patients"), icon: User },
          { id: "profile", label: t("nav.profile"), icon: User },
        ]
      case "pharmacy":
        return [
          { id: "home", label: t("nav.home"), icon: Home },
          { id: "scan", label: t("nav.scan"), icon: Scan },
          { id: "inventory", label: t("nav.inventory"), icon: ShoppingBag },
          { id: "profile", label: t("nav.profile"), icon: User },
        ]
      case "auditor":
        return [
          { id: "home", label: t("nav.dashboard"), icon: Home },
          { id: "analytics", label: t("nav.analytics"), icon: BarChart3 },
          { id: "reports", label: t("nav.reports"), icon: FileText },
          { id: "profile", label: t("nav.profile"), icon: User },
        ]
      case "admin":
        return [
          { id: "home", label: t("nav.dashboard"), icon: Home },
          { id: "users", label: t("nav.users"), icon: User },
          { id: "system", label: t("nav.system"), icon: Settings },
          { id: "profile", label: t("nav.profile"), icon: User },
        ]
      default:
        return []
    }
  }

  const tabs = getTabsForRole()

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="relative">
          <Shield className="h-10 w-10 text-primary" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-sidebar-foreground">{t("app.name")}</h1>
          <p className="text-sm text-sidebar-foreground/70 capitalize">
            {user.role} {t("common.dashboard")}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full justify-start gap-3 px-4 py-3 h-auto text-left transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/10">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

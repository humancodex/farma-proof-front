"use client"

import { Home, Wallet, ShoppingBag, User, Scan, FileText, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { user } = useAuth()

  if (!user) return null

  const getTabsForRole = () => {
    switch (user.role) {
      case "patient":
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "orders", label: "Prescriptions", icon: FileText },
        ]
      case "doctor":
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "prescriptions", label: "Prescriptions", icon: FileText },
        ]
      case "pharmacy":
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "scan", label: "Verify", icon: Scan },
        ]
      case "admin":
        return []
      default:
        return []
    }
  }

  const tabs = getTabsForRole()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-lg transition-colors",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

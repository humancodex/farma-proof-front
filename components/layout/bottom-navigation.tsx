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
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "orders", label: "Orders", icon: ShoppingBag },
          { id: "profile", label: "Profile", icon: User },
        ]
      case "doctor":
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "prescriptions", label: "Prescriptions", icon: FileText },
          { id: "patients", label: "Patients", icon: User },
          { id: "profile", label: "Profile", icon: User },
        ]
      case "pharmacy":
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "scan", label: "Scan", icon: Scan },
          { id: "inventory", label: "Inventory", icon: ShoppingBag },
          { id: "profile", label: "Profile", icon: User },
        ]
      case "auditor":
        return [
          { id: "home", label: "Dashboard", icon: Home },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
          { id: "reports", label: "Reports", icon: FileText },
          { id: "profile", label: "Profile", icon: User },
        ]
      case "admin":
        return [
          { id: "home", label: "Dashboard", icon: Home },
          { id: "users", label: "Users", icon: User },
          { id: "system", label: "System", icon: BarChart3 },
          { id: "profile", label: "Profile", icon: User },
        ]
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

"use client"
import { ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth, DEMO_USERS, type UserRole } from "@/lib/auth"
import { useTranslation, type Language } from "@/lib/i18n"

interface RoleSwitcherProps {
  language: Language
}

export function RoleSwitcher({ language }: RoleSwitcherProps) {
  const { user, switchRole, logout } = useAuth()
  const { t } = useTranslation(language)

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{user.name}</div>
              <Badge variant="secondary" className="text-xs">
                {t(`role.${user.role}` as any)}
              </Badge>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(DEMO_USERS).map(([role, demoUser]) => (
          <DropdownMenuItem
            key={role}
            onClick={() => switchRole(role as UserRole)}
            className={user.role === role ? "bg-accent" : ""}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{demoUser.name}</div>
                <div className="text-xs text-muted-foreground">{t(`role.${role}` as any)}</div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

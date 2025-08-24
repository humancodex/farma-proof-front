"use client"

import { Heart } from "lucide-react"
import { RoleSwitcher } from "@/components/auth/role-switcher"

interface DesktopHeaderProps {
  onMenuToggle?: () => void
}

export function DesktopHeader({ onMenuToggle }: DesktopHeaderProps) {
  return (
    <header className="lg:pl-64 bg-background border-b border-border sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo - Left Side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FarmaProof</h1>
              <p className="text-xs text-muted-foreground">Secure Prescriptions</p>
            </div>
          </div>
        </div>

        {/* Role Switcher - Right Side */}
        <div className="flex items-center">
          <RoleSwitcher />
        </div>
      </div>
    </header>
  )
}

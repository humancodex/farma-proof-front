"use client"

import { Plus, FileText, Scan, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

interface FloatingCTAProps {
  onClick: () => void
}

export function FloatingCTA({ onClick }: FloatingCTAProps) {
  const { user } = useAuth()

  if (!user) return null

  const getCtaConfig = () => {
    switch (user.role) {
      case "patient":
        return {
          icon: Plus,
          label: "New Purchase",
          className: "bg-primary hover:bg-primary/90 text-primary-foreground",
        }
      case "doctor":
        return {
          icon: FileText,
          label: "Issue Prescription",
          className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
        }
      case "pharmacy":
        return {
          icon: Scan,
          label: "Scan Proof",
          className: "bg-accent hover:bg-accent/90 text-accent-foreground",
        }
      case "admin":
        return {
          icon: Settings,
          label: "Manage System",
          className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
        }
      default:
        return {
          icon: Plus,
          label: "Action",
          className: "bg-primary hover:bg-primary/90 text-primary-foreground",
        }
    }
  }

  const { icon: Icon, label, className } = getCtaConfig()

  return (
    <Button onClick={onClick} className={`fixed bottom-20 right-4 h-14 px-6 rounded-full shadow-lg z-40 ${className}`}>
      <Icon className="h-5 w-5 mr-2" />
      <span className="font-medium">{label}</span>
    </Button>
  )
}

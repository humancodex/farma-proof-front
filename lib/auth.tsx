"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "patient" | "doctor" | "pharmacy" | "auditor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  verified: boolean
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchRole: (role: UserRole) => void
  isLoading: boolean
}

// Demo users for each role
export const DEMO_USERS: Record<UserRole, User> = {
  patient: {
    id: "patient-1",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    role: "patient",
    verified: true,
  },
  doctor: {
    id: "doctor-1",
    name: "Dr. Rivera",
    email: "dr.rivera@hospital.com",
    role: "doctor",
    verified: true,
  },
  pharmacy: {
    id: "pharmacy-1",
    name: "Andes Pharmacy",
    email: "contact@andespharmacy.com",
    role: "pharmacy",
    verified: true,
  },
  auditor: {
    id: "auditor-1",
    name: "System Auditor",
    email: "auditor@farmaproof.com",
    role: "auditor",
    verified: true,
  },
  admin: {
    id: "admin-1",
    name: "System Admin",
    email: "admin@farmaproof.com",
    role: "admin",
    verified: true,
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("farmaproof-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("farmaproof-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo login - find user by email
    const foundUser = Object.values(DEMO_USERS).find((u) => u.email === email)

    if (foundUser && password === "demo123") {
      setUser(foundUser)
      localStorage.setItem("farmaproof-user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("farmaproof-user")
  }

  const switchRole = (role: UserRole) => {
    const newUser = DEMO_USERS[role]
    setUser(newUser)
    localStorage.setItem("farmaproof-user", JSON.stringify(newUser))
  }

  return <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

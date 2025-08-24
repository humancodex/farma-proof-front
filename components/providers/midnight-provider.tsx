"use client"

import { ReactNode } from "react"

// Conditional provider that only loads on client side to avoid SSR issues
export function MidnightProvider({ children }: { children: ReactNode }) {
  // For now, return children without the provider until we can resolve the compatibility issue
  // This will allow the app to load but the wallet functionality won't work
  return <>{children}</>
}
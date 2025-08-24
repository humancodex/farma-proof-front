"use client"

import { ReactNode, createContext, useContext, useState, useCallback } from "react"

interface MidnightContextType {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const MidnightContext = createContext<MidnightContextType | undefined>(undefined)

export function useMidnight() {
  const context = useContext(MidnightContext)
  if (context === undefined) {
    throw new Error('useMidnight must be used within a MidnightProvider')
  }
  return context
}

// Global window type extension
declare global {
  interface Window {
    midnight?: {
      mnLace?: {
        enable(): Promise<{
          state(): Promise<{ address: string }>;
        }>;
      };
    };
  }
}

export function MidnightProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  const connect = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.midnight?.mnLace) {
        // @ts-expect-error: window.midnight is injected by wallet extension
        const api = await window.midnight.mnLace.enable()
        if (api) {
          const state = await api.state()
          setAddress(state.address)
          setIsConnected(true)
        }
      } else {
        throw new Error('Lace wallet not available')
      }
    } catch (error) {
      console.error('Failed to connect to Lace wallet:', error)
      throw error
    }
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
  }, [])

  const value = {
    isConnected,
    address,
    connect,
    disconnect
  }

  return (
    <MidnightContext.Provider value={value}>
      {children}
    </MidnightContext.Provider>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, CheckCircle, XCircle } from "lucide-react"
import { farmaProofWallet, type WalletConnectionStatus } from "../../src/lib/walletConnector"

interface WalletConnectorButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  onConnectionChange?: (status: WalletConnectionStatus) => void
}

export function WalletConnectorButton({
  variant = "default",
  size = "default",
  className = "",
  onConnectionChange,
}: WalletConnectorButtonProps) {
  const [connectionStatus, setConnectionStatus] = useState<WalletConnectionStatus>({
    status: "disconnected",
  })
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Subscribe to wallet connection status changes
    const subscription = farmaProofWallet.connectionStatus$.subscribe((status) => {
      setConnectionStatus(status)
      onConnectionChange?.(status)
    })

    return () => subscription.unsubscribe()
  }, [onConnectionChange])

  const handleConnect = async () => {
    if (connectionStatus.status === "connected") {
      farmaProofWallet.disconnect()
      return
    }

    setIsConnecting(true)
    try {
      await farmaProofWallet.connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const getButtonContent = () => {
    switch (connectionStatus.status) {
      case "connected":
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Connected
          </>
        )
      case "connecting":
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        )
      case "error":
        return (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Error
          </>
        )
      default:
        return (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </>
        )
    }
  }

  const getButtonVariant = () => {
    switch (connectionStatus.status) {
      case "connected":
        return "outline"
      case "error":
        return "destructive"
      default:
        return variant
    }
  }

  const isDisabled = isConnecting || connectionStatus.status === "connecting"

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      onClick={handleConnect}
      disabled={isDisabled}
      className={className}
    >
      {getButtonContent()}
    </Button>
  )
}

// Hook for using wallet connection status
export function useWalletConnection() {
  const [connectionStatus, setConnectionStatus] = useState<WalletConnectionStatus>({
    status: "disconnected",
  })

  useEffect(() => {
    const subscription = farmaProofWallet.connectionStatus$.subscribe(setConnectionStatus)
    return () => subscription.unsubscribe()
  }, [])

  const connect = () => farmaProofWallet.connect()
  const disconnect = () => farmaProofWallet.disconnect()
  const getBalance = () => farmaProofWallet.getBalance()
  const getWalletAddress = () => farmaProofWallet.getWalletAddress()

  return {
    connectionStatus,
    connect,
    disconnect,
    getBalance,
    getWalletAddress,
    isConnected: connectionStatus.status === "connected",
    isConnecting: connectionStatus.status === "connecting",
    hasError: connectionStatus.status === "error",
    error: connectionStatus.error,
    publicKey: connectionStatus.publicKey,
    balance: connectionStatus.balance,
  }
}

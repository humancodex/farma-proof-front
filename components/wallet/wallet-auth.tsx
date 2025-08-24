"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Key, Wifi, WifiOff } from "lucide-react"
import { useCallback, useState, useEffect } from "react"

// Extend the Window interface to include midnight
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

// Custom hook for wallet connection
const useWallet = () => {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [walletApi, setWalletApi] = useState<any>(null)

  const connectWallet = useCallback(async (walletName: string) => {
    if (walletName !== "mnLace") return
    
    setConnecting(true)
    try {
      if (typeof window !== 'undefined' && window.midnight?.[walletName]) {
        const api = await window.midnight[walletName].enable()
        console.log("Wallet API available:", api)
        
        if (api) {
          setWalletApi(api)
          setConnected(true)
          
          try {
            const state = await api.state()
            console.log('Wallet state', state)
            setAddress(state.address)
          } catch (error) {
            console.log('Error getting wallet state:', error)
          }
        }
      } else {
        throw new Error('Wallet not available')
      }
    } catch (error) {
      console.log("Error connecting to wallet:", error)
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setConnected(false)
    setAddress(null)
    setWalletApi(null)
  }, [])

  const setOpen = useCallback((open: boolean) => {
    console.log("Wallet modal:", open)
  }, [])

  return {
    connectingWallet: connecting,
    disconnect,
    setOpen,
    connectWallet,
    connected,
    address,
    walletApi
  }
}

export function WalletAuth() {
  const { 
    connectingWallet, 
    disconnect, 
    setOpen, 
    connectWallet, 
    connected, 
    address 
  } = useWallet()

  // Derived values
  const hasConnectedWallet = connected
  const isProofServerOnline = true // Mock for now
  const walletName = connected ? "mnLace" : "Not connected"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Midnight Wallet Connection
          </CardTitle>
          <CardDescription>
            Connect your wallet to interact with the Midnight Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Wallet Connection Button */}
            <div className="flex justify-center">
              <Button 
                onClick={() => connectWallet("mnLace")}
                disabled={connectingWallet || hasConnectedWallet}
                size="lg"
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                {connectingWallet 
                  ? "Connecting..." 
                  : hasConnectedWallet 
                    ? "Connected to Lace" 
                    : "Connect Lace Wallet"
                }
              </Button>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${hasConnectedWallet ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium">
                  {hasConnectedWallet ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isProofServerOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Server Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600">Server Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Manage your wallet connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setOpen(true)}
              className="gap-2"
            >
              <Wallet className="h-4 w-4" />
              Open Wallet
            </Button>
            <Button 
              onClick={() => connectWallet("mnLace")}
              className="gap-2"
            >
              <Wallet className="h-4 w-4" />
              Connect Lace
            </Button>
            <Button 
              variant="destructive" 
              onClick={disconnect}
              disabled={!hasConnectedWallet}
              className="gap-2"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Details (Compact) */}
      {hasConnectedWallet && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">Wallet Name</h4>
                <div className="bg-muted px-3 py-2 rounded text-sm font-mono">
                  {walletName || 'Not connected'}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Address</h4>
                <div className="bg-muted px-3 py-2 rounded text-sm font-mono break-all">
                  {address || 'Not connected'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Server Connection Info */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
              🌐 Midnight Network Connection
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              To connect to the actual Midnight Network:
            </p>
            <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <div>• <strong>TestNet:</strong> Use official Midnight TestNet endpoints</div>
              <div>• <strong>DevNet:</strong> Connect to development network</div>
              <div>• <strong>Local:</strong> Run local Midnight node for testing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              🚀 Development Status
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              The Midnight Network wallet integration is currently in development mode. 
              Mock data is displayed while we resolve React 19 compatibility issues with the 
              MeshSDK provider.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
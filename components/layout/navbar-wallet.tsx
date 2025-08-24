"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMidnight } from "../providers/midnight-provider";

function formatAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 5) + "..." + address.slice(-5);
}

export function NavbarWallet() {
  const { isConnected, address, connect, disconnect } = useMidnight();
  const [connecting, setConnecting] = useState(false);

  // Handler for the wallet connection
  const handleConnectWallet = async () => {
    if (isConnected) {
      disconnect();
      return;
    }

    setConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnectWallet}
      disabled={connecting}
      variant={isConnected ? "secondary" : "default"}
      className="min-w-[120px]"
      size="sm"
    >
      {connecting 
        ? "Connecting..." 
        : address 
          ? formatAddress(address) 
          : isConnected 
            ? "Menu" 
            : "Connect Wallet"
      }
    </Button>
  );
}
"use client"

import { ShoppingBag, MapPin, Clock, Eye, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DEMO_ORDERS } from "@/lib/demo-data"
import { useState } from "react"

export function OrdersList() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "default"
      case "paid":
        return "secondary"
      case "proof_valid":
        return "outline"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fulfilled":
        return CheckCircle
      case "paid":
        return Clock
      case "proof_valid":
        return CheckCircle
      case "pending":
        return Clock
      case "cancelled":
        return XCircle
      default:
        return Clock
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">My Orders</h2>
        <p className="text-muted-foreground">Track your medicine purchases</p>
      </div>

      {/* Orders List */}
      {DEMO_ORDERS.length > 0 ? (
        <div className="space-y-4">
          {DEMO_ORDERS.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            const isSelected = selectedOrder === order.id

            return (
              <Card key={order.id} className={isSelected ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{order.medicineName}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.pharmacyName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {order.quantity} • ${order.totalPrice}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status)} className="mb-2">
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {order.status.replace("_", " ")}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-muted-foreground">Order placed</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {order.status !== "pending" && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-muted-foreground">Proof verified</span>
                      </div>
                    )}

                    {(order.status === "paid" || order.status === "fulfilled") && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-muted-foreground">Payment confirmed</span>
                      </div>
                    )}

                    {order.status === "fulfilled" && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-muted-foreground">Order fulfilled</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(order.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Details (Expandable) */}
                  {isSelected && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-mono">{order.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Proof ID:</span>
                        <span className="font-mono">{order.proofId}</span>
                      </div>
                      {order.txHash && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transaction:</span>
                          <span className="font-mono text-xs">{order.txHash.slice(0, 20)}...</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(isSelected ? null : order.id)}
                    className="w-full mt-3"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {isSelected ? "Hide Details" : "View Details"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Alert>
          <ShoppingBag className="h-4 w-4" />
          <AlertDescription>No orders found. Start by purchasing medicine with your prescriptions.</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

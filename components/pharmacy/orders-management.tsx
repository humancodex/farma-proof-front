"use client"

import { ShoppingBag, Clock, CheckCircle, Package, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEMO_ORDERS } from "@/lib/demo-data"
import { useState } from "react"

export function OrdersManagement() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

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
        return Package
      case "proof_valid":
        return CheckCircle
      case "pending":
        return Clock
      case "cancelled":
        return Clock
      default:
        return Clock
    }
  }

  const filteredOrders = DEMO_ORDERS.filter((order) => {
    return statusFilter === "all" || order.status === statusFilter
  })

  const handleFulfillOrder = (orderId: string) => {
    console.log("Fulfill order:", orderId)
    // In a real app, this would update the order status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
          Orders Management
        </h2>
        <p className="text-muted-foreground">Track and fulfill customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-foreground">{DEMO_ORDERS.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-amber-600">
              {DEMO_ORDERS.filter((o) => o.status === "paid").length}
            </div>
            <div className="text-xs text-muted-foreground">Ready</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">
              {DEMO_ORDERS.filter((o) => o.status === "fulfilled").length}
            </div>
            <div className="text-xs text-muted-foreground">Fulfilled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-muted-foreground">
              {DEMO_ORDERS.filter((o) => o.status === "pending").length}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="proof_valid">Proof Valid</SelectItem>
                <SelectItem value="paid">Ready for Pickup</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
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
                        <p className="text-sm text-muted-foreground">
                          Order #{order.id.slice(-6)} • Qty: {order.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">Total: ${order.totalPrice}</p>
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
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm mb-4">
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
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer:</span>
                        <span>Anonymous (ZK verified)</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(isSelected ? null : order.id)}
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {isSelected ? "Hide Details" : "View Details"}
                    </Button>

                    {order.status === "paid" && (
                      <Button variant="default" size="sm" onClick={() => handleFulfillOrder(order.id)}>
                        <Package className="mr-2 h-4 w-4" />
                        Fulfill
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Alert>
          <ShoppingBag className="h-4 w-4" />
          <AlertDescription>
            {statusFilter !== "all"
              ? `No orders with status "${statusFilter.replace("_", " ")}" found.`
              : "No orders found."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

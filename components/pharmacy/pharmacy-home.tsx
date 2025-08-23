"use client"

import { Scan, Package, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_ORDERS, DEMO_MEDICINES } from "@/lib/demo-data"

interface PharmacyHomeProps {
  onNavigate: (tab: string) => void
  onScanProof: () => void
}

export function PharmacyHome({ onNavigate, onScanProof }: PharmacyHomeProps) {
  // Calculate KPIs from demo data
  const todayOrders = DEMO_ORDERS.filter((order) => {
    const orderDate = new Date(order.createdAt).toDateString()
    const today = new Date().toDateString()
    return orderDate === today
  })

  const pendingPickups = DEMO_ORDERS.filter((order) => order.status === "paid").length
  const fulfilledToday = DEMO_ORDERS.filter(
    (order) => order.status === "fulfilled" && new Date(order.updatedAt).toDateString() === new Date().toDateString(),
  ).length
  const totalRevenue = DEMO_ORDERS.filter((order) => order.status === "fulfilled").reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
          Pharmacy Dashboard
        </h2>
        <p className="text-muted-foreground">Verify prescriptions and manage orders</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Scan className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{todayOrders.length}</div>
            <div className="text-sm text-muted-foreground">Proofs Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{pendingPickups}</div>
            <div className="text-sm text-muted-foreground">Pending Pickups</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onScanProof} className="w-full justify-start h-12" size="lg">
            <Scan className="mr-3 h-5 w-5" />
            Scan ZK Proof
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => onNavigate("inventory")} className="justify-start">
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </Button>
            <Button variant="outline" onClick={() => onNavigate("scan")} className="justify-start">
              <CheckCircle className="mr-2 h-4 w-4" />
              Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Today's Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Orders fulfilled</span>
            <span className="font-bold text-lg">{fulfilledToday}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Pending pickups</span>
            <span className="font-bold text-lg text-amber-600">{pendingPickups}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Revenue (total)</span>
            <span className="font-bold text-lg text-primary">${totalRevenue.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      {pendingPickups > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Pickups</CardTitle>
            <CardDescription>Orders ready for customer pickup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEMO_ORDERS.filter((order) => order.status === "paid")
              .slice(0, 3)
              .map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{order.medicineName}</div>
                      <div className="text-xs text-muted-foreground">
                        Order #{order.id.slice(-6)} • Qty: {order.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Ready</Badge>
                    <div className="text-xs text-muted-foreground mt-1">${order.totalPrice}</div>
                  </div>
                </div>
              ))}
            <Button variant="ghost" onClick={() => onNavigate("scan")} className="w-full">
              View All Orders
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Inventory Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventory Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total medicines</span>
            <span className="font-bold text-lg">{DEMO_MEDICINES.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">In stock</span>
            <span className="font-bold text-lg text-primary">{DEMO_MEDICINES.filter((med) => med.inStock).length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Low stock alerts</span>
            <span className="font-bold text-lg text-destructive">0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

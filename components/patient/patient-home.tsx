"use client"

import { ShoppingBag, Wallet, Clock, MapPin, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_PRESCRIPTION_VCS, DEMO_ORDERS } from "@/lib/demo-data"

interface PatientHomeProps {
  onNavigate: (tab: string) => void
  onStartPurchase: () => void
}

export function PatientHome({ onNavigate, onStartPurchase }: PatientHomeProps) {
  const validVCs = DEMO_PRESCRIPTION_VCS.filter((vc) => vc.status === "valid")
  const recentOrders = DEMO_ORDERS.slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-heading-2 text-foreground mb-2">Your prescriptions, protected</h2>
        <p className="text-body text-muted-foreground">Secure medicine access with zero-knowledge verification</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Wallet className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{validVCs.length}</div>
            <div className="text-body-sm text-muted-foreground">Valid Prescriptions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{DEMO_ORDERS.length}</div>
            <div className="text-body-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onStartPurchase} className="w-full justify-start h-12" size="lg">
            <Plus className="mr-3 h-5 w-5" />
            Buy Medicine
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => onNavigate("wallet")} className="justify-start">
              <Wallet className="mr-2 h-4 w-4" />
              My Wallet
            </Button>
            <Button variant="outline" onClick={() => onNavigate("orders")} className="justify-start">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-3">Recent Orders</CardTitle>
            <CardDescription>Your latest medicine purchases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-body-sm">{order.medicineName}</div>
                    <div className="text-caption text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {order.pharmacyName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      order.status === "fulfilled" ? "default" : order.status === "paid" ? "secondary" : "outline"
                    }
                  >
                    {order.status.replace("_", " ")}
                  </Badge>
                  <div className="text-caption text-muted-foreground mt-1">${order.totalPrice}</div>
                </div>
              </div>
            ))}
            <Button variant="ghost" onClick={() => onNavigate("orders")} className="w-full">
              View All Orders
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Prescriptions Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Active Prescriptions</CardTitle>
          <CardDescription>Valid credentials ready for use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {validVCs.slice(0, 2).map((vc) => (
            <div key={vc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="font-medium text-body-sm">{vc.medicineName}</div>
                  <div className="text-caption text-muted-foreground">by {vc.doctorName}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="default">Valid</Badge>
                <div className="text-caption text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(vc.expiresAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" onClick={() => onNavigate("wallet")} className="w-full">
            View All Prescriptions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

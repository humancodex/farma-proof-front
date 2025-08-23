"use client"

import { Package, Search, Plus, Edit, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DEMO_MEDICINES } from "@/lib/demo-data"
import { useState } from "react"

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedicines = DEMO_MEDICINES.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const inStockCount = DEMO_MEDICINES.filter((med) => med.inStock).length
  const outOfStockCount = DEMO_MEDICINES.filter((med) => !med.inStock).length
  const prescriptionMedicines = DEMO_MEDICINES.filter((med) => med.requiresPrescription).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
          Inventory Management
        </h2>
        <p className="text-muted-foreground">Manage medicine stock and availability</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{DEMO_MEDICINES.length}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{inStockCount}</div>
            <div className="text-sm text-muted-foreground">In Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
            <div className="text-sm text-muted-foreground">Out of Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medicine Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMedicines.length > 0 ? (
            <div className="space-y-3">
              {filteredMedicines.map((medicine) => (
                <div key={medicine.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{medicine.name}</h4>
                      <p className="text-sm text-muted-foreground">{medicine.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={medicine.inStock ? "default" : "destructive"}>
                          {medicine.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        {medicine.requiresPrescription && (
                          <Badge variant="outline" className="text-xs">
                            Prescription Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${medicine.price}</div>
                    <div className="flex gap-1 mt-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                {searchTerm ? "No medicines match your search criteria." : "No medicines in inventory."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Prescription Medicines Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Prescription Medicines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Prescription required medicines</span>
            <span className="font-bold text-lg">{prescriptionMedicines}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Available without prescription</span>
            <span className="font-bold text-lg">{DEMO_MEDICINES.length - prescriptionMedicines}</span>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Always verify zero-knowledge proofs for prescription medicines before dispensing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { FileText, Clock, User, Eye, Ban, Trash2, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEMO_PRESCRIPTION_VCS } from "@/lib/demo-data"
import { useState } from "react"

export function PrescriptionsList() {
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "default"
      case "expired":
        return "destructive"
      case "used":
        return "secondary"
      case "revoked":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredPrescriptions = DEMO_PRESCRIPTION_VCS.filter((prescription) => {
    const matchesSearch =
      prescription.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleRevoke = (prescriptionId: string) => {
    console.log("Revoke prescription:", prescriptionId)
    // In a real app, this would call an API to revoke the prescription
  }

  const handleDelete = (prescriptionId: string) => {
    console.log("Delete prescription:", prescriptionId)
    // In a real app, this would call an API to delete the prescription
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
          My Prescriptions
        </h2>
        <p className="text-muted-foreground">Manage issued digital prescriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-foreground">{DEMO_PRESCRIPTION_VCS.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">
              {DEMO_PRESCRIPTION_VCS.filter((p) => p.status === "valid").length}
            </div>
            <div className="text-xs text-muted-foreground">Valid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-destructive">
              {DEMO_PRESCRIPTION_VCS.filter((p) => p.status === "expired").length}
            </div>
            <div className="text-xs text-muted-foreground">Expired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-muted-foreground">
              {DEMO_PRESCRIPTION_VCS.filter((p) => p.status === "revoked").length}
            </div>
            <div className="text-xs text-muted-foreground">Revoked</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by medicine or patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      {filteredPrescriptions.length > 0 ? (
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => {
            const isSelected = selectedPrescription === prescription.id

            return (
              <Card key={prescription.id} className={isSelected ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{prescription.medicineName}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Patient: {prescription.patientId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {prescription.quantity} • {prescription.dosage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(prescription.status)}>{prescription.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(prescription.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Issued:</span>
                          <div className="font-medium">{new Date(prescription.issuedAt).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires:</span>
                          <div className="font-medium">{new Date(prescription.expiresAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">VC Hash:</span>
                        <div className="font-mono text-xs mt-1 bg-background p-2 rounded">{prescription.vcHash}</div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPrescription(isSelected ? null : prescription.id)}
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {isSelected ? "Hide Details" : "View Details"}
                    </Button>

                    {prescription.status === "valid" && (
                      <Button variant="outline" size="sm" onClick={() => handleRevoke(prescription.id)}>
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}

                    <Button variant="outline" size="sm" onClick={() => handleDelete(prescription.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            {searchTerm || statusFilter !== "all"
              ? "No prescriptions match your search criteria."
              : "No prescriptions issued yet. Start by issuing your first prescription."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

"use client"

import { Users, FileText, Clock, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DEMO_PRESCRIPTION_VCS } from "@/lib/demo-data"

export function PatientsList() {
  // Group prescriptions by patient
  const patientData = DEMO_PRESCRIPTION_VCS.reduce(
    (acc, prescription) => {
      const patientId = prescription.patientId
      if (!acc[patientId]) {
        acc[patientId] = {
          id: patientId,
          prescriptions: [],
          totalPrescriptions: 0,
          validPrescriptions: 0,
          lastVisit: "",
        }
      }

      acc[patientId].prescriptions.push(prescription)
      acc[patientId].totalPrescriptions++

      if (prescription.status === "valid") {
        acc[patientId].validPrescriptions++
      }

      // Update last visit date
      if (!acc[patientId].lastVisit || new Date(prescription.issuedAt) > new Date(acc[patientId].lastVisit)) {
        acc[patientId].lastVisit = prescription.issuedAt
      }

      return acc
    },
    {} as Record<string, any>,
  )

  const patients = Object.values(patientData)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
          My Patients
        </h2>
        <p className="text-muted-foreground">Manage patient prescriptions and history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{patients.length}</div>
            <div className="text-sm text-muted-foreground">Total Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {patients.filter((p) => p.validPrescriptions > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {patients.reduce((sum, p) => sum + p.totalPrescriptions, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Prescriptions</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      {patients.length > 0 ? (
        <div className="space-y-4">
          {patients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Patient {patient.id}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={patient.validPrescriptions > 0 ? "default" : "secondary"}>
                      {patient.validPrescriptions > 0 ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Patient Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-bold text-lg">{patient.totalPrescriptions}</div>
                    <div className="text-muted-foreground">Total Prescriptions</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-bold text-lg text-primary">{patient.validPrescriptions}</div>
                    <div className="text-muted-foreground">Valid</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-bold text-lg text-destructive">
                      {patient.totalPrescriptions - patient.validPrescriptions}
                    </div>
                    <div className="text-muted-foreground">Expired</div>
                  </div>
                </div>

                {/* Recent Prescriptions */}
                <div>
                  <h4 className="font-medium mb-3">Recent Prescriptions</h4>
                  <div className="space-y-2">
                    {patient.prescriptions.slice(0, 3).map((prescription: any) => (
                      <div key={prescription.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-secondary" />
                          <span className="text-sm font-medium">{prescription.medicineName}</span>
                          <span className="text-xs text-muted-foreground">Qty: {prescription.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(prescription.status)} className="text-xs">
                            {prescription.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(prescription.issuedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            No patients found. Patients will appear here after you issue prescriptions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function getStatusColor(status: string) {
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

"use client"

import { FileText, Users, Clock, CheckCircle, Plus, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_PRESCRIPTION_VCS } from "@/lib/demo-data"

interface DoctorHomeProps {
  onNavigate: (tab: string) => void
  onIssuePrescription: () => void
}

export function DoctorHome({ onNavigate, onIssuePrescription }: DoctorHomeProps) {
  // Calculate stats from demo data
  const totalPrescriptions = DEMO_PRESCRIPTION_VCS.length
  const validPrescriptions = DEMO_PRESCRIPTION_VCS.filter((vc) => vc.status === "valid").length
  const expiredPrescriptions = DEMO_PRESCRIPTION_VCS.filter((vc) => vc.status === "expired").length
  const recentPrescriptions = DEMO_PRESCRIPTION_VCS.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
          Doctor Dashboard
        </h2>
        <p className="text-muted-foreground">Manage digital prescriptions securely</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalPrescriptions}</div>
            <div className="text-sm text-muted-foreground">Total Issued</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{validPrescriptions}</div>
            <div className="text-sm text-muted-foreground">Currently Valid</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onIssuePrescription} className="w-full justify-start h-12" size="lg">
            <Plus className="mr-3 h-5 w-5" />
            Issue New Prescription
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => onNavigate("prescriptions")} className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              My Prescriptions
            </Button>
            <Button variant="outline" onClick={() => onNavigate("patients")} className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Patients
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
          <CardDescription>Latest issued prescriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPrescriptions.map((prescription) => (
            <div key={prescription.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="font-medium text-sm">{prescription.medicineName}</div>
                  <div className="text-xs text-muted-foreground">
                    Patient ID: {prescription.patientId} • Qty: {prescription.quantity}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    prescription.status === "valid"
                      ? "default"
                      : prescription.status === "expired"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {prescription.status}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(prescription.issuedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" onClick={() => onNavigate("prescriptions")} className="w-full">
            View All Prescriptions
          </Button>
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Prescriptions issued today</span>
            <span className="font-bold text-lg">2</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Expiring this week</span>
            <span className="font-bold text-lg text-amber-600">{expiredPrescriptions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Active patients</span>
            <span className="font-bold text-lg">1</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

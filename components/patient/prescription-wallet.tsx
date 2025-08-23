"use client"

import { Wallet, Clock, User, FileText, Trash2, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DEMO_PRESCRIPTION_VCS } from "@/lib/demo-data"
import { useState } from "react"

interface PrescriptionWalletProps {
  onGenerateProof: (vcId: string) => void
}

export function PrescriptionWallet({ onGenerateProof }: PrescriptionWalletProps) {
  const [selectedVC, setSelectedVC] = useState<string | null>(null)

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

  const validVCs = DEMO_PRESCRIPTION_VCS.filter((vc) => vc.status === "valid")
  const expiredVCs = DEMO_PRESCRIPTION_VCS.filter((vc) => vc.status === "expired")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
          Prescription Wallet
        </h2>
        <p className="text-muted-foreground">Your verified prescription credentials</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{validVCs.length}</div>
            <div className="text-xs text-muted-foreground">Valid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{expiredVCs.length}</div>
            <div className="text-xs text-muted-foreground">Expired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{DEMO_PRESCRIPTION_VCS.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Valid Prescriptions */}
      {validVCs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Valid Prescriptions</h3>
          <div className="space-y-3">
            {validVCs.map((vc) => (
              <Card key={vc.id} className={selectedVC === vc.id ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{vc.medicineName}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {vc.doctorName}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(vc.status)}>{vc.status}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{vc.quantity} tablets</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dosage:</span>
                      <span className="font-medium">{vc.dosage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(vc.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VC Hash:</span>
                      <span className="font-mono text-xs">{vc.vcHash.slice(0, 16)}...</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => onGenerateProof(vc.id)} className="flex-1" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate ZK Proof
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVC(selectedVC === vc.id ? null : vc.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Expired Prescriptions */}
      {expiredVCs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Expired Prescriptions</h3>
          <div className="space-y-3">
            {expiredVCs.map((vc) => (
              <Card key={vc.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{vc.medicineName}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {vc.doctorName}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(vc.status)}>{vc.status}</Badge>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expired:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(vc.expiresAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled>
                      <FileText className="mr-2 h-4 w-4" />
                      Cannot Generate Proof
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {DEMO_PRESCRIPTION_VCS.length === 0 && (
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription>
            No prescription credentials found. Visit your doctor to get a digital prescription.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

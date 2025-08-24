"use client"

import { useState } from "react"
import { Scan, Camera, CheckCircle, XCircle, ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// Mock ZK proof verification for demo
const verifyZKProof = async (proofId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return Math.random() > 0.05 // 95% success rate
}
import { DEMO_ORDERS, DEMO_PRESCRIPTION_VCS, DEMO_MEDICINES } from "@/lib/demo-data"
import { useFarma } from "@/src/hooks/useFarma"
import { Status } from "@/packages/types/prescription"
import { PrescriptionStatusManager } from "@/src/lib/prescriptionStatus"

interface ProofScannerProps {
  onComplete: () => void
  onCancel: () => void
}

type ScanStep = "scan" | "verify" | "details" | "fulfill"

export function ProofScanner({ onComplete, onCancel }: ProofScannerProps) {
  const [currentStep, setCurrentStep] = useState<ScanStep>("scan")
  const [proofId, setProofId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean
    order?: any
    prescription?: any
    medicine?: any
    error?: string
  } | null>(null)
  const [useRealBackend, setUseRealBackend] = useState(false)
  
  // Real FarmaProof integration
  const { pharmacyFulfill, getOrderStatus } = useFarma()

  const handleRealScanProof = async () => {
    if (!proofId.trim()) return

    setIsLoading(true)
    setCurrentStep("verify")

    try {
      // For real backend, proofId would be an order ID
      const orderStatus = await getOrderStatus(proofId)
      
      if (!orderStatus) {
        setVerificationResult({
          isValid: false,
          error: "Order not found or invalid",
        })
        setCurrentStep("details")
        return
      }

      // Check if order is in PAID state (ready for fulfillment) or PROOF_VALID (needs payment)
      const isValid = orderStatus.chainState === 'PAID' || orderStatus.chainState === 'PROOF_VALID'
      
      // If order is valid and not yet verified, mark as verified by pharmacy
      if (isValid && orderStatus.state === 'PROOF_VALID') {
        await PrescriptionStatusManager.updateStatus(orderStatus.id, Status.verified)
        console.log(`Prescription ${orderStatus.id} status changed to: verified`)
      }

      setVerificationResult({
        isValid,
        order: {
          id: orderStatus.id,
          quantity: orderStatus.qty_requested,
          medicineCodeHash: orderStatus.medicine_code_hash,
          state: orderStatus.state,
          totalPrice: orderStatus.qty_requested * 50, // Mock price
          prescriptionStatus: orderStatus.chainState === 'PAID' ? Status.paid : Status.verified,
        },
        error: !isValid ? `Order not ready for fulfillment. Status: ${orderStatus.state}` : undefined,
      })

      setCurrentStep("details")
    } catch (error) {
      setVerificationResult({
        isValid: false,
        error: "Failed to verify order status",
      })
      setCurrentStep("details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleScanProof = async () => {
    if (!proofId.trim()) {
      return
    }

    if (useRealBackend) {
      await handleRealScanProof()
      return
    }

    setIsLoading(true)
    setCurrentStep("verify")

    try {
      // Simulate scanning delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Find the order with this proof ID
      const order = DEMO_ORDERS.find((o) => o.proofId === proofId)

      if (!order) {
        setVerificationResult({
          isValid: false,
          error: "Proof ID not found or invalid",
        })
        return
      }

      // Find the related prescription and medicine
      const prescription = DEMO_PRESCRIPTION_VCS.find((vc) => vc.medicineId === order.medicineId)
      const medicine = DEMO_MEDICINES.find((med) => med.id === order.medicineId)

      // Verify the proof
      const isValid = await verifyZKProof(proofId)

      setVerificationResult({
        isValid,
        order,
        prescription,
        medicine,
        error: !isValid ? "Proof verification failed" : undefined,
      })

      setCurrentStep("details")
    } catch (error) {
      setVerificationResult({
        isValid: false,
        error: "Verification error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFulfillOrder = async () => {
    setIsLoading(true)
    setCurrentStep("fulfill")

    try {
      if (useRealBackend && verificationResult?.order?.id) {
        // Use real FarmaProof backend
        const result = await pharmacyFulfill(verificationResult.order.id)
        
        if (!result.success) {
          setVerificationResult(prev => ({
            ...prev!,
            error: result.error || "Fulfillment failed"
          }))
          setCurrentStep("details")
          return
        }
        
        // Update prescription status to delivered
        await PrescriptionStatusManager.updateStatus(verificationResult.order.id, Status.delivered)
        console.log("Real order fulfilled:", result.txHash)
        console.log(`Prescription ${verificationResult.order.id} status changed to: delivered`)
      } else {
        // Simulate fulfillment process
        await new Promise((resolve) => setTimeout(resolve, 2000))
        
        // Update demo prescription status to delivered
        if (verificationResult?.order?.id) {
          await PrescriptionStatusManager.updateStatus(verificationResult.order.id, Status.delivered)
          console.log(`Demo prescription ${verificationResult.order.id} status changed to: delivered`)
        }
        
        console.log("Demo order fulfilled:", verificationResult?.order?.id)
      }

      onComplete()
    } catch (error) {
      console.error("Fulfillment error:", error)
      setVerificationResult(prev => ({
        ...prev!,
        error: "Fulfillment failed"
      }))
      setCurrentStep("details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualEntry = () => {
    if (useRealBackend) {
      // For real backend, use an integer order ID
      setProofId("1")
    } else {
      // For demo, use a known proof ID
      setProofId("proof-abc123")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground font-[family-name:var(--font-work-sans)]">Scan ZK Proof</h2>
          <p className="text-sm text-muted-foreground">Verify customer prescription proof</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={useRealBackend ? "default" : "outline"}
            size="sm"
            onClick={() => setUseRealBackend(!useRealBackend)}
          >
            {useRealBackend ? "Real" : "Demo"}
          </Button>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === "scan" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scan Customer Proof</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera View Placeholder */}
                <div className="bg-muted/50 p-8 rounded-lg text-center border-2 border-dashed border-muted-foreground/30">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Position QR code within the frame</p>
                  <Button variant="outline" className="mb-4 bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    Enable Camera
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
                  </div>
                </div>

                {/* Manual Entry */}
                <div className="space-y-3">
                  <Label htmlFor="proofId">Proof ID</Label>
                  <Input
                    id="proofId"
                    placeholder={useRealBackend ? "Enter order ID (e.g., 1)" : "Enter proof ID (e.g., proof-abc123)"}
                    value={proofId}
                    onChange={(e) => setProofId(e.target.value)}
                  />
                  <Button onClick={handleManualEntry} variant="outline" size="sm" className="w-full bg-transparent">
                    {useRealBackend ? "Use Test Order ID" : "Use Demo Proof ID"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleScanProof} disabled={!proofId.trim()} className="w-full" size="lg">
              <Scan className="mr-2 h-5 w-5" />
              Verify Proof
            </Button>
          </div>
        )}

        {currentStep === "verify" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="animate-spin">
                  <Scan className="h-12 w-12 text-accent mx-auto" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Verifying Proof...</h3>
                  <p className="text-sm text-muted-foreground">Checking zero-knowledge proof validity</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "details" && verificationResult && (
          <div className="space-y-6">
            {/* Verification Status */}
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                {verificationResult.isValid ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-primary">Proof Valid</h3>
                      <p className="text-sm text-muted-foreground">Zero-knowledge proof verified successfully</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-12 w-12 text-destructive mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-destructive">Proof Invalid</h3>
                      <p className="text-sm text-muted-foreground">{verificationResult.error}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Details */}
            {verificationResult.isValid && verificationResult.order && verificationResult.medicine && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prescription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{verificationResult.medicine.name}</h4>
                          <p className="text-sm text-muted-foreground">{verificationResult.medicine.description}</p>
                        </div>
                      </div>
                      <Badge variant="default">Valid</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <div className="font-medium">{verificationResult.order.quantity}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Price:</span>
                        <div className="font-medium">${verificationResult.order.totalPrice}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order ID:</span>
                        <div className="font-mono text-xs">{verificationResult.order.id}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="secondary">{verificationResult.order.status.replace("_", " ")}</Badge>
                      </div>
                    </div>

                    {verificationResult.prescription && (
                      <div className="space-y-2">
                        <span className="text-muted-foreground text-sm">Prescription expires:</span>
                        <div className="font-medium">
                          {new Date(verificationResult.prescription.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep("scan")}>
                    Scan Another
                  </Button>
                  <Button onClick={handleFulfillOrder} className="flex-1">
                    <Package className="mr-2 h-4 w-4" />
                    Fulfill Order
                  </Button>
                </div>
              </>
            )}

            {!verificationResult.isValid && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep("scan")} className="flex-1">
                  Try Again
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === "fulfill" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                {isLoading ? (
                  <>
                    <div className="animate-pulse">
                      <Package className="h-12 w-12 text-primary mx-auto" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Fulfilling Order...</h3>
                      <p className="text-sm text-muted-foreground">Processing customer pickup</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Order Fulfilled</h3>
                      <p className="text-sm text-muted-foreground">Customer pickup completed successfully</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {!isLoading && (
              <Button onClick={onComplete} className="w-full">
                Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

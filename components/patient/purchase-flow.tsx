"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, ShoppingBag, CreditCard, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  DEMO_PHARMACIES,
  DEMO_MEDICINES,
  DEMO_PRESCRIPTION_VCS,
  type Pharmacy,
  type Medicine,
  type PrescriptionVC,
} from "@/lib/demo-data"
import { generateZKProof, payOnMidnight, type ZKProof } from "@/lib/zk-services"
import { useFarma } from "@/src/hooks/useFarma"
import { Status } from "@/packages/types/prescription"
import { PrescriptionStatusManager } from "@/src/lib/prescriptionStatus"

interface PurchaseFlowProps {
  onComplete: () => void
  onCancel: () => void
}

type Step = "pharmacy" | "medicine" | "proof" | "payment" | "receipt"

export function PurchaseFlow({ onComplete, onCancel }: PurchaseFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>("pharmacy")
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [selectedVC, setSelectedVC] = useState<PrescriptionVC | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [zkProof, setZkProof] = useState<ZKProof | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [txHash, setTxHash] = useState("")
  const [useRealBackend, setUseRealBackend] = useState(false) // Toggle for real vs demo
  
  // Real FarmaProof integration
  const { patientPurchase, isLoading: farmaLoading, currentOrder } = useFarma()

  const steps = [
    { id: "pharmacy", label: "Select Pharmacy", icon: MapPin },
    { id: "medicine", label: "Select Medicine", icon: ShoppingBag },
    { id: "proof", label: "Generate Proof", icon: Check },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "receipt", label: "Receipt", icon: Receipt },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const validVCs = DEMO_PRESCRIPTION_VCS.filter((vc) => vc.status === "valid")

  // Real FarmaProof purchase function
  const handleRealPurchase = async () => {
    if (!selectedMedicine || !selectedVC || !selectedPharmacy) return

    try {
      setIsLoading(true)
      setError("")

      // Generate medicine code hash (in real implementation, this would come from the VC)
      const medicineCodeHash = `0x${Buffer.from(selectedMedicine.id).toString('hex').padStart(64, '0')}` as `0x${string}`
      
      // Mock issuer policy hash and patient binding (these would come from the VC in real implementation)
      const issuerPolicyHash = `0x${'1'.repeat(64)}` as `0x${string}`
      const patientBinding = `0x${'2'.repeat(64)}` as `0x${string}`

      const result = await patientPurchase({
        medicineCodeHash,
        qty: quantity,
        issuerPolicyHash,
        patientBinding,
      })

      if (result.state === 'paid') {
        setTxHash(result.txHash || '')
        
        // Update prescription status to paid
        if (selectedVC?.id) {
          await PrescriptionStatusManager.updateStatus(selectedVC.id, Status.paid)
          console.log(`Prescription ${selectedVC.id} status changed to: paid`)
        }
        
        setCurrentStep('receipt')
      } else if (result.state === 'error') {
        setError(result.error || 'Purchase failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    setError("")
    setIsLoading(true)

    try {
      switch (currentStep) {
        case "pharmacy":
          if (selectedPharmacy) {
            setCurrentStep("medicine")
          }
          break
        case "medicine":
          if (selectedMedicine && selectedVC) {
            setCurrentStep("proof")
          }
          break
        case "proof":
          if (selectedVC && selectedMedicine) {
            const proof = await generateZKProof(selectedVC.id, selectedMedicine.id, quantity)
            setZkProof(proof)
            setCurrentStep("payment")
          }
          break
        case "payment":
          if (useRealBackend) {
            // Use real FarmaProof backend
            await handleRealPurchase()
          } else {
            // Use demo implementation
            if (zkProof && selectedMedicine) {
              const result = await payOnMidnight(selectedMedicine.price * quantity, zkProof.id)
              if (result.success && result.txHash) {
                setTxHash(result.txHash)
                
                // Update prescription status to paid (demo mode)
                if (selectedVC?.id) {
                  await PrescriptionStatusManager.updateStatus(selectedVC.id, Status.paid)
                  console.log(`Demo prescription ${selectedVC.id} status changed to: paid`)
                }
                
                setCurrentStep("receipt")
              } else {
                setError(result.error || "Payment failed")
              }
            }
          }
          break
        case "receipt":
          onComplete()
          break
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    const stepOrder: Step[] = ["pharmacy", "medicine", "proof", "payment", "receipt"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "pharmacy":
        return selectedPharmacy !== null
      case "medicine":
        return selectedMedicine !== null && selectedVC !== null
      case "proof":
        return true
      case "payment":
        return zkProof !== null
      case "receipt":
        return true
      default:
        return false
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
          <h2 className="text-xl font-bold text-foreground font-[family-name:var(--font-work-sans)]">Buy Medicine</h2>
          <p className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
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

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((step, index) => (
            <span key={step.id} className={index <= currentStepIndex ? "text-primary" : ""}>
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === "pharmacy" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Pharmacy</h3>
            <div className="space-y-3">
              {DEMO_PHARMACIES.map((pharmacy) => (
                <Card
                  key={pharmacy.id}
                  className={`cursor-pointer transition-colors ${
                    selectedPharmacy?.id === pharmacy.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{pharmacy.name}</h4>
                          <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                          <p className="text-sm text-muted-foreground">{pharmacy.phone}</p>
                        </div>
                      </div>
                      {pharmacy.verified && <Badge variant="default">Verified</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === "medicine" && selectedPharmacy && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Medicine & Prescription</h3>

            {/* Available Medicines */}
            <div className="space-y-3">
              <h4 className="font-medium">Available Medicines</h4>
              {DEMO_MEDICINES.filter((med) => selectedPharmacy.medicines.includes(med.id)).map((medicine) => (
                <Card
                  key={medicine.id}
                  className={`cursor-pointer transition-colors ${
                    selectedMedicine?.id === medicine.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedMedicine(medicine)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{medicine.name}</h4>
                        <p className="text-sm text-muted-foreground">{medicine.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${medicine.price}</div>
                        <Badge variant={medicine.inStock ? "default" : "destructive"}>
                          {medicine.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Valid Prescriptions */}
            {selectedMedicine && (
              <div className="space-y-3">
                <h4 className="font-medium">Select Prescription</h4>
                {validVCs
                  .filter((vc) => vc.medicineId === selectedMedicine.id)
                  .map((vc) => (
                    <Card
                      key={vc.id}
                      className={`cursor-pointer transition-colors ${
                        selectedVC?.id === vc.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedVC(vc)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{vc.medicineName}</h4>
                            <p className="text-sm text-muted-foreground">by {vc.doctorName}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {vc.quantity}</p>
                          </div>
                          <Badge variant="default">Valid</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {validVCs.filter((vc) => vc.medicineId === selectedMedicine.id).length === 0 && (
                  <Alert>
                    <AlertDescription>
                      No valid prescription found for {selectedMedicine.name}. Please get a prescription from your
                      doctor.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}

        {currentStep === "proof" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generate Zero-Knowledge Proof</h3>
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                {isLoading ? (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <div>
                      <h4 className="font-semibold">Generating ZK Proof...</h4>
                      <p className="text-sm text-muted-foreground">
                        Creating cryptographic proof without exposing your medical data
                      </p>
                    </div>
                  </>
                ) : zkProof ? (
                  <>
                    <Check className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <h4 className="font-semibold">Proof Generated Successfully</h4>
                      <p className="text-sm text-muted-foreground">Proof ID: {zkProof.id}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Ready to Generate Proof</h4>
                      <p className="text-sm text-muted-foreground">
                        This will create a zero-knowledge proof of your prescription validity
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "payment" && zkProof && selectedMedicine && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment</h3>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Medicine:</span>
                  <span className="font-medium">{selectedMedicine.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per unit:</span>
                  <span className="font-medium">${selectedMedicine.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pharmacy:</span>
                  <span className="font-medium">{selectedPharmacy?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Proof ID:</span>
                  <span className="font-mono text-sm">{zkProof.id}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${(selectedMedicine.price * quantity).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "receipt" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Purchase Complete</h3>
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Check className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <h4 className="font-semibold">Payment Successful!</h4>
                  <p className="text-sm text-muted-foreground">Your order has been placed and payment confirmed</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Transaction Hash:</span>
                    <span className="font-mono text-xs">{txHash.slice(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Proof ID:</span>
                    <span className="font-mono text-xs">{zkProof?.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pharmacy:</span>
                    <span>{selectedPharmacy?.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {currentStep !== "pharmacy" && currentStep !== "receipt" && (
          <Button variant="outline" onClick={handleBack} disabled={isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <Button onClick={handleNext} disabled={!canProceed() || isLoading} className="flex-1">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === "receipt" ? (
            "Complete"
          ) : (
            <>
              {currentStep === "proof" ? "Generate Proof" : currentStep === "payment" ? "Pay with Midnight" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

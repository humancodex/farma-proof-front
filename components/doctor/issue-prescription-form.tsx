"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, FileText, Loader2, QrCode, Share, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEMO_MEDICINES } from "@/lib/demo-data"
import { PrescriptionVC, Status } from "@/packages/types/prescription"

interface IssuePrescriptionFormProps {
  onComplete: () => void
  onCancel: () => void
}

interface FormData {
  patientPseudonym: string
  patientWallet: string
  medicineId: string
  quantity: number
  dosage: string
  healthInsurance: string
  notes: string
  expiryDays: number
}

// TODO: with this information we should create the first smart contract
export function IssuePrescriptionForm({ onComplete, onCancel }: IssuePrescriptionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    patientPseudonym: "",
    patientWallet: "",
    medicineId: "",
    quantity: 1,
    dosage: "",
    healthInsurance: "",
    notes: "",
    expiryDays: 90,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isIssued, setIsIssued] = useState(false)
  const [vcData, setVcData] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientPseudonym.trim()) {
      newErrors.patientPseudonym = "Patient pseudonym is required"
    }
    if (!formData.patientWallet.trim()) {
      newErrors.patientWallet = "Patient wallet address is required"
    }
    if (!formData.healthInsurance.trim()) {
      newErrors.healthInsurance = "Health insurance information is required"
    }
    if (!formData.medicineId) {
      newErrors.medicineId = "Please select a medicine"
    }
    if (formData.quantity < 1 || formData.quantity > 365) {
      newErrors.quantity = "Quantity must be between 1 and 365"
    }
    if (!formData.dosage.trim()) {
      newErrors.dosage = "Dosage instructions are required"
    }
    if (formData.expiryDays < 1 || formData.expiryDays > 365) {
      newErrors.expiryDays = "Expiry must be between 1 and 365 days"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate VC generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedMedicine = DEMO_MEDICINES.find((med) => med.id === formData.medicineId)
      const issuedAt = Date.now()
      const expiresAt = issuedAt + (formData.expiryDays * 24 * 60 * 60 * 1000)

      const newVC: PrescriptionVC = {
        id: `vc-${Date.now()}`,
        drugName: selectedMedicine?.name || "",
        dosage: formData.dosage,
        quantity: formData.quantity,
        healthInsurance: formData.healthInsurance,
        doctorWallet: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock doctor wallet
        patientWallet: formData.patientWallet,
        issuedAt: issuedAt,
        expiresAt: expiresAt,
        status: Status.init, // Initial status when prescription is created
        vcHash: `0x${Math.random().toString(16).substr(2, 32)}`,
        notes: formData.notes,
      }
      console.log("newVerifiableCredential", newVC)
      setVcData(newVC)
      setIsIssued(true)
    } catch (error) {
      console.error("Error issuing prescription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  //TODO SEND THIS TO THE USER WALLET AND SAVE IT TO THE DATABASE
  const handleShare = () => {
    if (navigator.share && vcData) {
      navigator.share({
        title: "Digital Prescription",
        text: `Prescription for ${vcData.drugName} - ${vcData.quantity} tablets - Status: ${vcData.status}`,
        url: window.location.origin,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Prescription ID: ${vcData?.id}\nDrug: ${vcData?.drugName}\nQuantity: ${vcData?.quantity}\nStatus: ${vcData?.status}\nVC Hash: ${vcData?.vcHash}`
      )
    }
  }

  if (isIssued && vcData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground font-[family-name:var(--font-work-sans)]">
              Prescription Issued
            </h2>
            <p className="text-sm text-muted-foreground">Digital prescription created successfully</p>
          </div>
        </div>

        {/* Success Card */}
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <Check className="h-12 w-12 text-primary mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Prescription Successfully Issued</h3>
              <p className="text-sm text-muted-foreground">
                Digital prescription has been created and is ready for patient use
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prescription Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prescription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Patient Wallet:</span>
                <div className="font-medium font-mono text-xs">{vcData.patientWallet}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Medicine:</span>
                <div className="font-medium">{vcData.drugName}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Quantity:</span>
                <div className="font-medium">{vcData.quantity} tablets</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary">{vcData.status}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Health Insurance:</span>
                <div className="font-medium">{vcData.healthInsurance}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Doctor Wallet:</span>
                <div className="font-medium font-mono text-xs">{vcData.doctorWallet}</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">Dosage Instructions:</span>
              <div className="font-medium">{vcData.dosage}</div>
            </div>

            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">Expires:</span>
              <div className="font-medium">{new Date(vcData.expiresAt).toLocaleDateString()}</div>
            </div>

            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">Issued:</span>
              <div className="font-medium">{new Date(vcData.issuedAt).toLocaleString()}</div>
            </div>

            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">VC Hash:</span>
              <div className="font-mono text-xs bg-muted p-2 rounded">{vcData.vcHash}</div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Share with Patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-8 rounded-lg text-center">
              <QrCode className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">QR Code for prescription sharing</p>
              <p className="text-xs text-muted-foreground mt-2">Prescription ID: {vcData.id}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleShare} className="flex-1">
                <Share className="mr-2 h-4 w-4" />
                Share Prescription
              </Button>
              <Button variant="outline" onClick={onComplete}>
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground font-[family-name:var(--font-work-sans)]">
            Issue Prescription
          </h2>
          <p className="text-sm text-muted-foreground">Create a new digital prescription</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientPseudonym">Patient Pseudonym *</Label>
              <Input
                id="patientPseudonym"
                placeholder="Enter patient identifier (e.g., patient-123)"
                value={formData.patientPseudonym}
                onChange={(e) => setFormData({ ...formData, patientPseudonym: e.target.value })}
                className={errors.patientPseudonym ? "border-destructive" : ""}
              />
              {errors.patientPseudonym && <p className="text-sm text-destructive">{errors.patientPseudonym}</p>}
              <p className="text-xs text-muted-foreground">Use a privacy-preserving identifier for the patient</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientWallet">Patient Wallet Address *</Label>
              <Input
                id="patientWallet"
                placeholder="Enter patient wallet address (e.g., 0x123...abc)"
                value={formData.patientWallet}
                onChange={(e) => setFormData({ ...formData, patientWallet: e.target.value })}
                className={errors.patientWallet ? "border-destructive" : ""}
              />
              {errors.patientWallet && <p className="text-sm text-destructive">{errors.patientWallet}</p>}
              <p className="text-xs text-muted-foreground">Patient's blockchain wallet address for receiving the prescription</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthInsurance">Health Insurance *</Label>
              <Input
                id="healthInsurance"
                placeholder="Enter health insurance provider or ID"
                value={formData.healthInsurance}
                onChange={(e) => setFormData({ ...formData, healthInsurance: e.target.value })}
                className={errors.healthInsurance ? "border-destructive" : ""}
              />
              {errors.healthInsurance && <p className="text-sm text-destructive">{errors.healthInsurance}</p>}
              <p className="text-xs text-muted-foreground">Patient's health insurance information for coverage verification</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prescription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicine">Medicine *</Label>
              <Select
                value={formData.medicineId}
                onValueChange={(value) => setFormData({ ...formData, medicineId: value })}
              >
                <SelectTrigger className={errors.medicineId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select medicine" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_MEDICINES.filter((med) => med.requiresPrescription).map((medicine) => (
                    <SelectItem key={medicine.id} value={medicine.id}>
                      <div>
                        <div className="font-medium">{medicine.name}</div>
                        <div className="text-sm text-muted-foreground">{medicine.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.medicineId && <p className="text-sm text-destructive">{errors.medicineId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                  className={errors.quantity ? "border-destructive" : ""}
                />
                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDays">Expires in (days) *</Label>
                <Input
                  id="expiryDays"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.expiryDays}
                  onChange={(e) => setFormData({ ...formData, expiryDays: Number.parseInt(e.target.value) || 90 })}
                  className={errors.expiryDays ? "border-destructive" : ""}
                />
                {errors.expiryDays && <p className="text-sm text-destructive">{errors.expiryDays}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage Instructions *</Label>
              <Input
                id="dosage"
                placeholder="e.g., Take 1 tablet twice daily with food"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className={errors.dosage ? "border-destructive" : ""}
              />
              {errors.dosage && <p className="text-sm text-destructive">{errors.dosage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional instructions or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            This prescription will be issued as a verifiable credential. The patient's medical data remains private
            through zero-knowledge proofs.
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Issuing Prescription...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Sign & Issue Prescription
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

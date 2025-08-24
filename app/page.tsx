"use client"

import { useState } from "react"
import { ResponsiveLayout } from "@/components/layout/responsive-layout"
import { LoginScreen } from "@/components/auth/login-screen"
import { PatientHome } from "@/components/patient/patient-home"
import { PrescriptionWallet } from "@/components/patient/prescription-wallet"
import { PurchaseFlow } from "@/components/patient/purchase-flow"
import { OrdersList } from "@/components/patient/orders-list"
import { DoctorHome } from "@/components/doctor/doctor-home"
import { IssuePrescriptionForm } from "@/components/doctor/issue-prescription-form"
import { PrescriptionsList } from "@/components/doctor/prescriptions-list"
import { PatientsList } from "@/components/doctor/patients-list"
import { PharmacyHome } from "@/components/pharmacy/pharmacy-home"
import { ProofScanner } from "@/components/pharmacy/proof-scanner"
import { InventoryManagement } from "@/components/pharmacy/inventory-management"
import { OrdersManagement } from "@/components/pharmacy/orders-management"
import { AdminHome } from "@/components/admin/admin-home"
import { AuditorHome } from "@/components/auditor/auditor-home"
import { WalletUI } from "@/components/wallet/wallet-ui"
import { useAuth } from "@/lib/auth"
import type { Language } from "@/lib/i18n"

export default function HomePage() {

  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("home")
  const [language, setLanguage] = useState<Language>("en")
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false)
  const [showIssuePrescription, setShowIssuePrescription] = useState(false)
  const [showProofScanner, setShowProofScanner] = useState(false)

  // Early return if no user
  if (!user) {
    return <LoginScreen language={language} onLanguageChange={setLanguage} />
  }

  const handleFloatingCTA = () => {
    if (user.role === "patient") {
      setShowPurchaseFlow(true)
    } else if (user.role === "doctor") {
      setShowIssuePrescription(true)
    } else if (user.role === "pharmacy") {
      setShowProofScanner(true)
    }
    console.log("Floating CTA clicked for role:", user.role)
  }

  const handleStartPurchase = () => {
    setShowPurchaseFlow(true)
  }

  const handleGenerateProof = (vcId: string) => {
    console.log("Generate proof for VC:", vcId)
    setShowPurchaseFlow(true)
  }

  const handlePurchaseComplete = () => {
    setShowPurchaseFlow(false)
    setActiveTab("orders")
  }

  const handlePurchaseCancel = () => {
    setShowPurchaseFlow(false)
  }

  const handleIssuePrescription = () => {
    setShowIssuePrescription(true)
  }

  const handlePrescriptionComplete = () => {
    setShowIssuePrescription(false)
    setActiveTab("prescriptions")
  }

  const handlePrescriptionCancel = () => {
    setShowIssuePrescription(false)
  }

  const handleScanProof = () => {
    setShowProofScanner(true)
  }

  const handleScanComplete = () => {
    setShowProofScanner(false)
    setActiveTab("scan")
  }

  const handleScanCancel = () => {
    setShowProofScanner(false)
  }

  const renderPatientContent = () => {
    switch (activeTab) {
      case "home":
        return <PatientHome onNavigate={setActiveTab} onStartPurchase={handleStartPurchase} />
      case "wallet":
        return <PrescriptionWallet onGenerateProof={handleGenerateProof} />
      case "wallet-dashboard":
        return <WalletUI />
      case "orders":
        return <OrdersList />
      case "profile":
        return (
          <div className="text-center py-12 lg:py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Profile</h2>
              <p className="text-muted-foreground text-lg">Profile management coming soon</p>
            </div>
          </div>
        )
      default:
        return <PatientHome onNavigate={setActiveTab} onStartPurchase={handleStartPurchase} />
    }
  }

  const renderDoctorContent = () => {
    switch (activeTab) {
      case "home":
        return <DoctorHome onNavigate={setActiveTab} onIssuePrescription={handleIssuePrescription} />
      case "prescriptions":
        return <PrescriptionsList />
      case "patients":
        return <PatientsList />
      case "profile":
        return (
          <div className="text-center py-12 lg:py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Profile</h2>
              <p className="text-muted-foreground text-lg">Profile management coming soon</p>
            </div>
          </div>
        )
      default:
        return <DoctorHome onNavigate={setActiveTab} onIssuePrescription={handleIssuePrescription} />
    }
  }

  const renderPharmacyContent = () => {
    switch (activeTab) {
      case "home":
        return <PharmacyHome onNavigate={setActiveTab} onScanProof={handleScanProof} />
      case "scan":
        return <OrdersManagement />
      case "inventory":
        return <InventoryManagement />
      case "wallet-dashboard":
        return <WalletUI />
      case "profile":
        return (
          <div className="text-center py-12 lg:py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Profile</h2>
              <p className="text-muted-foreground text-lg">Profile management coming soon</p>
            </div>
          </div>
        )
      default:
        return <PharmacyHome onNavigate={setActiveTab} onScanProof={handleScanProof} />
    }
  }

  const renderAdminContent = () => {
    switch (activeTab) {
      case "home":
        return <AdminHome />
      case "users":
        return <AdminHome />
      case "system":
        return <AdminHome />
      case "wallet-dashboard":
        return <WalletUI />
      case "profile":
        return (
          <div className="text-center py-12 lg:py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Profile</h2>
              <p className="text-muted-foreground text-lg">Profile management coming soon</p>
            </div>
          </div>
        )
      default:
        return <AdminHome />
    }
  }

  const renderAuditorContent = () => {
    switch (activeTab) {
      case "home":
        return <AuditorHome />
      case "analytics":
        return <AuditorHome />
      case "reports":
        return <AuditorHome />
      case "wallet-dashboard":
        return <WalletUI />
      case "profile":
        return (
          <div className="text-center py-12 lg:py-16">
            <div className="max-w-md mx-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Profile</h2>
              <p className="text-muted-foreground text-lg">Profile management coming soon</p>
            </div>
          </div>
        )
      default:
        return <AuditorHome />
    }
  }

  const renderContent = () => {
    if (user.role === "patient") {
      return renderPatientContent()
    } else if (user.role === "doctor") {
      return renderDoctorContent()
    } else if (user.role === "pharmacy") {
      return renderPharmacyContent()
    } else if (user.role === "admin") {
      return renderAdminContent()
    } else if (user.role === "auditor") {
      return renderAuditorContent()
    }

    return (
      <div className="text-center py-12 lg:py-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Welcome back, {user.name}</h2>
          <p className="text-muted-foreground mb-6 text-lg">Role: {user.role}</p>
          <p className="text-muted-foreground">{user.role} interface coming in next development phase</p>
        </div>
      </div>
    )
  }

  // Show purchase flow overlay for patients
  if (showPurchaseFlow && user.role === "patient") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md lg:max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
          <PurchaseFlow onComplete={handlePurchaseComplete} onCancel={handlePurchaseCancel} />
        </div>
      </div>
    )
  }

  // Show issue prescription overlay for doctors
  if (showIssuePrescription && user.role === "doctor") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md lg:max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
          <IssuePrescriptionForm onComplete={handlePrescriptionComplete} onCancel={handlePrescriptionCancel} />
        </div>
      </div>
    )
  }

  // Show proof scanner overlay for pharmacies
  if (showProofScanner && user.role === "pharmacy") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md lg:max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
          <ProofScanner onComplete={handleScanComplete} onCancel={handleScanCancel} />
        </div>
      </div>
    )
  }

  return (
    <ResponsiveLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      language={language}
      onLanguageChange={setLanguage}
      onFloatingCTAClick={handleFloatingCTA}
    >
      {renderContent()}
    </ResponsiveLayout>
  )
}

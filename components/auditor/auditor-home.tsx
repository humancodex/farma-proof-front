import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Shield, AlertTriangle, CheckCircle, Search, Download, Filter } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"

interface AuditorHomeProps {
  language: Language
}

export function AuditorHome({ language }: AuditorHomeProps) {
  const { t } = useTranslation(language)

  const complianceStats = {
    totalAudits: 2847,
    passedAudits: 2756,
    flaggedTransactions: 91,
    complianceRate: 96.8,
  }

  const auditTrail = [
    {
      id: 1,
      action: "Prescription Issued",
      doctor: "Dr. Sarah Johnson",
      patient: "Patient#4A7B",
      timestamp: "2024-01-15 14:30:22",
      status: "verified",
      proofId: "ZK_PROOF_001",
    },
    {
      id: 2,
      action: "Prescription Verified",
      pharmacy: "MedPlus Pharmacy",
      patient: "Patient#8C2D",
      timestamp: "2024-01-15 13:45:11",
      status: "verified",
      proofId: "ZK_PROOF_002",
    },
    {
      id: 3,
      action: "Payment Processed",
      pharmacy: "HealthCare Pharmacy",
      patient: "Patient#1F9E",
      timestamp: "2024-01-15 12:20:33",
      status: "flagged",
      proofId: "ZK_PROOF_003",
    },
  ]

  const complianceReports = [
    { id: 1, title: "Monthly Compliance Report", period: "January 2024", status: "completed", date: "2024-01-31" },
    { id: 2, title: "Prescription Audit Trail", period: "Q4 2023", status: "in-progress", date: "2024-01-15" },
    { id: 3, title: "ZK Proof Verification Log", period: "December 2023", status: "completed", date: "2023-12-31" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-2 text-gray-900">{t("auditor.dashboard")}</h1>
          <p className="text-body text-gray-600">{t("auditor.complianceOverview")}</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Download className="w-4 h-4 mr-2" />
          {t("auditor.exportReport")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("auditor.totalAudits")}</p>
                <p className="text-xl font-bold">{complianceStats.totalAudits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("auditor.passedAudits")}</p>
                <p className="text-xl font-bold">{complianceStats.passedAudits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("auditor.flaggedTransactions")}</p>
                <p className="text-xl font-bold">{complianceStats.flaggedTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("auditor.complianceRate")}</p>
                <p className="text-xl font-bold">{complianceStats.complianceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="audit-trail" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-trail">{t("auditor.auditTrail")}</TabsTrigger>
          <TabsTrigger value="compliance">{t("auditor.complianceReports")}</TabsTrigger>
          <TabsTrigger value="verification">{t("auditor.proofVerification")}</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-trail" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("auditor.recentActivity")}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input placeholder={t("auditor.searchTransactions")} className="w-64" />
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditTrail.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          entry.status === "verified" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{entry.action}</p>
                        <p className="text-body-sm text-gray-600">
                          {entry.doctor && `${t("auditor.doctor")}: ${entry.doctor}`}
                          {entry.pharmacy && `${t("auditor.pharmacy")}: ${entry.pharmacy}`}
                          {" • "}
                          {t("auditor.patient")}: {entry.patient}
                        </p>
                        <p className="text-caption text-gray-500">{entry.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={entry.status === "verified" ? "default" : "secondary"}>
                        {t(`auditor.status.${entry.status}`)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {t("auditor.viewDetails")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("auditor.complianceReports")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-body-sm text-gray-600">
                        {report.period} • {report.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.status === "completed" ? "default" : "secondary"}>
                        {t(`auditor.reportStatus.${report.status}`)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        {t("auditor.download")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("auditor.zkProofVerification")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">{t("auditor.verificationTools")}</p>
                  <Button className="mt-4">{t("auditor.startVerification")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

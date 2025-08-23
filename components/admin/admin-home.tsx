import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building2, FileText, Activity, Search, Settings, Shield } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"

interface AdminHomeProps {
  language: Language
}

export function AdminHome({ language }: AdminHomeProps) {
  const { t } = useTranslation(language)

  const systemStats = {
    totalUsers: 1247,
    activeDoctors: 89,
    activePharmacies: 34,
    totalPrescriptions: 5632,
    dailyTransactions: 156,
  }

  const recentUsers = [
    { id: 1, name: "Dr. Sarah Johnson", role: "doctor", status: "active", joined: "2024-01-15" },
    { id: 2, name: "MedPlus Pharmacy", role: "pharmacy", status: "pending", joined: "2024-01-14" },
    { id: 3, name: "Dr. Michael Chen", role: "doctor", status: "active", joined: "2024-01-13" },
    { id: 4, name: "HealthCare Pharmacy", role: "pharmacy", status: "active", joined: "2024-01-12" },
  ]

  const systemAlerts = [
    { id: 1, type: "warning", message: "High prescription volume detected", time: "2 hours ago" },
    { id: 2, type: "info", message: "System maintenance scheduled", time: "1 day ago" },
    { id: 3, type: "success", message: "New pharmacy verified", time: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-2 text-gray-900">{t("admin.dashboard")}</h1>
          <p className="text-body text-gray-600">{t("admin.systemOverview")}</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Settings className="w-4 h-4 mr-2" />
          {t("admin.settings")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("admin.totalUsers")}</p>
                <p className="text-xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("admin.activeDoctors")}</p>
                <p className="text-xl font-bold">{systemStats.activeDoctors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("admin.activePharmacies")}</p>
                <p className="text-xl font-bold">{systemStats.activePharmacies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("admin.totalPrescriptions")}</p>
                <p className="text-xl font-bold">{systemStats.totalPrescriptions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-body-sm text-gray-600">{t("admin.dailyTransactions")}</p>
                <p className="text-xl font-bold">{systemStats.dailyTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">{t("admin.userManagement")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("admin.analytics")}</TabsTrigger>
          <TabsTrigger value="alerts">{t("admin.systemAlerts")}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("admin.recentUsers")}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input placeholder={t("admin.searchUsers")} className="w-64" />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {user.role === "doctor" ? <Shield className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-body-sm text-gray-600">
                          {t(`role.${user.role}` as any)} • {t("admin.joined")} {user.joined}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {t(`admin.status.${user.status}`)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {t("admin.manage")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.prescriptionTrends")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t("admin.chartPlaceholder")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.userGrowth")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t("admin.chartPlaceholder")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.systemAlerts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.type === "warning"
                          ? "bg-yellow-500"
                          : alert.type === "info"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-600">{alert.time}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t("admin.resolve")}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

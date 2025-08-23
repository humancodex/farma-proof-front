"use client"

import type React from "react"

import { useState } from "react"
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth, DEMO_USERS, type UserRole } from "@/lib/auth"
import { useTranslation, type Language } from "@/lib/i18n"

interface LoginScreenProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function LoginScreen({ language, onLanguageChange }: LoginScreenProps) {
  const { login, isLoading } = useAuth()
  const { t } = useTranslation(language)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Invalid credentials. Use any demo email with password 'demo123'")
    }
  }

  const handleQuickLogin = (role: UserRole) => {
    const user = DEMO_USERS[role]
    setEmail(user.email)
    setPassword("demo123")
    setSelectedRole(role)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t("app.name")}</h1>
          <p className="text-muted-foreground">{t("app.tagline")}</p>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === "en" ? "es" : "en")}
            className="text-xs"
          >
            {language === "en" ? "Español" : "English"}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">{t("privacy.message")}</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose a demo role below or enter credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Demo Roles</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(DEMO_USERS).map(([role, user]) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickLogin(role as UserRole)}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Badge variant="secondary" className="text-xs">
                      {t(`role.${role}` as any)}
                    </Badge>
                    <span className="text-xs text-center">{user.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              Demo password: <code className="bg-muted px-1 rounded">demo123</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

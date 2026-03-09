"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { signIn } from "next-auth/react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound, Loader2, Mail } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export function LoginForm() {
  const t = useTranslations("LoginPage")
  const router = useRouter()
  const { login } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!email.trim()) {
      newErrors.email = t("errors.emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("errors.emailInvalid")
    }

    // Password validation
    if (!password) {
      newErrors.password = t("errors.passwordRequired")
    } else if (password.length < 6) {
      newErrors.password = t("errors.passwordMinLength")
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
    setErrors({})

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_AUTH_LOGIN_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Allow backend to set HTTP-only cookies
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || t("errors.loginFailed"))
      }

      // Handle successful login - store access token and user, then redirect
      // Refresh token is stored in HTTP-only cookie by the backend
      const data = await response.json()
      login(data.access, data.user)
      router.push("/profile")
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : t("errors.loginFailed"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const [isSSOLoading, setIsSSOLoading] = useState(false)

  const handleSSOLogin = async () => {
    setIsSSOLoading(true)
    try {
      await signIn("keycloak", { callbackUrl: "/auth/callback" })
    } catch (error) {
      console.error("SSO login error:", error)
      setIsSSOLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errors.general && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {errors.general}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="mt-2" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("loggingIn")}
              </>
            ) : (
              t("login")
            )}
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("or")}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleSSOLogin}
            disabled={isLoading || isSSOLoading}
            size="lg"
          >
            {isSSOLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("ssoLogin")}
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                {t("ssoLogin")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

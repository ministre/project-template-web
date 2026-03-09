"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Clock, Key, Shield, History } from "lucide-react"
import { refreshAccessToken, getAuthMethod, type AuthMethod } from "@/hooks/useAuth"
import { AuthGuard } from "@/components/AuthGuard"

function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleString()
}

export function DebugContent() {
  const t = useTranslations("DebugPage")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshStatus, setLastRefreshStatus] = useState<"success" | "error" | null>(null)
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null)
  const [lastTokenRefresh, setLastTokenRefresh] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const expiration = localStorage.getItem("accessTokenExpiration")
    const method = getAuthMethod()
    const lastRefresh = localStorage.getItem("lastTokenRefresh")
    
    if (token) {
      setAccessToken(token)
    }
    if (expiration) {
      setTokenExpiration(expiration)
    }
    if (method) {
      setAuthMethod(method)
    }
    if (lastRefresh) {
      setLastTokenRefresh(lastRefresh)
    }
  }, [])

  const handleRefreshToken = async () => {
    setIsRefreshing(true)
    setLastRefreshStatus(null)
    
    const currentAuthMethod = getAuthMethod()
    console.log("[Debug] Manual token refresh triggered, method:", currentAuthMethod)
    
    const result = await refreshAccessToken(currentAuthMethod)
    
    if (result?.access) {
      localStorage.setItem("accessToken", result.access)
      setAccessToken(result.access)
      if (result.access_expiration) {
        localStorage.setItem("accessTokenExpiration", result.access_expiration)
        setTokenExpiration(result.access_expiration)
      }
      
      // Save and display last refresh time
      const refreshTime = new Date().toISOString()
      localStorage.setItem("lastTokenRefresh", refreshTime)
      setLastTokenRefresh(refreshTime)
      
      console.log("[Debug] Token refreshed successfully:", result.access.substring(0, 20) + "...")
      console.log("[Debug] Token expires at:", result.access_expiration)
      setLastRefreshStatus("success")
    } else {
      console.log("[Debug] Token refresh failed")
      setLastRefreshStatus("error")
    }
    
    setIsRefreshing(false)
  }

  return (
    <AuthGuard>
      <div className="py-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessToken && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Key className="h-4 w-4 shrink-0" />
                  <span>{t("accessToken")}:</span>
                </div>
                <div className="rounded bg-muted p-2 text-xs font-mono break-all max-h-24 overflow-y-auto">
                  {accessToken}
                </div>
              </div>
            )}
            
            {authMethod && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>{t("authMethod")}: <span className="font-medium text-foreground uppercase">{authMethod}</span></span>
              </div>
            )}
            
            {tokenExpiration && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t("tokenExpires")}: {formatDateTime(tokenExpiration)}</span>
              </div>
            )}
            
            {lastTokenRefresh && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <History className="h-4 w-4" />
                <span>{t("lastRefresh")}: {formatDateTime(lastTokenRefresh)}</span>
              </div>
            )}
            
            <Button 
              onClick={handleRefreshToken} 
              disabled={isRefreshing}
              className="w-full"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? t("refreshing") : t("refreshToken")}
            </Button>
            
            {lastRefreshStatus === "success" && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {t("refreshSuccess")}
              </p>
            )}
            
            {lastRefreshStatus === "error" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {t("refreshError")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}

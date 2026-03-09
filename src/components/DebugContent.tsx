"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Clock } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

interface RefreshResponse {
  access: string
  access_expiration: string
}

async function refreshAccessToken(): Promise<RefreshResponse | null> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_TOKEN_REFRESH_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

function formatExpiration(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleString()
}

export function DebugContent() {
  const t = useTranslations("DebugPage")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshStatus, setLastRefreshStatus] = useState<"success" | "error" | null>(null)
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(null)

  useEffect(() => {
    const expiration = localStorage.getItem("accessTokenExpiration")
    if (expiration) {
      setTokenExpiration(expiration)
    }
  }, [])

  const handleRefreshToken = async () => {
    setIsRefreshing(true)
    setLastRefreshStatus(null)
    
    console.log("[Debug] Manual token refresh triggered")
    
    const result = await refreshAccessToken()
    
    if (result?.access) {
      localStorage.setItem("accessToken", result.access)
      if (result.access_expiration) {
        localStorage.setItem("accessTokenExpiration", result.access_expiration)
        setTokenExpiration(result.access_expiration)
      }
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
      <div className="container mx-auto p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tokenExpiration && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t("tokenExpires")}: {formatExpiration(tokenExpiration)}</span>
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

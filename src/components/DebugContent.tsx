"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import { AuthGuard } from "@/components/AuthGuard"

async function refreshAccessToken(): Promise<{ access: string } | null> {
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

export function DebugContent() {
  const t = useTranslations("DebugPage")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshStatus, setLastRefreshStatus] = useState<"success" | "error" | null>(null)

  const handleRefreshToken = async () => {
    setIsRefreshing(true)
    setLastRefreshStatus(null)
    
    console.log("[Debug] Manual token refresh triggered")
    
    const result = await refreshAccessToken()
    
    if (result?.access) {
      localStorage.setItem("accessToken", result.access)
      console.log("[Debug] Token refreshed successfully:", result.access.substring(0, 20) + "...")
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

"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, User as UserIcon } from "lucide-react"

export function ProfileContent() {
  const t = useTranslations("UserProfilePage")
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{t("username")}</span>
            <span className="font-medium">{user.username}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{t("email")}</span>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{t("firstName")}</span>
            <span className="font-medium">{user.first_name}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{t("lastName")}</span>
            <span className="font-medium">{user.last_name}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

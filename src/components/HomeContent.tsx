"use client"

import { useTranslations } from "next-intl"
import { AuthGuard } from "@/components/AuthGuard"

export function HomeContent() {
  const t = useTranslations("HomePage")

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>
    </AuthGuard>
  )
}

import { setRequestLocale } from "next-intl/server"
import { SSOCallback } from "@/components/SSOCallback"

export default async function AuthCallbackPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SSOCallback />
}

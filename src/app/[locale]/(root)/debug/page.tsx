import { setRequestLocale } from "next-intl/server"
import { DebugContent } from "@/components/DebugContent"

export default async function Debug({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <DebugContent />
}

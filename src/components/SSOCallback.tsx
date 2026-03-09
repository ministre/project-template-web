"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "@/i18n/navigation"
import { Loader2 } from "lucide-react"

export function SSOCallback() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated" && session) {
      // Save token and user to localStorage
      if (session.accessToken) {
        localStorage.setItem("accessToken", session.accessToken)
        console.log("[v0] SSO: Access token saved to localStorage")
      }
      
      if (session.user) {
        const user = {
          email: session.user.email || "",
          username: session.user.name || "",
          first_name: session.user.name?.split(" ")[0] || "",
          last_name: session.user.name?.split(" ").slice(1).join(" ") || "",
        }
        localStorage.setItem("user", JSON.stringify(user))
        console.log("[v0] SSO: User data saved to localStorage")
      }
      
      // Save auth method and last refresh time
      localStorage.setItem("authMethod", "sso")
      localStorage.setItem("lastTokenRefresh", new Date().toISOString())
      console.log("[v0] SSO: Auth method saved as 'sso'")

      // Dispatch event to update header
      window.dispatchEvent(new Event("tokenChanged"))
      
      // Redirect to profile
      router.push("/profile")
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [session, status, router])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  )
}

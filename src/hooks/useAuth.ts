"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"

export interface User {
  pk?: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export type AuthMethod = "api" | "sso"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface JWTPayload {
  exp: number
  iat: number
  jti: string
  user_id: number
}

function parseJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload) return true
  
  // Token is expired if exp time has passed
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

function isTokenExpiringSoon(token: string, thresholdSeconds: number = 300): boolean {
  const payload = parseJWT(token)
  if (!payload) return true
  
  // Token is expiring soon if less than threshold seconds remaining
  const now = Math.floor(Date.now() / 1000)
  return (payload.exp - now) < thresholdSeconds
}

interface RefreshResponse {
  access: string
  access_expiration: string
}

// Helper to get auth method from localStorage
export function getAuthMethod(): AuthMethod | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authMethod") as AuthMethod | null
}

// Helper to save last token refresh time
function saveLastRefreshTime() {
  localStorage.setItem("lastTokenRefresh", new Date().toISOString())
}

// Refresh token for API auth (uses HTTP-only cookie)
async function refreshApiToken(): Promise<RefreshResponse | null> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_TOKEN_REFRESH_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send HTTP-only cookies with request
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

// Refresh token for SSO auth (uses NextAuth session endpoint)
async function refreshSsoToken(): Promise<RefreshResponse | null> {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      return null
    }

    const session = await response.json()
    
    if (session?.accessToken) {
      return {
        access: session.accessToken,
        access_expiration: session.expires || "", // SSO provides expiration in "expires" field
      }
    }
    
    return null
  } catch {
    return null
  }
}

// Unified refresh function that chooses the right method
export async function refreshAccessToken(authMethod?: AuthMethod | null): Promise<RefreshResponse | null> {
  const method = authMethod ?? getAuthMethod()
  
  if (method === "sso") {
    return refreshSsoToken()
  }
  
  // Default to API refresh
  return refreshApiToken()
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })
  
  const router = useRouter()
  const pathname = usePathname()

  const clearAuth = useCallback(() => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("accessTokenExpiration")
    localStorage.removeItem("user")
    localStorage.removeItem("authMethod")
    localStorage.removeItem("lastTokenRefresh")
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  const validateAndRefreshToken = useCallback(async (): Promise<boolean> => {
    const accessToken = localStorage.getItem("accessToken")
    const userJson = localStorage.getItem("user")

    // No tokens - not authenticated
    if (!accessToken || !userJson) {
      clearAuth()
      return false
    }

    // Parse user
    let user: User
    try {
      user = JSON.parse(userJson) as User
    } catch {
      clearAuth()
      return false
    }

    // Check if access token is still valid and not expiring soon
    if (!isTokenExpired(accessToken) && !isTokenExpiringSoon(accessToken)) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    }

    // Access token expired or expiring soon - try to refresh based on auth method
    const authMethod = getAuthMethod()
    const result = await refreshAccessToken(authMethod)
    
    if (result?.access) {
      localStorage.setItem("accessToken", result.access)
      if (result.access_expiration) {
        localStorage.setItem("accessTokenExpiration", result.access_expiration)
      }
      saveLastRefreshTime()
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    }

    // Could not refresh - clear auth
    clearAuth()
    return false
  }, [clearAuth])

  // Initial auth check
  useEffect(() => {
    validateAndRefreshToken()
  }, [validateAndRefreshToken])

  // Background token refresh
  useEffect(() => {
    const refreshInterval = parseInt(process.env.NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL || "60000", 10)
    
    const intervalId = setInterval(async () => {
      const accessToken = localStorage.getItem("accessToken")
      
      // Skip if no token (user not logged in)
      if (!accessToken) return
      
      const authMethod = getAuthMethod()
      console.log("[v0] Background token refresh triggered, method:", authMethod)
      
      const result = await refreshAccessToken(authMethod)
      
      if (result?.access) {
        localStorage.setItem("accessToken", result.access)
        if (result.access_expiration) {
          localStorage.setItem("accessTokenExpiration", result.access_expiration)
        }
        saveLastRefreshTime()
        console.log("[v0] Token refreshed successfully, expires:", result.access_expiration)
      } else {
        console.log("[v0] Token refresh failed, clearing auth")
        clearAuth()
      }
    }, refreshInterval)
    
    return () => clearInterval(intervalId)
  }, [clearAuth])

  // Check token on pathname change (navigation)
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken")
      
      // Skip if no token (user not logged in)
      if (!accessToken) return
      
      const isValid = await validateAndRefreshToken()
      
      // If token invalid and not on login page, redirect to login
      if (!isValid && pathname !== "/login") {
        router.push("/login")
      }
    }
    
    checkAuth()
  }, [pathname, validateAndRefreshToken, router])

  const login = useCallback((accessToken: string, user: User, authMethod: AuthMethod = "api") => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("authMethod", authMethod)
    saveLastRefreshTime()
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
  }, [])

  const logout = useCallback(() => {
    clearAuth()
  }, [clearAuth])

  return {
    ...authState,
    login,
    logout,
    validateAndRefreshToken,
  }
}

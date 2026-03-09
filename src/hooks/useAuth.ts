"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"

export interface User {
  pk: number
  username: string
  email: string
  first_name: string
  last_name: string
}

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

async function refreshAccessToken(refreshToken: string): Promise<{ access: string } | null> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_AUTH_TOKEN_REFRESH_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
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
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  const validateAndRefreshToken = useCallback(async (): Promise<boolean> => {
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
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

    // Access token expired or expiring soon - try to refresh
    if (refreshToken && !isTokenExpired(refreshToken)) {
      const result = await refreshAccessToken(refreshToken)
      
      if (result?.access) {
        localStorage.setItem("accessToken", result.access)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        return true
      }
    }

    // Could not refresh - clear auth
    clearAuth()
    return false
  }, [clearAuth])

  // Initial auth check
  useEffect(() => {
    validateAndRefreshToken()
  }, [validateAndRefreshToken])

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

  const login = useCallback((accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("user", JSON.stringify(user))
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

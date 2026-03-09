"use client"

import { useState, useEffect, useCallback } from "react"

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

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const userJson = localStorage.getItem("user")

    if (accessToken && userJson) {
      try {
        const user = JSON.parse(userJson) as User
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = useCallback((accessToken: string, user: User) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("user", JSON.stringify(user))
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }, [])

  return {
    ...authState,
    login,
    logout,
  }
}

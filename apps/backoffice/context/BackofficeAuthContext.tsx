"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export interface BackofficeUser {
  id: string
  email: string
  name: string
  role: string
  routes: string[]
  portal: "backoffice"
}

interface BackofficeAuthContextType {
  user: BackofficeUser | null
  loading: boolean
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasRouteAccess: (path: string) => boolean
}

const BackofficeAuthContext = createContext<BackofficeAuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  hasRouteAccess: () => false,
})

const STORAGE_KEY = "sdverse_backoffice_session"

export const BackofficeAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BackofficeUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // 1. Initialize session from localStorage or cookie
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed: BackofficeUser = JSON.parse(saved)
        if (parsed && parsed.portal === "backoffice") {
          setUser(parsed)
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    } else {
      // Default initial session for seamless development / admin experience
      const defaultAdmin: BackofficeUser = {
        id: "admin_01",
        email: "admin@sdverse.auto",
        name: "Admin Spryker",
        role: "Admin",
        routes: [
          "/",
          "/companies",
          "/customers",
          "/users",
          "/roles",
          "/products",
          "/orders",
          "/sellers",
          "/settings",
        ],
        portal: "backoffice",
      }
      setUser(defaultAdmin)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAdmin))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        return { success: false, error: data.message || "Failed to log in." }
      }

      const userData: BackofficeUser = data.user
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      document.cookie = `sdverse_backoffice_session=1; path=/; max-age=86400; SameSite=Lax`

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error during login." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    document.cookie = "sdverse_backoffice_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/login")
  }

  const hasRouteAccess = (path: string): boolean => {
    if (!user) return false
    const allowed = user.routes || []
    if (path === "/" && allowed.includes("/")) return true
    return allowed.some((r) => r === path || (r !== "/" && path.startsWith(r)))
  }

  // Redirect to /login if unauthenticated and not on /login
  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [loading, user, pathname, router])

  return (
    <BackofficeAuthContext.Provider value={{ user, loading, login, logout, hasRouteAccess }}>
      {children}
    </BackofficeAuthContext.Provider>
  )
}

export const useBackofficeAuth = () => useContext(BackofficeAuthContext)

"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export interface SellerUser {
  id: string | number
  id_customer?: number
  email: string
  first_name?: string
  last_name?: string
  name: string
  company_id: string
  id_company?: number | null
  company_name: string
  role_id?: string
  role_name: string
  routes: string[]
  portal: "seller"
}

interface SellerAuthContextType {
  user: SellerUser | null
  loading: boolean
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasRouteAccess: (path: string) => boolean
}

const SellerAuthContext = createContext<SellerAuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  hasRouteAccess: () => false,
})

const STORAGE_KEY = "sdverse_seller_session"

export const SellerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SellerUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // 1. Initialize session from localStorage or cookie
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed: SellerUser = JSON.parse(saved)
        if (parsed && parsed.portal === "seller") {
          setUser(parsed)
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  // Sync latest permissions from backend when logged in
  useEffect(() => {
    if (user?.email) {
      refreshPermissions(user.email)
    }
  }, [user?.email])

  const refreshPermissions = async (email: string) => {
    try {
      const res = await fetch("/api/auth/me?email=" + encodeURIComponent(email))
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
        }
      }
    } catch (e) {}
  }

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

      const userData: SellerUser = data.user
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      document.cookie = `sdverse_seller_session=1; path=/; max-age=86400; SameSite=Lax`

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error during login." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    document.cookie = "sdverse_seller_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/login")
  }

  const hasRouteAccess = (path: string): boolean => {
    if (!user) return false
    const allowed = user.routes || []
    // Exact match or root match
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
    <SellerAuthContext.Provider value={{ user, loading, login, logout, hasRouteAccess }}>
      {children}
    </SellerAuthContext.Provider>
  )
}

export const useSellerAuth = () => useContext(SellerAuthContext)

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  name: string
  role: "profesor" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (password: string, email?: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user)
      }
      setIsLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase.from("users").select("*").eq("email", authUser.email).single()

      if (error) {
        console.error("Error loading user profile:", error)
        return
      }

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
        })
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error)
    }
  }

  const login = async (passwordOrEmail: string, passwordParam?: string): Promise<boolean> => {
    setIsLoading(true)
    const isAdminLogin = passwordParam === undefined
    const adminPassword = "navojoa2026" // Actualizar contraseña del administrador a navojoa2026
    const adminEmail = "admin@taller.edu"

    try {
      if (isAdminLogin) {
        console.log("[v0] Attempting admin login with password only")
        if (passwordOrEmail === adminPassword) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
          })

          if (error) {
            console.error("[v0] Admin login error:", error.message)
            setIsLoading(false)
            return false
          }

          console.log("[v0] Admin login successful")
          return true
        } else {
          console.error("[v0] Invalid admin password")
          setIsLoading(false)
          return false
        }
      } else {
        console.log("[v0] Attempting professor login with email:", passwordOrEmail)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: passwordOrEmail,
          password: passwordParam!,
        })

        if (error) {
          console.error("[v0] Professor login error:", error.message)
          setIsLoading(false)
          return false
        }

        console.log("[v0] Professor login successful, user:", data.user?.email)
        return true
      }
    } catch (error) {
      console.error("[v0] Login exception:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

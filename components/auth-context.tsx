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
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (isMounted) {
          if (session?.user) {
            await loadUserProfile(session.user)
          }
          setIsLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile } = await supabase.from("users").select("*").eq("email", authUser.email).single()

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
        })
      }
    } catch (error) {
      // Error silencioso
    }
  }

  const login = async (passwordOrEmail: string, passwordParam?: string): Promise<boolean> => {
    const isAdminLogin = passwordParam === undefined
    const adminPassword = "navojoa2026"
    const adminEmail = "admin@taller.edu"

    try {
      if (isAdminLogin) {
        if (passwordOrEmail === adminPassword) {
          const { error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
          })
          if (!error) {
            const {
              data: { session },
            } = await supabase.auth.getSession()
            if (session?.user) {
              await loadUserProfile(session.user)
            }
            return true
          }
          return false
        }
        return false
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: passwordOrEmail,
          password: passwordParam!,
        })
        if (!error) {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          if (session?.user) {
            await loadUserProfile(session.user)
          }
          return true
        }
        return false
      }
    } catch {
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

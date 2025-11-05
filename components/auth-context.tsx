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
    const adminPassword = "navojoa2026"
    const adminEmail = "admin@taller.edu"

    try {
      if (isAdminLogin) {
        if (passwordOrEmail === adminPassword) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
          })

          if (error) {
            setIsLoading(false)
            return false
          }

          return true
        } else {
          setIsLoading(false)
          return false
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: passwordOrEmail,
          password: passwordParam!,
        })

        if (error) {
          setIsLoading(false)
          return false
        }

        return true
      }
    } catch (error) {
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

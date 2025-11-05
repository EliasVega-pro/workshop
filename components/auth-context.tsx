"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

interface User {
  id: string
  email: string
  name: string
  role: "profesor" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (password: string, email?: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const login = async (passwordOrEmail: string, passwordParam?: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const isAdminLogin = passwordParam === undefined
      const adminPassword = "navojoa2026"

      if (isAdminLogin) {
        // Admin login - solo contraseña
        if (passwordOrEmail === adminPassword) {
          const { data: profile } = await supabase.from("users").select("*").eq("role", "admin").single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
            })
            return true
          }
        }
        return false
      } else {
        // Profesor login - email + contraseña
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("email", passwordOrEmail)
          .eq("password", passwordParam)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
          })
          return true
        }
        return false
      }
    } catch (error) {
      console.log("[v0] Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Verificar que el email no existe
      const { data: existing } = await supabase.from("users").select("id").eq("email", email).single()

      if (existing) {
        return false
      }

      // Crear nuevo usuario profesor
      const { error } = await supabase.from("users").insert([
        {
          email,
          password,
          name,
          role: "profesor",
        },
      ])

      if (!error) {
        // Auto login después de registrarse
        return await login(email, password)
      }
      return false
    } catch (error) {
      console.log("[v0] Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

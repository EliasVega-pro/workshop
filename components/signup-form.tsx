"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Mail, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function SignupForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    if (!email || !password || !name) {
      setError("Por favor complete todos los campos")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Attempting signup with email:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: "profesor",
          },
        },
      })

      console.log("[v0] Signup response:", data, error)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Insert user profile
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: email,
            name: name,
            role: "profesor",
          },
        ])

        if (profileError) {
          console.error("[v0] Profile creation error:", profileError)
        }

        setMessage("Usuario creado exitosamente. Ahora puede iniciar sesión.")
        setTimeout(() => onBack(), 2000)
      }
    } catch (error) {
      console.error("[v0] Signup exception:", error)
      setError("Error al crear usuario")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Crear Cuenta</CardTitle>
        <p className="text-muted-foreground">Registro de nuevo profesor</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Dr. Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="profesor@universidad.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <Button type="button" variant="outline" className="w-full bg-transparent" onClick={onBack}>
              Volver al Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

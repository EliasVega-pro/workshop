"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, GraduationCap } from "lucide-react"
import { useAuth } from "./auth-context"
import { SignupForm } from "./signup-form"

export function LoginForm() {
  const [loginType, setLoginType] = useState<"profesor" | "admin">("profesor")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showSignup, setShowSignup] = useState(false)
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (loginType === "admin") {
      if (!password) {
        return
      }
      const success = await login(password)
      if (!success) {
        // Fail silenciosamente
      }
    } else {
      if (!email || !password) {
        return
      }
      const success = await login(email, password)
      if (!success) {
        // Fail silenciosamente
      }
    }
  }

  if (showSignup) {
    return <SignupForm onBack={() => setShowSignup(false)} />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Sistema de Reservas</CardTitle>
          <p className="text-muted-foreground">Taller de Ingeniería</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setLoginType("profesor")
                setError("")
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                loginType === "profesor"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Profesor
            </button>
            <button
              onClick={() => {
                setLoginType("admin")
                setError("")
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                loginType === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginType === "profesor" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="profesor@universidad.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input"
                  disabled={isLoading}
                />
              </div>
            )}

            {loginType === "admin" && (
              <div className="p-3 bg-primary/10 border border-primary rounded-lg">
                <p className="text-sm text-primary font-medium">Acceso de Administrador</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {loginType === "admin" ? "Contraseña Admin" : "Contraseña"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={loginType === "admin" ? "Ingrese contraseña de administrador" : "Ingrese su contraseña"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input"
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              {loginType === "profesor" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowSignup(true)}
                >
                  Crear Nueva Cuenta
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Usuarios de prueba:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p className="font-medium">Admin: Solo contraseña</p>
              <p>• Contraseña: navojoa2026</p>
              <p className="font-medium mt-2">Profesores:</p>
              <p>• profesor1@universidad.edu / Profesor123!</p>
              <p>O cree una nueva cuenta usando el botón de arriba.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Calendar, User, BookOpen, LogOut, History, Save, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-context"
import { LoginForm } from "@/components/login-form"
import { HistoryPanel } from "@/components/history-panel"
import { StatusPanel } from "@/components/status-panel"
import { createClient } from "@/lib/supabase/client"

interface Material {
  id: string
  nombre: string
  cantidad: number
  material_id?: string
}

interface Subject {
  id: string
  name: string
}

interface AvailableMaterial {
  id: string
  name: string
  available_quantity: number
  unit: string
}

type View = "main" | "history" | "status"

export default function WorkshopReservation() {
  const { toast } = useToast()
  const { user, logout, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState<View>("main")
  const [maestro, setMaestro] = useState("")
  const [materiaId, setMateriaId] = useState("")
  const [fechaReservacion, setFechaReservacion] = useState("")
  const [fechaUso, setFechaUso] = useState("")
  const [materiales, setMateriales] = useState<Material[]>([])
  const [materialSeleccionado, setMaterialSeleccionado] = useState("")
  const [nuevaCantidad, setNuevaCantidad] = useState("")

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [availableMaterials, setAvailableMaterials] = useState<AvailableMaterial[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadSubjects()
      loadMaterials()
      setMaestro(user.name) // Auto-fill teacher name
    }
  }, [user])

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase.from("subjects").select("*").order("name")

      if (error) throw error
      setSubjects(data || [])
    } catch (error) {
      console.error("Error loading subjects:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las materias.",
        variant: "destructive",
      })
    }
  }

  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase.from("materials").select("*").order("name")

      if (error) throw error
      setAvailableMaterials(data || [])
    } catch (error) {
      console.error("Error loading materials:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los materiales.",
        variant: "destructive",
      })
    }
  }

  const agregarMaterial = () => {
    if (materialSeleccionado && nuevaCantidad.trim()) {
      const selectedMaterial = availableMaterials.find((m) => m.id === materialSeleccionado)
      if (!selectedMaterial) return

      const cantidad = Number.parseInt(nuevaCantidad)
      if (cantidad > selectedMaterial.available_quantity) {
        toast({
          title: "Error",
          description: `Solo hay ${selectedMaterial.available_quantity} ${selectedMaterial.unit} disponibles.`,
          variant: "destructive",
        })
        return
      }

      const material: Material = {
        id: Date.now().toString(),
        nombre: selectedMaterial.name,
        cantidad: cantidad,
        material_id: selectedMaterial.id,
      }
      setMateriales([...materiales, material])
      setMaterialSeleccionado("")
      setNuevaCantidad("")
      toast({
        title: "Material agregado",
        description: `${material.nombre} (${material.cantidad}) agregado exitosamente.`,
      })
    }
  }

  const quitarMaterial = (id: string) => {
    setMateriales(materiales.filter((material) => material.id !== id))
    toast({
      title: "Material eliminado",
      description: "El material ha sido eliminado de la lista.",
    })
  }

  const hacerReservacion = async () => {
    if (!maestro || !materiaId || !fechaReservacion || !fechaUso) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    if (!user) return

    setIsSubmitting(true)

    try {
      // Create reservation
      const { data: reservation, error: reservationError } = await supabase
        .from("reservations")
        .insert({
          user_id: user.id,
          subject_id: materiaId,
          reservation_date: fechaReservacion,
          usage_date: fechaUso,
          status: "activa",
        })
        .select()
        .single()

      if (reservationError) throw reservationError

      // Add materials to reservation
      if (materiales.length > 0) {
        const materialInserts = materiales.map((material) => ({
          reservation_id: reservation.id,
          material_id: material.material_id,
          quantity: material.cantidad,
        }))

        const { error: materialsError } = await supabase.from("reservation_materials").insert(materialInserts)

        if (materialsError) throw materialsError
      }

      toast({
        title: "Reservación exitosa",
        description: `Taller reservado para ${maestro}`,
      })

      // Clear form
      limpiarCeldas()
    } catch (error) {
      console.error("Error creating reservation:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la reservación. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const limpiarCeldas = () => {
    setMaestro(user?.name || "")
    setMateriaId("")
    setFechaReservacion("")
    setFechaUso("")
    setMateriales([])
    setMaterialSeleccionado("")
    setNuevaCantidad("")
    toast({
      title: "Formulario limpiado",
      description: "Todos los campos han sido limpiados.",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Ha salido del sistema exitosamente.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  if (currentView === "history") {
    return <HistoryPanel onBack={() => setCurrentView("main")} />
  }

  if (currentView === "status") {
    return <StatusPanel onBack={() => setCurrentView("main")} />
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-primary">
                Sistema de Reservas - Taller de Ingeniería
              </CardTitle>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Bienvenido</p>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Form */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Teacher and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maestro" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Maestro:
                </Label>
                <Input
                  id="maestro"
                  placeholder="Ingrese nombre completo"
                  value={maestro}
                  onChange={(e) => setMaestro(e.target.value)}
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="materia" className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Materia:
                </Label>
                <Select value={materiaId} onValueChange={setMateriaId}>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Seleccione una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaReservacion" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de reservación:
                </Label>
                <Input
                  id="fechaReservacion"
                  type="date"
                  value={fechaReservacion}
                  onChange={(e) => setFechaReservacion(e.target.value)}
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaUso" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de uso:
                </Label>
                <Input
                  id="fechaUso"
                  type="date"
                  value={fechaUso}
                  onChange={(e) => setFechaUso(e.target.value)}
                  className="bg-input"
                />
              </div>
            </div>

            {/* Material Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Gestión de Materiales</h3>
                <div className="flex gap-2">
                  <Button onClick={agregarMaterial} className="bg-green-500 hover:bg-green-600 text-white" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                  <Button
                    onClick={() => {
                      if (materiales.length > 0) {
                        const lastMaterial = materiales[materiales.length - 1]
                        setMateriales(materiales.filter((material) => material.id !== lastMaterial.id))
                        toast({
                          title: "Material eliminado",
                          description: "El material ha sido eliminado de la lista.",
                        })
                      }
                    }}
                    variant="destructive"
                    size="sm"
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    Quitar
                  </Button>
                </div>
              </div>

              {/* Add Material Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <Select value={materialSeleccionado} onValueChange={setMaterialSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar material" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMaterials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.available_quantity} {material.unit} disponibles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(e.target.value)}
                />
                <Button onClick={agregarMaterial} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Material
                </Button>
              </div>

              {/* Materials Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center font-semibold">Cantidad</TableHead>
                      <TableHead className="text-center font-semibold">Material</TableHead>
                      <TableHead className="text-center font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materiales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          No hay materiales agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      materiales.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="text-center">{material.cantidad}</TableCell>
                          <TableCell className="text-center">{material.nombre}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={() => {
                                setMateriales(materiales.filter((m) => m.id !== material.id))
                                toast({
                                  title: "Material eliminado",
                                  description: "El material ha sido eliminado de la lista.",
                                })
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={logout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Salir de la sesión
          </Button>

          <Button
            onClick={hacerReservacion}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Calendar className="w-4 h-4" />
            {isSubmitting ? "Guardando..." : "Hacer reservación"}
          </Button>

          <Button onClick={limpiarCeldas} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Trash2 className="w-4 h-4" />
            Limpiar las celdas
          </Button>

          <Button onClick={() => setCurrentView("status")} variant="secondary" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Ver estado del Taller
          </Button>

          <Button
            onClick={() =>
              toast({ title: "Cambios guardados", description: "Los cambios han sido guardados exitosamente." })
            }
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>

          <Button onClick={() => setCurrentView("history")} variant="secondary" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Ir a la pantalla de historial
          </Button>
        </div>
      </div>
    </div>
  )
}

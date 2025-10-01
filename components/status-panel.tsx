"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Activity, Calendar, Users, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface StatusPanelProps {
  onBack: () => void
}

// Mock data for workshop status
const workshopStatus = {
  disponibilidad: "disponible", // disponible, ocupado, mantenimiento
  ocupacionActual: 3,
  capacidadMaxima: 8,
  reservasHoy: 5,
  reservasSemana: 12,
  materialesDisponibles: 85,
  materialesTotal: 100,
  proximasReservaciones: [
    {
      id: "1",
      maestro: "Dr. Juan Pérez",
      materia: "Mecánica de Fluidos",
      hora: "09:00 - 11:00",
      fecha: "2024-01-25",
    },
    {
      id: "2",
      maestro: "Ing. María García",
      materia: "Resistencia de Materiales",
      hora: "14:00 - 16:00",
      fecha: "2024-01-25",
    },
    {
      id: "3",
      maestro: "Dr. Carlos López",
      materia: "Termodinámica",
      hora: "10:00 - 12:00",
      fecha: "2024-01-26",
    },
  ],
  alertas: [
    {
      tipo: "warning",
      mensaje: "Mantenimiento programado para el 30 de enero",
      fecha: "2024-01-30",
    },
    {
      tipo: "info",
      mensaje: "Nuevos equipos disponibles en el laboratorio",
      fecha: "2024-01-24",
    },
  ],
}

export function StatusPanel({ onBack }: StatusPanelProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponible":
        return <Badge className="bg-green-500 text-white">Disponible</Badge>
      case "ocupado":
        return <Badge className="bg-red-500 text-white">Ocupado</Badge>
      case "mantenimiento":
        return <Badge className="bg-yellow-500 text-white">Mantenimiento</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const ocupacionPorcentaje = (workshopStatus.ocupacionActual / workshopStatus.capacidadMaxima) * 100
  const materialesPorcentaje = (workshopStatus.materialesDisponibles / workshopStatus.materialesTotal) * 100

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <CardTitle className="text-2xl font-bold text-primary">Estado del Taller de Ingeniería</CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estado Actual</p>
                  <div className="mt-2">{getStatusBadge(workshopStatus.disponibilidad)}</div>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ocupación</p>
                  <p className="text-2xl font-bold">
                    {workshopStatus.ocupacionActual}/{workshopStatus.capacidadMaxima}
                  </p>
                  <Progress value={ocupacionPorcentaje} className="mt-2" />
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reservas Hoy</p>
                  <p className="text-2xl font-bold text-primary">{workshopStatus.reservasHoy}</p>
                  <p className="text-xs text-muted-foreground">{workshopStatus.reservasSemana} esta semana</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Materiales</p>
                  <p className="text-2xl font-bold">
                    {workshopStatus.materialesDisponibles}/{workshopStatus.materialesTotal}
                  </p>
                  <Progress value={materialesPorcentaje} className="mt-2" />
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas y Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workshopStatus.alertas.map((alerta, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alerta.tipo === "warning" ? "bg-yellow-50 border-yellow-400" : "bg-blue-50 border-blue-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  {alerta.tipo === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  )}
                  <p className="font-medium">{alerta.mensaje}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Fecha: {alerta.fecha}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Próximas Reservaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workshopStatus.proximasReservaciones.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{reserva.maestro}</h4>
                    <p className="text-sm text-muted-foreground">{reserva.materia}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{reserva.hora}</p>
                    <p className="text-sm text-muted-foreground">{reserva.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Package className="w-6 h-6" />
                <span className="text-sm">Inventario de Materiales</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Programar Mantenimiento</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Users className="w-6 h-6" />
                <span className="text-sm">Gestionar Usuarios</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
                <Activity className="w-6 h-6" />
                <span className="text-sm">Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

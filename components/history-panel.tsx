"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Calendar, User, BookOpen, Package } from "lucide-react"

interface Reservation {
  id: string
  maestro: string
  materia: string
  fechaReservacion: string
  fechaUso: string
  materiales: { nombre: string; cantidad: number }[]
  estado: "completada" | "pendiente" | "cancelada"
  usuario: string
}

// Mock data for demonstration
const mockReservations: Reservation[] = [
  {
    id: "1",
    maestro: "Dr. Juan Pérez",
    materia: "Mecánica de Fluidos",
    fechaReservacion: "2024-01-15",
    fechaUso: "2024-01-20",
    materiales: [
      { nombre: "Tubos de ensayo", cantidad: 10 },
      { nombre: "Medidor de presión", cantidad: 2 },
    ],
    estado: "completada",
    usuario: "profesor1",
  },
  {
    id: "2",
    maestro: "Ing. María García",
    materia: "Resistencia de Materiales",
    fechaReservacion: "2024-01-18",
    fechaUso: "2024-01-25",
    materiales: [
      { nombre: "Probetas de acero", cantidad: 5 },
      { nombre: "Máquina de tracción", cantidad: 1 },
    ],
    estado: "pendiente",
    usuario: "ing.garcia",
  },
  {
    id: "3",
    maestro: "Dr. Carlos López",
    materia: "Termodinámica",
    fechaReservacion: "2024-01-10",
    fechaUso: "2024-01-15",
    materiales: [
      { nombre: "Termómetros", cantidad: 8 },
      { nombre: "Calorímetro", cantidad: 3 },
    ],
    estado: "cancelada",
    usuario: "admin",
  },
  {
    id: "4",
    maestro: "Ing. Ana Rodríguez",
    materia: "Circuitos Eléctricos",
    fechaReservacion: "2024-01-22",
    fechaUso: "2024-01-28",
    materiales: [
      { nombre: "Multímetros", cantidad: 6 },
      { nombre: "Protoboards", cantidad: 10 },
      { nombre: "Resistencias", cantidad: 50 },
    ],
    estado: "pendiente",
    usuario: "profesor1",
  },
]

interface HistoryPanelProps {
  onBack: () => void
}

export function HistoryPanel({ onBack }: HistoryPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredReservations, setFilteredReservations] = useState(mockReservations)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFilteredReservations(mockReservations)
    } else {
      const filtered = mockReservations.filter(
        (reservation) =>
          reservation.maestro.toLowerCase().includes(term.toLowerCase()) ||
          reservation.materia.toLowerCase().includes(term.toLowerCase()) ||
          reservation.usuario.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredReservations(filtered)
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "completada":
        return <Badge className="bg-green-500 text-white">Completada</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

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
              <CardTitle className="text-2xl font-bold text-primary">Historial de Reservaciones</CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por maestro, materia o usuario..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{mockReservations.length}</div>
              <p className="text-sm text-muted-foreground">Total Reservaciones</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockReservations.filter((r) => r.estado === "completada").length}
              </div>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {mockReservations.filter((r) => r.estado === "pendiente").length}
              </div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {mockReservations.filter((r) => r.estado === "cancelada").length}
              </div>
              <p className="text-sm text-muted-foreground">Canceladas</p>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Reservaciones ({filteredReservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Maestro</TableHead>
                  <TableHead>Materia</TableHead>
                  <TableHead>Fecha Reservación</TableHead>
                  <TableHead>Fecha Uso</TableHead>
                  <TableHead>Materiales</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-mono text-sm">#{reservation.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {reservation.maestro}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        {reservation.materia}
                      </div>
                    </TableCell>
                    <TableCell>{reservation.fechaReservacion}</TableCell>
                    <TableCell>{reservation.fechaUso}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{reservation.materiales.length} items</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.estado)}</TableCell>
                    <TableCell className="font-mono text-sm">{reservation.usuario}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

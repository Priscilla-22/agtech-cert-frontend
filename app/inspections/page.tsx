"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Inspection } from "@/lib/types"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect, useState } from "react"

const columns: ColumnDef<Inspection>[] = [
  {
    accessorKey: "farmerName",
    header: "Farmer",
  },
  {
    accessorKey: "farmName",
    header: "Farm",
  },
  {
    accessorKey: "inspectorName",
    header: "Inspector",
  },
  {
    accessorKey: "scheduledDate",
    header: "Scheduled Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("scheduledDate"))
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("score") as number | undefined
      return score ? (
        <Badge variant={score >= 80 ? "default" : "destructive"}>{score}/100</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const inspection = row.original
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/inspections/${inspection.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/inspections/${inspection.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )
    },
  },
]

function InspectionsContent() {
  // State for inspections data
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch inspections data
  useEffect(() => {
    const fetchInspections = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:3002/api/inspections')
        if (!response.ok) {
          throw new Error('Failed to fetch inspections')
        }

        const inspectionsData = await response.json()
        setInspections(inspectionsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inspections')
        console.error('Inspections fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [])

  if (loading) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading inspections...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-600">Error loading inspections: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const pendingInspections = inspections.filter((i) => i.status === "pending")
  const completedInspections = inspections.filter((i) => i.status === "completed")
  const failedInspections = inspections.filter((i) => i.status === "failed")

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        {/* Mobile sidebar overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden sidebar-overlay opacity-0 invisible transition-all duration-300"
          onClick={() => {
            const sidebar = document.querySelector('[data-sidebar]')
            if (sidebar) {
              sidebar.classList.add('-translate-x-full')
              sidebar.classList.remove('translate-x-0')
              document.querySelector('.sidebar-overlay')?.classList.add('opacity-0', 'invisible')
              document.querySelector('.sidebar-overlay')?.classList.remove('opacity-100', 'visible')
            }
          }}
        />

        <Sidebar />

        <div className="flex-1 flex flex-col w-full md:w-auto">
          <Navbar />

          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-96">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
                <p className="text-muted-foreground">Manage farm inspections and certification reviews</p>
              </div>
              <Button asChild>
                <Link href="/inspections/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Inspection
                </Link>
              </Button>
            </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInspections.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting inspection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedInspections.length}</div>
                <p className="text-xs text-muted-foreground">Successfully completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{failedInspections.length}</div>
                <p className="text-xs text-muted-foreground">Did not pass inspection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    completedInspections.reduce((acc, i) => acc + (i.score || 0), 0) / completedInspections.length || 0,
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Out of 100</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Inspections</CardTitle>
              <CardDescription>Complete list of farm inspections and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={inspections}
                searchKey="farmerName"
                searchPlaceholder="Search by farmer name..."
              />
            </CardContent>
          </Card>
        </div>
      </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function InspectionsPage() {
  return (
    <ProtectedRoute>
      <InspectionsContent />
    </ProtectedRoute>
  )
}

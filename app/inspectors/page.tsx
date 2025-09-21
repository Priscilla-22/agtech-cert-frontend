"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Trash2, Users, Phone, Mail } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Inspector {
  id: number
  name: string
  email: string
  phone: string
  specialization: string
  status: 'active' | 'inactive'
  createdAt: string
}

function InspectorsContent() {
  const { toast } = useToast()
  const [inspectors, setInspectors] = useState<Inspector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInspectors = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/inspectors')
      if (!response.ok) {
        throw new Error('Failed to fetch inspectors')
      }

      const data = await response.json()
      setInspectors(data.data || data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inspectors')
      console.error('Inspectors fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInspectors()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inspector?')) return

    try {
      const response = await fetch(`/api/inspectors/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete inspector')
      }

      toast({
        title: "Inspector Deleted",
        description: "Inspector has been successfully removed from the system."
      })

      fetchInspectors()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete inspector. Please try again."
      })
    }
  }

  const columns: ColumnDef<Inspector>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      )
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          {row.getValue("email")}
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          {row.getValue("phone")}
        </div>
      )
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.getValue("specialization")}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === 'active' ? 'default' : 'destructive'} className="text-xs">
            {status}
          </Badge>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inspector = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/inspectors/${inspector.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/inspectors/${inspector.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(inspector.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    }
  ]

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
                <p className="text-muted-foreground">Loading inspectors...</p>
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
                <Users className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-600">Error loading inspectors: {error}</p>
                <Button onClick={() => fetchInspectors()}>
                  Retry
                </Button>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const activeInspectors = inspectors.filter(i => i.status === 'active')
  const inactiveInspectors = inspectors.filter(i => i.status === 'inactive')

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6 pb-96">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Inspectors</h1>
                  <p className="text-muted-foreground">Manage certified inspectors and their assignments</p>
                </div>
                <Button asChild>
                  <Link href="/inspectors/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Inspector
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inspectors</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inspectors.length}</div>
                    <p className="text-xs text-muted-foreground">Registered in system</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                    <Users className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeInspectors.length}</div>
                    <p className="text-xs text-muted-foreground">Currently available</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                    <Users className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inactiveInspectors.length}</div>
                    <p className="text-xs text-muted-foreground">Not available</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Inspectors</CardTitle>
                  <CardDescription>Complete list of registered inspectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={columns}
                    data={inspectors}
                    searchKey="name"
                    searchPlaceholder="Search by inspector name..."
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

export default function InspectorsPage() {
  return (
    <ProtectedRoute>
      <InspectorsContent />
    </ProtectedRoute>
  )
}
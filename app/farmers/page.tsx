"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Eye, Edit, Trash2, AlertTriangle, Download, FileText, MoreHorizontal } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Farmer } from "@/lib/types"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const columns: ColumnDef<Farmer>[] = [
  {
    id: "row-number",
    header: "#",
    cell: ({ row }) => (
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-sm font-medium text-primary">
          {row.index + 1}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "totalFarms",
    header: "Farms",
    cell: ({ row }) => <span className="font-medium">{row.getValue("totalFarms")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "certificationStatus",
    header: "Certification",
    cell: ({ row }) => <StatusBadge status={row.getValue("certificationStatus")} />,
  },
  {
    accessorKey: "registrationDate",
    header: "Registered",
    cell: ({ row }) => {
      const date = new Date(row.getValue("registrationDate"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const farmer = row.original
      return (
        <div className="flex items-center justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open actions menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end" side="bottom" sideOffset={5}>
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 px-2"
                  onClick={() => window.location.href = `/farmers/${farmer.id}`}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 px-2"
                  onClick={() => window.location.href = `/farmers/${farmer.id}/edit`}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Farmer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 px-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this farmer?')) {
                      console.log('Delete farmer:', farmer.id)
                      // TODO: Implement delete functionality
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Farmer
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]

export default function FarmersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // State for farmers data
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Download functions
  const downloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log('Downloading PDF...')
  }

  const downloadExcel = () => {
    // TODO: Implement Excel download functionality
    console.log('Downloading Excel...')
  }

  // Fetch farmers data
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('http://localhost:3002/api/farmers')
        if (!response.ok) {
          throw new Error('Failed to fetch farmers')
        }

        const farmersData = await response.json()
        setFarmers(farmersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch farmers')
        console.error('Farmers fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFarmers()
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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
                <p className="text-muted-foreground">Loading farmers...</p>
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
                <p className="text-red-600">Error loading farmers: {error}</p>
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

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6 pb-96">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-space-grotesk font-bold text-foreground">Farmers</h1>
                  <p className="text-muted-foreground">Manage registered farmers and their certification status</p>
                </div>
                <Button asChild>
                  <Link href="/farmers/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Farmer
                  </Link>
                </Button>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Registered Farmers</CardTitle>
                  <CardDescription>A list of all farmers in your certification system</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={columns}
                    data={farmers}
                    searchKey="name"
                    searchPlaceholder="Search farmers..."
                    onDownloadPDF={downloadPDF}
                    onDownloadExcel={downloadExcel}
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

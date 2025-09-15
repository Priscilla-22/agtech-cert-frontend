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
import { FarmersFilter, type FilterValues } from "@/components/farmers/FarmersFilter"
import { Plus, Eye, Edit, Trash2, AlertTriangle, Download, FileText, MoreHorizontal, Search } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Farmer } from "@/lib/types"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function ActionsCell({ farmer }: { farmer: Farmer }) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this farmer?")) {
      console.log("Delete farmer:", farmer.id)
      // TODO: Hook up API deletion and refresh table state
    }
    setShowMenu(false)
  }

  return (
    <div className="relative flex items-center justify-center">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-muted"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Open actions menu"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {showMenu && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-8 z-50 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              onClick={() => {
                router.push(`/farmers/${farmer.id}`)
                setShowMenu(false)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              onClick={() => {
                router.push(`/farmers/${farmer.id}/edit`)
                setShowMenu(false)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Farmer
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Farmer
            </button>
          </div>
        </>
      )}
    </div>
  )
}

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
      return <ActionsCell farmer={farmer} />
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
  const [filters, setFilters] = useState<FilterValues>({})
  const [totalFarmers, setTotalFarmers] = useState(0)
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0
  })

  // Download functions
  const downloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log('Downloading PDF...')
  }

  const downloadExcel = () => {
    // TODO: Implement Excel download functionality
    console.log('Downloading Excel...')
  }

  // Build query parameters from filters
  const buildQueryParams = (filtersToApply: FilterValues, paginationToApply = pagination) => {
    const params = new URLSearchParams()

    // Add filters
    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (key === 'registrationDateFrom' || key === 'registrationDateTo') {
          // Format dates for backend
          params.append(key, (value as Date).toISOString().split('T')[0])
        } else {
          params.append(key, value.toString())
        }
      }
    })

    // Add pagination
    params.append('limit', paginationToApply.limit.toString())
    params.append('offset', paginationToApply.offset.toString())

    return params.toString()
  }

  // Fetch farmers data
  const fetchFarmers = async (filtersToApply: FilterValues = filters, paginationToApply = pagination) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = buildQueryParams(filtersToApply, paginationToApply)
      const response = await fetch(`http://localhost:3002/api/farmers?${queryParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch farmers')
      }

      const result = await response.json()

      // Handle both old format (array) and new format (object with data array)
      if (Array.isArray(result)) {
        setFarmers(result)
        setTotalFarmers(result.length)
      } else {
        setFarmers(result.data || [])
        setTotalFarmers(result.total || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farmers')
      console.error('Farmers fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter handlers
  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    // Reset pagination when applying new filters
    const newPagination = { ...pagination, offset: 0 }
    setPagination(newPagination)
    fetchFarmers(filters, newPagination)
  }

  const handleClearFilters = () => {
    const clearedFilters: FilterValues = {}
    setFilters(clearedFilters)
    const newPagination = { ...pagination, offset: 0 }
    setPagination(newPagination)
    fetchFarmers(clearedFilters, newPagination)
  }

  // Initial fetch
  useEffect(() => {
    fetchFarmers()
  }, [])

  // Fetch when pagination changes (but not filters - those are handled manually)
  useEffect(() => {
    if (pagination.offset > 0) {
      fetchFarmers()
    }
  }, [pagination.offset, pagination.limit])

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

          <main className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-96">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold text-foreground">Farmers</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Manage registered farmers and their certification status
                    {totalFarmers > 0 && ` (${totalFarmers} total)`}
                  </p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/farmers/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Farmer
                  </Link>
                </Button>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Registered Farmers</CardTitle>
                  <CardDescription>
                    A list of all farmers in your certification system
                    {farmers.length !== totalFarmers && totalFarmers > 0 && (
                      ` - Showing ${farmers.length} of ${totalFarmers}`
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search and Action Buttons Row */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 mt-8">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-full md:max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        placeholder="Search farmers by name, email, or phone..."
                        value={filters.search || ''}
                        onChange={(e) => {
                          const newFilters = { ...filters, search: e.target.value || undefined }
                          handleFiltersChange(newFilters)
                          if (!e.target.value) {
                            handleApplyFilters()
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyFilters()
                          }
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      {/* Filter Button */}
                      <FarmersFilter
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onApplyFilters={handleApplyFilters}
                        onClearFilters={handleClearFilters}
                        isLoading={loading}
                      />

                      {/* PDF Button */}
                      <Button
                        onClick={downloadPDF}
                        className="h-10 px-4 py-2 text-sm font-medium hover:opacity-90 transition-all duration-200 rounded-md border border-gray-300"
                        style={{ backgroundColor: '#A8C5E2', color: '#1f2937' }}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        <span>PDF</span>
                      </Button>

                      {/* Excel Button */}
                      <Button
                        onClick={downloadExcel}
                        className="h-10 px-4 py-2 text-white text-sm font-medium hover:opacity-90 transition-all duration-200 rounded-md border border-gray-300"
                        style={{ backgroundColor: '#16a34a' }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        <span>Excel</span>
                      </Button>
                    </div>
                  </div>

                  <DataTable
                    columns={columns}
                    data={farmers}
                    searchKey=""
                    searchPlaceholder=""
                    onDownloadPDF={undefined}
                    onDownloadExcel={undefined}
                    showSearch={false}
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

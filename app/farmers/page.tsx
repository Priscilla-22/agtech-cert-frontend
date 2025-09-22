"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { FarmersFilter, type FilterValues } from "@/components/farmers/FarmersFilter"
import { ExportButton } from "@/components/exports/ExportButton"
import { Plus, AlertTriangle, Search } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchAllFarmers } from "@/lib/services/farmer-service"
import { Farmer } from "@/lib/types/farmer"
import { createFarmerColumns } from "@/components/farmers/farmer-columns"


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

  // Export handlers
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExportStart = (format: string) => {
    setExportLoading(format)
    setExportError(null)
  }

  const handleExportComplete = () => {
    setExportLoading(null)
    setExportError(null)
  }

  const handleExportError = (error: Error) => {
    setExportLoading(null)
    setExportError(error.message)
    console.error('Export error:', error)
  }

  async function loadFarmers() {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchAllFarmers()
      setFarmers(result || [])
      setTotalFarmers(result?.length || 0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch farmers'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function handleFiltersChange(newFilters: FilterValues) {
    setFilters(newFilters)
  }

  function handleApplyFilters() {
    loadFarmers()
  }

  function handleClearFilters() {
    setFilters({})
    loadFarmers()
  }

  function handleDeleteFarmer(farmerId: string) {
    setFarmers(prevFarmers => prevFarmers.filter(farmer => farmer.id !== farmerId))
    setTotalFarmers(prev => prev - 1)
  }

  useEffect(() => {
    loadFarmers()
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
            <div className="max-w-full mx-auto space-y-4 md:space-y-6 pb-20 md:pb-96">
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

                      {/* Export Buttons */}
                      <ExportButton
                        format="pdf"
                        data={farmers}
                        title="Farmers Report"
                        subtitle="PESIRA - Agricultural Technology Certification Platform"
                        filename={`Farmers_Report_${new Date().toISOString().split('T')[0]}.pdf`}
                        onExportStart={() => handleExportStart('pdf')}
                        onExportComplete={handleExportComplete}
                        onExportError={handleExportError}
                        disabled={exportLoading === 'pdf'}
                      />

                      <ExportButton
                        format="excel"
                        data={farmers}
                        title="Farmers Data Export"
                        subtitle="PESIRA - Agricultural Technology Certification Platform"
                        filename={`Farmers_Data_${new Date().toISOString().split('T')[0]}.xlsx`}
                        onExportStart={() => handleExportStart('excel')}
                        onExportComplete={handleExportComplete}
                        onExportError={handleExportError}
                        disabled={exportLoading === 'excel'}
                      />

                      <ExportButton
                        format="csv"
                        data={farmers}
                        title="Farmers Data Export"
                        subtitle="PESIRA - Agricultural Technology Certification Platform"
                        filename={`Farmers_Data_${new Date().toISOString().split('T')[0]}.csv`}
                        onExportStart={() => handleExportStart('csv')}
                        onExportComplete={handleExportComplete}
                        onExportError={handleExportError}
                        disabled={exportLoading === 'csv'}
                      />
                    </div>
                  </div>

                  <DataTable
                    columns={createFarmerColumns(handleDeleteFarmer)}
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

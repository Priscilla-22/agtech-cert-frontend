"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Calculator, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, ToggleRight, History, MoreHorizontal, Award } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Inspection } from "@/lib/types"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/config"
import { api } from "@/lib/api-client"

function StatusChangeDialog({
  inspection,
  onStatusChange,
  open,
  onOpenChange
}: {
  inspection: Inspection
  onStatusChange: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState(inspection.status)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  useEffect(() => {
    setNewStatus(inspection.status)
  }, [inspection.status, isOpen])

  const handleStatusChange = async () => {
    if (newStatus === inspection.status) {
      setIsOpen(false)
      return
    }

    setLoading(true)
    try {
      let response
      console.log(`Changing status from ${inspection.status} to ${newStatus}`)

      response = await fetch(`/api/${API_ENDPOINTS.INSPECTIONS.DETAIL(inspection.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Status update failed:', errorData)

        toast({
          variant: "destructive",
          title: "Cannot Update Status",
          description: errorData.error || `Failed to update status: ${response.status}`
        })
        return
      }

      const result = await response.json()
      console.log('Status update result:', result)

      toast({
        title: "Status Updated",
        description: `Inspection status changed from ${inspection.status} to ${newStatus}`
      })

      setIsOpen(false)
      setTimeout(() => {
        onStatusChange()
      }, 100)
    } catch (error) {

      if (!error.message?.includes('Failed to update status:')) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update inspection status. Please try again."
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Inspection Status</DialogTitle>
          <DialogDescription>
            Update the status for {inspection.farmerName}'s farm inspection
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Status</label>
            <p className="text-sm text-muted-foreground capitalize">{inspection.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium">New Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-full border-2 border-gray-300 focus:border-primary min-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} disabled={loading || newStatus === inspection.status}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface HistoryEntry {
  id: number
  oldStatus: string
  newStatus: string
  reason: string
  timestamp: string
}

function StatusHistoryDialog({
  inspection,
  open,
  onOpenChange
}: {
  inspection: Inspection
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  // Use controlled or uncontrolled state
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const fetchHistory = async () => {
    if (!isOpen) return

    setLoading(true)
    try {
      const response = await fetch(`/api/${API_ENDPOINTS.INSPECTIONS.DETAIL(inspection.id)}/history`)
      if (response.ok) {
        const historyData = await response.json()
        setHistory(historyData)
      }
    } catch (error) {
      console.error('Failed to fetch status history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Status History</DialogTitle>
          <DialogDescription>
            Status change history for {inspection.farmerName}'s farm inspection
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No status changes recorded
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={entry.oldStatus as any} className="text-xs" />
                      <span className="text-muted-foreground">→</span>
                      <StatusBadge status={entry.newStatus as any} className="text-xs" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{entry.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function GenerateCertificateButton({ inspection, onStatusChange }: { inspection: Inspection, onStatusChange: () => void }) {
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateCertificate = async () => {
    setGenerating(true)

    try {
      const data = await api.inspections.approve(inspection.id.toString(), {})

      // The API client returns JSON data, not a response object
      toast({
        title: "Certificate Generated Successfully!",
        description: data.certificate?.certificateNumber
          ? `Certificate #${data.certificate.certificateNumber} has been generated.`
          : "Certificate generation completed successfully."
      })

      // Refresh the inspections list
      setTimeout(() => {
        onStatusChange()
      }, 1000)

    } catch (error) {
      console.error('Error generating certificate:', error)
      toast({
        variant: "destructive",
        title: "Certificate Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate certificate. Please try again."
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleGenerateCertificate}
      disabled={generating}
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      <Award className="mr-2 h-4 w-4" />
      {generating ? "Generating..." : "Generate"}
    </Button>
  )
}

function ActionsDropdown({ inspection, onStatusChange }: { inspection: Inspection, onStatusChange: () => void }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const { toast } = useToast()

  const handleStatusDialogOpen = () => {
    setShowMenu(false)
    setShowStatusDialog(true)
  }

  const handleHistoryDialogOpen = () => {
    setShowMenu(false)
    setShowHistoryDialog(true)
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
          <div className="absolute right-0 top-8 z-50 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1">
            <Link
              href={`/inspections/${inspection.id}`}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-blue-600"
              onClick={() => setShowMenu(false)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>

            <Link
              href={`/inspections/${inspection.id}/edit`}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-orange-600"
              onClick={() => setShowMenu(false)}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Score Inspection
            </Link>

            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-purple-600"
              onClick={handleStatusDialogOpen}
            >
              <ToggleRight className="mr-2 h-4 w-4" />
              Change Status
            </button>

            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-gray-600"
              onClick={handleHistoryDialogOpen}
            >
              <History className="mr-2 h-4 w-4" />
              View History
            </button>

            <Link
              href={`/inspections/${inspection.id}/edit`}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-green-600"
              onClick={() => setShowMenu(false)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Inspection
            </Link>

          </div>
        </>
      )}

      {/* Status Change Dialog */}
      <StatusChangeDialog
        inspection={inspection}
        onStatusChange={onStatusChange}
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />

      {/* Status History Dialog */}
      <StatusHistoryDialog
        inspection={inspection}
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />
    </div>
  )
}

const createColumns = (onStatusChange: () => void): ColumnDef<Inspection>[] => [
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row }) => {
      return <div className="w-8 text-center text-sm text-muted-foreground">{row.index + 1}</div>
    },
  },
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
    id: "certificate",
    header: "Certificate",
    cell: ({ row }) => {
      const inspection = row.original
      if (inspection.status === 'completed' && inspection.score >= 80) {
        return (
          <GenerateCertificateButton
            inspection={inspection}
            onStatusChange={onStatusChange}
          />
        )
      }
      return <span className="text-muted-foreground text-sm">-</span>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const inspection = row.original
      return <ActionsDropdown inspection={inspection} onStatusChange={onStatusChange} />
    },
  },
]

function InspectionsContent() {
  // State for inspections data
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch inspections data
  const fetchInspections = async () => {
    try {
      setLoading(true)
      setError(null)

      const inspectionsData = await api.inspections.getAll()
      console.log('Raw inspections data from API:', inspectionsData)

      if (Array.isArray(inspectionsData)) {
        console.log('Status distribution:', inspectionsData.map(i => i.status))
        setInspections(inspectionsData)
      } else {
        // Handle wrapped response format
        const inspections = inspectionsData.data || inspectionsData || []
        console.log('Status distribution:', inspections.map(i => i.status))
        setInspections(inspections)
      }

      // Also fetch status distribution for debugging
      try {
        const statusResponse = await fetch(`/api/${API_ENDPOINTS.INSPECTIONS.STATUS_DISTRIBUTION}`)
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          console.log('Status distribution from backend:', statusData)
        }
      } catch (statusError) {
        console.warn('Could not fetch status distribution:', statusError)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inspections')
      console.error('Inspections fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInspections()
  }, [])

  const handleStatusChange = () => {
    fetchInspections()
  }

  const columns = createColumns(handleStatusChange)

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

  const scheduledInspections = inspections.filter((i) => i.status === "scheduled")
  const inProgressInspections = inspections.filter((i) => i.status === "in_progress")
  const completedInspections = inspections.filter((i) => i.status === "completed")
  const failedInspections = inspections.filter((i) => i.status === "failed")

  console.log('Status counts:', {
    total: inspections.length,
    scheduled: scheduledInspections.length,
    inProgress: inProgressInspections.length,
    completed: completedInspections.length,
    failed: failedInspections.length,
    allStatuses: inspections.map(i => i.status)
  })

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
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scheduledInspections.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting inspection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressInspections.length}</div>
                <p className="text-xs text-muted-foreground">Currently inspecting</p>
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
                <p className="text-xs text-muted-foreground">Need attention</p>
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

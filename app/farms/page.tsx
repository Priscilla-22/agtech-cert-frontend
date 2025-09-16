"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  MapPin,
  User,
  Calendar,
  Building2,
} from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { api } from "@/lib/api-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Farm {
  id: number
  name: string
  farmerId: number
  farmerName?: string
  location: string
  size: number
  cropTypes: string[]
  certificationStatus: string
  lastInspection?: string
  registrationDate: string
  status: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

function FarmsContent() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [certificationFilter, setCertificationFilter] = useState("all")
  const { toast } = useToast()

  const fetchFarms = async () => {
    try {
      setLoading(true)
      const response = await api.farms.getAll({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        certificationStatus: certificationFilter !== "all" ? certificationFilter : undefined,
      })
      
      // Handle both array and object response formats
      setFarms(Array.isArray(response) ? response : response.data || [])
    } catch (error) {
      console.error("Error fetching farms:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load farms. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarms()
  }, [searchTerm, statusFilter, certificationFilter])

  const handleDeleteFarm = async (farmId: number) => {
    try {
      await api.farms.delete(farmId.toString())
      setFarms(farms.filter(farm => farm.id !== farmId))
      toast({
        title: "Success",
        description: "Farm deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting farm:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete farm. Please try again.",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
    }
    return statusColors[status as keyof typeof statusColors] || statusColors.active
  }

  const getCertificationBadge = (status: string) => {
    const certColors = {
      certified: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      "not-certified": "bg-gray-100 text-gray-800",
    }
    return certColors[status as keyof typeof certColors] || certColors["not-certified"]
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
                <p className="text-muted-foreground">Loading farms...</p>
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
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Farm Management</h1>
                  <p className="text-muted-foreground">
                    Manage and track agricultural farms in the certification system
                  </p>
                </div>
                <Link href="/farms/new">
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Farm
                  </Button>
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farms.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Farms</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {farms.filter(farm => farm.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Certified Farms</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {farms.filter(farm => farm.certificationStatus === 'certified').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Area</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {farms.reduce((total, farm) => total + (farm.size || 0), 0).toFixed(1)} ha
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Search & Filter</CardTitle>
                  <CardDescription>
                    Find farms by name, location, or farmer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search farms..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Certification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Certifications</SelectItem>
                        <SelectItem value="certified">Certified</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="not-certified">Not Certified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Farms Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Farms ({farms.length})</CardTitle>
                  <CardDescription>
                    All registered farms in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {farms.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-2 text-sm font-medium text-muted-foreground">No farms found</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Get started by adding your first farm.
                      </p>
                      <div className="mt-6">
                        <Link href="/farms/new">
                          <Button>Add New Farm</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Farm Name</TableHead>
                            <TableHead>Farmer</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Crops</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Certification</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {farms.map((farm) => (
                            <TableRow key={farm.id}>
                              <TableCell className="font-medium">{farm.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  {farm.farmerName || `Farmer #${farm.farmerId}`}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  {farm.location}
                                </div>
                              </TableCell>
                              <TableCell>{farm.size} ha</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {farm.cropTypes?.slice(0, 2).map((crop) => (
                                    <Badge key={crop} variant="secondary" className="text-xs">
                                      {crop}
                                    </Badge>
                                  ))}
                                  {farm.cropTypes?.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{farm.cropTypes.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadge(farm.status)}>
                                  {farm.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getCertificationBadge(farm.certificationStatus)}>
                                  {farm.certificationStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  {new Date(farm.registrationDate).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/farms/${farm.id}`}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/farms/${farm.id}/edit`}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Farm
                                      </Link>
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete Farm
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Farm</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{farm.name}"? This action
                                            cannot be undone and will remove all associated data.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteFarm(farm.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete Farm
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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

export default function FarmsPage() {
  return (
    <ProtectedRoute>
      <FarmsContent />
    </ProtectedRoute>
  )
}
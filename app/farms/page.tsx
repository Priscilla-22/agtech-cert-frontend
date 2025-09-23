"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Farm {
  id: number
  farmName: string
  farmerId: number
  farmerName?: string
  location: string
  totalArea: string | number
  cropTypes: string[]
  certificationStatus: string
  lastInspection?: string
  organicSince: string
  status?: string
}

function FarmsContent() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [certificationFilter, setCertificationFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { toast } = useToast()
  const { userEmail } = useAuth()

  const ITEMS_PER_PAGE = 10

  // Get current user's farmer ID
  useEffect(() => {
    const getCurrentUserFarmerId = async () => {
      if (!userEmail) return

      try {
        // Find farmer by email to get farmer ID
        const farmersResponse = await api.farmers.getAll({ search: userEmail })
        const farmers = Array.isArray(farmersResponse) ? farmersResponse : farmersResponse.data || []

        // Find the farmer that matches the current user's email
        const currentFarmer = farmers.find((farmer: any) => farmer.email === userEmail)
        if (currentFarmer) {
          setCurrentUserId(currentFarmer.id.toString())
        }
      } catch (error) {
        console.error("Error finding current user farmer:", error)
      }
    }

    getCurrentUserFarmerId()
  }, [userEmail])

  const fetchFarms = async () => {
    try {
      setLoading(true)

      let response
      if (currentUserId) {
        response = await api.farms.getByFarmerId(currentUserId)
      } else {
        response = await api.farms.getAll({
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          certificationStatus: certificationFilter !== "all" ? certificationFilter : undefined,
        })
      }

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
    if (userEmail !== undefined) {
      fetchFarms()
      setCurrentPage(0)
    }
  }, [searchTerm, statusFilter, certificationFilter, currentUserId, userEmail])

  // Filter farms based on current filters
  const filteredFarms = farms.filter(farm => {
    const matchesSearch = !searchTerm ||
      farm.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farm.farmerName && farm.farmerName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || (farm.status || 'active') === statusFilter
    const matchesCertification = certificationFilter === "all" || farm.certificationStatus === certificationFilter

    return matchesSearch && matchesStatus && matchesCertification
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredFarms.length / ITEMS_PER_PAGE)
  const paginatedFarms = filteredFarms.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
          <main className="flex-1 p-3 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {currentUserId ? 'My Farms' : 'Farm Management'}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    {currentUserId
                      ? 'Manage and track your registered farms'
                      : 'Manage and track agricultural farms in the certification system'
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden xs:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                    <span className="xs:hidden">Filter</span>
                  </Button>
                  <Link href="/farms/new" className="flex-1 sm:flex-none">
                    <Button className="flex items-center justify-center gap-2 w-full">
                      <Plus className="w-4 h-4" />
                      <span className="hidden xs:inline">Add New Farm</span>
                      <span className="xs:hidden">Add Farm</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mt-6 sm:mt-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Total Farms</CardTitle>
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-1 sm:pt-2">
                    <div className="text-lg sm:text-2xl font-bold">{farms.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Active Farms</CardTitle>
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-1 sm:pt-2">
                    <div className="text-lg sm:text-2xl font-bold">
                      {farms.filter(farm => farm.status === 'active' || !farm.status).length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Certified Farms</CardTitle>
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-1 sm:pt-2">
                    <div className="text-lg sm:text-2xl font-bold">
                      {farms.filter(farm => farm.certificationStatus === 'certified').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Total Area</CardTitle>
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-1 sm:pt-2">
                    <div className="text-lg sm:text-2xl font-bold">
                      {farms.reduce((total, farm) => total + (parseFloat(farm.totalArea?.toString() || '0') || 0), 0).toFixed(1)} ha
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              {showFilters && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Search & Filter</CardTitle>
                    <CardDescription className="text-sm">
                      Find farms by name, location, or farmer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search farms..."
                          className="pl-10 h-11 sm:h-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="h-11 sm:h-10">
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
                          <SelectTrigger className="h-11 sm:h-10">
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
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Farms Cards */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Farms ({filteredFarms.length})</CardTitle>
                      <CardDescription className="text-sm">
                        {currentUserId
                          ? 'Your registered farms'
                          : 'All registered farms in the system'
                        }
                        {filteredFarms.length !== farms.length && ` - Showing ${filteredFarms.length} of ${farms.length} farms`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg self-start sm:self-auto">
                      <Button
                        variant={viewMode === 'cards' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('cards')}
                        className="h-8 px-2 sm:px-3"
                      >
                        <Grid3X3 className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Cards</span>
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        className="h-8 px-2 sm:px-3"
                      >
                        <List className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Table</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredFarms.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-2 text-sm font-medium text-muted-foreground">No farms found</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {farms.length === 0 ? "Get started by adding your first farm." : "Try adjusting your search or filters."}
                      </p>
                      {farms.length === 0 && (
                        <div className="mt-6">
                          <Link href="/farms/new">
                            <Button>Add New Farm</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {viewMode === 'cards' ? (
                        /* Farm Cards Grid */
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                          {paginatedFarms.map((farm) => (
                            <Card key={farm.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                              <CardHeader className="pb-3 sm:pb-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <CardTitle className="text-base sm:text-lg truncate">{farm.farmName}</CardTitle>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                      <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                      <span className="truncate">{farm.farmerName || `Farmer #${farm.farmerId}`}</span>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
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
                                        <AlertDialogContent className="mx-4 max-w-sm sm:max-w-md">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Farm</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete "{farm.farmName}"? This action
                                              cannot be undone and will remove all associated data.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteFarm(farm.id)}
                                              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                            >
                                              Delete Farm
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3 sm:space-y-4">
                                {/* Location and Size */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                                      <span className="text-muted-foreground">Location</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium truncate" title={farm.location}>{farm.location}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                                      <span className="text-muted-foreground">Size</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium">{farm.totalArea} ha</p>
                                  </div>
                                </div>

                                {/* Crops */}
                                <div className="space-y-2">
                                  <span className="text-xs sm:text-sm text-muted-foreground">Crops</span>
                                  <div className="flex flex-wrap gap-1">
                                    {farm.cropTypes?.slice(0, 3).map((crop) => (
                                      <Badge key={crop} variant="secondary" className="text-xs px-2 py-0.5">
                                        {crop}
                                      </Badge>
                                    ))}
                                    {farm.cropTypes?.length > 3 && (
                                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                        +{farm.cropTypes.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Status and Certification */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Status</span>
                                    <div>
                                      <Badge className={getStatusBadge(farm.status || 'active')} variant="outline">
                                        {farm.status || 'active'}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Certification</span>
                                    <div>
                                      <Badge className={getCertificationBadge(farm.certificationStatus)} variant="outline">
                                        {farm.certificationStatus}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Registration Date */}
                                <div className="pt-2 border-t">
                                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span>Organic since {new Date(farm.organicSince).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        /* Table View */
                        <div className="overflow-x-auto">
                          <Table className="min-w-full">
                            <TableHeader style={{ backgroundColor: '#CBDDE9' }}>
                              <TableRow className="border-b-2 border-gray-200" style={{ backgroundColor: '#CBDDE9' }}>
                                <TableHead className="w-[100px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>#</TableHead>
                                <TableHead className="w-[180px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Farm Name</TableHead>
                                <TableHead className="w-[150px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Farmer</TableHead>
                                <TableHead className="w-[200px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Location</TableHead>
                                <TableHead className="w-[100px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Size (ha)</TableHead>
                                <TableHead className="w-[160px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Crops</TableHead>
                                <TableHead className="w-[100px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Status</TableHead>
                                <TableHead className="w-[140px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Certification</TableHead>
                                <TableHead className="w-[130px] font-semibold text-gray-900 py-4 px-6 border-r border-gray-300" style={{ backgroundColor: '#CBDDE9' }}>Organic Since</TableHead>
                                <TableHead className="w-[150px] text-right font-semibold text-gray-900 py-4 px-6 last:border-r-0" style={{ backgroundColor: '#CBDDE9' }}>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedFarms.map((farm, index) => (
                                <TableRow key={farm.id}>
                                  <TableCell className="font-medium">
                                    {currentPage * ITEMS_PER_PAGE + index + 1}
                                  </TableCell>
                                  <TableCell className="font-medium">{farm.farmName}</TableCell>
                                  <TableCell>{farm.farmerName || `Farmer #${farm.farmerId}`}</TableCell>
                                  <TableCell>{farm.location}</TableCell>
                                  <TableCell>{farm.totalArea}</TableCell>
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
                                    <Badge className={getStatusBadge(farm.status || 'active')}>
                                      {farm.status || 'active'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getCertificationBadge(farm.certificationStatus)}>
                                      {farm.certificationStatus}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(farm.organicSince).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="text-right">
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
                                                Are you sure you want to delete "{farm.farmName}"? This action
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

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 pt-4">
                          {/* Previous Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {/* First Page */}
                          {currentPage > 2 && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(0)}
                                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50"
                              >
                                1
                              </Button>
                              {currentPage > 3 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                            </>
                          )}

                          {/* Page Numbers */}
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Calculate the range of pages to show
                            let startPage = Math.max(0, currentPage - 2)
                            let endPage = Math.min(totalPages - 1, startPage + 4)

                            // Adjust start if we're near the end
                            if (endPage - startPage < 4) {
                              startPage = Math.max(0, endPage - 4)
                            }

                            const pageIndex = startPage + i

                            if (pageIndex > endPage) return null

                            const isCurrentPage = pageIndex === currentPage

                            return (
                              <Button
                                key={pageIndex}
                                variant={isCurrentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageIndex)}
                                className={`w-10 h-10 p-0 rounded-full ${
                                  isCurrentPage
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageIndex + 1}
                              </Button>
                            )
                          })}

                          {/* Last Page */}
                          {currentPage < totalPages - 3 && totalPages > 5 && (
                            <>
                              {currentPage < totalPages - 4 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(totalPages - 1)}
                                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50"
                              >
                                {totalPages}
                              </Button>
                            </>
                          )}

                          {/* Next Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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
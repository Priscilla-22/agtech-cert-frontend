"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  MapPin,
  Ruler,
  Wheat,
  User,
  Building2,
  Calendar,
  Phone,
  Mail,
  Edit,
  Droplets,
  Map,
  Info,
} from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { api } from "@/lib/api-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Farm {
  id: number
  name: string
  farmerId: number
  farmerName?: string
  farmerEmail?: string
  farmerPhone?: string
  location: string
  county?: string
  ward?: string
  village?: string
  size: number
  cultivatedSize?: number
  soilType?: string
  cropTypes: string[]
  irrigationSystem?: string
  landTenure?: string
  waterSources?: string[]
  description?: string
  registrationDate: string
  status: string
  certificationStatus?: string
  lastInspection?: string
  totalFields?: number
  totalInspections?: number
}

function FarmDetailsContent() {
  const params = useParams()
  const { toast } = useToast()
  const [farm, setFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!params.id) {
          throw new Error("Farm ID is required")
        }

        const response = await api.farms.getById(params.id as string)
        setFarm(response)
      } catch (error) {
        console.error("Error fetching farm:", error)
        setError("Failed to load farm details")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load farm details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFarm()
  }, [params.id])

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
                <p className="text-muted-foreground">Loading farm details...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !farm) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-muted-foreground">Farm Not Found</h3>
                <p className="text-sm text-muted-foreground">
                  {error || "The requested farm could not be found."}
                </p>
                <Link href="/farms">
                  <Button>Back to Farms</Button>
                </Link>
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
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/farms">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Farms
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{farm.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getStatusBadge(farm.status)}>
                        {farm.status}
                      </Badge>
                      {farm.certificationStatus && (
                        <Badge className={getCertificationBadge(farm.certificationStatus)}>
                          {farm.certificationStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={`/farms/${farm.id}/edit`}>
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Farm
                  </Button>
                </Link>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Area</CardTitle>
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farm.size} ha</div>
                    {farm.cultivatedSize && (
                      <p className="text-xs text-muted-foreground">
                        {farm.cultivatedSize} ha cultivated
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Crop Types</CardTitle>
                    <Wheat className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farm.cropTypes?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Different crops grown
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fields</CardTitle>
                    <Map className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farm.totalFields || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Field subdivisions
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inspections</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{farm.totalInspections || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {farm.lastInspection ? `Last: ${new Date(farm.lastInspection).toLocaleDateString()}` : "No inspections"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="farmer">Farmer Info</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Farm Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Farm Name:</span>
                            <span className="text-sm font-medium">{farm.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Registration Date:</span>
                            <span className="text-sm font-medium">
                              {new Date(farm.registrationDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className={getStatusBadge(farm.status)}>
                              {farm.status}
                            </Badge>
                          </div>
                          {farm.certificationStatus && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Certification:</span>
                              <Badge className={getCertificationBadge(farm.certificationStatus)}>
                                {farm.certificationStatus}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wheat className="w-5 h-5" />
                          Crops & Production
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <span className="text-sm text-muted-foreground">Primary Crops:</span>
                          <div className="flex flex-wrap gap-1">
                            {farm.cropTypes?.map((crop) => (
                              <Badge key={crop} variant="secondary" className="text-xs">
                                {crop}
                              </Badge>
                            )) || <span className="text-sm text-muted-foreground">No crops specified</span>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Area:</span>
                            <span className="text-sm font-medium">{farm.size} hectares</span>
                          </div>
                          {farm.cultivatedSize && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Cultivated:</span>
                              <span className="text-sm font-medium">{farm.cultivatedSize} hectares</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {farm.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{farm.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Physical Address:</span>
                            <span className="text-sm font-medium">{farm.location}</span>
                          </div>
                          {farm.county && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">County:</span>
                              <span className="text-sm font-medium">{farm.county}</span>
                            </div>
                          )}
                          {farm.ward && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Ward:</span>
                              <span className="text-sm font-medium">{farm.ward}</span>
                            </div>
                          )}
                          {farm.village && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Village:</span>
                              <span className="text-sm font-medium">{farm.village}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Ruler className="w-5 h-5" />
                          Technical Specifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {farm.soilType && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Soil Type:</span>
                              <span className="text-sm font-medium capitalize">{farm.soilType}</span>
                            </div>
                          )}
                          {farm.irrigationSystem && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Irrigation:</span>
                              <span className="text-sm font-medium capitalize">{farm.irrigationSystem.replace(/-/g, ' ')}</span>
                            </div>
                          )}
                          {farm.landTenure && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Land Tenure:</span>
                              <span className="text-sm font-medium capitalize">{farm.landTenure}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Droplets className="w-5 h-5" />
                          Water Sources
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {farm.waterSources && farm.waterSources.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {farm.waterSources.map((source) => (
                                <Badge key={source} variant="outline" className="text-xs">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No water sources specified</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="farmer" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Farmer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Farmer:</span>
                          <span className="text-sm font-medium">
                            {farm.farmerName || `Farmer #${farm.farmerId}`}
                          </span>
                        </div>
                        {farm.farmerEmail && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {farm.farmerEmail}
                            </span>
                          </div>
                        )}
                        {farm.farmerPhone && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone:</span>
                            <span className="text-sm font-medium flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {farm.farmerPhone}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pt-4">
                        <Link href={`/farmers/${farm.farmerId}`}>
                          <Button variant="outline" size="sm">
                            <User className="w-4 h-4 mr-2" />
                            View Farmer Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function FarmDetailsPage() {
  return (
    <ProtectedRoute>
      <FarmDetailsContent />
    </ProtectedRoute>
  )
}
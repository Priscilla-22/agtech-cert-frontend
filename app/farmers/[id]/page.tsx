"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, MapPin, Phone, Mail, Calendar, Building2, AlertTriangle, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"

interface FarmerDetailPageProps {
  params: { id: string }
}

function FarmerDetailContent({ params }: FarmerDetailPageProps) {
  const [farmer, setFarmer] = useState<any>(null)
  const [farmerFarms, setFarmerFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch farmer details
        const farmerRes = await fetch(`http://localhost:3002/api/farmers/${params.id}`)
        if (!farmerRes.ok) {
          if (farmerRes.status === 404) {
            setError('Farmer not found')
            return
          }
          throw new Error('Failed to fetch farmer')
        }

        const farmerData = await farmerRes.json()
        setFarmer(farmerData)

        // Fetch farmer's farms (optional - may not exist yet)
        try {
          const farmsRes = await fetch(`http://localhost:3002/api/farms?farmerId=${params.id}`)
          if (farmsRes.ok) {
            const farmsData = await farmsRes.json()
            setFarmerFarms(farmsData)
          }
        } catch (farmError) {
          // Farms endpoint might not exist yet, so we'll just use empty array
          setFarmerFarms([])
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch farmer data')
        console.error('Farmer data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFarmerData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading farmer details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <p className="text-red-600">Error: {error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/farmers">Back to Farmers</Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!farmer) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="text-center space-y-4">
              <User className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Farmer not found</p>
              <Button asChild>
                <Link href="/farmers">Back to Farmers</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/farmers">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Farmers
                </Link>
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-space-grotesk font-bold text-foreground">{farmer.name}</h1>
                <p className="text-muted-foreground">Farmer Details</p>
              </div>
              <Button asChild>
                <Link href={`/farmers/${farmer.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Farmer
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Contact Information</CardTitle>
                  <CardDescription>Farmer contact details and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{farmer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{farmer.phone}</span>
                  </div>
                  {farmer.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{farmer.address}</span>
                    </div>
                  )}
                  {farmer.registrationDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Registered: {new Date(farmer.registrationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={farmer.status === 'active' ? 'default' : 'secondary'}>
                      {farmer.status || 'Active'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Farm Information</CardTitle>
                  <CardDescription>Agricultural details and certification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {farmer.totalLandSize && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Land Size</span>
                      <span className="text-lg font-semibold">{farmer.totalLandSize} hectares</span>
                    </div>
                  )}
                  {farmer.farmingType && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Farming Type</span>
                      <span className="text-sm">{farmer.farmingType}</span>
                    </div>
                  )}
                  {farmer.primaryCrops && farmer.primaryCrops.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Primary Crops</span>
                      <div className="flex flex-wrap gap-2">
                        {farmer.primaryCrops.map((crop: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {farmer.organicExperience && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Organic Experience</span>
                      <span className="text-sm">{farmer.organicExperience}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {farmer.county && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Location Details</CardTitle>
                  <CardDescription>Administrative location information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <span className="text-sm font-medium">County:</span>
                      <p className="text-sm text-muted-foreground">{farmer.county}</p>
                    </div>
                    {farmer.subCounty && (
                      <div>
                        <span className="text-sm font-medium">Sub-County:</span>
                        <p className="text-sm text-muted-foreground">{farmer.subCounty}</p>
                      </div>
                    )}
                    {farmer.ward && (
                      <div>
                        <span className="text-sm font-medium">Ward:</span>
                        <p className="text-sm text-muted-foreground">{farmer.ward}</p>
                      </div>
                    )}
                    {farmer.village && (
                      <div>
                        <span className="text-sm font-medium">Village:</span>
                        <p className="text-sm text-muted-foreground">{farmer.village}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {farmerFarms.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Registered Farms</CardTitle>
                  <CardDescription>List of farms owned by {farmer.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {farmerFarms.map((farm) => (
                      <div key={farm.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{farm.name}</h3>
                            <p className="text-sm text-muted-foreground">{farm.location}</p>
                            <p className="text-sm text-muted-foreground">{farm.size} hectares</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={farm.certificationStatus === 'certified' ? 'default' : 'secondary'}>
                            {farm.certificationStatus || 'Pending'}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/farms/${farm.id}`}>View Farm</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function FarmerDetailPage({ params }: FarmerDetailPageProps) {
  return (
    <ProtectedRoute>
      <FarmerDetailContent params={params} />
    </ProtectedRoute>
  )
}
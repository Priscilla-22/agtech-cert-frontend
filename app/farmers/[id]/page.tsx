"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, MapPin, Phone, Mail, Calendar, Building2, AlertTriangle, User, Star, Briefcase, DollarSign, CheckCircle } from "lucide-react"
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
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back button */}
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                <Link href="/farmers">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Farmers
                </Link>
              </Button>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Sidebar - Profile Section */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                  {/* Avatar */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{farmer.name}</h2>
                    <div className="flex items-center justify-center text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{farmer.county}, {farmer.subCounty}</span>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#10b981', color: 'white' }}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {farmer.certificationStatus || 'Active'}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{farmer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{farmer.phone}</span>
                    </div>
                    {farmer.registrationDate && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Since {new Date(farmer.registrationDate).getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full" style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}>
                    <Link href={`/farmers/${farmer.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Farmer
                    </Link>
                  </Button>
                </div>

                {/* Farming Stats Cards */}
                {farmer.farmingType && (
                  <div className="bg-white rounded-2xl shadow-md p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{farmer.farmingType}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Land Size</span>
                      <span className="font-semibold" style={{ color: '#10b981' }}>{farmer.totalLandSize || 'N/A'} hectares</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span>{farmer.organicExperience || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" style={{ color: '#10b981' }} fill="currentColor" />
                        <Star className="w-3 h-3" style={{ color: '#10b981' }} fill="currentColor" />
                        <Star className="w-3 h-3" style={{ color: '#10b981' }} fill="currentColor" />
                        <Star className="w-3 h-3" style={{ color: '#10b981' }} fill="currentColor" />
                        <Star className="w-3 h-3 text-gray-300" />
                        <span className="ml-2 text-xs">4.0</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2">
                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <div className="flex space-x-6 border-b border-gray-200 mb-6">
                    <button className="pb-2 px-1 border-b-2 font-medium text-sm" style={{ borderColor: '#f97316', color: '#f97316' }}>
                      Farm Details
                    </button>
                    <button className="pb-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                      Crops
                    </button>
                    <button className="pb-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                      Certifications
                    </button>
                    <button className="pb-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                      History
                    </button>
                  </div>

                  {/* Farm Information Cards */}
                  <div className="space-y-4">
                    {/* Location Card */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Location Details</h4>
                          <p className="text-sm text-gray-500">Administrative information</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">County</span>
                          <p className="font-medium text-gray-900">{farmer.county}</p>
                        </div>
                        {farmer.subCounty && (
                          <div>
                            <span className="text-gray-500">Sub-County</span>
                            <p className="font-medium text-gray-900">{farmer.subCounty}</p>
                          </div>
                        )}
                        {farmer.ward && (
                          <div>
                            <span className="text-gray-500">Ward</span>
                            <p className="font-medium text-gray-900">{farmer.ward}</p>
                          </div>
                        )}
                        {farmer.village && (
                          <div>
                            <span className="text-gray-500">Village</span>
                            <p className="font-medium text-gray-900">{farmer.village}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Primary Crops */}
                    {farmer.primaryCrops && farmer.primaryCrops.length > 0 && (
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-bold text-gray-900 mb-3">Primary Crops</h4>
                        <div className="flex flex-wrap gap-2">
                          {farmer.primaryCrops.map((crop: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Additional Information</h4>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        {farmer.educationLevel && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Education Level</span>
                            <span className="font-medium text-gray-900">{farmer.educationLevel}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Member Since</span>
                          <span className="font-medium text-gray-900">
                            {farmer.registrationDate ? new Date(farmer.registrationDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registered Farms Section */}
            {farmerFarms.length > 0 && (
              <div className="mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Registered Farms</h3>
                  <div className="space-y-4">
                    {farmerFarms.map((farm) => (
                      <div key={farm.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{farm.name}</h4>
                            <p className="text-sm text-gray-500">{farm.location}</p>
                            <p className="text-sm text-gray-500">{farm.size} hectares</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {farm.certificationStatus || 'Pending'}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="rounded-full"
                            style={{ borderColor: '#f97316', color: '#f97316' }}
                          >
                            <Link href={`/farms/${farm.id}`}>View Farm</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
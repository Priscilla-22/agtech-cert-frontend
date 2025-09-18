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
import { api } from "@/lib/api-client"

interface FarmerDetailPageProps {
  params: { id: string }
}

function FarmerDetailContent({ params }: FarmerDetailPageProps) {
  const [farmer, setFarmer] = useState<any>(null)
  const [farmerFarms, setFarmerFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('farm-details')
  const router = useRouter()

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch farmer details
        const farmerData = await api.farmers.getById(params.id)
        setFarmer(farmerData)

        // Fetch farmer's farms (optional - may not exist yet)
        try {
          const farmsData = await api.farms.getByFarmerId(params.id)
          // Handle both array and object response formats
          if (Array.isArray(farmsData)) {
            setFarmerFarms(farmsData)
          } else {
            setFarmerFarms(farmsData.data || [])
          }
        } catch (farmError) {
          // Farms endpoint might not exist yet, so we'll just use empty array
          setFarmerFarms([])
        }

      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setError('Farmer not found')
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch farmer data')
        }
        console.error('Farmer data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFarmerData()
  }, [params.id])

  if (loading) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
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
        <Footer />
      </div>
    )
  }

  if (!farmer) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
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
                      <div className="w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #f4a261, #e8ddc7)' }}>
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{farmer.name}</h2>
                      <div className="flex items-center justify-center text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{farmer.county}, {farmer.subCounty}</span>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f4a261', color: 'white' }}>
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
                    <Button asChild className="w-full" style={{ backgroundColor: '#f4a261', borderColor: '#f4a261' }}>
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
                        <span className="font-semibold" style={{ color: '#f4a261' }}>{farmer.totalLandSize || 'N/A'} hectares</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span>{farmer.organicExperience || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" style={{ color: '#f4a261' }} fill="currentColor" />
                          <Star className="w-3 h-3" style={{ color: '#f4a261' }} fill="currentColor" />
                          <Star className="w-3 h-3" style={{ color: '#f4a261' }} fill="currentColor" />
                          <Star className="w-3 h-3" style={{ color: '#f4a261' }} fill="currentColor" />
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
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors"
                        style={{
                          borderColor: activeTab === 'farm-details' ? '#f4a261' : 'transparent',
                          color: activeTab === 'farm-details' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('farm-details')}
                      >
                        Farm Details
                      </button>
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors hover:text-gray-700"
                        style={{
                          borderColor: activeTab === 'crops' ? '#f4a261' : 'transparent',
                          color: activeTab === 'crops' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('crops')}
                      >
                        Crops
                      </button>
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors hover:text-gray-700"
                        style={{
                          borderColor: activeTab === 'certifications' ? '#f4a261' : 'transparent',
                          color: activeTab === 'certifications' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('certifications')}
                      >
                        Certifications
                      </button>
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors hover:text-gray-700"
                        style={{
                          borderColor: activeTab === 'history' ? '#f4a261' : 'transparent',
                          color: activeTab === 'history' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('history')}
                      >
                        History
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-4">
                      {activeTab === 'farm-details' && (
                        <>
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
                        <div className="border-b border-gray-100 pb-4 pt-8">
                          <h4 className="font-bold text-gray-900 mb-3">Primary Crops</h4>
                          <div className="flex flex-wrap gap-2">
                            {farmer.primaryCrops.map((crop: string, index: number) => (
                              <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f4a261', color: '#6b5843' }}>
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Details */}
                      <div className="pt-8">
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
                        </>
                      )}

                      {activeTab === 'crops' && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Crop Information</h4>
                          {farmer.primaryCrops && farmer.primaryCrops.length > 0 ? (
                            <>
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-700 mb-3">Primary Crops</h5>
                                <div className="flex flex-wrap gap-2">
                                  {farmer.primaryCrops.map((crop: string, index: number) => (
                                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f4a261', color: '#6b5843' }}>
                                      {crop}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  This farmer specializes in {farmer.primaryCrops.join(', ')} cultivation using {farmer.farmingType?.toLowerCase()} methods.
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No crop information available</p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'certifications' && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Certification Status</h4>
                          <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">Organic Certification</h5>
                                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f4a261', color: 'white' }}>
                                  {farmer.certificationStatus || 'Active'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Current certification status for organic farming practices.
                              </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                <strong>Next Review:</strong> Certificate renewal scheduled for {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'history' && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Activity History</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 border-l-2 border-green-200 bg-green-50 rounded-r-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-gray-900">Farmer Registration</p>
                                <p className="text-sm text-gray-600">
                                  Registered on {farmer.registrationDate ? new Date(farmer.registrationDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border-l-2 border-blue-200 bg-blue-50 rounded-r-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-gray-900">Profile Completion</p>
                                <p className="text-sm text-gray-600">
                                  Completed farm details and crop information
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border-l-2 border-orange-200 bg-orange-50 rounded-r-lg">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-gray-900">Certification Status</p>
                                <p className="text-sm text-gray-600">
                                  Current status: {farmer.certificationStatus || 'Active'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                              style={{ borderColor: '#f4a261', color: '#f4a261' }}
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
        </div>
      </div>
      <Footer />
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
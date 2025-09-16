"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, MapPin, GraduationCap, Tractor, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"

interface EditFarmerPageProps {
  params: { id: string }
}

function EditFarmerContent({ params }: EditFarmerPageProps) {
  const router = useRouter()
  const [farmer, setFarmer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Personal & Contact Information
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    idNumber: '',
    dateOfBirth: '',

    // Location Details
    county: '',
    subCounty: '',
    ward: '',
    village: '',
    address: '',

    // Farming Background
    farmingExperience: '',
    educationLevel: '',
    primaryCrops: [],
    farmingType: '',

    // Farm Details
    totalLandSize: '',
    landTenure: '',
    soilType: '',
    irrigationSystem: '',

    // Certification Info
    organicExperience: '',
    previousCertification: '',
    certifyingBody: '',
    status: 'active'
  })

  // Fetch farmer data
  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        setLoading(true)
        setError(null)

        const farmerData = await api.farmers.getById(params.id)
        setFarmer(farmerData)

        // Pre-populate form with farmer data
        setFormData({
          name: farmerData.name || '',
          email: farmerData.email || '',
          phone: farmerData.phone || '',
          alternatePhone: farmerData.alternatePhone || '',
          idNumber: farmerData.idNumber || '',
          dateOfBirth: farmerData.dateOfBirth || '',
          county: farmerData.county || '',
          subCounty: farmerData.subCounty || '',
          ward: farmerData.ward || '',
          village: farmerData.village || '',
          address: farmerData.address || '',
          farmingExperience: farmerData.farmingExperience || '',
          educationLevel: farmerData.educationLevel || '',
          primaryCrops: farmerData.primaryCrops || [],
          farmingType: farmerData.farmingType || '',
          totalLandSize: farmerData.totalLandSize?.toString() || '',
          landTenure: farmerData.landTenure || '',
          soilType: farmerData.soilType || '',
          irrigationSystem: farmerData.irrigationSystem || '',
          organicExperience: farmerData.organicExperience || '',
          previousCertification: farmerData.previousCertification || '',
          certifyingBody: farmerData.certifyingBody || '',
          status: farmerData.status || 'active'
        })

      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setError('Farmer not found')
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch farmer')
        }
        console.error('Farmer fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFarmer()
  }, [params.id])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.farmers.update(params.id, formData)

      // Success - redirect back to farmer details
      router.push(`/farmers/${params.id}`)

    } catch (error) {
      console.error('Update error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update farmer')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#faf9f7' }}>
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
      <div style={{ backgroundColor: '#faf9f7' }}>
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

  return (
    <div style={{ backgroundColor: '#faf9f7' }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                  <Link href={`/farmers/${params.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Farmer Details
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-space-grotesk font-bold">Edit Farmer</h1>
                  <p className="text-muted-foreground">Update farmer information</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal & Contact Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1f3408', color: 'white' }}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle>Personal & Contact Information</CardTitle>
                        <CardDescription>Basic identity and contact details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alternatePhone">Alternate Phone</Label>
                      <Input
                        id="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                        placeholder="Enter alternate phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number *</Label>
                      <Input
                        id="idNumber"
                        value={formData.idNumber}
                        onChange={(e) => handleInputChange('idNumber', e.target.value)}
                        placeholder="Enter ID number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1f3408', color: 'white' }}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle>Location Details</CardTitle>
                        <CardDescription>Physical address and location information</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="county">County *</Label>
                      <Input
                        id="county"
                        value={formData.county}
                        onChange={(e) => handleInputChange('county', e.target.value)}
                        placeholder="Enter county"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subCounty">Sub-County</Label>
                      <Input
                        id="subCounty"
                        value={formData.subCounty}
                        onChange={(e) => handleInputChange('subCounty', e.target.value)}
                        placeholder="Enter sub-county"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Ward</Label>
                      <Input
                        id="ward"
                        value={formData.ward}
                        onChange={(e) => handleInputChange('ward', e.target.value)}
                        placeholder="Enter ward"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="village">Village</Label>
                      <Input
                        id="village"
                        value={formData.village}
                        onChange={(e) => handleInputChange('village', e.target.value)}
                        placeholder="Enter village"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Physical Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter physical address"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Farming Background */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1f3408', color: 'white' }}>
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle>Farming Background</CardTitle>
                        <CardDescription>Experience and education information</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="farmingExperience">Years in Farming</Label>
                      <Select value={formData.farmingExperience} onValueChange={(value) => handleInputChange('farmingExperience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="2-5">2-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="11-20">11-20 years</SelectItem>
                          <SelectItem value="20+">20+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="educationLevel">Education Level</Label>
                      <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="tertiary">Tertiary</SelectItem>
                          <SelectItem value="university">University</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmingType">Farming Type</Label>
                      <Select value={formData.farmingType} onValueChange={(value) => handleInputChange('farmingType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select farming type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organic">Organic</SelectItem>
                          <SelectItem value="conventional">Conventional</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                          <SelectItem value="subsistence">Subsistence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organicExperience">Organic Experience</Label>
                      <Select value={formData.organicExperience} onValueChange={(value) => handleInputChange('organicExperience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organic experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="2-3">2-3 years</SelectItem>
                          <SelectItem value="4-5">4-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Farm Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1f3408', color: 'white' }}>
                        <Tractor className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle>Farm Details</CardTitle>
                        <CardDescription>Land and infrastructure information</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalLandSize">Total Land Size (hectares)</Label>
                      <Input
                        id="totalLandSize"
                        type="number"
                        step="0.1"
                        value={formData.totalLandSize}
                        onChange={(e) => handleInputChange('totalLandSize', e.target.value)}
                        placeholder="Enter land size"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landTenure">Land Tenure</Label>
                      <Select value={formData.landTenure} onValueChange={(value) => handleInputChange('landTenure', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select land tenure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="leased">Leased</SelectItem>
                          <SelectItem value="communal">Communal</SelectItem>
                          <SelectItem value="family">Family Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="loam">Loam</SelectItem>
                          <SelectItem value="volcanic">Volcanic</SelectItem>
                          <SelectItem value="alluvial">Alluvial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="irrigationSystem">Irrigation System</Label>
                      <Select value={formData.irrigationSystem} onValueChange={(value) => handleInputChange('irrigationSystem', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select irrigation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="drip">Drip Irrigation</SelectItem>
                          <SelectItem value="sprinkler">Sprinkler</SelectItem>
                          <SelectItem value="furrow">Furrow</SelectItem>
                          <SelectItem value="basin">Basin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>Current farmer status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/farmers/${params.id}`}>Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="text-white"
                    style={{ backgroundColor: '#1f3408', borderColor: '#1f3408' }}
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Updating..." : "Update Farmer"}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function EditFarmerPage({ params }: EditFarmerPageProps) {
  return (
    <ProtectedRoute>
      <EditFarmerContent params={params} />
    </ProtectedRoute>
  )
}
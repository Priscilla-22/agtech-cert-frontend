"use client"

import React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Award } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { API_ENDPOINTS } from "@/lib/config"
import { api } from "@/lib/api-client"

export default function NewCertificatePage() {
  const [formData, setFormData] = useState({
    farmId: "",
    issueDate: "",
    expiryDate: "",
    cropTypes: [] as string[],
  })
  const [farmers, setFarmers] = useState<any[]>([])
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [farmersData, farmsData] = await Promise.all([
          api.farmers.getAll().catch(() => ({ data: [] })),
          api.farms.getAll().catch(() => [])
        ])

        setFarmers(farmersData?.data || [])
        setFarms(Array.isArray(farmsData) ? farmsData : [])
      } catch (error) {
        // Handle error silently
      }
      setLoading(false)
    }

    loadData()
  }, [])

  const selectedFarm = farms.find((f: any) => f.id.toString() === formData.farmId)

  const availableCrops = [
    "Tomatoes",
    "Lettuce",
    "Carrots",
    "Peppers",
    "Cucumbers",
    "Herbs",
    "Wheat",
    "Corn",
    "Soybeans",
  ]

  function handleCropToggle(crop: string, checked: boolean) {
    const newCropTypes = checked
      ? [...formData.cropTypes, crop]
      : formData.cropTypes.filter((c: string) => c !== crop)

    setFormData({ ...formData, cropTypes: newCropTypes })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedFarm) {
      alert('Please select a farm')
      return
    }

    if (!formData.issueDate || !formData.expiryDate) {
      alert('Please select issue and expiry dates')
      return
    }

    if (formData.cropTypes.length === 0) {
      alert('Please select at least one crop type')
      return
    }

    try {
      setIsSubmitting(true)

      const certificate = await api.certificates.create(formData)
      const certNumber = certificate.certificateNumber || 'Unknown'
      alert(`Certificate ${certNumber} created successfully!`)

      window.location.href = '/certificates'

    } catch (error) {
      alert(`Failed to create certificate: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  function generateCertificateNumber() {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ORG-${year}-${random}`
  }

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
            <div className="max-w-full mx-auto space-y-6 pb-96 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/certificates">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Certificates
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Issue New Certificate</h1>
              <p className="text-muted-foreground">Create a new organic certification document</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Farm Selection */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Farm Selection</CardTitle>
                  <CardDescription>Choose the farm to certify</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="farm">Select Farm</Label>
                      <Select
                        value={formData.farmId}
                        onValueChange={(value) => setFormData({ ...formData, farmId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a farm to certify" />
                        </SelectTrigger>
                        <SelectContent>
                          {loading ? (
                            <SelectItem value="loading" disabled>Loading farms...</SelectItem>
                          ) : farms.length === 0 ? (
                            <SelectItem value="no-farms" disabled>No farms available</SelectItem>
                          ) : (
                            farms
                              .filter((farm) => farm.certificationStatus === "pending")
                              .map((farm: any) => {
                                return (
                                  <SelectItem key={farm.id} value={farm.id.toString()}>
                                    {farm.farmName} - {farm.farmerName || '-'}
                                  </SelectItem>
                                )
                              })
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Farm Details Card */}
              {selectedFarm && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle>Selected Farm Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Farmer:</span>
                        <span>{selectedFarm.farmerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{selectedFarm.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Size:</span>
                        <span>{selectedFarm.totalArea} acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Organic Since:</span>
                        <span>{new Date(selectedFarm.organicSince).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Certificate Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Configuration</CardTitle>
                  <CardDescription>Set dates and crop types for certification</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="issueDate">Issue Date</Label>
                        <Input
                          id="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Certified Crop Types</Label>
                      <div className="grid gap-3 md:grid-cols-3">
                        {availableCrops.map((crop) => (
                          <div key={crop} className="flex items-center space-x-2">
                            <Checkbox
                              id={crop}
                              checked={formData.cropTypes.includes(crop)}
                              onCheckedChange={(checked) => handleCropToggle(crop, checked as boolean)}
                            />
                            <Label htmlFor={crop} className="text-sm font-normal">
                              {crop}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={isSubmitting}>
                        <Award className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Creating Certificate...' : 'Issue Certificate'}
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <Link href="/certificates">Cancel</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Certificate Preview Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certificate Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-primary">Certificate Number</Label>
                      <p className="font-mono text-lg font-bold">{generateCertificateNumber()}</p>
                      <p className="text-xs text-muted-foreground">
                        This number will be automatically generated upon certificate creation
                      </p>
                    </div>
                    {selectedFarm && (
                      <div className="space-y-2 pt-3 border-t">
                        <div>
                          <Label className="text-sm font-medium">Farm</Label>
                          <p className="text-sm">{selectedFarm.farmName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Farmer</Label>
                          <p className="text-sm">{selectedFarm.farmerName}</p>
                        </div>
                        {formData.cropTypes.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium">Certified Crops</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.cropTypes.map((crop: string) => (
                                <span key={crop} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                  {crop}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Award } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

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

  // Fetch farmers and farms data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmersRes, farmsRes] = await Promise.all([
          fetch('http://localhost:3002/api/farmers'),
          fetch('http://localhost:3002/api/farms')
        ])

        if (farmersRes.ok) {
          const farmersData = await farmersRes.json()
          setFarmers(farmersData)
        }

        if (farmsRes.ok) {
          const farmsData = await farmsRes.json()
          setFarms(farmsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const selectedFarm = farms.find((f) => f.id === formData.farmId)
  const selectedFarmer = selectedFarm ? farmers.find((f) => f.id === selectedFarm.farmerId) : null

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

  const handleCropToggle = (crop: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, cropTypes: [...formData.cropTypes, crop] })
    } else {
      setFormData({ ...formData, cropTypes: formData.cropTypes.filter((c) => c !== crop) })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `ORG-${year}-${random}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col gap-6 max-w-2xl">
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

          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>Select the farm and specify certification details</CardDescription>
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
                        <SelectItem value="" disabled>Loading farms...</SelectItem>
                      ) : farms.length === 0 ? (
                        <SelectItem value="" disabled>No approved farms available</SelectItem>
                      ) : (
                        farms
                          .filter((farm) => farm.certificationStatus === "approved")
                          .map((farm) => {
                            const farmer = farmers.find((f) => f.id === farm.farmerId)
                            return (
                              <SelectItem key={farm.id} value={farm.id}>
                                {farm.name} - {farmer?.name || 'Unknown Farmer'}
                              </SelectItem>
                            )
                          })
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFarm && selectedFarmer && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Farmer:</span>
                          <span>{selectedFarmer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Location:</span>
                          <span>{selectedFarm.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Size:</span>
                          <span>{selectedFarm.size} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Organic Since:</span>
                          <span>{new Date(selectedFarm.organicSince).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                  <div className="grid gap-3 md:grid-cols-2">
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

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">Certificate Number</span>
                    </div>
                    <p className="font-mono text-sm">{generateCertificateNumber()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This number will be automatically generated upon certificate creation
                    </p>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="submit">
                    <Award className="mr-2 h-4 w-4" />
                    Issue Certificate
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/certificates">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

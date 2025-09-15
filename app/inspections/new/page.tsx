"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function NewInspectionPage() {
  const [formData, setFormData] = useState({
    farmId: "",
    inspectorName: "",
    scheduledDate: "",
    notes: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3002/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Inspection scheduled successfully")
        // Redirect to inspections list or show success message
        window.location.href = '/inspections'
      } else {
        console.error("Failed to schedule inspection")
      }
    } catch (error) {
      console.error("Error scheduling inspection:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/inspections">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inspections
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Schedule New Inspection</h1>
              <p className="text-muted-foreground">Create a new farm inspection appointment</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
              <CardDescription>Select the farm and inspector for this inspection</CardDescription>
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
                      <SelectValue placeholder="Choose a farm to inspect" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="" disabled>Loading farms...</SelectItem>
                      ) : farms.length === 0 ? (
                        <SelectItem value="" disabled>No farms available</SelectItem>
                      ) : (
                        farms.map((farm) => {
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
                          <span className="font-medium">Crops:</span>
                          <span>{selectedFarm.cropTypes.join(", ")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="inspector">Inspector Name</Label>
                    <Select
                      value={formData.inspectorName}
                      onValueChange={(value) => setFormData({ ...formData, inspectorName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inspector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                        <SelectItem value="Lisa Brown">Lisa Brown</SelectItem>
                        <SelectItem value="David Martinez">David Martinez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special instructions or notes for the inspection"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Inspection
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/inspections">Cancel</Link>
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

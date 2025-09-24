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
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api-client"
import { auth } from "@/lib/firebase"

export default function NewInspectionPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    farmId: "",
    inspectorName: "",
    scheduledDate: "",
    notes: "",
  })
  const [farmers, setFarmers] = useState<any[]>([])
  const [farms, setFarms] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {}
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        unsubscribe()
        if (user) {
          try {
            const token = await user.getIdToken()
            headers.Authorization = `Bearer ${token}`
          } catch (error) {
            console.error('Error getting Firebase token:', error)
          }
        }
        resolve(headers)
      })
    })
  }

  // Fetch farmers, farms, and inspectors data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmersRes, farmsRes, inspectorsRes] = await Promise.all([
          api.farmers.getAll(),
          api.farms.getAll(),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://agtech-cert-backend.onrender.com'}/api/inspectors`, {
            headers: await getAuthHeaders()
          })
        ])

        if (farmersRes && farmersRes.data) {
          setFarmers(farmersRes.data)
        }

        if (farmsRes && Array.isArray(farmsRes)) {
          setFarms(farmsRes)
        }

        if (inspectorsRes.ok) {
          const inspectorsData = await inspectorsRes.json()
          const inspectorsArray = inspectorsData.data || inspectorsData || []
          setInspectors(Array.isArray(inspectorsArray) ? inspectorsArray : [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const selectedFarm = farms.find((f) => f.id.toString() === formData.farmId)
  const selectedFarmer = selectedFarm ? farmers.find((f) => f.id === selectedFarm.farmerId) : null

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.farmId || !formData.inspectorName || !formData.scheduledDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)

    try {
      // Convert farmId back to number for backend
      const submissionData = {
        ...formData,
        farmId: parseInt(formData.farmId)
      }

      console.log('Submitting inspection data:', submissionData)

      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const responseData = await response.json()
      console.log('Response:', responseData)

      if (response.ok) {
        toast({
          title: "Success",
          description: "Inspection scheduled successfully!",
        })
        router.push('/inspections')
      } else {
        console.error("Failed to schedule inspection:", responseData)
        if (responseData.errors && Array.isArray(responseData.errors)) {
          toast({
            title: "Failed to schedule inspection",
            description: responseData.errors.join(', '),
            variant: "destructive"
          })
        } else {
          toast({
            title: "Failed to schedule inspection",
            description: responseData.error || 'Unknown error',
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error("Error scheduling inspection:", error)
      toast({
        title: "Error",
        description: "Error scheduling inspection. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        {/* Mobile sidebar overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden sidebar-overlay opacity-0 invisible transition-all duration-300"
          onClick={() => {
            const sidebar = document.querySelector('[data-sidebar]')
            if (sidebar) {
              sidebar.classList.add('-translate-x-full')
              sidebar.classList.remove('translate-x-0')
              document.querySelector('.sidebar-overlay')?.classList.add('opacity-0', 'invisible')
              document.querySelector('.sidebar-overlay')?.classList.remove('opacity-100', 'visible')
            }
          }}
        />

        <Sidebar />

        <div className="flex-1 flex flex-col w-full md:w-auto">
          <Navbar />

          <main className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-96">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold text-foreground">Schedule New Inspection</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Create a new farm inspection appointment
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
                  <Link href="/inspections">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Inspections
                  </Link>
                </Button>
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Inspection Details</CardTitle>
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
                        <SelectItem value="loading" disabled>Loading farms...</SelectItem>
                      ) : farms.length === 0 ? (
                        <SelectItem value="no-farms" disabled>No farms available</SelectItem>
                      ) : (
                        farms.map((farm) => {
                          const farmer = farmers.find((f) => f.id === farm.farmerId)
                          return (
                            <SelectItem key={farm.id} value={farm.id.toString()}>
                              {farm.farmName || farm.name} - {farmer?.name || 'Unknown Farmer'} (owner)
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
                        {loading ? (
                          <SelectItem value="loading" disabled>Loading inspectors...</SelectItem>
                        ) : inspectors.length === 0 ? (
                          <SelectItem value="no-inspectors" disabled>No active inspectors available</SelectItem>
                        ) : (
                          inspectors
                            .filter(inspector => inspector.status === 'active')
                            .map((inspector) => (
                              <SelectItem key={inspector.id} value={inspector.name}>
                                {inspector.name} - {inspector.specialization}
                              </SelectItem>
                            ))
                        )}
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
                  <Button type="submit" disabled={submitting}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {submitting ? 'Scheduling...' : 'Schedule Inspection'}
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
      </div>
      <Footer />
    </div>
  )
}

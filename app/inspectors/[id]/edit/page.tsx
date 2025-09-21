"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Users } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

interface EditInspectorPageProps {
  params: { id: string }
}

function EditInspectorContent({ params }: EditInspectorPageProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualifications: "",
    experience: "",
    status: "active"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchInspector = async () => {
      try {
        const response = await fetch(`/api/inspectors/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error('Failed to fetch inspector')
        }

        const inspector = await response.json()
        setFormData({
          name: inspector.name,
          email: inspector.email,
          phone: inspector.phone,
          specialization: inspector.specialization,
          qualifications: inspector.qualifications || "",
          experience: inspector.experience,
          status: inspector.status
        })
      } catch (error) {
        console.error('Error fetching inspector:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load inspector details"
        })
        router.push('/inspectors')
      } finally {
        setLoading(false)
      }
    }

    fetchInspector()
  }, [params.id, router, toast])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly."
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/inspectors/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update inspector')
      }

      toast({
        title: "✅ Inspector Updated Successfully!",
        description: `${formData.name} has been updated.`
      })

      setTimeout(() => {
        router.push('/inspectors')
      }, 1500)
    } catch (error) {
      console.error('Error updating inspector:', error)

      const errorMessage = error instanceof Error ? error.message : "Unable to connect to the server. Please check your connection and try again."

      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
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
                <p className="text-muted-foreground">Loading inspector details...</p>
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
            <div className="max-w-4xl mx-auto space-y-6 pb-96">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/inspectors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Inspectors
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-space-grotesk font-bold">Edit Inspector</h1>
                  <p className="text-muted-foreground">Update inspector information and credentials</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Inspector Information
                  </CardTitle>
                  <CardDescription>
                    Update the details for this certified organic inspector
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="inspector@example.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="font-medium">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+254 700 123 456"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="specialization" className="font-medium">Specialization *</Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={(value) => setFormData({ ...formData, specialization: value })}
                        >
                          <SelectTrigger className={errors.specialization ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="organic-crops">Organic Crops</SelectItem>
                            <SelectItem value="livestock">Livestock</SelectItem>
                            <SelectItem value="processing">Processing & Handling</SelectItem>
                            <SelectItem value="general">General Organic Farming</SelectItem>
                            <SelectItem value="soil-management">Soil Management</SelectItem>
                            <SelectItem value="pest-control">Pest Control</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.specialization && <p className="text-sm text-red-500">{errors.specialization}</p>}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="experience" className="font-medium">Years of Experience</Label>
                        <Select
                          value={formData.experience}
                          onValueChange={(value) => setFormData({ ...formData, experience: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="status" className="font-medium">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="qualifications" className="font-medium">Qualifications & Certifications</Label>
                      <Textarea
                        id="qualifications"
                        value={formData.qualifications}
                        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                        placeholder="List certifications, degrees, and relevant qualifications..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Include any relevant certifications, degrees, or training in organic farming and inspection
                      </p>
                    </div>

                    <div className="flex gap-4 pt-6 border-t">
                      <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Updating Inspector..." : "Update Inspector"}
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <Link href="/inspectors">Cancel</Link>
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

export default function EditInspectorPage({ params }: EditInspectorPageProps) {
  return (
    <ProtectedRoute>
      <EditInspectorContent params={params} />
    </ProtectedRoute>
  )
}
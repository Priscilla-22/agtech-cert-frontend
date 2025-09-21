"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, RefreshCw, Calendar, Building2, User, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/ProtectedRoute"

interface RenewCertificatePageProps {
  params: { id: string }
}

function RenewCertificateContent({ params }: RenewCertificatePageProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [certificate, setCertificate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    reason: "",
    notes: "",
    requestedExpiryDate: ""
  })

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/certificates/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error('Failed to fetch certificate')
        }

        const data = await response.json()
        setCertificate(data)

        // Set default expiry date to 3 years from now
        const futureDate = new Date()
        futureDate.setFullYear(futureDate.getFullYear() + 3)
        setFormData(prev => ({
          ...prev,
          requestedExpiryDate: futureDate.toISOString().split('T')[0]
        }))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificate')
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.reason.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide a reason for renewal."
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`http://localhost:3002/api/certificates/${params.id}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: formData.reason,
          notes: formData.notes,
          requestedExpiryDate: formData.requestedExpiryDate
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit renewal request')
      }

      toast({
        title: "✅ Renewal Request Submitted!",
        description: "Your certificate renewal request has been submitted for review."
      })

      setTimeout(() => {
        router.push('/certificates')
      }, 1500)
    } catch (error) {
      console.error('Error submitting renewal:', error)
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit renewal request. Please try again."
      })
    } finally {
      setSubmitting(false)
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
                <p className="text-muted-foreground">Loading certificate...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !certificate) {
    notFound()
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
                  <Link href={`/certificates/${certificate.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Certificate
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-space-grotesk font-bold">Renew Certificate</h1>
                  <p className="text-muted-foreground">Certificate #{certificate.certificateNumber}</p>
                </div>
              </div>

              {/* Current Certificate Info */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Current Certificate Details
                  </CardTitle>
                  <CardDescription>
                    Review current certificate information before renewal
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{certificate.farm?.farmName}</p>
                      <p className="text-sm text-muted-foreground">Farm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{certificate.farmer?.name}</p>
                      <p className="text-sm text-muted-foreground">Farmer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Issue Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-orange-600">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Renewal Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Renewal Request
                  </CardTitle>
                  <CardDescription>
                    Submit a request to renew this organic certification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="reason" className="font-medium">Reason for Renewal *</Label>
                        <select
                          id="reason"
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-full p-2 border border-input rounded-md bg-background"
                          required
                        >
                          <option value="">Select a reason</option>
                          <option value="expiring">Certificate Expiring</option>
                          <option value="expansion">Farm Expansion</option>
                          <option value="change-practices">Change in Farming Practices</option>
                          <option value="market-requirements">Market Requirements</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="requestedExpiryDate" className="font-medium">Requested New Expiry Date</Label>
                        <Input
                          id="requestedExpiryDate"
                          type="date"
                          value={formData.requestedExpiryDate}
                          onChange={(e) => setFormData({ ...formData, requestedExpiryDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="notes" className="font-medium">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Provide any additional information about the renewal request..."
                        rows={4}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Renewal Process</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Your renewal request will be reviewed by our certification team</li>
                        <li>• A new inspection may be required depending on the changes</li>
                        <li>• Processing time is typically 2-4 weeks</li>
                        <li>• You will be notified of the status via email</li>
                      </ul>
                    </div>

                    <div className="flex gap-4 pt-6 border-t">
                      <Button type="submit" disabled={submitting}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {submitting ? "Submitting..." : "Submit Renewal Request"}
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <Link href={`/certificates/${certificate.id}`}>Cancel</Link>
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

export default function RenewCertificatePage({ params }: RenewCertificatePageProps) {
  return (
    <ProtectedRoute>
      <RenewCertificateContent params={params} />
    </ProtectedRoute>
  )
}
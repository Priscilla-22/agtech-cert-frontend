"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, RefreshCw, Calendar, Building2, User, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CertificatePreview } from "@/components/certificate/certificate-preview"
import { useEffect, useState } from "react"

interface CertificateDetailPageProps {
  params: { id: string }
}

export default function CertificateDetailPage({ params }: CertificateDetailPageProps) {
  const [certificate, setCertificate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificate')
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading certificate...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !certificate) {
    notFound()
  }

  const isExpiringSoon = new Date(certificate.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/certificates">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Certificates
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">Certificate Details</h1>
              <p className="text-muted-foreground">{certificate.certificateNumber}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              {certificate.status === "active" && (
                <Button asChild>
                  <Link href={`/certificates/${certificate.id}/renew`}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Renew
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Information</CardTitle>
                  <CardDescription>Basic details about this certificate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-mono text-sm">{certificate.certificateNumber}</p>
                      <p className="text-xs text-muted-foreground">Certificate Number</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{certificate.farmerName}</p>
                      <p className="text-xs text-muted-foreground">Farmer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{certificate.farmName}</p>
                      <p className="text-xs text-muted-foreground">Farm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Issue Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Expiry Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Status:</span>
                    <StatusBadge status={certificate.status} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certified Crops</CardTitle>
                  <CardDescription>Organic certified crop types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {certificate.cropTypes.map((crop) => (
                      <Badge key={crop} variant="secondary">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isExpiringSoon && certificate.status === "active" && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">Renewal Required</CardTitle>
                    <CardDescription className="text-yellow-700">
                      This certificate expires within 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/certificates/${certificate.id}/renew`}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Start Renewal Process
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Preview</CardTitle>
                  <CardDescription>Official organic certification document</CardDescription>
                </CardHeader>
                <CardContent>
                  <CertificatePreview certificate={certificate} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

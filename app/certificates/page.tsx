"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Download, RefreshCw, Award, AlertTriangle, CheckCircle, X } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Certificate } from "@/lib/types/certificate"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useEffect, useState } from "react"
import { fetchAllCertificates } from "@/lib/services/certificate-service"
import { api } from "@/lib/api-client"


const columns: ColumnDef<Certificate>[] = [
  {
    accessorKey: "certificateNumber",
    header: "Certificate #",
    cell: ({ row }: { row: any }) => (
      <span className="font-mono text-sm">{row.getValue("certificateNumber")}</span>
    ),
  },
  {
    accessorKey: "farmerName",
    header: "Farmer",
  },
  {
    accessorKey: "farmName",
    header: "Farm",
  },
  {
    accessorKey: "cropTypes",
    header: "Crops",
    cell: ({ row }: { row: any }) => {
      const crops = row.getValue("cropTypes") as string[]
      if (!crops?.length) {
        return <span className="text-muted-foreground text-sm">-</span>
      }

      const displayCrops = crops.slice(0, 2)
      const extraCount = crops.length - 2

      return (
        <div className="flex flex-wrap gap-1">
          {displayCrops.map((crop: string) => (
            <Badge key={crop} variant="secondary" className="text-xs">
              {crop}
            </Badge>
          ))}
          {extraCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{extraCount}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "issueDate",
    header: "Issue Date",
    cell: ({ row }: { row: any }) => new Date(row.getValue("issueDate")).toLocaleDateString(),
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }: { row: any }) => {
      const expiryDate = new Date(row.getValue("expiryDate"))
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      const isExpiringSoon = expiryDate <= thirtyDaysFromNow

      return (
        <div className="flex items-center gap-2">
          <span>{expiryDate.toLocaleDateString()}</span>
          {isExpiringSoon && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      const certificate = row.original

      async function downloadPDF() {
        try {
          const blob = await api.certificates.downloadPDF(certificate.id.toString())
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `certificate-${certificate.certificateNumber || certificate.id}.pdf`
          document.body.appendChild(a)
          a.click()
          URL.revokeObjectURL(url)
          document.body.removeChild(a)
        } catch (error) {
          console.error('Download failed:', error)
          // Fallback to window.open
          window.open(`/api/certificates/${certificate.id}/pdf`, '_blank')
        }
      }

      function approveRenewal() {
        // TODO: Implement renewal approval
        console.log('Approve renewal for certificate:', certificate.id)
      }

      function rejectRenewal() {
        // TODO: Implement renewal rejection
        console.log('Reject renewal for certificate:', certificate.id)
      }

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/certificates/${certificate.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadPDF}>
            <Download className="h-4 w-4" />
          </Button>
          {certificate.status === 'renewal_pending' ? (
            <>
              <Button variant="ghost" size="sm" onClick={approveRenewal} className="text-green-600 hover:text-green-700">
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={rejectRenewal} className="text-red-600 hover:text-red-700">
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    },
  },
]

function CertificatesContent() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchAllCertificates()
        setCertificates(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch certificates')
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

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
                <p className="text-muted-foreground">Loading certificates...</p>
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
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-600">Error loading certificates: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const activeCertificates = certificates.filter((c: Certificate) => c.status === "active")
  const expiredCertificates = certificates.filter((c: Certificate) => c.status === "expired")
  const revokedCertificates = certificates.filter((c: Certificate) => c.status === "revoked")
  const expiringSoon = certificates.filter((c: Certificate) => {
    const expiryDate = new Date(c.expiryDate)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return c.status === "active" && expiryDate <= thirtyDaysFromNow
  })

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6 pb-96">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
                <p className="text-muted-foreground">Manage organic certification documents and renewals</p>
              </div>
              <Button asChild>
                <Link href="/certificates/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Issue Certificate
                </Link>
              </Button>
            </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCertificates.length}</div>
                <p className="text-xs text-muted-foreground">Valid certificates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiringSoon.length}</div>
                <p className="text-xs text-muted-foreground">Within 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
                <Award className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiredCertificates.length}</div>
                <p className="text-xs text-muted-foreground">Need renewal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revoked</CardTitle>
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revokedCertificates.length}</div>
                <p className="text-xs text-muted-foreground">Cancelled certificates</p>
              </CardContent>
            </Card>
          </div>

          {expiringSoon.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Certificates Expiring Soon
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  The following certificates will expire within 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringSoon.map((cert: Certificate) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium">{cert.farmName}</p>
                        <p className="text-sm text-muted-foreground">
                          {cert.certificateNumber} - Expires {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/certificates/${cert.id}/renew`}>Renew</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Certificates</CardTitle>
              <CardDescription>Complete list of organic certification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={certificates}
                searchKey="farmerName"
                searchPlaceholder="Search by farmer name..."
              />
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

export default function CertificatesPage() {
  return (
    <ProtectedRoute>
      <CertificatesContent />
    </ProtectedRoute>
  )
}

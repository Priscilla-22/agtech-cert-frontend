"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"

import { ArrowLeft, Edit, Calendar, User, Building2, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

interface InspectionDetailPageProps {
  params: { id: string }
}

export default function InspectionDetailPage({ params }: InspectionDetailPageProps) {
  const [inspection, setInspection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/inspections/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error('Failed to fetch inspection')
        }

        const data = await response.json()
        setInspection(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inspection')
      } finally {
        setLoading(false)
      }
    }

    fetchInspection()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading inspection...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !inspection) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/inspections">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inspections
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">Inspection Details</h1>
              <p className="text-muted-foreground">
                {inspection.farmName} - {inspection.farmerName}
              </p>
            </div>
            <Button asChild>
              <Link href={`/inspections/${inspection.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Inspection
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inspection Information</CardTitle>
                <CardDescription>Basic details about this inspection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{inspection.farmName}</p>
                    <p className="text-sm text-muted-foreground">Farm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{inspection.farmerName}</p>
                    <p className="text-sm text-muted-foreground">Farmer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{inspection.inspectorName}</p>
                    <p className="text-sm text-muted-foreground">Inspector</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{new Date(inspection.scheduledDate).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  </div>
                </div>
                {inspection.completedDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(inspection.completedDate).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Completed Date</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Status:</span>
                  <StatusBadge status={inspection.status} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inspection Results</CardTitle>
                <CardDescription>Scores and assessment outcomes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inspection.score ? (
                  <>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{inspection.score}/100</div>
                      <Badge variant={inspection.score >= 80 ? "default" : "destructive"} className="text-sm">
                        {inspection.score >= 80 ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Organic Practices</span>
                        <span className="font-medium">95/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Documentation</span>
                        <span className="font-medium">88/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Soil Management</span>
                        <span className="font-medium">92/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pest Control</span>
                        <span className="font-medium">94/100</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Inspection not yet completed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {inspection.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Inspector Notes
                </CardTitle>
                <CardDescription>Additional comments and observations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{inspection.notes}</p>
              </CardContent>
            </Card>
          )}

          {inspection.violations && inspection.violations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Violations & Issues
                </CardTitle>
                <CardDescription>Items that need attention or correction</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {inspection.violations.map((violation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{violation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

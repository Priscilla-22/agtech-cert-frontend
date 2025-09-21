"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"

import { ArrowLeft, Edit, Calendar, User, Building2, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface InspectionDetailPageProps {
  params: { id: string }
}

export default function InspectionDetailPage({ params }: InspectionDetailPageProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [inspection, setInspection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const response = await fetch(`/api/inspections/${params.id}`)

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

    if (user) {
      fetchInspection()
    }
  }, [params.id, user])

  if (loading) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col w-full md:w-auto">
            <Navbar />
            <main className="flex-1 p-3 sm:p-4 md:p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading inspection...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !inspection) {
    notFound()
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
                  <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold text-foreground">Inspection Details</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {inspection.farmName} - {inspection.farmerName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
                    <Link href="/inspections">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Inspections
                    </Link>
                  </Button>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/inspections/${inspection.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Inspection
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-space-grotesk">Inspection Information</CardTitle>
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

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-space-grotesk">Inspection Results</CardTitle>
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
                          {inspection.checklist ? (
                            <>
                              <div className="flex justify-between text-sm">
                                <span>Organic Practices</span>
                                <span className="font-medium">
                                  {inspection.checklist.filter(item =>
                                    ['syntheticInputs', 'organicSeed'].includes(item.id) && item.answer === true
                                  ).length * 50}/100
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Documentation</span>
                                <span className="font-medium">
                                  {inspection.checklist.filter(item =>
                                    item.id === 'recordKeeping' && item.answer === true
                                  ).length * 100}/100
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Soil Management</span>
                                <span className="font-medium">
                                  {inspection.checklist.filter(item =>
                                    ['bufferZones', 'compostManagement'].includes(item.id) && item.answer === true
                                  ).length * 50}/100
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Overall Compliance</span>
                                <span className="font-medium">{inspection.score}/100</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-sm text-muted-foreground py-4">
                              Checklist not yet completed
                            </div>
                          )}
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
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-space-grotesk">
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
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-space-grotesk">
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
      </div>
      <Footer />
    </div>
  )
}

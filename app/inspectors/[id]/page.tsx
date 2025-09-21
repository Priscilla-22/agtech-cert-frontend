"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, Phone, Users, GraduationCap, Calendar, CheckCircle, Star, AlertTriangle, UserCheck } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

interface InspectorDetailPageProps {
  params: { id: string }
}

interface Inspector {
  id: number
  name: string
  email: string
  phone: string
  specialization: string
  qualifications: string
  experience: string
  status: string
  createdAt: string
  updatedAt: string
}

function InspectorDetailContent({ params }: InspectorDetailPageProps) {
  const [inspector, setInspector] = useState<Inspector | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('professional-details')

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

        const data = await response.json()
        setInspector(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inspector')
      } finally {
        setLoading(false)
      }
    }

    fetchInspector()
  }, [params.id])

  if (loading) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
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

  if (error) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-600">Error: {error}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/inspectors">Back to Inspectors</Link>
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!inspector) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <UserCheck className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Inspector not found</p>
                <Button asChild>
                  <Link href="/inspectors">Back to Inspectors</Link>
                </Button>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const getSpecializationColor = (specialization: string) => {
    switch (specialization) {
      case 'organic-crops': return 'bg-green-100 text-green-800'
      case 'soil-management': return 'bg-amber-100 text-amber-800'
      case 'pest-control': return 'bg-orange-100 text-orange-800'
      case 'livestock': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case '1-2': return '1-2 years'
      case '3-5': return '3-5 years'
      case '6-10': return '6-10 years'
      case '10+': return '10+ years'
      default: return experience
    }
  }

  const getExperienceStars = (experience: string) => {
    switch (experience) {
      case '1-2': return 2
      case '3-5': return 3
      case '6-10': return 4
      case '10+': return 5
      default: return 1
    }
  }

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Back button */}
              <div className="mb-6">
                <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                  <Link href="/inspectors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Inspectors
                  </Link>
                </Button>
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar - Profile Section */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Profile Card */}
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    {/* Avatar */}
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #f4a261, #e8ddc7)' }}>
                        <UserCheck className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{inspector.name}</h2>
                      <div className="flex items-center justify-center text-gray-500 mb-3">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        <span className="text-sm">{inspector.specialization.split('-').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}</span>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: inspector.status === 'active' ? '#f4a261' : '#ef4444', color: 'white' }}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {inspector.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{inspector.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{inspector.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Since {new Date(inspector.createdAt).getFullYear()}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full" style={{ backgroundColor: '#f4a261', borderColor: '#f4a261' }}>
                      <Link href={`/inspectors/${inspector.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Inspector
                      </Link>
                    </Button>
                  </div>

                  {/* Experience Stats Card */}
                  <div className="bg-white rounded-2xl shadow-md p-4">
                    <h3 className="font-bold text-gray-900 mb-2">Professional Experience</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Experience Level</span>
                      <span className="font-semibold" style={{ color: '#f4a261' }}>{getExperienceLabel(inspector.experience)}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Specialization:</span>
                        <span>{inspector.specialization.split('-').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < getExperienceStars(inspector.experience) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                          />
                        ))}
                        <span className="ml-2 text-xs">{getExperienceStars(inspector.experience)}.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2">
                  {/* Tab Navigation */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex space-x-6 border-b border-gray-200 mb-6">
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors"
                        style={{
                          borderColor: activeTab === 'professional-details' ? '#f4a261' : 'transparent',
                          color: activeTab === 'professional-details' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('professional-details')}
                      >
                        Professional Details
                      </button>
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors hover:text-gray-700"
                        style={{
                          borderColor: activeTab === 'qualifications' ? '#f4a261' : 'transparent',
                          color: activeTab === 'qualifications' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('qualifications')}
                      >
                        Qualifications
                      </button>
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors hover:text-gray-700"
                        style={{
                          borderColor: activeTab === 'inspections' ? '#f4a261' : 'transparent',
                          color: activeTab === 'inspections' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('inspections')}
                      >
                        Inspections
                      </button>
                      <button
                        className="pb-2 px-1 border-b-2 font-medium text-sm transition-colors hover:text-gray-700"
                        style={{
                          borderColor: activeTab === 'history' ? '#f4a261' : 'transparent',
                          color: activeTab === 'history' ? '#f4a261' : '#6b7280'
                        }}
                        onClick={() => setActiveTab('history')}
                      >
                        Activity History
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-4">
                      {activeTab === 'professional-details' && (
                        <>
                          {/* Contact Details */}
                          <div className="border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-gray-900 mb-1">Contact Information</h4>
                                <p className="text-sm text-gray-500">Professional contact details</p>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Email</span>
                                <p className="font-medium text-gray-900">{inspector.email}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Phone</span>
                                <p className="font-medium text-gray-900">{inspector.phone}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Status</span>
                                <p className="font-medium text-gray-900 capitalize">{inspector.status}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Experience</span>
                                <p className="font-medium text-gray-900">{getExperienceLabel(inspector.experience)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Specialization */}
                          <div className="border-b border-gray-100 pb-4 pt-8">
                            <h4 className="font-bold text-gray-900 mb-3">Specialization</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f4a261', color: '#6b5843' }}>
                                {inspector.specialization.split('-').map(word =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </span>
                            </div>
                          </div>

                          {/* Registration Details */}
                          <div className="pt-8">
                            <h4 className="font-bold text-gray-900 mb-3">Registration Information</h4>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Registered</span>
                                <span className="font-medium text-gray-900">
                                  {new Date(inspector.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Last Updated</span>
                                <span className="font-medium text-gray-900">
                                  {new Date(inspector.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'qualifications' && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Qualifications & Certifications</h4>
                          {inspector.qualifications ? (
                            <>
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-700 mb-3">Professional Qualifications</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-600 whitespace-pre-line">
                                    {inspector.qualifications}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600">
                                  <strong>Experience Level:</strong> {getExperienceLabel(inspector.experience)} in {inspector.specialization.split('-').map(word =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ')} inspection and certification.
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No qualification information available</p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'inspections' && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Recent Inspections</h4>
                          <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">No inspections yet</h5>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                  Available
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                This inspector is available for new inspection assignments.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'history' && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Activity History</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 border-l-2 border-green-200 bg-green-50 rounded-r-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-gray-900">Inspector Registration</p>
                                <p className="text-sm text-gray-600">
                                  Registered on {new Date(inspector.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border-l-2 border-blue-200 bg-blue-50 rounded-r-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-gray-900">Profile Completion</p>
                                <p className="text-sm text-gray-600">
                                  Completed professional details and qualifications
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border-l-2 border-orange-200 bg-orange-50 rounded-r-lg">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-gray-900">Current Status</p>
                                <p className="text-sm text-gray-600">
                                  Status: {inspector.status === 'active' ? 'Active and available for inspections' : 'Inactive'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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

export default function InspectorDetailPage({ params }: InspectorDetailPageProps) {
  return (
    <ProtectedRoute>
      <InspectorDetailContent params={params} />
    </ProtectedRoute>
  )
}
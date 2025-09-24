"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, CheckCircle, XCircle, AlertTriangle, Calculator, FileText, ClipboardCheck, Award } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { approveInspection } from "@/lib/services/inspection-service"
import { fetchAllInspectors } from "@/lib/services/inspector-service"
import { api } from "@/lib/api-client"

interface EditInspectionPageProps {
  params: { id: string }
}

interface ChecklistItem {
  id: string
  question: string
  answer?: boolean
}

interface Inspection {
  id: number
  farmId: number
  farmName: string
  farmerName: string
  inspectorName: string
  scheduledDate: string
  inspectionDate?: string
  status: string
  checklist?: ChecklistItem[]
  score?: number
  notes?: string
  violations?: string[]
}

const CHECKLIST_QUESTIONS = [
  {
    id: 'syntheticInputs',
    question: 'Any synthetic inputs in the last 36 months?',
    category: 'Organic Practices'
  },
  {
    id: 'bufferZones',
    question: 'Adequate buffer zones?',
    category: 'Soil Management'
  },
  {
    id: 'organicSeed',
    question: 'Organic seed or permitted exceptions?',
    category: 'Organic Practices'
  },
  {
    id: 'compostManagement',
    question: 'Compost/soil fertility managed organically?',
    category: 'Soil Management'
  },
  {
    id: 'recordKeeping',
    question: 'Recordkeeping/logs available?',
    category: 'Documentation'
  }
]

function EditInspectionContent({ params }: EditInspectionPageProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    CHECKLIST_QUESTIONS.map(q => ({
      id: q.id,
      question: q.question,
      answer: undefined
    }))
  )
  const [notes, setNotes] = useState('')
  const [violations, setViolations] = useState<string[]>([''])
  const [newViolation, setNewViolation] = useState('')
  const [status, setStatus] = useState('scheduled')
  const [inspectorName, setInspectorName] = useState('')
  const [inspectors, setInspectors] = useState<any[]>([])

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inspection and inspectors in parallel
        const [inspectionData, inspectorsData] = await Promise.all([
          api.inspections.getById(params.id).catch(err => {
            console.error('Error fetching inspection:', err)
            if (err?.status === 404) {
              notFound()
              return null
            }
            throw err
          }),
          fetchAllInspectors().catch(err => {
            console.error('Error fetching inspectors:', err)
            return []
          })
        ])

        // Handle inspection response
        if (!inspectionData) {
          notFound()
          return
        }
        setInspection(inspectionData)

        // Set inspectors
        setInspectors(Array.isArray(inspectorsData) ? inspectorsData : [])

        // Initialize form data
        const existingChecklist = inspectionData.checklist && inspectionData.checklist.length > 0
          ? inspectionData.checklist
          : CHECKLIST_QUESTIONS.map(q => ({
              id: q.id,
              question: q.question,
              answer: undefined
            }))

        setChecklist(existingChecklist)
        setNotes(inspectionData.notes || '')
        setViolations(inspectionData.violations?.length > 0 ? inspectionData.violations : [''])
        setStatus(inspectionData.status || 'scheduled')
        // IMPORTANT: Pre-fill inspector name from scheduled inspection
        setInspectorName(inspectionData.inspectorName || '')

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inspection')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [params.id, user])

  const calculateScore = () => {
    if (!Array.isArray(checklist) || checklist.length === 0) return 0

    const answeredQuestions = checklist.filter(item => item.answer !== undefined)
    if (answeredQuestions.length === 0) return 0

    const yesAnswers = answeredQuestions.filter(item => item.answer === true)
    return Math.round((yesAnswers.length / answeredQuestions.length) * 100)
  }

  const handleChecklistChange = (questionId: string, answer: boolean) => {
    setChecklist(prev => {
      if (!Array.isArray(prev)) return []
      return prev.map(item =>
        item.id === questionId ? { ...item, answer } : item
      )
    })
  }

  const addViolation = () => {
    if (newViolation.trim()) {
      setViolations(prev => [...prev.filter(v => v.trim()), newViolation.trim()])
      setNewViolation('')
    }
  }

  const removeViolation = (index: number) => {
    setViolations(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async (newStatus?: string) => {
    setSaving(true)

    try {
      const score = calculateScore()
      const finalStatus = newStatus || status

      const updateData = {
        checklist,
        notes: notes.trim(),
        status: finalStatus,
        score,
        inspectorName: inspectorName.trim() || 'Agronomist',
        ...(finalStatus === 'completed' && { inspectionDate: new Date().toISOString().split('T')[0] })
      }

      const result = await api.inspections.update(params.id, updateData)

      // Check if certificate was automatically generated
      if (result.certificateGenerated && result.certificate) {
        toast({
          title: "🎉 Certificate Generated!",
          description: `Inspection completed with score ${score}/100. Certificate #${result.certificate.certificateNumber} has been automatically generated and is ready for download!`
        })
      } else {
        toast({
          title: "Inspection Updated Successfully!",
          description: `Inspection has been ${finalStatus === 'completed' ? 'completed' : finalStatus === 'failed' ? 'failed' : finalStatus === 'in_progress' ? 'marked as in progress' : 'scheduled'} with a score of ${score}/100.`
        })
      }


      setTimeout(() => {
        router.push('/inspections')
      }, 1500)

    } catch (error) {
      console.error('Error updating inspection:', error)
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update inspection. Please try again."
      })
    } finally {
      setSaving(false)
    }
  }

  const handleApproveForCertification = async () => {
    setApproving(true)

    try {
      const result = await approveInspection(params.id)

      if (result && result.success) {
        toast({
          title: "Inspection Approved for Certification!",
          description: result.certificateId
            ? `Certificate #${result.certificateId} has been generated and is ready for download.`
            : "Inspection approved successfully. Certificate generation in progress."
        })

        setTimeout(() => {
          router.push('/inspections')
        }, 2000)
      } else {
        const errorMessage = result?.message || result?.error || 'Approval failed'
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error approving inspection:', error)
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve inspection for certification. Please try again."
      })
    } finally {
      setApproving(false)
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
                <p className="text-muted-foreground">Loading inspection details...</p>
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

  const currentScore = calculateScore()
  const isPassing = currentScore >= 80
  const answeredQuestions = Array.isArray(checklist) ? checklist.filter(item => item.answer !== undefined) : []
  const completionPercentage = Array.isArray(checklist) && checklist.length > 0
    ? Math.round((answeredQuestions.length / checklist.length) * 100)
    : 0

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6 pb-96">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/inspections/${inspection.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Inspection
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Score Inspection</h1>
                  <p className="text-muted-foreground">{inspection.farmName} - {inspection.farmerName}</p>
                  {inspectorName && (
                    <p className="text-sm text-blue-600">Inspector: {inspectorName}</p>
                  )}
                </div>
              </div>

              {/* Score Card */}
              <Card className="border-l-4" style={{ borderLeftColor: isPassing ? '#10b981' : '#ef4444' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Current Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold mb-2">
                        {currentScore}/100
                      </div>
                      <Badge variant={isPassing ? "default" : "destructive"} className="text-sm">
                        {isPassing ? "Passing" : "Failing"} ({currentScore >= 80 ? "≥80% required" : "80% required"})
                      </Badge>
                      {completionPercentage === 100 && (
                        <Badge variant="outline" className="text-xs text-green-600 mt-1">
                          Ready to submit as {status}
                        </Badge>
                      )}
                      {status === 'submitted' && completionPercentage === 100 && (
                        <Badge variant="outline" className="text-xs text-blue-600 mt-1">
                          {isPassing ? "Eligible for certificate" : "Below 80% threshold"}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {completionPercentage}% Complete
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {answeredQuestions.length} of {Array.isArray(checklist) ? checklist.length : 0} questions answered
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Inspection Checklist */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5" />
                      Inspection Checklist
                    </CardTitle>
                    <CardDescription>
                      Answer all questions to complete the inspection assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Array.isArray(checklist) && checklist.length > 0 ? checklist.map((item, index) => {
                      const questionData = CHECKLIST_QUESTIONS.find(q => q.id === item.id)
                      return (
                        <div key={item.id} className="space-y-3 p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm mb-1">{item.question}</p>
                              {questionData && (
                                <p className="text-xs text-muted-foreground mb-3">
                                  Category: {questionData.category}
                                </p>
                              )}
                              <RadioGroup
                                value={item.answer?.toString() || ""}
                                onValueChange={(value) =>
                                  handleChecklistChange(item.id, value === "true")
                                }
                              >
                                <div className="flex items-center space-x-6">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id={`${item.id}-yes`} />
                                    <label
                                      htmlFor={`${item.id}-yes`}
                                      className="text-sm font-medium text-green-700 cursor-pointer flex items-center gap-1"
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                      Yes
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id={`${item.id}-no`} />
                                    <label
                                      htmlFor={`${item.id}-no`}
                                      className="text-sm font-medium text-red-700 cursor-pointer flex items-center gap-1"
                                    >
                                      <XCircle className="w-3 h-3" />
                                      No
                                    </label>
                                  </div>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          {!Array.isArray(checklist) ? 'Loading checklist...' : 'No checklist items available'}
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-2 text-xs text-gray-500">
                            Debug: checklist type: {typeof checklist}, length: {Array.isArray(checklist) ? checklist.length : 'N/A'}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notes and Violations */}
                <div className="space-y-6">
                  {/* Inspector Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5" />
                        Inspector Information
                      </CardTitle>
                      <CardDescription>
                        Select the inspector who conducted this inspection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="inspector">Inspector Name</Label>
                        <Select value={inspectorName} onValueChange={setInspectorName}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select inspector from your list" />
                          </SelectTrigger>
                          <SelectContent>
                            {inspectors.length > 0 ? (
                              inspectors
                                .filter(inspector => inspector.status === 'active')
                                .map((inspector) => (
                                  <SelectItem key={inspector.id} value={inspector.name}>
                                    {inspector.name} - {inspector.specialization}
                                  </SelectItem>
                                ))
                            ) : (
                              <SelectItem value="No inspectors" disabled>
                                No inspectors available
                              </SelectItem>
                            )}
                            <SelectItem value="Agronomist">Agronomist (Self)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {inspectors.length > 0
                            ? "Pre-filled from scheduled inspection. Change if needed or select 'Agronomist' for self-inspection."
                            : "No inspectors found. Add inspectors from the Inspectors page or select 'Agronomist' for self-inspection."
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Inspector Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Inspector Notes
                      </CardTitle>
                      <CardDescription>
                        Add observations and recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter detailed observations, recommendations, and any additional comments about the farm inspection..."
                        rows={6}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>

                  {/* Violations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Violations & Issues
                      </CardTitle>
                      <CardDescription>
                        Document any violations or areas that need attention
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Existing violations */}
                      {violations.filter(v => v.trim()).map((violation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="flex-1 text-sm">{violation}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeViolation(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {/* Add new violation */}
                      <div className="flex gap-2">
                        <Textarea
                          value={newViolation}
                          onChange={(e) => setNewViolation(e.target.value)}
                          placeholder="Describe the violation or issue..."
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          onClick={addViolation}
                          disabled={!newViolation.trim()}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Update */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Inspection Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => handleSave()}
                  disabled={saving || approving}
                  variant="outline"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Draft"}
                </Button>

                {completionPercentage === 100 && inspection?.status !== status && (
                  <Button
                    onClick={() => handleSave(status)}
                    disabled={saving || approving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {saving ? `Saving as ${status}...` : `Submit as ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                  </Button>
                )}


                <Button variant="ghost" asChild>
                  <Link href="/inspections">Back to Inspections</Link>
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

export default function EditInspectionPage({ params }: EditInspectionPageProps) {
  return (
    <ProtectedRoute>
      <EditInspectionContent params={params} />
    </ProtectedRoute>
  )
}
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
import { ArrowLeft, Save, CheckCircle, XCircle, AlertTriangle, Calculator, FileText, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"

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
  const [status, setStatus] = useState('draft')

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

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

        // Initialize form data
        const existingChecklist = data.checklist && data.checklist.length > 0
          ? data.checklist
          : CHECKLIST_QUESTIONS.map(q => ({
              id: q.id,
              question: q.question,
              answer: undefined
            }))

        setChecklist(existingChecklist)
        setNotes(data.notes || '')
        setViolations(data.violations?.length > 0 ? data.violations : [''])
        setStatus(data.status || 'draft')

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
        complianceScore: score,
        ...(finalStatus === 'approved' && { inspectionDate: new Date().toISOString().split('T')[0] })
      }

      const response = await fetch(`http://localhost:3002/api/inspections/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Failed to update inspection')
      }

      toast({
        title: "✅ Inspection Updated Successfully!",
        description: `Inspection has been ${finalStatus === 'approved' ? 'approved' : finalStatus === 'rejected' ? 'rejected' : finalStatus === 'submitted' ? 'submitted for review' : 'saved as draft'} with a score of ${score}/100.`
      })

      // Always redirect after saving to refresh the data
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
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
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
                  disabled={saving}
                  variant="outline"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  onClick={() => handleSave(status)}
                  disabled={saving || completionPercentage < 100}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {saving ? "Completing..." : "Complete Inspection"}
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/inspections">Cancel</Link>
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
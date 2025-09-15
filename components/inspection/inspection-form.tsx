"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface InspectionFormProps {
  onSubmit: (data: any) => void
  initialData?: any
}

export function InspectionForm({ onSubmit, initialData }: InspectionFormProps) {
  const [formData, setFormData] = useState({
    status: initialData?.status || "pending",
    score: initialData?.score || "",
    organicPractices: initialData?.organicPractices || "",
    documentation: initialData?.documentation || "",
    soilManagement: initialData?.soilManagement || "",
    pestControl: initialData?.pestControl || "",
    notes: initialData?.notes || "",
    violations: initialData?.violations || [],
    ...initialData,
  })

  const [newViolation, setNewViolation] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addViolation = () => {
    if (newViolation.trim()) {
      setFormData({
        ...formData,
        violations: [...formData.violations, newViolation.trim()],
      })
      setNewViolation("")
    }
  }

  const removeViolation = (index: number) => {
    setFormData({
      ...formData,
      violations: formData.violations.filter((_: any, i: number) => i !== index),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inspection Status</CardTitle>
          <CardDescription>Update the current status of this inspection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="score">Overall Score</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder="0-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Scores</CardTitle>
          <CardDescription>Individual category scores for detailed evaluation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organicPractices">Organic Practices</Label>
              <Input
                id="organicPractices"
                type="number"
                min="0"
                max="100"
                value={formData.organicPractices}
                onChange={(e) => setFormData({ ...formData, organicPractices: e.target.value })}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentation">Documentation</Label>
              <Input
                id="documentation"
                type="number"
                min="0"
                max="100"
                value={formData.documentation}
                onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soilManagement">Soil Management</Label>
              <Input
                id="soilManagement"
                type="number"
                min="0"
                max="100"
                value={formData.soilManagement}
                onChange={(e) => setFormData({ ...formData, soilManagement: e.target.value })}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pestControl">Pest Control</Label>
              <Input
                id="pestControl"
                type="number"
                min="0"
                max="100"
                value={formData.pestControl}
                onChange={(e) => setFormData({ ...formData, pestControl: e.target.value })}
                placeholder="0-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Violations & Issues</CardTitle>
          <CardDescription>Record any violations or areas needing improvement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newViolation}
              onChange={(e) => setNewViolation(e.target.value)}
              placeholder="Enter violation or issue"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addViolation())}
            />
            <Button type="button" onClick={addViolation}>
              Add
            </Button>
          </div>
          {formData.violations.length > 0 && (
            <div className="space-y-2">
              {formData.violations.map((violation: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{violation}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeViolation(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspector Notes</CardTitle>
          <CardDescription>Additional observations and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Enter detailed notes about the inspection..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit">Save Inspection</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  )
}

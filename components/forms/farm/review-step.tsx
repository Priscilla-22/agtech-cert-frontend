"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FarmFormData } from "@/lib/types/farm-form"

interface ReviewStepProps {
  formData: FarmFormData
  selectedCrops: string[]
}

export function ReviewStep({
  formData,
  selectedCrops
}: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>
          Please review all the information before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-semibold">Farm Details</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Farm Name:</strong> {formData.name}</div>
              <div><strong>Location:</strong> {formData.location}</div>
              <div><strong>Size:</strong> {formData.size} ha</div>
              <div><strong>Soil Type:</strong> {formData.soilType}</div>
              <div><strong>Irrigation:</strong> {formData.irrigationSystem}</div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Crops & Resources</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Crops:</strong> {selectedCrops.join(', ') || 'None selected'}</div>
              <div><strong>Water Sources:</strong> {formData.waterSources.join(', ') || 'None selected'}</div>
              {formData.description && <div><strong>Description:</strong> {formData.description}</div>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
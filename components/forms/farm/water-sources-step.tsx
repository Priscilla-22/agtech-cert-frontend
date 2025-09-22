"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FarmFormData, NewFarmerFormData, WATER_SOURCES } from "@/lib/types/farm-form"

interface WaterSourcesStepProps {
  formData: FarmFormData
  farmerMode: 'existing' | 'new'
  newFarmerData: NewFarmerFormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onNewFarmerInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onWaterSourceChange: (source: string, checked: boolean) => void
  onNewFarmerWaterSourceChange: (source: string, checked: boolean) => void
}

export function WaterSourcesStep({
  formData,
  farmerMode,
  newFarmerData,
  onInputChange,
  onNewFarmerInputChange,
  onWaterSourceChange,
  onNewFarmerWaterSourceChange
}: WaterSourcesStepProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Water Sources</CardTitle>
          <CardDescription>
            Select available water sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Farm Water Sources</Label>
            <div className="grid grid-cols-2 gap-4">
              {WATER_SOURCES.map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={source}
                    checked={formData.waterSources.includes(source)}
                    onCheckedChange={(checked) => onWaterSourceChange(source, checked as boolean)}
                  />
                  <Label htmlFor={source} className="text-sm font-normal">
                    {source}
                  </Label>
                </div>
              ))}
            </div>

            {farmerMode === 'new' && (
              <div className="mt-6 p-3 border rounded-lg bg-blue-50/50">
                <Label className="text-sm font-medium text-blue-800">Farmer's Water Sources</Label>
                <p className="text-xs text-blue-600 mb-3">Select the water sources the farmer typically uses</p>
                <div className="grid grid-cols-2 gap-2">
                  {WATER_SOURCES.map((source) => (
                    <div key={`farmer-${source}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={`farmer-${source}`}
                        checked={newFarmerData.waterSources.includes(source)}
                        onCheckedChange={(checked) => onNewFarmerWaterSourceChange(source, checked as boolean)}
                      />
                      <Label htmlFor={`farmer-${source}`} className="text-xs font-normal">
                        {source}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerTotalLandSize" className="text-xs">Total Land Size (hectares) *</Label>
                    <Input
                      id="newFarmerTotalLandSize"
                      name="totalLandSize"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newFarmerData.totalLandSize}
                      onChange={onNewFarmerInputChange}
                      placeholder="e.g., 5.5"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerCultivatedSize" className="text-xs">Cultivated Size (hectares)</Label>
                    <Input
                      id="newFarmerCultivatedSize"
                      name="cultivatedSize"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newFarmerData.cultivatedSize}
                      onChange={onNewFarmerInputChange}
                      placeholder="e.g., 4.0"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Any additional details about the farm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Additional information about the farm..."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
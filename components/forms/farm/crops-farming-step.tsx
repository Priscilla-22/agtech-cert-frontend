"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Wheat } from "lucide-react"
import { CROP_OPTIONS, NewFarmerFormData } from "@/lib/types/farm-form"

interface CropsFarmingStepProps {
  selectedCrops: string[]
  farmerMode: 'existing' | 'new'
  newFarmerData: NewFarmerFormData
  onCropChange: (crop: string, checked: boolean) => void
  onNewFarmerCropChange: (crop: string, checked: boolean) => void
}

export function CropsFarmingStep({
  selectedCrops,
  farmerMode,
  newFarmerData,
  onCropChange,
  onNewFarmerCropChange
}: CropsFarmingStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wheat className="w-5 h-5" />
          Crop Information
        </CardTitle>
        <CardDescription>
          Select the crops grown on this farm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label>Primary Crops</Label>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {CROP_OPTIONS.map((crop) => (
              <div key={crop} className="flex items-center space-x-2">
                <Checkbox
                  id={crop}
                  checked={selectedCrops.includes(crop)}
                  onCheckedChange={(checked) => onCropChange(crop, checked as boolean)}
                />
                <Label htmlFor={crop} className="text-sm font-normal">
                  {crop}
                </Label>
              </div>
            ))}
          </div>

          {farmerMode === 'new' && (
            <div className="mt-6 p-3 border rounded-lg bg-blue-50/50">
              <Label className="text-sm font-medium text-blue-800">Farmer's Primary Crops</Label>
              <p className="text-xs text-blue-600 mb-3">Select the crops the farmer typically grows</p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {CROP_OPTIONS.map((crop) => (
                  <div key={`farmer-${crop}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`farmer-${crop}`}
                      checked={newFarmerData.primaryCrops.includes(crop)}
                      onCheckedChange={(checked) => onNewFarmerCropChange(crop, checked as boolean)}
                    />
                    <Label htmlFor={`farmer-${crop}`} className="text-xs font-normal">
                      {crop}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
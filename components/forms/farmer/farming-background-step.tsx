"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FarmerFormData,
  FormErrors,
  EDUCATION_LEVELS,
  FARMING_EXPERIENCE,
  FARMING_TYPES,
  AVAILABLE_CROPS
} from "@/lib/types/farmer-form"

interface FarmingBackgroundStepProps {
  formData: FarmerFormData
  setFormData: (data: FarmerFormData) => void
  errors: FormErrors
}

export function FarmingBackgroundStep({ formData, setFormData, errors }: FarmingBackgroundStepProps) {
  function updateFormData(field: keyof FarmerFormData, value: string) {
    setFormData({ ...formData, [field]: value })
  }

  function handleCropChange(crop: string, checked: boolean) {
    const newCrops = checked
      ? [...formData.primaryCrops, crop]
      : formData.primaryCrops.filter(c => c !== crop)

    setFormData({ ...formData, primaryCrops: newCrops })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="pb-3 border-b border-green-100">
          <h3 className="text-lg font-semibold">Farming Experience</h3>
          <p className="text-sm text-muted-foreground">Your agricultural background and education</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="yearsInFarming" className="font-medium">Years in Farming *</Label>
            <Select
              value={formData.yearsInFarming}
              onValueChange={(value) => updateFormData('yearsInFarming', value)}
            >
              <SelectTrigger className={errors.yearsInFarming ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {FARMING_EXPERIENCE.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.yearsInFarming && <p className="text-sm text-red-500">{errors.yearsInFarming}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="educationLevel" className="font-medium">Education Level *</Label>
            <Select
              value={formData.educationLevel}
              onValueChange={(value) => updateFormData('educationLevel', value)}
            >
              <SelectTrigger className={errors.educationLevel ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {EDUCATION_LEVELS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.educationLevel && <p className="text-sm text-red-500">{errors.educationLevel}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="farmingType" className="font-medium">Farming Type *</Label>
          <Select
            value={formData.farmingType}
            onValueChange={(value) => updateFormData('farmingType', value)}
          >
            <SelectTrigger className={errors.farmingType ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}>
              <SelectValue placeholder="Select farming type" />
            </SelectTrigger>
            <SelectContent>
              {FARMING_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.farmingType && <p className="text-sm text-red-500">{errors.farmingType}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="pb-3 border-b border-green-100">
          <h3 className="text-lg font-semibold">Crop Information</h3>
          <p className="text-sm text-muted-foreground">What crops do you grow?</p>
        </div>

        <div className="space-y-4">
          <Label className="font-medium">Primary Crops Grown *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-green-100 rounded-lg bg-green-50/30">
            {AVAILABLE_CROPS.map((crop) => (
              <div key={crop} className="flex items-center space-x-3 p-2 rounded">
                <Checkbox
                  id={crop}
                  checked={formData.primaryCrops.includes(crop)}
                  onCheckedChange={(checked) => handleCropChange(crop, checked as boolean)}
                  className="border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <label htmlFor={crop} className="text-sm cursor-pointer">{crop}</label>
              </div>
            ))}
          </div>
          {errors.primaryCrops && <p className="text-sm text-red-500">{errors.primaryCrops}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="agriculturalTraining" className="font-medium">Agricultural Training/Certifications</Label>
          <Textarea
            id="agriculturalTraining"
            value={formData.agriculturalTraining}
            onChange={(e) => updateFormData('agriculturalTraining', e.target.value)}
            placeholder="List any agricultural training, courses, or certifications received"
            rows={3}
            className="border-green-200 focus:border-green-400 focus:ring-green-200"
          />
          <p className="text-xs text-muted-foreground">Include any formal agricultural training, workshops, or certifications</p>
        </div>
      </div>
    </div>
  )
}
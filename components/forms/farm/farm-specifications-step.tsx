"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ruler } from "lucide-react"
import { FarmFormData, SOIL_TYPES, IRRIGATION_SYSTEMS } from "@/lib/types/farm-form"

interface FarmSpecificationsStepProps {
  formData: FarmFormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFormDataChange: (updates: Partial<FarmFormData>) => void
}

export function FarmSpecificationsStep({
  formData,
  onInputChange,
  onFormDataChange
}: FarmSpecificationsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="w-5 h-5" />
          Farm Specifications
        </CardTitle>
        <CardDescription>
          Technical details about the farm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size">Total Farm Size (hectares) *</Label>
            <Input
              id="size"
              name="size"
              type="number"
              step="0.1"
              min="0"
              value={formData.size}
              onChange={onInputChange}
              placeholder="e.g., 5.5"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cultivatedSize">Cultivated Size (hectares)</Label>
            <Input
              id="cultivatedSize"
              name="cultivatedSize"
              type="number"
              step="0.1"
              min="0"
              value={formData.cultivatedSize}
              onChange={onInputChange}
              placeholder="e.g., 4.0"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="soilType">Soil Type</Label>
          <Select value={formData.soilType} onValueChange={(value) => onFormDataChange({ soilType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select soil type" />
            </SelectTrigger>
            <SelectContent>
              {SOIL_TYPES.map((soil) => (
                <SelectItem key={soil} value={soil.toLowerCase()}>
                  {soil}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="irrigationSystem">Irrigation System</Label>
          <Select value={formData.irrigationSystem} onValueChange={(value) => onFormDataChange({ irrigationSystem: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select irrigation system" />
            </SelectTrigger>
            <SelectContent>
              {IRRIGATION_SYSTEMS.map((system) => (
                <SelectItem key={system} value={system.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
                  {system}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="landTenure">Land Tenure</Label>
          <Select value={formData.landTenure} onValueChange={(value) => onFormDataChange({ landTenure: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select land tenure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="leased">Leased</SelectItem>
              <SelectItem value="communal">Communal</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
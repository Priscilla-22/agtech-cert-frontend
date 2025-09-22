"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { FarmFormData } from "@/lib/types/farm-form"

interface LocationDetailsStepProps {
  formData: FarmFormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function LocationDetailsStep({
  formData,
  onInputChange
}: LocationDetailsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Information
        </CardTitle>
        <CardDescription>
          Specify the farm's location details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Physical Address *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={onInputChange}
            placeholder="Detailed physical address"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              name="county"
              value={formData.county}
              onChange={onInputChange}
              placeholder="County"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward">Ward</Label>
            <Input
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={onInputChange}
              placeholder="Ward"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              name="village"
              value={formData.village}
              onChange={onInputChange}
              placeholder="Village"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
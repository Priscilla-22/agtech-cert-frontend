"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FarmerFormData, FormErrors } from "@/lib/types/farmer-form"

interface PersonalInfoStepProps {
  formData: FarmerFormData
  setFormData: (data: FarmerFormData) => void
  errors: FormErrors
}

export function PersonalInfoStep({ formData, setFormData, errors }: PersonalInfoStepProps) {
  function updateFormData(field: keyof FarmerFormData, value: string) {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="pb-3 border-b border-green-100">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <p className="text-sm text-muted-foreground">Enter your basic personal details</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="name" className="font-medium">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="John Doe Mwangi"
              className={errors.name ? "border-red-500 border-2" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="idNumber" className="font-medium">National ID Number *</Label>
            <Input
              id="idNumber"
              value={formData.idNumber}
              onChange={(e) => updateFormData('idNumber', e.target.value)}
              placeholder="12345678"
              className={errors.idNumber ? "border-red-500 border-2" : ""}
            />
            {errors.idNumber && <p className="text-sm text-red-500">{errors.idNumber}</p>}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label htmlFor="email" className="font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="farmer@example.com"
              className={errors.email ? "border-red-500 border-2" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="dateOfBirth" className="font-medium">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              className={errors.dateOfBirth ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
            />
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="pb-3 border-b border-green-100">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p className="text-sm text-muted-foreground">Phone numbers for communication</p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="phone" className="font-medium">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="+254 700 123 456"
            className={errors.phone ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>
    </div>
  )
}
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, User, UserPlus } from "lucide-react"
import { FarmFormData, NewFarmerFormData } from "@/lib/types/farm-form"

import { Farmer } from "@/lib/types/farmer"

interface BasicInfoStepProps {
  formData: FarmFormData
  newFarmerData: NewFarmerFormData
  farmers: Farmer[]
  farmerMode: 'existing' | 'new'
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onNewFarmerInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onFormDataChange: (updates: Partial<FarmFormData>) => void
  onFarmerModeChange: (mode: 'existing' | 'new') => void
}

export function BasicInfoStep({
  formData,
  newFarmerData,
  farmers,
  farmerMode,
  onInputChange,
  onNewFarmerInputChange,
  onFormDataChange,
  onFarmerModeChange
}: BasicInfoStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Enter the farm's basic details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Farm Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Enter farm name"
            required
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Farmer Selection *</Label>
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={farmerMode === 'existing' ? 'default' : 'outline'}
                onClick={() => onFarmerModeChange('existing')}
                className="flex-1 text-xs"
                size="sm"
              >
                <User className="w-3 h-3 mr-1" />
                Existing
              </Button>
              <Button
                type="button"
                variant={farmerMode === 'new' ? 'default' : 'outline'}
                onClick={() => onFarmerModeChange('new')}
                className="flex-1 text-xs"
                size="sm"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                New
              </Button>
            </div>

            {farmerMode === 'existing' ? (
              <Select value={formData.farmerId} onValueChange={(value) => onFormDataChange({ farmerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose existing farmer" />
                </SelectTrigger>
                <SelectContent>
                  {farmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {farmer.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="grid gap-3 p-3 border rounded-lg bg-muted/30">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerMemberNumber" className="text-xs">Member Number (Auto-generated)</Label>
                    <Input
                      id="newFarmerMemberNumber"
                      name="memberNumber"
                      value={newFarmerData.memberNumber}
                      size="sm"
                      readOnly
                      disabled
                      className="bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerName" className="text-xs">Full Name *</Label>
                    <Input
                      id="newFarmerName"
                      name="name"
                      value={newFarmerData.name}
                      onChange={onNewFarmerInputChange}
                      placeholder="Enter farmer's full name"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerEmail" className="text-xs">Email *</Label>
                    <Input
                      id="newFarmerEmail"
                      name="email"
                      type="email"
                      value={newFarmerData.email}
                      onChange={onNewFarmerInputChange}
                      placeholder="farmer@example.com"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerPhone" className="text-xs">Phone *</Label>
                    <Input
                      id="newFarmerPhone"
                      name="phone"
                      value={newFarmerData.phone}
                      onChange={onNewFarmerInputChange}
                      placeholder="+254700000000"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerIdNumber" className="text-xs">ID Number *</Label>
                    <Input
                      id="newFarmerIdNumber"
                      name="idNumber"
                      value={newFarmerData.idNumber}
                      onChange={onNewFarmerInputChange}
                      placeholder="Enter ID number"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerDateOfBirth" className="text-xs">Date of Birth *</Label>
                    <Input
                      id="newFarmerDateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={newFarmerData.dateOfBirth}
                      onChange={onNewFarmerInputChange}
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerCounty" className="text-xs">County *</Label>
                    <Input
                      id="newFarmerCounty"
                      name="county"
                      value={newFarmerData.county}
                      onChange={onNewFarmerInputChange}
                      placeholder="County"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerSubCounty" className="text-xs">Sub-County *</Label>
                    <Input
                      id="newFarmerSubCounty"
                      name="subCounty"
                      value={newFarmerData.subCounty}
                      onChange={onNewFarmerInputChange}
                      placeholder="Sub-County"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerWard" className="text-xs">Ward *</Label>
                    <Input
                      id="newFarmerWard"
                      name="ward"
                      value={newFarmerData.ward}
                      onChange={onNewFarmerInputChange}
                      placeholder="Ward"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newFarmerVillage" className="text-xs">Village *</Label>
                    <Input
                      id="newFarmerVillage"
                      name="village"
                      value={newFarmerData.village}
                      onChange={onNewFarmerInputChange}
                      placeholder="Village"
                      size="sm"
                      required
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="newFarmerAddress" className="text-xs">Physical Address *</Label>
                    <Input
                      id="newFarmerAddress"
                      name="address"
                      value={newFarmerData.address}
                      onChange={onNewFarmerInputChange}
                      placeholder="Physical address"
                      size="sm"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationDate">Registration Date</Label>
            <Input
              id="registrationDate"
              name="registrationDate"
              type="date"
              value={formData.registrationDate}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => onFormDataChange({ status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Filter,
  X,
  CalendarIcon,
  Search,
  RotateCcw,
  MapPin,
  GraduationCap,
  Leaf,
  Building,
  User,
  Calendar as CalendarIconAlias
} from 'lucide-react'
import { format } from 'date-fns'

export interface FilterValues {
  search?: string
  status?: string
  certificationStatus?: string
  county?: string
  subCounty?: string
  farmingType?: string
  organicExperience?: string
  educationLevel?: string
  minLandSize?: number
  maxLandSize?: number
  registrationDateFrom?: Date
  registrationDateTo?: Date
}

interface FarmersFilterProps {
  filters: FilterValues
  onFiltersChange: (filters: FilterValues) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isLoading?: boolean
}

const filterOptions = {
  status: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ],
  certificationStatus: [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'certified', label: 'Certified' },
    { value: 'expired', label: 'Expired' },
    { value: 'rejected', label: 'Rejected' }
  ],
  farmingType: [
    { value: 'organic', label: 'Organic' },
    { value: 'conventional', label: 'Conventional' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'subsistence', label: 'Subsistence' }
  ],
  organicExperience: [
    { value: '0-1', label: '0-1 years' },
    { value: '2-3', label: '2-3 years' },
    { value: '4-5', label: '4-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '10+', label: '10+ years' }
  ],
  educationLevel: [
    { value: 'none', label: 'None' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'tertiary', label: 'Tertiary' },
    { value: 'university', label: 'University' }
  ],
  counties: [
    'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi',
    'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
    'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans-Nzoia',
    'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
    'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
    'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
  ]
}

export function FarmersFilter({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isLoading = false
}: FarmersFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterValues, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' || value === 'all' ? undefined : value
    })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value =>
      value !== undefined && value !== '' && value !== null
    ).length
  }

  const hasActiveFilters = getActiveFiltersCount() > 0

  const getFilterSummary = () => {
    const activeFilters = []

    if (filters.search) activeFilters.push(`Search: "${filters.search}"`)
    if (filters.status) activeFilters.push(`Status: ${filterOptions.status.find(s => s.value === filters.status)?.label}`)
    if (filters.certificationStatus) activeFilters.push(`Cert: ${filterOptions.certificationStatus.find(s => s.value === filters.certificationStatus)?.label}`)
    if (filters.county) activeFilters.push(`County: ${filters.county}`)
    if (filters.farmingType) activeFilters.push(`Type: ${filterOptions.farmingType.find(s => s.value === filters.farmingType)?.label}`)

    return activeFilters
  }

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 hover:opacity-90 h-10 px-4 py-2"
          style={{ backgroundColor: '#cbdde9', color: '#1f2937' }}
          disabled={isLoading}
        >
          <Filter className="mr-2 h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </PopoverTrigger>

          <PopoverContent className="w-96 p-4 z-[60]" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filter Farmers</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Search
                  </Label>
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Status Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Status
                    </Label>
                    <Select
                      value={filters.status || 'all'}
                      onValueChange={(value) => updateFilter('status', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {filterOptions.status.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Certification
                    </Label>
                    <Select
                      value={filters.certificationStatus || 'all'}
                      onValueChange={(value) => updateFilter('certificationStatus', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All certifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All certifications</SelectItem>
                        {filterOptions.certificationStatus.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      County
                    </Label>
                    <Select
                      value={filters.county || 'all'}
                      onValueChange={(value) => updateFilter('county', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All counties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All counties</SelectItem>
                        {filterOptions.counties.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sub County</Label>
                    <Input
                      placeholder="Enter sub county..."
                      value={filters.subCounty || ''}
                      onChange={(e) => updateFilter('subCounty', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Farming Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      Farming Type
                    </Label>
                    <Select
                      value={filters.farmingType || 'all'}
                      onValueChange={(value) => updateFilter('farmingType', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {filterOptions.farmingType.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Organic Experience</Label>
                    <Select
                      value={filters.organicExperience || 'all'}
                      onValueChange={(value) => updateFilter('organicExperience', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="All experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All experience</SelectItem>
                        {filterOptions.organicExperience.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Education Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    Education Level
                  </Label>
                  <Select
                    value={filters.educationLevel || 'all'}
                    onValueChange={(value) => updateFilter('educationLevel', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="All education levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All education levels</SelectItem>
                      {filterOptions.educationLevel.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Land Size Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Land Size (Acres)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minLandSize || ''}
                      onChange={(e) => updateFilter('minLandSize', e.target.value ? Number(e.target.value) : undefined)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxLandSize || ''}
                      onChange={(e) => updateFilter('maxLandSize', e.target.value ? Number(e.target.value) : undefined)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <CalendarIconAlias className="h-3 w-3" />
                    Registration Date
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal text-sm h-9"
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {filters.registrationDateFrom ? format(filters.registrationDateFrom, 'PPP') : 'From'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.registrationDateFrom}
                          onSelect={(date) => updateFilter('registrationDateFrom', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal text-sm h-9"
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {filters.registrationDateTo ? format(filters.registrationDateTo, 'PPP') : 'To'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.registrationDateTo}
                          onSelect={(date) => updateFilter('registrationDateTo', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      onApplyFilters()
                      setIsOpen(false)
                    }}
                    className="flex-1 text-sm h-9"
                    disabled={isLoading}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="text-sm h-9"
                    disabled={isLoading}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
      </Popover>
    </div>
  )
}
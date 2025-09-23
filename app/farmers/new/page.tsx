"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Save, Check, User, MapPin, FileText, GraduationCap, Tractor } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createFarmer } from "@/lib/services/farmer-service"
import { FarmerFormData, FormStep, FormErrors, LAND_TENURE_TYPES, SOIL_TYPES, ORGANIC_EXPERIENCE_LEVELS, IRRIGATION_METHODS, WATER_SOURCES } from "@/lib/types/farmer-form"
import { PersonalInfoStep } from "@/components/forms/farmer/personal-info-step"
import { FarmingBackgroundStep } from "@/components/forms/farmer/farming-background-step"


const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    title: "Personal & Contact",
    description: "Identity & contact details",
    icon: User,
    fields: ["name", "email", "phone", "idNumber", "dateOfBirth"]
  },
  {
    id: 2,
    title: "Location Details",
    description: "Physical location",
    icon: MapPin,
    fields: ["county", "subCounty", "ward", "village", "address"]
  },
  {
    id: 3,
    title: "Farming Background",
    description: "Experience & education",
    icon: GraduationCap,
    fields: ["yearsInFarming", "educationLevel", "primaryCrops", "farmingType"]
  },
  {
    id: 4,
    title: "Farm Details",
    description: "Land & infrastructure",
    icon: Tractor,
    fields: ["totalLandSize", "ownedLandSize", "landTenure", "soilType"]
  },
  {
    id: 5,
    title: "Certification Status",
    description: "Organic certification info",
    icon: FileText,
    fields: ["previousCertification", "organicExperience"]
  }
]

function NewFarmerContent() {
  const { toast } = useToast()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FarmerFormData>({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    dateOfBirth: "",
    county: "",
    subCounty: "",
    ward: "",
    village: "",
    address: "",
    yearsInFarming: "",
    educationLevel: "",
    agriculturalTraining: "",
    primaryCrops: [],
    farmingType: "",
    totalLandSize: "",
    ownedLandSize: "",
    leasedLandSize: "",
    landTenure: "",
    soilType: "",
    waterSources: [],
    irrigationMethod: "",
    previousCertification: "",
    certificationBodies: "",
    transitionStartDate: "",
    organicExperience: "",
    motivationForOrganic: "",
    status: "active",
    notes: ""
  })

  const [errors, setErrors] = useState<FormErrors>({})

  function validateStep(step: number): boolean {
    const stepConfig = FORM_STEPS.find(s => s.id === step)
    if (!stepConfig) return true

    const newErrors: FormErrors = {}

    stepConfig.fields.forEach(field => {
      const value = formData[field as keyof FarmerFormData]
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      if (currentStep < FORM_STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step)
    }
  }

  const handleCropChange = (crop: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, primaryCrops: [...formData.primaryCrops, crop] })
    } else {
      setFormData({ ...formData, primaryCrops: formData.primaryCrops.filter(c => c !== crop) })
    }
  }

  const handleWaterSourceChange = (source: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, waterSources: [...formData.waterSources, source] })
    } else {
      setFormData({ ...formData, waterSources: formData.waterSources.filter(s => s !== source) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields before submitting."
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newFarmer = await createFarmer(formData)

      toast({
        title: "Farmer Registered Successfully!",
        description: `${formData.name} has been added to the system and is ready for certification tracking.`
      })

      setTimeout(() => {
        router.push('/farmers')
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to connect to the server. Please check your connection and try again."

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentStep - 1) / (FORM_STEPS.length - 1)) * 100
  const currentStepConfig = FORM_STEPS.find(s => s.id === currentStep)

  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )

      case 2:
        return (
          <div className="space-y-8">
            {/* Administrative Location Section */}
            <div className="space-y-6">
              <div className="pb-3 border-b border-green-100">
                <h3 className="text-lg font-semibold">Administrative Location</h3>
                <p className="text-sm text-muted-foreground">Select your administrative location details</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="county" className="font-medium">County *</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    placeholder="Enter county"
                    className={errors.county ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
                  />
                  {errors.county && <p className="text-sm text-red-500">{errors.county}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subCounty" className="font-medium">Sub-County *</Label>
                  <Input
                    id="subCounty"
                    value={formData.subCounty}
                    onChange={(e) => setFormData({ ...formData, subCounty: e.target.value })}
                    placeholder="Enter sub-county"
                    className={errors.subCounty ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
                  />
                  {errors.subCounty && <p className="text-sm text-red-500">{errors.subCounty}</p>}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="ward" className="font-medium">Ward *</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Enter ward"
                    className={errors.ward ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
                  />
                  {errors.ward && <p className="text-sm text-red-500">{errors.ward}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="village" className="font-medium">Village/Location *</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="Enter village/location"
                    className={errors.village ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
                  />
                  {errors.village && <p className="text-sm text-red-500">{errors.village}</p>}
                </div>
              </div>
            </div>

            {/* Physical Address Section */}
            <div className="space-y-6">
              <div className="pb-3 border-b border-green-100">
                <h3 className="text-lg font-semibold">Physical Address & Location</h3>
                <p className="text-sm text-muted-foreground">Detailed location information for farm visits</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="font-medium">Physical Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Detailed physical address/directions to the farm"
                  rows={3}
                  className={errors.address ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <FarmingBackgroundStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )

      case 4:
        return (
          <div className="space-y-8">
            {/* Land Size Section */}
            <div className="space-y-6">
              <div className="pb-3 border-b border-green-100">
                <h3 className="text-lg font-semibold">Land Information</h3>
                <p className="text-sm text-muted-foreground">Details about your farm land size and ownership</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <Label htmlFor="totalLandSize" className="font-medium">Total Land Size (Hectares) *</Label>
                  <Input
                    id="totalLandSize"
                    type="number"
                    step="0.1"
                    value={formData.totalLandSize}
                    onChange={(e) => setFormData({ ...formData, totalLandSize: e.target.value })}
                    placeholder="e.g., 2.5"
                    className={errors.totalLandSize ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
                  />
                  {errors.totalLandSize && <p className="text-sm text-red-500">{errors.totalLandSize}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ownedLandSize" className="font-medium">Owned Land (Hectares) *</Label>
                  <Input
                    id="ownedLandSize"
                    type="number"
                    step="0.1"
                    value={formData.ownedLandSize}
                    onChange={(e) => setFormData({ ...formData, ownedLandSize: e.target.value })}
                    placeholder="e.g., 1.5"
                    className={errors.ownedLandSize ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}
                  />
                  {errors.ownedLandSize && <p className="text-sm text-red-500">{errors.ownedLandSize}</p>}
                </div>


                <div className="space-y-3">
                  <Label htmlFor="leasedLandSize" className="font-medium">Leased Land (Hectares)</Label>
                  <Input
                    id="leasedLandSize"
                    type="number"
                    step="0.1"
                    value={formData.leasedLandSize}
                    onChange={(e) => setFormData({ ...formData, leasedLandSize: e.target.value })}
                    placeholder="e.g., 1.0"
                    className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="landTenure" className="font-medium">Land Tenure *</Label>
                  <Select
                    value={formData.landTenure}
                    onValueChange={(value) => setFormData({ ...formData, landTenure: value })}
                  >
                    <SelectTrigger className={errors.landTenure ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}>
                      <SelectValue placeholder="Select land tenure" />
                    </SelectTrigger>
                    <SelectContent>
                      {LAND_TENURE_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.landTenure && <p className="text-sm text-red-500">{errors.landTenure}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="soilType" className="font-medium">Predominant Soil Type *</Label>
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) => setFormData({ ...formData, soilType: value })}
                  >
                    <SelectTrigger className={errors.soilType ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOIL_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.soilType && <p className="text-sm text-red-500">{errors.soilType}</p>}
                </div>
              </div>
            </div>

            {/* Water & Irrigation Section */}
            <div className="space-y-6">
              <div className="pb-3 border-b border-green-100">
                <h3 className="text-lg font-semibold">Water & Irrigation</h3>
                <p className="text-sm text-muted-foreground">Water sources and irrigation methods available</p>
              </div>

              <div className="space-y-4">
                <Label className="font-medium">Water Sources Available</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-green-100 rounded-lg bg-green-50/30">
                  {WATER_SOURCES.map((source) => (
                    <div key={source} className="flex items-center space-x-3 p-2 rounded">
                      <Checkbox
                        id={source}
                        checked={formData.waterSources.includes(source)}
                        onCheckedChange={(checked) => handleWaterSourceChange(source, checked as boolean)}
                        className="border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label htmlFor={source} className="text-sm cursor-pointer">{source}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="irrigationMethod" className="font-medium">Irrigation Method</Label>
                <Select
                  value={formData.irrigationMethod}
                  onValueChange={(value) => setFormData({ ...formData, irrigationMethod: value })}
                >
                  <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200">
                    <SelectValue placeholder="Select irrigation method (if applicable)" />
                  </SelectTrigger>
                  <SelectContent>
                    {IRRIGATION_METHODS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select the primary irrigation method used on your farm</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            {/* Certification Status Section */}
            <div className="space-y-6">
              <div className="pb-3 border-b border-green-100">
                <h3 className="text-lg font-semibold">Organic Certification Status</h3>
                <p className="text-sm text-muted-foreground">Your current organic farming and certification status</p>
              </div>

              <div className="space-y-4">
                <Label className="font-medium">Previous Organic Certification *</Label>
                <RadioGroup
                  value={formData.previousCertification}
                  onValueChange={(value) => setFormData({ ...formData, previousCertification: value })}
                  className={errors.previousCertification ? "border border-red-500 rounded-lg p-4" : "border border-green-200 rounded-lg p-4 bg-green-50/30"}
                >
                  <div className="flex items-center space-x-3 p-2 rounded">
                    <RadioGroupItem value="yes" id="cert-yes" className="border-green-400 text-green-600" />
                    <Label htmlFor="cert-yes" className="cursor-pointer">Yes, previously certified</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded">
                    <RadioGroupItem value="transitioning" id="cert-transitioning" className="border-green-400 text-green-600" />
                    <Label htmlFor="cert-transitioning" className="cursor-pointer">Currently in transition period</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded">
                    <RadioGroupItem value="no" id="cert-no" className="border-green-400 text-green-600" />
                    <Label htmlFor="cert-no" className="cursor-pointer">No, new to organic farming</Label>
                  </div>
                </RadioGroup>
                {errors.previousCertification && <p className="text-sm text-red-500">{errors.previousCertification}</p>}
              </div>

              {formData.previousCertification === "yes" && (
                <div className="space-y-3 p-4 bg-green-50/50 rounded-lg border border-green-100">
                  <Label htmlFor="certificationBodies" className="font-medium">Previous Certification Bodies</Label>
                  <Input
                    id="certificationBodies"
                    value={formData.certificationBodies}
                    onChange={(e) => setFormData({ ...formData, certificationBodies: e.target.value })}
                    placeholder="e.g., KOAN, Bio-Vision, Africert"
                    className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  />
                </div>
              )}

              {(formData.previousCertification === "yes" || formData.previousCertification === "transitioning") && (
                <div className="space-y-3 p-4 bg-green-50/50 rounded-lg border border-green-100">
                  <Label htmlFor="transitionStartDate" className="font-medium">Organic Transition Start Date</Label>
                  <Input
                    id="transitionStartDate"
                    type="date"
                    value={formData.transitionStartDate}
                    onChange={(e) => setFormData({ ...formData, transitionStartDate: e.target.value })}
                    className="border-green-200 focus:border-green-400 focus:ring-green-200"
                  />
                  <p className="text-xs text-muted-foreground">When did you start transitioning to organic practices?</p>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="organicExperience" className="font-medium">Organic Farming Experience *</Label>
                <Select
                  value={formData.organicExperience}
                  onValueChange={(value) => setFormData({ ...formData, organicExperience: value })}
                >
                  <SelectTrigger className={errors.organicExperience ? "border-red-500" : "border-green-200 focus:border-green-400 focus:ring-green-200"}>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIC_EXPERIENCE_LEVELS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.organicExperience && <p className="text-sm text-red-500">{errors.organicExperience}</p>}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <div className="pb-3 border-b border-green-100">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <p className="text-sm text-muted-foreground">Tell us more about your organic farming journey</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="motivationForOrganic" className="font-medium">Motivation for Organic Farming</Label>
                <Textarea
                  id="motivationForOrganic"
                  value={formData.motivationForOrganic}
                  onChange={(e) => setFormData({ ...formData, motivationForOrganic: e.target.value })}
                  placeholder="Why do you want to pursue organic farming? What are your goals?"
                  rows={3}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="font-medium">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information relevant to organic certification"
                  rows={3}
                  className="border-green-200 focus:border-green-400 focus:ring-green-200"
                />
              </div>
            </div>

            {/* Comprehensive Summary */}
            <div className="mt-8 p-6 bg-green-50/50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-lg">Review Farmer Information</h4>
              </div>
              <div className="grid gap-6 md:grid-cols-2 text-sm mt-24">
                <div className="space-y-3">
                  <h5 className="font-medium mb-2 border-b border-green-200 pb-1">Personal Information</h5>
                  <div className="space-y-1">
                    <p><strong>Member ID:</strong> <span className="text-muted-foreground">Will be generated upon registration</span></p>
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>ID Number:</strong> {formData.idNumber}</p>
                    <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium mb-2 border-b border-green-200 pb-1">Location</h5>
                  <div className="space-y-1">
                    <p><strong>County:</strong> {formData.county}</p>
                    <p><strong>Sub-County:</strong> {formData.subCounty}</p>
                    <p><strong>Ward:</strong> {formData.ward}</p>
                    <p><strong>Village:</strong> {formData.village}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium mb-2 border-b border-green-200 pb-1">Farming Background</h5>
                  <div className="space-y-1">
                    <p><strong>Experience:</strong> {formData.yearsInFarming}</p>
                    <p><strong>Education:</strong> {formData.educationLevel}</p>
                    <p><strong>Farming Type:</strong> {formData.farmingType}</p>
                    <p><strong>Primary Crops:</strong> {formData.primaryCrops.join(', ')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium mb-2 border-b border-green-200 pb-1">Farm Details</h5>
                  <div className="space-y-1">
                    <p><strong>Total Land:</strong> {formData.totalLandSize} ha</p>
                    <p><strong>Owned Land:</strong> {formData.ownedLandSize} ha</p>
                    <p><strong>Land Tenure:</strong> {formData.landTenure}</p>
                    <p><strong>Soil Type:</strong> {formData.soilType}</p>
                    <p><strong>Water Sources:</strong> {formData.waterSources.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6 pb-96">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-transparent hover:text-current">
                <Link href="/farmers">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Farmers
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-space-grotesk font-bold">Add New Farmer</h1>
                <p className="text-muted-foreground">Complete farmer registration for organic certification tracking</p>
              </div>
            </div>

            {/* Progress Steps */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle>Step {currentStep} of {FORM_STEPS.length}</CardTitle>
                    <CardDescription>{currentStepConfig?.title}: {currentStepConfig?.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                  </div>
                </div>
                <Progress value={progress} className="mb-4" />

                {/* Step indicators */}

                <div className="flex items-center justify-between mb-24">
                  {FORM_STEPS.map((step) => {
                    const Icon = step.icon
                    const isCompleted = completedSteps.includes(step.id)
                    const isCurrent = currentStep === step.id
                    const isClickable = step.id <= currentStep || completedSteps.includes(step.id - 1)

                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1">
                        <button
                          onClick={() => handleStepClick(step.id)}
                          disabled={!isClickable}
                          className={`
                            w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors mb-2
                            ${isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                              isCurrent ? 'border-primary text-primary bg-primary/10' :
                              isClickable ? 'border-muted-foreground' : 'border-muted text-muted-foreground'}
                            ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                          `}
                        >
                          {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </button>
                        <div className="text-center">
                          <div className="text-xs font-medium">{step.title}</div>
                          <div className="text-xs text-muted-foreground">{step.description}</div>
                        </div>
                        {isCompleted && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6 ">
                  {renderStepContent()}

                  {/* Navigation buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className="hover:bg-transparent hover:text-current"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < FORM_STEPS.length ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-primary hover:bg-primary hover:text-primary-foreground" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Registering..." : "Register Farmer"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function NewFarmerPage() {
  return (
    <ProtectedRoute>
      <NewFarmerContent />
    </ProtectedRoute>
  )
}
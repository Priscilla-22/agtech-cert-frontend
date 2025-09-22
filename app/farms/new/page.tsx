"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import { fetchAllFarmers, createFarmer } from "@/lib/services/farmer-service"
import { createFarm } from "@/lib/services/farm-service"
import { FarmFormData, NewFarmerFormData } from "@/lib/types/farm-form"
import { Farmer } from "@/lib/types/farmer"
import { BasicInfoStep } from "@/components/forms/farm/basic-info-step"
import { LocationDetailsStep } from "@/components/forms/farm/location-details-step"
import { FarmSpecificationsStep } from "@/components/forms/farm/farm-specifications-step"
import { CropsFarmingStep } from "@/components/forms/farm/crops-farming-step"
import { WaterSourcesStep } from "@/components/forms/farm/water-sources-step"
import { ReviewStep } from "@/components/forms/farm/review-step"


function NewFarmContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [selectedCrops, setSelectedCrops] = useState<string[]>([])

  const [farmerMode, setFarmerMode] = useState<'existing' | 'new'>('existing')
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 4
  
  const [formData, setFormData] = useState<FarmFormData>({
    name: "",
    farmerId: "",
    location: "",
    county: "",
    ward: "",
    village: "",
    size: "",
    cultivatedSize: "",
    soilType: "",
    cropTypes: [],
    irrigationSystem: "",
    landTenure: "",
    waterSources: [],
    description: "",
    registrationDate: new Date().toISOString().split('T')[0],
    status: "active",
  })


  // New farmer data for registration
  const [newFarmerData, setNewFarmerData] = useState<NewFarmerFormData>({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    idNumber: "",
    dateOfBirth: "",
    county: "",
    subCounty: "",
    ward: "",
    village: "",
    address: "",
    educationLevel: "primary",
    farmingExperience: "0-2",
    agriculturalTraining: "",
    primaryCrops: [],
    farmingType: "subsistence",
    totalLandSize: "",
    cultivatedSize: "",
    landTenure: "owned",
    soilType: "loam",
    waterSources: [],
    irrigationSystem: "none",
    previousCertification: "no",
    certifyingBody: "",
    certificationExpiry: "",
    organicExperience: "0-2",
    motivation: "",
    challenges: "",
    expectations: "",
    notes: "",
  })

  // Fetch farmers for dropdown
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const farmersData = await fetchAllFarmers()
        setFarmers((farmersData || []).filter((farmer: Farmer) => farmer.status === 'active'))
      } catch (error) {
        console.error("Error fetching farmers:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load farmers. Please try again.",
        })
      }
    }

    fetchFarmers()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleNewFarmerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewFarmerData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNewFarmerCropChange = (crop: string, checked: boolean) => {
    if (checked) {
      setNewFarmerData(prev => ({
        ...prev,
        primaryCrops: [...prev.primaryCrops, crop]
      }))
    } else {
      setNewFarmerData(prev => ({
        ...prev,
        primaryCrops: prev.primaryCrops.filter(c => c !== crop)
      }))
    }
  }

  const handleNewFarmerWaterSourceChange = (source: string, checked: boolean) => {
    if (checked) {
      setNewFarmerData(prev => ({
        ...prev,
        waterSources: [...prev.waterSources, source]
      }))
    } else {
      setNewFarmerData(prev => ({
        ...prev,
        waterSources: prev.waterSources.filter(s => s !== source)
      }))
    }
  }

  const handleCropChange = (crop: string, checked: boolean) => {
    if (checked) {
      setSelectedCrops(prev => [...prev, crop])
      setFormData(prev => ({
        ...prev,
        cropTypes: [...prev.cropTypes, crop]
      }))
    } else {
      setSelectedCrops(prev => prev.filter(c => c !== crop))
      setFormData(prev => ({
        ...prev,
        cropTypes: prev.cropTypes.filter(c => c !== crop)
      }))
    }
  }

  const handleWaterSourceChange = (source: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        waterSources: [...prev.waterSources, source]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        waterSources: prev.waterSources.filter(s => s !== source)
      }))
    }
  }


  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }


  const isCurrentPageValid = () => {
    if (currentPage === 0) {
      return formData.name.trim() &&
             ((farmerMode === 'existing' && formData.farmerId) ||
              (farmerMode === 'new' && newFarmerData.name.trim() && newFarmerData.email.trim() &&
               newFarmerData.phone.trim() && newFarmerData.idNumber.trim() && newFarmerData.dateOfBirth.trim() &&
               newFarmerData.county.trim() && newFarmerData.subCounty.trim() && newFarmerData.ward.trim() &&
               newFarmerData.village.trim() && newFarmerData.address.trim())) &&
             formData.location.trim()
    } else if (currentPage === 1) {
      return formData.size && parseFloat(formData.size) > 0
    }
    return true
  }

  // Removed handleKeyDown to prevent any Enter key interference

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (currentPage !== totalPages - 1) {
      return
    }

    // Validation
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Farm name is required.",
      })
      return
    }

    // Validate farmer selection or new farmer data
    if (farmerMode === 'existing' && !formData.farmerId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a farmer.",
      })
      return
    }

    if (farmerMode === 'new') {
      const requiredFields = [
        { field: newFarmerData.name.trim(), message: "Farmer name is required." },
        { field: newFarmerData.email.trim(), message: "Farmer email is required." },
        { field: newFarmerData.phone.trim(), message: "Farmer phone number is required." },
        { field: newFarmerData.idNumber.trim(), message: "Farmer ID number is required." },
        { field: newFarmerData.dateOfBirth.trim(), message: "Farmer date of birth is required." },
        { field: newFarmerData.county.trim(), message: "County is required." },
        { field: newFarmerData.subCounty.trim(), message: "Sub-county is required." },
        { field: newFarmerData.ward.trim(), message: "Ward is required." },
        { field: newFarmerData.village.trim(), message: "Village is required." },
        { field: newFarmerData.address.trim(), message: "Physical address is required." },
      ];

      for (const { field, message } of requiredFields) {
        if (!field) {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: message,
          })
          return
        }
      }

      // Also validate that at least one crop and water source is selected
      if (newFarmerData.primaryCrops.length === 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please select at least one primary crop for the farmer.",
        })
        return
      }

      if (newFarmerData.waterSources.length === 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please select at least one water source for the farmer.",
        })
        return
      }

      if (!newFarmerData.totalLandSize || parseFloat(newFarmerData.totalLandSize) <= 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please enter total land size for the farmer (must be greater than 0).",
        })
        return
      }
    }

    if (!formData.location.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Location is required.",
      })
      return
    }

    if (!formData.size || parseFloat(formData.size) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a valid farm size.",
      })
      return
    }

    setLoading(true)
    
    try {
      let farmerId = formData.farmerId

      // If registering a new farmer, create the farmer first
      if (farmerMode === 'new') {
        const farmerSubmitData = {
          ...newFarmerData,
          totalLandSize: newFarmerData.totalLandSize ? parseFloat(newFarmerData.totalLandSize) : 0,
          cultivatedSize: newFarmerData.cultivatedSize ? parseFloat(newFarmerData.cultivatedSize) : 0,
          registrationDate: new Date().toISOString().split('T')[0],
          status: "active",
          certificationStatus: "pending",
        }

        toast({
          title: "Creating Farmer",
          description: "Registering new farmer...",
        })

        const createdFarmer = await createFarmer(farmerSubmitData)
        farmerId = createdFarmer?.id?.toString()

        if (!farmerId) {
          throw new Error("Failed to get farmer ID from created farmer")
        }

        toast({
          title: "Farmer Created",
          description: "Now creating the farm...",
        })
      }

      // Prepare farm data for submission - only include fields that exist in farms table
      const submitData = {
        farmerId: farmerId,
        name: formData.name,
        location: formData.location,
        size: parseFloat(formData.size),
        cultivatedSize: formData.cultivatedSize ? parseFloat(formData.cultivatedSize) : undefined,
        cropTypes: selectedCrops,
      }

      await createFarm(submitData)
      
      toast({
        title: "Success",
        description: farmerMode === 'new' 
          ? "Farmer and farm registered successfully!" 
          : "Farm registered successfully!",
      })
      
      router.push("/farms")
    } catch (error) {
      console.error("Error creating farm:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: farmerMode === 'new' 
          ? "Failed to register farmer and farm. Please try again."
          : "Failed to register farm. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            <div className="w-full px-8 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Link href="/farms">
                  <Button type="button" variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Farms
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Register New Farm</h1>
                  <p className="text-muted-foreground">
                    Add a new farm to the certification system
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          i === currentPage
                            ? "bg-primary text-primary-foreground"
                            : i < currentPage
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {i + 1}
                      </div>
                      {i < totalPages - 1 && (
                        <div className={`w-8 h-0.5 ${i < currentPage ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {currentPage === 0 && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <BasicInfoStep
                      formData={formData}
                      newFarmerData={newFarmerData}
                      farmers={farmers}
                      farmerMode={farmerMode}
                      onInputChange={handleInputChange}
                      onNewFarmerInputChange={handleNewFarmerInputChange}
                      onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
                      onFarmerModeChange={setFarmerMode}
                    />
                    <LocationDetailsStep
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                  </div>
                )}

                {currentPage === 1 && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <FarmSpecificationsStep
                      formData={formData}
                      onInputChange={handleInputChange}
                      onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
                    />
                    <CropsFarmingStep
                      selectedCrops={selectedCrops}
                      farmerMode={farmerMode}
                      newFarmerData={newFarmerData}
                      onCropChange={handleCropChange}
                      onNewFarmerCropChange={handleNewFarmerCropChange}
                    />
                  </div>
                )}

                {currentPage === 2 && (
                  <WaterSourcesStep
                    formData={formData}
                    farmerMode={farmerMode}
                    newFarmerData={newFarmerData}
                    onInputChange={handleInputChange}
                    onNewFarmerInputChange={handleNewFarmerInputChange}
                    onWaterSourceChange={handleWaterSourceChange}
                    onNewFarmerWaterSourceChange={handleNewFarmerWaterSourceChange}
                  />
                )}

                {currentPage === 3 && (
                  <ReviewStep
                    formData={formData}
                    selectedCrops={selectedCrops}
                  />
                )}
                {/* Navigation Controls */}
                <div className="flex flex-col items-center gap-6 pt-6">
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="w-3 h-3 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-xs"
                    >
                      <ChevronLeft className="h-1.5 w-1.5" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        type="button"
                        variant={i === currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(i)}
                        className={`w-3 h-3 p-0 rounded-full text-[10px] font-bold leading-none ${
                          i === currentPage
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages - 1 || !isCurrentPageValid()}
                      className="w-3 h-3 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-xs"
                    >
                      <ChevronRight className="h-1.5 w-1.5" />
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Link href="/farms">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    {currentPage === totalPages - 1 ? (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? "Registering..." : "Register Farm"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleNextPage}
                        disabled={!isCurrentPageValid()}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function NewFarmPage() {
  return (
    <ProtectedRoute>
      <NewFarmContent />
    </ProtectedRoute>
  )
}
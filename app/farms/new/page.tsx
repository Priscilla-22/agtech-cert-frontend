"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  MapPin,
  Ruler,
  Wheat,
  User,
  Building2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/ProtectedRoute"
import { api } from "@/lib/api-client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Farmer {
  id: number
  name: string
  email: string
  phone: string
  county: string
  status: string
}

const cropOptions = [
  "Maize", "Tea", "Coffee", "Wheat", "Rice", "Beans", "Potatoes", "Tomatoes",
  "Onions", "Carrots", "Cabbage", "Spinach", "Kale", "Bananas", "Avocados",
  "Mangoes", "Oranges", "Lemons", "Sugarcane", "Cotton", "Barley", "Sorghum"
]

const soilTypes = [
  "Clay", "Sandy", "Loam", "Silt", "Volcanic", "Red soil", "Black cotton", "Alluvial"
]

const irrigationSystems = [
  "Rain-fed", "Furrow irrigation", "Sprinkler", "Drip irrigation", 
  "Centre pivot", "Flood irrigation", "Sub-surface drip"
]

function NewFarmContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [selectedCrops, setSelectedCrops] = useState<string[]>([])

  const [farmerMode, setFarmerMode] = useState<'existing' | 'new'>('existing')
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 4 // We'll have 4 pages with 2 cards each

  // Group form sections into pages (2 cards per page)
  const formPages = [
    // Page 1: Basic Information + Location Information
    ['basic', 'location'],
    // Page 2: Farm Specifications + Crop Information
    ['specifications', 'crops'],
    // Page 3: Water Sources + Additional Information
    ['water', 'additional'],
    // Page 4: Review (if needed, or can be combined with submit)
    ['review']
  ]
  
  const [formData, setFormData] = useState({
    name: "",
    farmerId: "",
    location: "",
    county: "",
    ward: "",
    village: "",
    size: "",
    cultivatedSize: "",
    soilType: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
    cropTypes: [] as string[],
    irrigationSystem: "",
    landTenure: "",
    waterSources: [] as string[],
    description: "",
    registrationDate: new Date().toISOString().split('T')[0],
    status: "active",
  })

  // Generate member number for new farmers
  const generateMemberNumber = () => {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `AGT-${year}-${timestamp}-${random}`
  }

  // New farmer data for registration
  const [newFarmerData, setNewFarmerData] = useState({
    memberNumber: generateMemberNumber(),
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
    primaryCrops: [] as string[],
    farmingType: "subsistence",
    totalLandSize: "",
    cultivatedSize: "",
    landTenure: "owned",
    soilType: "loam",
    waterSources: [] as string[],
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
        const response = await api.farmers.getAll()
        const farmersData = Array.isArray(response) ? response : response.data || []
        setFarmers(farmersData.filter((farmer: Farmer) => farmer.status === 'active'))
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

  // Navigation functions
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

  // Validation for current page
  const isCurrentPageValid = () => {
    if (currentPage === 0) {
      // Basic Information + Location validation
      return formData.name.trim() &&
             ((farmerMode === 'existing' && formData.farmerId) ||
              (farmerMode === 'new' && newFarmerData.name.trim() && newFarmerData.email.trim() &&
               newFarmerData.phone.trim() && newFarmerData.idNumber.trim() && newFarmerData.dateOfBirth.trim() &&
               newFarmerData.county.trim() && newFarmerData.subCounty.trim() && newFarmerData.ward.trim() &&
               newFarmerData.village.trim() && newFarmerData.address.trim())) &&
             formData.location.trim()
    } else if (currentPage === 1) {
      // Farm Specifications + Crops validation
      return formData.size && parseFloat(formData.size) > 0
    } else if (currentPage === 2) {
      // Water Sources + Additional (optional fields, so always valid)
      return true
    } else if (currentPage === 3) {
      // Review page (always valid)
      return true
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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

        const createdFarmer = await api.farmers.create(farmerSubmitData)
        farmerId = createdFarmer.data?.id?.toString() || createdFarmer.id?.toString()

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
        farmerId: parseInt(farmerId),
        name: formData.name,
        location: formData.location,
        size: parseFloat(formData.size),
        cultivatedSize: formData.cultivatedSize ? parseFloat(formData.cultivatedSize) : undefined,
        cropTypes: selectedCrops,
        // Note: Other fields like county, ward, village, soilType, etc. belong to farmer, not farm
      }

      await api.farms.create(submitData)
      
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
                  <Button variant="outline" size="sm">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Page Content */}
                <div className="space-y-6">
                  {/* Page 1: Basic Information + Location Information */}
                  {currentPage === 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Basic Information */}
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
                              onChange={handleInputChange}
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
                                  onClick={() => setFarmerMode('existing')}
                                  className="flex-1 text-xs"
                                  size="sm"
                                >
                                  <User className="w-3 h-3 mr-1" />
                                  Existing
                                </Button>
                                <Button
                                  type="button"
                                  variant={farmerMode === 'new' ? 'default' : 'outline'}
                                  onClick={() => setFarmerMode('new')}
                                  className="flex-1 text-xs"
                                  size="sm"
                                >
                                  <UserPlus className="w-3 h-3 mr-1" />
                                  New
                                </Button>
                              </div>

                              {farmerMode === 'existing' ? (
                                <Select value={formData.farmerId} onValueChange={(value) => setFormData(prev => ({ ...prev, farmerId: value }))}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose existing farmer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {farmers.map((farmer) => (
                                      <SelectItem key={farmer.id} value={farmer.id.toString()}>
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4" />
                                          {farmer.name} - {farmer.email}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                        onChange={handleNewFarmerInputChange}
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
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
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

                      {/* Location Information */}
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
                              onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                placeholder="County"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ward">Ward</Label>
                              <Input
                                id="ward"
                                name="ward"
                                value={formData.ward}
                                onChange={handleInputChange}
                                placeholder="Ward"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="village">Village</Label>
                              <Input
                                id="village"
                                name="village"
                                value={formData.village}
                                onChange={handleInputChange}
                                placeholder="Village"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="coordinates.latitude">Latitude</Label>
                              <Input
                                id="coordinates.latitude"
                                name="coordinates.latitude"
                                type="number"
                                step="any"
                                value={formData.coordinates.latitude}
                                onChange={handleInputChange}
                                placeholder="e.g., -1.2921"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="coordinates.longitude">Longitude</Label>
                              <Input
                                id="coordinates.longitude"
                                name="coordinates.longitude"
                                type="number"
                                step="any"
                                value={formData.coordinates.longitude}
                                onChange={handleInputChange}
                                placeholder="e.g., 36.8219"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Page 2: Farm Specifications + Crop Information */}
                  {currentPage === 1 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Farm Specifications */}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                placeholder="e.g., 4.0"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="soilType">Soil Type</Label>
                            <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select soil type" />
                              </SelectTrigger>
                              <SelectContent>
                                {soilTypes.map((soil) => (
                                  <SelectItem key={soil} value={soil.toLowerCase()}>
                                    {soil}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="irrigationSystem">Irrigation System</Label>
                            <Select value={formData.irrigationSystem} onValueChange={(value) => setFormData(prev => ({ ...prev, irrigationSystem: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select irrigation system" />
                              </SelectTrigger>
                              <SelectContent>
                                {irrigationSystems.map((system) => (
                                  <SelectItem key={system} value={system.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
                                    {system}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="landTenure">Land Tenure</Label>
                            <Select value={formData.landTenure} onValueChange={(value) => setFormData(prev => ({ ...prev, landTenure: value }))}>
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

                      {/* Crop Information */}
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
                              {cropOptions.map((crop) => (
                                <div key={crop} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={crop}
                                    checked={selectedCrops.includes(crop)}
                                    onCheckedChange={(checked) => handleCropChange(crop, checked as boolean)}
                                  />
                                  <Label htmlFor={crop} className="text-sm font-normal">
                                    {crop}
                                  </Label>
                                </div>
                              ))}
                            </div>

                            {/* If registering new farmer, also select their crops */}
                            {farmerMode === 'new' && (
                              <div className="mt-6 p-3 border rounded-lg bg-blue-50/50">
                                <Label className="text-sm font-medium text-blue-800">Farmer's Primary Crops</Label>
                                <p className="text-xs text-blue-600 mb-3">Select the crops the farmer typically grows</p>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                  {cropOptions.map((crop) => (
                                    <div key={`farmer-${crop}`} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`farmer-${crop}`}
                                        checked={newFarmerData.primaryCrops.includes(crop)}
                                        onCheckedChange={(checked) => handleNewFarmerCropChange(crop, checked as boolean)}
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
                    </div>
                  )}

                  {/* Page 3: Water Sources + Additional Information */}
                  {currentPage === 2 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Water Sources */}
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
                              {["River", "Borehole", "Well", "Spring", "Dam", "Rainwater"].map((source) => (
                                <div key={source} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={source}
                                    checked={formData.waterSources.includes(source)}
                                    onCheckedChange={(checked) => handleWaterSourceChange(source, checked as boolean)}
                                  />
                                  <Label htmlFor={source} className="text-sm font-normal">
                                    {source}
                                  </Label>
                                </div>
                              ))}
                            </div>

                            {/* If registering new farmer, also select their water sources */}
                            {farmerMode === 'new' && (
                              <div className="mt-6 p-3 border rounded-lg bg-blue-50/50">
                                <Label className="text-sm font-medium text-blue-800">Farmer's Water Sources</Label>
                                <p className="text-xs text-blue-600 mb-3">Select the water sources the farmer typically uses</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {["River", "Borehole", "Well", "Spring", "Dam", "Rainwater"].map((source) => (
                                    <div key={`farmer-${source}`} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`farmer-${source}`}
                                        checked={newFarmerData.waterSources.includes(source)}
                                        onCheckedChange={(checked) => handleNewFarmerWaterSourceChange(source, checked as boolean)}
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
                                      onChange={handleNewFarmerInputChange}
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
                                      onChange={handleNewFarmerInputChange}
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

                      {/* Additional Information */}
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
                              onChange={handleInputChange}
                              placeholder="Additional information about the farm..."
                              rows={8}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Page 4: Review */}
                  {currentPage === 3 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Review & Submit</CardTitle>
                        <CardDescription>
                          Please review all the information before submitting
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <h4 className="font-semibold">Farm Details</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Farm Name:</strong> {formData.name}</div>
                              <div><strong>Location:</strong> {formData.location}</div>
                              <div><strong>Size:</strong> {formData.size} ha</div>
                              <div><strong>Soil Type:</strong> {formData.soilType}</div>
                              <div><strong>Irrigation:</strong> {formData.irrigationSystem}</div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-semibold">Crops & Resources</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Crops:</strong> {selectedCrops.join(', ') || 'None selected'}</div>
                              <div><strong>Water Sources:</strong> {formData.waterSources.join(', ') || 'None selected'}</div>
                              {formData.description && <div><strong>Description:</strong> {formData.description}</div>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="flex flex-col items-center gap-6 pt-6">
                  {/* Circular Pagination - Centered */}
                  <div className="flex items-center gap-0.5">
                    {/* Previous Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="w-3 h-3 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-xs"
                    >
                      <ChevronLeft className="h-1.5 w-1.5" />
                    </Button>

                    {/* Page Indicators */}
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

                    {/* Next Button */}
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

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Link href="/farms">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    {currentPage === totalPages - 1 ? (
                      <Button type="submit" disabled={loading}>
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
              </form>
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
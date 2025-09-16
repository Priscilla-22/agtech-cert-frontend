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
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3 // We'll have 3 pages with 2 cards each
  
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

  // New farmer data for registration
  const [newFarmerData, setNewFarmerData] = useState({
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
    farmingExperience: "0-1",
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
    organicExperience: "0-1",
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
      if (!newFarmerData.name.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Farmer name is required.",
        })
        return
      }

      if (!newFarmerData.email.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error", 
          description: "Farmer email is required.",
        })
        return
      }

      if (!newFarmerData.phone.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Farmer phone number is required.",
        })
        return
      }

      if (!newFarmerData.idNumber.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Farmer ID number is required.",
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

      // Prepare farm data for submission
      const submitData = {
        ...formData,
        farmerId: parseInt(farmerId),
        size: parseFloat(formData.size),
        cultivatedSize: formData.cultivatedSize ? parseFloat(formData.cultivatedSize) : undefined,
        coordinates: {
          latitude: formData.coordinates.latitude ? parseFloat(formData.coordinates.latitude) : null,
          longitude: formData.coordinates.longitude ? parseFloat(formData.coordinates.longitude) : null,
        },
        cropTypes: selectedCrops,
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
            <div className="max-w-4xl mx-auto space-y-6">
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

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <CardContent className="grid gap-4 md:grid-cols-2">
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
                    <div className="space-y-4 md:col-span-2">
                      <div className="space-y-2">
                        <Label>Farmer Selection *</Label>
                        <div className="flex gap-4 mb-4">
                          <Button
                            type="button"
                            variant={farmerMode === 'existing' ? 'default' : 'outline'}
                            onClick={() => setFarmerMode('existing')}
                            className="flex-1"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Select Existing Farmer
                          </Button>
                          <Button
                            type="button"
                            variant={farmerMode === 'new' ? 'default' : 'outline'}
                            onClick={() => setFarmerMode('new')}
                            className="flex-1"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Register New Farmer
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
                          <div className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg bg-muted/30">
                            <div className="space-y-2">
                              <Label htmlFor="newFarmerName">Full Name *</Label>
                              <Input
                                id="newFarmerName"
                                name="name"
                                value={newFarmerData.name}
                                onChange={handleNewFarmerInputChange}
                                placeholder="Enter farmer's full name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newFarmerEmail">Email Address *</Label>
                              <Input
                                id="newFarmerEmail"
                                name="email"
                                type="email"
                                value={newFarmerData.email}
                                onChange={handleNewFarmerInputChange}
                                placeholder="farmer@example.com"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newFarmerPhone">Phone Number *</Label>
                              <Input
                                id="newFarmerPhone"
                                name="phone"
                                value={newFarmerData.phone}
                                onChange={handleNewFarmerInputChange}
                                placeholder="+254700000000"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newFarmerIdNumber">ID Number *</Label>
                              <Input
                                id="newFarmerIdNumber"
                                name="idNumber"
                                value={newFarmerData.idNumber}
                                onChange={handleNewFarmerInputChange}
                                placeholder="Enter ID number"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newFarmerCounty">County</Label>
                              <Input
                                id="newFarmerCounty"
                                name="county"
                                value={newFarmerData.county}
                                onChange={handleNewFarmerInputChange}
                                placeholder="County"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newFarmerAddress">Physical Address</Label>
                              <Input
                                id="newFarmerAddress"
                                name="address"
                                value={newFarmerData.address}
                                onChange={handleNewFarmerInputChange}
                                placeholder="Physical address"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
                  <CardContent className="grid gap-4 md:grid-cols-2">
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
                  </CardContent>
                </Card>

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
                  <CardContent className="grid gap-4 md:grid-cols-2">
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
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    </div>
                  </CardContent>
                </Card>

                {/* Water Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Water Sources</CardTitle>
                    <CardDescription>
                      Select available water sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4 justify-end">
                  <Link href="/farms">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register Farm"}
                  </Button>
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
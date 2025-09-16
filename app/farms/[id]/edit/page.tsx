"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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

function EditFarmContent() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [selectedCrops, setSelectedCrops] = useState<string[]>([])

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
    registrationDate: "",
    status: "active",
  })

  // Fetch farm data and farmers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true)
        
        if (!params.id) {
          throw new Error("Farm ID is required")
        }

        // Fetch farm data and farmers in parallel
        const [farmResponse, farmersResponse] = await Promise.all([
          api.farms.getById(params.id as string),
          api.farmers.getAll()
        ])

        // Set farm data
        const farm = farmResponse
        setFormData({
          name: farm.name || "",
          farmerId: farm.farmerId?.toString() || "",
          location: farm.location || "",
          county: farm.county || "",
          ward: farm.ward || "",
          village: farm.village || "",
          size: farm.size?.toString() || "",
          cultivatedSize: farm.cultivatedSize?.toString() || "",
          soilType: farm.soilType || "",
          coordinates: {
            latitude: farm.coordinates?.latitude?.toString() || "",
            longitude: farm.coordinates?.longitude?.toString() || "",
          },
          cropTypes: farm.cropTypes || [],
          irrigationSystem: farm.irrigationSystem || "",
          landTenure: farm.landTenure || "",
          waterSources: farm.waterSources || [],
          description: farm.description || "",
          registrationDate: farm.registrationDate ? new Date(farm.registrationDate).toISOString().split('T')[0] : "",
          status: farm.status || "active",
        })

        setSelectedCrops(farm.cropTypes || [])

        // Set farmers data
        const farmersData = Array.isArray(farmersResponse) ? farmersResponse : farmersResponse.data || []
        setFarmers(farmersData.filter((farmer: Farmer) => farmer.status === 'active'))
        
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load farm data. Please try again.",
        })
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [params.id])

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

    if (!formData.farmerId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a farmer.",
      })
      return
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
      // Prepare data for submission
      const submitData = {
        ...formData,
        farmerId: parseInt(formData.farmerId),
        size: parseFloat(formData.size),
        cultivatedSize: formData.cultivatedSize ? parseFloat(formData.cultivatedSize) : undefined,
        coordinates: {
          latitude: formData.coordinates.latitude ? parseFloat(formData.coordinates.latitude) : null,
          longitude: formData.coordinates.longitude ? parseFloat(formData.coordinates.longitude) : null,
        },
        cropTypes: selectedCrops,
      }

      await api.farms.update(params.id as string, submitData)
      
      toast({
        title: "Success",
        description: "Farm updated successfully!",
      })
      
      router.push(`/farms/${params.id}`)
    } catch (error) {
      console.error("Error updating farm:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update farm. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading farm data...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
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
                <Link href={`/farms/${params.id}`}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Farm
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Edit Farm</h1>
                  <p className="text-muted-foreground">
                    Update farm information in the certification system
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
                      Update the farm's basic details
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
                    <div className="space-y-2">
                      <Label htmlFor="farmerId">Select Farmer *</Label>
                      <Select value={formData.farmerId} onValueChange={(value) => setFormData(prev => ({ ...prev, farmerId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose farmer" />
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
                      Update the farm's location details
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
                  <Link href={`/farms/${params.id}`}>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Farm"}
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

export default function EditFarmPage() {
  return (
    <ProtectedRoute>
      <EditFarmContent />
    </ProtectedRoute>
  )
}
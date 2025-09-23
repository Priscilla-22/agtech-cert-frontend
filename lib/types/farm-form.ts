export interface FarmFormData {
  name: string
  farmerId: string
  location: string
  county: string
  ward: string
  village: string
  size: string
  cultivatedSize: string
  soilType: string
  cropTypes: string[]
  irrigationSystem: string
  landTenure: string
  waterSources: string[]
  description: string
  registrationDate: string
  status: string
}

export interface NewFarmerFormData {
  name: string
  email: string
  phone: string
  idNumber: string
  dateOfBirth: string
  county: string
  subCounty: string
  ward: string
  village: string
  address: string
  educationLevel: string
  farmingExperience: string
  agriculturalTraining: string
  primaryCrops: string[]
  farmingType: string
  totalLandSize: string
  cultivatedSize: string
  landTenure: string
  soilType: string
  waterSources: string[]
  irrigationSystem: string
  previousCertification: string
  certifyingBody: string
  certificationExpiry: string
  organicExperience: string
  motivation: string
  challenges: string
  expectations: string
  notes: string
}

export const CROP_OPTIONS = [
  "Maize", "Tea", "Coffee", "Wheat", "Rice", "Beans", "Potatoes", "Tomatoes",
  "Onions", "Carrots", "Cabbage", "Spinach", "Kale", "Bananas", "Avocados",
  "Mangoes", "Oranges", "Lemons", "Sugarcane", "Cotton", "Barley", "Sorghum"
]

export const SOIL_TYPES = [
  "Clay", "Sandy", "Loam", "Silt", "Volcanic", "Red soil", "Black cotton", "Alluvial"
]

export const IRRIGATION_SYSTEMS = [
  "Rain-fed", "Furrow irrigation", "Sprinkler", "Drip irrigation",
  "Centre pivot", "Flood irrigation", "Sub-surface drip"
]

export const WATER_SOURCES = [
  "River", "Borehole", "Well", "Spring", "Dam", "Rainwater"
]

export const LAND_TENURE_OPTIONS = [
  { value: "owned", label: "Owned" },
  { value: "leased", label: "Leased" },
  { value: "communal", label: "Communal" },
  { value: "rented", label: "Rented" }
]

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" }
]
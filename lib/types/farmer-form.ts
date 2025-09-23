export interface FarmerFormData {
  // Personal & Contact Info
  name: string
  email: string
  phone: string
  alternatePhone: string
  idNumber: string
  dateOfBirth: string

  // Location & Address
  county: string
  subCounty: string
  ward: string
  village: string
  address: string

  // Farming Background
  yearsInFarming: string
  educationLevel: string
  agriculturalTraining: string
  primaryCrops: string[]
  farmingType: string

  // Farm Details
  totalLandSize: string
  ownedLandSize: string
  leasedLandSize: string
  landTenure: string
  soilType: string
  waterSources: string[]
  irrigationMethod: string

  // Certification Info
  previousCertification: string
  certificationBodies: string
  transitionStartDate: string
  organicExperience: string
  motivationForOrganic: string

  // System fields
  status: string
  notes: string
}

export interface FormStep {
  id: number
  title: string
  description: string
  icon: any
  fields: string[]
}

export interface FormErrors {
  [key: string]: string
}

export const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary Education" },
  { value: "secondary", label: "Secondary Education" },
  { value: "diploma", label: "Diploma" },
  { value: "degree", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "other", label: "Other" }
]

export const FARMING_EXPERIENCE = [
  { value: "0-2", label: "0-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "11-20", label: "11-20 years" },
  { value: "20+", label: "20+ years" }
]

export const FARMING_TYPES = [
  { value: "subsistence", label: "Subsistence Farming" },
  { value: "commercial", label: "Commercial Farming" },
  { value: "mixed", label: "Mixed Farming (Crops + Livestock)" },
  { value: "organic-transition", label: "Transitioning to Organic" },
  { value: "organic-certified", label: "Already Organic Certified" }
]

export const LAND_TENURE_TYPES = [
  { value: "freehold", label: "Freehold (Title Deed)" },
  { value: "leasehold", label: "Leasehold" },
  { value: "communal", label: "Communal Land" },
  { value: "family", label: "Family Land" },
  { value: "rented", label: "Rented" }
]

export const SOIL_TYPES = [
  { value: "clay", label: "Clay" },
  { value: "loam", label: "Loam" },
  { value: "sandy", label: "Sandy" },
  { value: "volcanic", label: "Volcanic" },
  { value: "black-cotton", label: "Black Cotton" },
  { value: "red-soil", label: "Red Soil" }
]

export const IRRIGATION_METHODS = [
  { value: "none", label: "Rain-fed only" },
  { value: "drip", label: "Drip Irrigation" },
  { value: "sprinkler", label: "Sprinkler" },
  { value: "furrow", label: "Furrow Irrigation" },
  { value: "manual", label: "Manual Watering" }
]

export const ORGANIC_EXPERIENCE_LEVELS = [
  { value: "none", label: "No organic experience" },
  { value: "beginner", label: "Beginner (< 1 year)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "experienced", label: "Experienced (3-5 years)" },
  { value: "expert", label: "Expert (5+ years)" }
]

export const AVAILABLE_CROPS = [
  'Maize', 'Beans', 'Coffee', 'Tea', 'Bananas', 'Tomatoes',
  'Potatoes', 'Onions', 'Cabbages', 'Carrots', 'Spinach', 'Kale'
]

export const WATER_SOURCES = [
  'River', 'Borehole', 'Well', 'Spring', 'Rainwater', 'Municipal', 'Dam/Pond'
]
export interface Farmer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  county?: string
  subCounty?: string
  ward?: string
  village?: string
  dateOfBirth?: string
  gender?: string
  farmingType?: string
  organicExperience?: string
  educationLevel?: string
  landSize?: number
  landOwnership?: string
  registrationDate: string
  status: string
  certificationStatus?: string
  createdAt?: string
  updatedAt?: string
}

export interface FarmerUpdateData {
  name?: string
  email?: string
  phone?: string
  address?: string
  county?: string
  subCounty?: string
  ward?: string
  village?: string
  dateOfBirth?: string
  gender?: string
  farmingType?: string
  organicExperience?: string
  educationLevel?: string
  landSize?: number
  landOwnership?: string
  status?: string
  certificationStatus?: string
}

export interface FarmerCreateData {
  name: string
  email: string
  phone: string
  address: string
  county?: string
  subCounty?: string
  ward?: string
  village?: string
  dateOfBirth?: string
  gender?: string
  farmingType?: string
  organicExperience?: string
  educationLevel?: string
  landSize?: number
  landOwnership?: string
}
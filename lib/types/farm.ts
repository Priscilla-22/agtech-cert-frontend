export interface Farm {
  id: string
  name: string
  farmerId: string
  farmerName?: string
  farmerEmail?: string
  farmerPhone?: string
  location: string
  county?: string
  ward?: string
  village?: string
  size: number
  cultivatedSize?: number
  soilType?: string
  cropTypes: string[]
  irrigationSystem?: string
  landTenure?: string
  waterSources?: string[]
  description?: string
  registrationDate: string
  status: string
  certificationStatus?: string
  lastInspection?: string
  totalFields?: number
  totalInspections?: number
  createdAt?: string
  updatedAt?: string
}

export interface FarmUpdateData {
  name?: string
  farmerId?: string
  location?: string
  county?: string
  ward?: string
  village?: string
  size?: number
  cultivatedSize?: number
  soilType?: string
  cropTypes?: string[]
  irrigationSystem?: string
  landTenure?: string
  waterSources?: string[]
  description?: string
  status?: string
  certificationStatus?: string
}

export interface FarmCreateData {
  name: string
  farmerId: string
  location: string
  county?: string
  ward?: string
  village?: string
  size: number
  cultivatedSize?: number
  soilType?: string
  cropTypes: string[]
  irrigationSystem?: string
  landTenure?: string
  waterSources?: string[]
  description?: string
}
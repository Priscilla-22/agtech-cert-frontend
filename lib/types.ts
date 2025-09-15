export interface Farmer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  registrationDate: string
  status: "active" | "inactive"
  totalFarms: number
  certificationStatus: "pending" | "approved" | "rejected"
}

export interface Farm {
  id: string
  farmerId: string
  name: string
  location: string
  size: number
  cropTypes: string[]
  organicSince: string
  lastInspection?: string
  certificationStatus: "pending" | "approved" | "rejected" | "expired"
}

export interface Field {
  id: string
  farmId: string
  name: string
  size: number
  cropType: string
  plantingDate: string
  harvestDate?: string
  organicStatus: boolean
}

export interface Inspection {
  id: string
  farmId: string
  farmerName: string
  farmName: string
  inspectorName: string
  scheduledDate: string
  completedDate?: string
  status: "pending" | "completed" | "failed"
  score?: number
  notes?: string
  violations?: string[]
}

export interface Certificate {
  id: string
  farmId: string
  farmerName: string
  farmName: string
  issueDate: string
  expiryDate: string
  status: "active" | "expired" | "revoked"
  certificateNumber: string
  cropTypes: string[]
}

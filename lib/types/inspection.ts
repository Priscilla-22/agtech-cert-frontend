export interface Inspection {
  id: string
  farmId: string
  farmName?: string
  farmerId: string
  farmerName?: string
  inspectorId: string
  inspectorName?: string
  inspectionDate: string
  status: string
  score?: number
  findings?: string
  recommendations?: string
  nextInspectionDate?: string
  complianceLevel?: string
  certificateId?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface InspectionUpdateData {
  farmId?: string
  inspectorId?: string
  inspectionDate?: string
  status?: string
  score?: number
  findings?: string
  recommendations?: string
  nextInspectionDate?: string
  complianceLevel?: string
  certificateId?: string
  notes?: string
}

export interface InspectionCreateData {
  farmId: string
  inspectorId: string
  inspectionDate: string
  status: string
  score?: number
  findings?: string
  recommendations?: string
  nextInspectionDate?: string
  complianceLevel?: string
  notes?: string
}
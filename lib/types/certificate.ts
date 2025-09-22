export interface Certificate {
  id: string
  certificateNumber: string
  farmerName: string
  farmName: string
  issueDate: string
  expiryDate: string
  cropTypes: string[] | string
  status?: string
  farmerId?: string
  inspectionId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CertificateUpdateData {
  certificateNumber?: string
  farmerName?: string
  farmName?: string
  issueDate?: string
  expiryDate?: string
  cropTypes?: string[] | string
  status?: string
  farmerId?: string
  inspectionId?: string
}

export interface CertificateCreateData {
  certificateNumber: string
  farmerName: string
  farmName: string
  issueDate: string
  expiryDate: string
  cropTypes: string[] | string
  farmerId: string
  inspectionId: string
}
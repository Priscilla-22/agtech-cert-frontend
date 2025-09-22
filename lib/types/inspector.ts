export interface Inspector {
  id: string
  name: string
  email: string
  phone?: string
  employeeId?: string
  department?: string
  qualifications?: string[]
  certifications?: string[]
  yearsOfExperience?: number
  specializations?: string[]
  status: string
  assignedRegions?: string[]
  supervisorId?: string
  supervisorName?: string
  totalInspections?: number
  averageRating?: number
  lastInspectionDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface InspectorUpdateData {
  name?: string
  email?: string
  phone?: string
  employeeId?: string
  department?: string
  qualifications?: string[]
  certifications?: string[]
  yearsOfExperience?: number
  specializations?: string[]
  status?: string
  assignedRegions?: string[]
  supervisorId?: string
}

export interface InspectorCreateData {
  name: string
  email: string
  phone?: string
  employeeId?: string
  department?: string
  qualifications?: string[]
  certifications?: string[]
  yearsOfExperience?: number
  specializations?: string[]
  status: string
  assignedRegions?: string[]
  supervisorId?: string
}
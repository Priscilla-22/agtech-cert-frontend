export interface DashboardStats {
  farmers: {
    total: number
    active: number
    inactive: number
    pendingCertification: number
  }
  inspections: {
    total: number
    pending: number
    completed: number
    failed: number
    averageScore: number
  }
  certificates: {
    total: number
    active: number
    expired: number
    revoked: number
    expiringSoon: number
  }
}

export interface Farmer {
  id: string
  status: string
  certificationStatus?: string
}

export interface Inspection {
  id: string
  status: string
  score?: number
}

export interface Certificate {
  id: string
  status: string
  expiryDate: string
}

export interface SimpleDashboardStats {
  totalFarmers: number
  activeCertificates: number
  pendingInspections: number
  monthlyRevenue: number
}

export interface MonthlyData {
  month: string
  farmers: number
  inspections: number
  certificates: number
}

export interface CertificationData {
  name: string
  value: number
  color: string
}

export interface ActivityItem {
  id: string
  type: 'inspection' | 'certificate'
  title: string
  farmer: string
  time: string
  status: 'completed' | 'success' | 'warning' | 'pending'
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface DashboardFilters {
  dateRange: DateRange
  statusFilter: string
  searchFilter: string
  typeFilter: string
}

export interface StatItem {
  title: string
  value: string
  icon: any
  color: string
}

export interface DashboardInspection {
  id: string
  status: string
  scheduledDate?: string
  createdAt?: string
  updatedAt?: string
  farmerName?: string
}

export interface DashboardCertificate {
  id: string
  status: string
  issueDate: string
  createdAt?: string
  farmerName?: string
  certificationType?: string
}
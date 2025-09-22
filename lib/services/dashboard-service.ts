import { getList } from '@/lib/utils/http'
import { DashboardStats, Farmer, Inspection, Certificate } from '@/lib/types/dashboard'

const fetchAllData = async () => {
  const [farmersResponse, inspectionsResponse, certificatesResponse] = await Promise.all([
    getList('/farmers'),
    getList('/inspections'),
    getList('/certificates')
  ])

  // Extract data arrays from backend response format {data: [...], total: number, ...}
  const farmers = farmersResponse?.data || farmersResponse || []
  const inspections = inspectionsResponse?.data || inspectionsResponse || []
  const certificates = certificatesResponse?.data || certificatesResponse || []

  return { farmers, inspections, certificates }
}

const calculateFarmerStats = (farmers: Farmer[]) => {
  const total = farmers.length
  const active = farmers.filter(f => f.status === "active").length
  const pendingCertification = farmers.filter(f => f.certificationStatus === "pending").length

  return {
    total,
    active,
    inactive: total - active,
    pendingCertification
  }
}

const calculateInspectionStats = (inspections: Inspection[]) => {
  const total = inspections.length
  const pending = inspections.filter(i => i.status === "pending").length
  const completed = inspections.filter(i => i.status === "completed").length
  const failed = inspections.filter(i => i.status === "failed").length

  const averageScore = completed.length > 0
    ? Math.round(completed.reduce((acc, i) => acc + (i.score || 0), 0) / completed.length)
    : 0

  return {
    total,
    pending,
    completed,
    failed,
    averageScore
  }
}

const calculateCertificateStats = (certificates: Certificate[]) => {
  const total = certificates.length
  const active = certificates.filter(c => c.status === "active").length
  const expired = certificates.filter(c => c.status === "expired").length
  const revoked = certificates.filter(c => c.status === "revoked").length

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const expiringSoon = certificates.filter(c => {
    const expiryDate = new Date(c.expiryDate)
    return c.status === "active" && expiryDate <= thirtyDaysFromNow
  }).length

  return {
    total,
    active,
    expired,
    revoked,
    expiringSoon
  }
}

export const generateDashboardStats = async (): Promise<DashboardStats> => {
  const { farmers, inspections, certificates } = await fetchAllData()

  return {
    farmers: calculateFarmerStats(farmers),
    inspections: calculateInspectionStats(inspections),
    certificates: calculateCertificateStats(certificates)
  }
}
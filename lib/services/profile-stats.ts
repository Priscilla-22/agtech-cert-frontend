import { api } from '@/lib/api-client'

export interface ProfileStats {
  farmersTotal: number
  inspectionsCompleted: number
  certificatesIssued: number
  successRate: number
}

export interface ProfileData {
  name: string
  email: string
  phone: string
  address: string
  role: string
  department: string
  licenseNumber: string
  experience: string
}

export const fetchProfileStats = async (): Promise<ProfileStats> => {
  try {
    const [farmersData, inspectionsData, certificatesData] = await Promise.all([
      api.farmers.getAll().catch(() => ({ data: [] })),
      api.inspections.getAll().catch(() => ({ data: [] })),
      api.certificates.getAll().catch(() => ({ data: [] }))
    ])

    const farmers = farmersData.data || []
    const inspections = inspectionsData.data || []
    const certificates = certificatesData.data || []

    const completedInspections = inspections.filter(i => i.status === 'approved')
    const activeCertificates = certificates.filter(c => c.status === 'active')
    const successRate = farmers.length > 0 ? Math.round((activeCertificates.length / farmers.length) * 100) : 0

    return {
      farmersTotal: farmers.length,
      inspectionsCompleted: completedInspections.length,
      certificatesIssued: activeCertificates.length,
      successRate
    }
  } catch (error) {
    return {
      farmersTotal: 0,
      inspectionsCompleted: 0,
      certificatesIssued: 0,
      successRate: 0
    }
  }
}

export const generateProfileData = (user: any, previousProfile: ProfileData): ProfileData => {
  if (!user) return previousProfile

  return {
    ...previousProfile,
    name: user.displayName || user.email?.split('@')[0] || "Agronomist User",
    email: user.email || "",
    phone: previousProfile.phone || "+254700000000",
    address: previousProfile.address || "Nairobi, Kenya",
    licenseNumber: previousProfile.licenseNumber || `AGR-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    experience: previousProfile.experience || "Organic farming certification specialist"
  }
}
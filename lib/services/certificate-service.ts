import { Certificate, CertificateUpdateData } from '@/lib/types/certificate'
import { get, put, del, getList } from '@/lib/utils/http'

export const fetchCertificateById = async (id: string): Promise<Certificate | null> => {
  return await get(`/certificates/${id}`)
}

export const updateCertificate = async (id: string, data: CertificateUpdateData): Promise<Certificate | null> => {
  return await put(`/certificates/${id}`, data)
}

export const revokeCertificate = async (id: string): Promise<boolean> => {
  return await del(`/certificates/${id}`)
}

export const fetchAllCertificates = async (): Promise<Certificate[]> => {
  return await getList('/certificates')
}
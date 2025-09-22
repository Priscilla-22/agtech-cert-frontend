import { get, post, put, del, getList } from '@/lib/utils/http'
import { Inspection, InspectionUpdateData, InspectionCreateData } from '@/lib/types/inspection'

export const fetchInspectionById = async (id: string): Promise<Inspection | null> => {
  return await get(`/inspections/${id}`)
}

export const updateInspection = async (id: string, data: InspectionUpdateData): Promise<Inspection | null> => {
  return await put(`/inspections/${id}`, data)
}

export const deleteInspection = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const success = await del(`/inspections/${id}`)
  return { success, message: success ? 'Inspection deleted successfully' : undefined }
}

export const fetchAllInspections = async (): Promise<Inspection[]> => {
  return await getList('/inspections')
}

export const createInspection = async (data: InspectionCreateData): Promise<Inspection | null> => {
  return await post('/inspections', data)
}

export const approveInspection = async (id: string): Promise<{ success: boolean; message?: string; certificateId?: number; error?: string }> => {
  try {
    const response = await fetch(`/api/inspections/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Approval failed' }
    }

    return { success: true, ...data }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}
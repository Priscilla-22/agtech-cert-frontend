import { get, post, put, del, getList } from '@/lib/utils/http'
import { Inspection, InspectionUpdateData, InspectionCreateData } from '@/lib/types/inspection'
import { api } from '@/lib/api-client'

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
    console.log('DEBUG: Calling api.inspections.approve with id:', id)
    const data = await api.inspections.approve(id, {})
    console.log('DEBUG: Approval successful, data:', data)
    return { success: true, ...data }
  } catch (error) {
    console.error('DEBUG: Approval failed with error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}
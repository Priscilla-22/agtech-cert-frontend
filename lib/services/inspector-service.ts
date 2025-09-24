import { get, post, put, del } from '@/lib/utils/http'
import { Inspector, InspectorUpdateData, InspectorCreateData } from '@/lib/types/inspector'

export const fetchInspectorById = async (id: string): Promise<Inspector | null> => {
  return await get(`/inspectors/${id}`)
}

export const updateInspector = async (id: string, data: InspectorUpdateData): Promise<Inspector | null> => {
  return await put(`/inspectors/${id}`, data)
}

export const deleteInspector = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const success = await del(`/inspectors/${id}`)
  return { success, message: success ? 'Inspector deleted successfully' : undefined }
}

export const fetchAllInspectors = async (): Promise<Inspector[]> => {
  const response = await get('/inspectors')
  return response?.data || response || []
}

export const createInspector = async (data: InspectorCreateData): Promise<Inspector | null> => {
  return await post('/inspectors', data)
}
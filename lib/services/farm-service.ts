import { get, post, put, del, getList } from '@/lib/utils/http'
import { Farm, FarmUpdateData, FarmCreateData } from '@/lib/types/farm'

export const fetchFarmById = async (id: string): Promise<Farm | null> => {
  return await get(`/farms/${id}`)
}

export const updateFarm = async (id: string, data: FarmUpdateData): Promise<Farm | null> => {
  return await put(`/farms/${id}`, data)
}

export const deleteFarm = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const success = await del(`/farms/${id}`)
  return { success, message: success ? 'Farm deleted successfully' : undefined }
}

export const fetchAllFarms = async (): Promise<Farm[]> => {
  return await getList('/farms')
}

export const createFarm = async (data: FarmCreateData): Promise<Farm | null> => {
  return await post('/farms', data)
}

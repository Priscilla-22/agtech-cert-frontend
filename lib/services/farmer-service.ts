import { get, post, put, del, getList } from '@/lib/utils/http'
import { Farmer, FarmerUpdateData, FarmerCreateData } from '@/lib/types/farmer'

export const fetchFarmerById = async (id: string): Promise<Farmer | null> => {
  return await get(`/farmers/${id}`)
}

export const updateFarmer = async (id: string, data: FarmerUpdateData): Promise<Farmer | null> => {
  return await put(`/farmers/${id}`, data)
}

export const deleteFarmer = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const success = await del(`/farmers/${id}`)
  return { success, message: success ? 'Farmer deleted successfully' : undefined }
}

export const fetchAllFarmers = async (): Promise<Farmer[]> => {
  const response = await getList('/farmers')
  // Backend returns {data: [...], total: number, ...}, we need just the data array
  return response?.data || response || []
}

export const createFarmer = async (data: FarmerCreateData): Promise<Farmer | null> => {
  return await post('/farmers', data)
}
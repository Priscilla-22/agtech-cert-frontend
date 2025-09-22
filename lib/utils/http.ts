import { API_BASE_URL } from '@/lib/config'

export const get = async (endpoint: string, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      ...options,
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

export const post = async (endpoint: string, data: any, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...options,
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

export const put = async (endpoint: string, data: any, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...options,
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

export const del = async (endpoint: string, options?: RequestInit): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      ...options,
    })
    return response.ok
  } catch {
    return false
  }
}

export const getList = async (endpoint: string, options?: RequestInit): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      cache: 'no-store',
      ...options,
    })
    return response.ok ? await response.json() : []
  } catch {
    return []
  }
}
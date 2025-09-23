import { API_CONFIG } from '@/lib/config'

export const get = async (endpoint: string, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...options,
    })

    if (response.ok) {
      return await response.json()
    } else {
      const errorData = await response.text()
      console.error(`POST ${endpoint} failed:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return { error: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    console.error(`POST ${endpoint} network error:`, error)
    return { error: 'Network error occurred' }
  }
}

export const put = async (endpoint: string, data: any, options?: RequestInit): Promise<any> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      ...options,
    })

    if (response.ok) {
      return await response.json()
    } else {
      const errorData = await response.text()
      console.error(`PUT ${endpoint} failed:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return { error: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    console.error(`PUT ${endpoint} network error:`, error)
    return { error: 'Network error occurred' }
  }
}

export const del = async (endpoint: string, options?: RequestInit): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      cache: 'no-store',
      ...options,
    })
    return response.ok ? await response.json() : []
  } catch {
    return []
  }
}
import { API_CONFIG } from '@/lib/config'
import { auth } from '@/lib/firebase'

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {}

  // Wait for Firebase auth to be ready
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe() // Clean up the listener

      if (user) {
        try {
          const token = await user.getIdToken()
          headers.Authorization = `Bearer ${token}`
        } catch (error) {
          console.error('Error getting Firebase token:', error)
        }
      }

      resolve(headers)
    })
  })
}

export const get = async (endpoint: string, options?: RequestInit): Promise<any> => {
  try {
    const authHeaders = await getAuthHeaders()
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        ...authHeaders,
        ...options?.headers
      },
      ...options,
    })

    if (response.ok) {
      return await response.json()
    } else {
      const errorData = await response.text()
      console.error(`GET ${endpoint} failed:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return { error: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    console.error(`GET ${endpoint} network error:`, error)
    return { error: 'Network error occurred' }
  }
}

export const post = async (endpoint: string, data: any, options?: RequestInit): Promise<any> => {
  try {
    const authHeaders = await getAuthHeaders()
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers
      },
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
    const authHeaders = await getAuthHeaders()
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers
      },
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
    const authHeaders = await getAuthHeaders()
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders,
        ...options?.headers
      },
      ...options,
    })
    return response.ok
  } catch {
    return false
  }
}

export const getList = async (endpoint: string, options?: RequestInit): Promise<any[]> => {
  try {
    const authHeaders = await getAuthHeaders()
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        ...authHeaders,
        ...options?.headers
      },
      cache: 'no-store',
      ...options,
    })
    return response.ok ? await response.json() : []
  } catch {
    return []
  }
}
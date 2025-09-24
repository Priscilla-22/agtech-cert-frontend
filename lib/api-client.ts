import { API_CONFIG, API_ENDPOINTS, HTTP_METHODS } from './config'
import { auth } from './firebase'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  total?: number
  limit?: number
  offset?: number
}

export interface ApiError {
  message: string
  status: number
  statusText: string
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined
}

class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  private buildUrl(endpoint: string, params?: QueryParams): string {
    let url: URL

    if (this.baseUrl.startsWith('http')) {
      const baseUrlWithSlash = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`
      url = new URL(endpoint, baseUrlWithSlash)
    } else {
      const fullUrl = this.baseUrl + endpoint
      url = new URL(fullUrl, window.location.origin)
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {}

    // Wait for Firebase auth to be ready
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        unsubscribe() // Clean up the listener

        if (user) {
          try {
            const token = await user.getIdToken(true) // Force refresh
            headers.Authorization = `Bearer ${token}`
            console.log('DEBUG: Got Firebase token, user:', user.email)
          } catch (error) {
            console.error('Error getting Firebase token:', error)
          }
        } else {
          console.log('DEBUG: No user logged in')
        }

        resolve(headers)
      })
    })
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    params?: QueryParams
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params)
    const authHeaders = await this.getAuthHeaders()

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    config.signal = controller.signal

    try {
      console.log('DEBUG API: Making request to:', url)
      console.log('DEBUG API: Request headers:', config.headers)
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      console.log('DEBUG API: Response status:', response.status)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // Use default error message
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
          statusText: response.statusText,
        }
        
        throw error
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      throw error
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request(API_ENDPOINTS.HEALTH)
  }

  farmers = {
    getAll: (params?: {
      search?: string
      status?: string
      certificationStatus?: string
      county?: string
      subCounty?: string
      farmingType?: string
      organicExperience?: string
      educationLevel?: string
      minLandSize?: number
      maxLandSize?: number
      registrationDateFrom?: string
      registrationDateTo?: string
      limit?: number
      offset?: number
    }) => {
      return this.request<ApiResponse<any[]>>(API_ENDPOINTS.FARMERS.LIST, { method: HTTP_METHODS.GET }, params)
    },

    getById: (id: string) => {
      return this.request(API_ENDPOINTS.FARMERS.DETAIL(id), { method: HTTP_METHODS.GET })
    },

    create: (data: any) => {
      return this.request(API_ENDPOINTS.FARMERS.CREATE, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      })
    },

    update: (id: string, data: any) => {
      return this.request(API_ENDPOINTS.FARMERS.UPDATE(id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(data),
      })
    },

    delete: (id: string) => {
      return this.request(API_ENDPOINTS.FARMERS.DELETE(id), { method: HTTP_METHODS.DELETE })
    },
  }

  farms = {
    getAll: () => {
      return this.request<ApiResponse<any[]>>(API_ENDPOINTS.FARMS.LIST, { method: HTTP_METHODS.GET })
    },

    getById: (id: string) => {
      return this.request(API_ENDPOINTS.FARMS.DETAIL(id), { method: HTTP_METHODS.GET })
    },

    getByFarmerId: (farmerId: string) => {
      return this.request(API_ENDPOINTS.FARMS.BY_FARMER(farmerId), { method: HTTP_METHODS.GET })
    },

    create: (data: any) => {
      return this.request(API_ENDPOINTS.FARMS.CREATE, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      })
    },

    update: (id: string, data: any) => {
      return this.request(API_ENDPOINTS.FARMS.UPDATE(id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(data),
      })
    },

    delete: (id: string) => {
      return this.request(API_ENDPOINTS.FARMS.DELETE(id), { method: HTTP_METHODS.DELETE })
    },
  }

  fields = {
    getAll: (params?: { farmId?: string }) => {
      return this.request<ApiResponse<any[]>>(API_ENDPOINTS.FIELDS.LIST, { method: HTTP_METHODS.GET }, params)
    },

    getById: (id: string) => {
      return this.request(API_ENDPOINTS.FIELDS.DETAIL(id), { method: HTTP_METHODS.GET })
    },

    getByFarmId: (farmId: string) => {
      return this.request(API_ENDPOINTS.FIELDS.BY_FARM(farmId), { method: HTTP_METHODS.GET })
    },

    create: (data: any) => {
      return this.request(API_ENDPOINTS.FIELDS.CREATE, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      })
    },

    update: (id: string, data: any) => {
      return this.request(API_ENDPOINTS.FIELDS.UPDATE(id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(data),
      })
    },

    delete: (id: string) => {
      return this.request(API_ENDPOINTS.FIELDS.DELETE(id), { method: HTTP_METHODS.DELETE })
    },
  }

  inspections = {
    getAll: () => {
      return this.request<ApiResponse<any[]>>(API_ENDPOINTS.INSPECTIONS.LIST, { method: HTTP_METHODS.GET })
    },

    getById: (id: string) => {
      return this.request(API_ENDPOINTS.INSPECTIONS.DETAIL(id), { method: HTTP_METHODS.GET })
    },

    getChecklist: () => {
      return this.request(API_ENDPOINTS.INSPECTIONS.CHECKLIST, { method: HTTP_METHODS.GET })
    },

    create: (data: any) => {
      return this.request(API_ENDPOINTS.INSPECTIONS.CREATE, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      })
    },

    update: (id: string, data: any) => {
      return this.request(API_ENDPOINTS.INSPECTIONS.UPDATE(id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(data),
      })
    },

    approve: (id: string, data: any) => {
      return this.request(API_ENDPOINTS.INSPECTIONS.APPROVE(id), {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      })
    },

    reject: (id: string, data: { reason: string }) => {
      return this.request(API_ENDPOINTS.INSPECTIONS.REJECT(id), {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      })
    },

    delete: (id: string) => {
      return this.request(API_ENDPOINTS.INSPECTIONS.DELETE(id), { method: HTTP_METHODS.DELETE })
    },
  }

  certificates = {
    getAll: () => {
      return this.request<ApiResponse<any[]>>(API_ENDPOINTS.CERTIFICATES.LIST, { method: HTTP_METHODS.GET })
    },

    getById: (id: string) => {
      return this.request(API_ENDPOINTS.CERTIFICATES.DETAIL(id), { method: HTTP_METHODS.GET })
    },

    create: (data: any) => {
      return this.request(API_ENDPOINTS.CERTIFICATES.CREATE, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      })
    },

    update: (id: string, data: any) => {
      return this.request(API_ENDPOINTS.CERTIFICATES.UPDATE(id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(data),
      })
    },

    delete: (id: string) => {
      return this.request(API_ENDPOINTS.CERTIFICATES.DELETE(id), { method: HTTP_METHODS.DELETE })
    },

    downloadPDF: async (id: string): Promise<Blob> => {
      const url = this.buildUrl(API_ENDPOINTS.CERTIFICATES.PDF(id))
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to download certificate PDF')
      }
      
      return response.blob()
    },
  }

  dashboard = {
    getStats: () => {
      return this.request(API_ENDPOINTS.DASHBOARD.STATS, { method: HTTP_METHODS.GET })
    },
  }
}

export const api = new ApiClient()
export { ApiClient }
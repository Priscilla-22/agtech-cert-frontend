const isClient = typeof window !== 'undefined'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agtech-cert-backend.onrender.com/api'

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
} as const

export const API_ENDPOINTS = {
  HEALTH: 'health',

  FARMERS: {
    LIST: 'farmers',
    DETAIL: (id: string) => `farmers/${id}`,
    CREATE: 'farmers',
    UPDATE: (id: string) => `farmers/${id}`,
    DELETE: (id: string) => `farmers/${id}`,
  },
  
  FARMS: {
    LIST: 'farms',
    DETAIL: (id: string) => `farms/${id}`,
    CREATE: 'farms',
    UPDATE: (id: string) => `farms/${id}`,
    DELETE: (id: string) => `farms/${id}`,
    BY_FARMER: (farmerId: string) => `farms/farmer/${farmerId}`,
  },

  FIELDS: {
    LIST: 'fields',
    DETAIL: (id: string) => `fields/${id}`,
    CREATE: 'fields',
    UPDATE: (id: string) => `fields/${id}`,
    DELETE: (id: string) => `fields/${id}`,
    BY_FARM: (farmId: string) => `fields?farmId=${farmId}`,
  },

  INSPECTIONS: {
    LIST: 'inspections',
    DETAIL: (id: string) => `inspections/${id}`,
    CREATE: 'inspections',
    UPDATE: (id: string) => `inspections/${id}`,
    DELETE: (id: string) => `inspections/${id}`,
    APPROVE: (id: string) => `inspections/${id}/approve`,
    REJECT: (id: string) => `inspections/${id}/reject`,
    CHECKLIST: 'inspections/checklist',
    STATUS_DISTRIBUTION: 'inspections/status-distribution',
    HISTORY: (id: string) => `inspections/${id}/history`,
  },

  CERTIFICATES: {
    LIST: 'certificates',
    DETAIL: (id: string) => `certificates/${id}`,
    CREATE: 'certificates',
    UPDATE: (id: string) => `certificates/${id}`,
    DELETE: (id: string) => `certificates/${id}`,
    PDF: (id: string) => `certificates/${id}/pdf`,
    RENEW: (id: string) => `certificates/${id}/renew`,
  },

  DASHBOARD: {
    STATS: 'dashboard/stats',
  },
} as const

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const
// API Configuration
const isClient = typeof window !== 'undefined'

export const API_CONFIG = {
  BASE_URL: isClient 
    ? '/api/' // Client-side: use Next.js API routes
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/', // Server-side: use backend directly
  TIMEOUT: 30000, // 30 seconds
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  HEALTH: 'health',
  
  // Farmers
  FARMERS: {
    LIST: 'farmers',
    DETAIL: (id: string) => `farmers/${id}`,
    CREATE: 'farmers',
    UPDATE: (id: string) => `farmers/${id}`,
    DELETE: (id: string) => `farmers/${id}`,
  },
  
  // Farms
  FARMS: {
    LIST: 'farms',
    DETAIL: (id: string) => `farms/${id}`,
    CREATE: 'farms',
    UPDATE: (id: string) => `farms/${id}`,
    DELETE: (id: string) => `farms/${id}`,
    BY_FARMER: (farmerId: string) => `farms?farmerId=${farmerId}`,
  },
  
  // Fields
  FIELDS: {
    LIST: 'fields',
    DETAIL: (id: string) => `fields/${id}`,
    CREATE: 'fields',
    UPDATE: (id: string) => `fields/${id}`,
    DELETE: (id: string) => `fields/${id}`,
    BY_FARM: (farmId: string) => `fields?farmId=${farmId}`,
  },
  
  // Inspections
  INSPECTIONS: {
    LIST: 'inspections',
    DETAIL: (id: string) => `inspections/${id}`,
    CREATE: 'inspections',
    UPDATE: (id: string) => `inspections/${id}`,
    DELETE: (id: string) => `inspections/${id}`,
    APPROVE: (id: string) => `inspections/${id}/approve`,
    REJECT: (id: string) => `inspections/${id}/reject`,
    CHECKLIST: 'inspections/checklist',
  },
  
  // Certificates
  CERTIFICATES: {
    LIST: 'certificates',
    DETAIL: (id: string) => `certificates/${id}`,
    CREATE: 'certificates',
    UPDATE: (id: string) => `certificates/${id}`,
    DELETE: (id: string) => `certificates/${id}`,
    PDF: (id: string) => `certificates/${id}/pdf`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: 'dashboard/stats',
  },
} as const

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const
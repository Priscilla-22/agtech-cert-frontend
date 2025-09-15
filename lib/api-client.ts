const API_BASE_URL = "/api"

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getFarmers() {
    return this.request("/farmers")
  }

  async getFarmer(id: string) {
    return this.request(`/farmers/${id}`)
  }

  async createFarmer(data: any) {
    return this.request("/farmers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateFarmer(id: string, data: any) {
    return this.request(`/farmers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteFarmer(id: string) {
    return this.request(`/farmers/${id}`, {
      method: "DELETE",
    })
  }

  async getInspections() {
    return this.request("/inspections")
  }

  async getInspection(id: string) {
    return this.request(`/inspections/${id}`)
  }

  async createInspection(data: any) {
    return this.request("/inspections", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateInspection(id: string, data: any) {
    return this.request(`/inspections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async getCertificates() {
    return this.request("/certificates")
  }

  async getCertificate(id: string) {
    return this.request(`/certificates/${id}`)
  }

  async createCertificate(data: any) {
    return this.request("/certificates", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCertificate(id: string, data: any) {
    return this.request(`/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async revokeCertificate(id: string) {
    return this.request(`/certificates/${id}`, {
      method: "DELETE",
    })
  }

  async getDashboardStats() {
    return this.request("/dashboard/stats")
  }

  async downloadCertificatePDF(id: string) {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}/pdf`)
    if (!response.ok) {
      throw new Error("Failed to download certificate")
    }
    return response.blob()
  }
}

export const apiClient = new ApiClient()

// Mock data for development and testing

export const mockFarmers = [
  {
    id: 1,
    name: "John Farmer",
    email: "john@example.com",
    phone: "+254712345678",
    county: "Nakuru",
    subCounty: "Njoro",
    ward: "Lare",
    village: "Kampi ya Moto",
    farmingType: "Organic",
    totalLandSize: 5,
    primaryCrops: ["Maize", "Beans"],
    organicExperience: "3 years",
    educationLevel: "Secondary",
    certificationStatus: "active",
    status: "active",
    registrationDate: "2024-01-15T00:00:00.000Z"
  }
]

export const mockCertificates = [
  {
    id: 1,
    farmerId: 1,
    certificateNumber: "CERT-2024-001",
    status: "active",
    issuedDate: "2024-01-15T00:00:00.000Z",
    expiryDate: "2025-01-15T00:00:00.000Z",
    certificationBody: "PESIRA",
    certificationType: "Organic"
  }
]

export const mockInspections = [
  {
    id: 1,
    farmerId: 1,
    inspectorId: 1,
    scheduledDate: "2024-02-01T00:00:00.000Z",
    status: "completed",
    type: "annual",
    findings: "Farm meets organic standards",
    recommendations: "Continue current practices"
  }
]
import { type NextRequest, NextResponse } from "next/server"
import { mockCertificates, mockFarms, mockFarmers } from "@/lib/mock-data"
import type { Certificate } from "@/lib/types"

export async function GET() {
  try {
    return NextResponse.json(mockCertificates)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const farm = mockFarms.find((f) => f.id === body.farmId)
    const farmer = farm ? mockFarmers.find((f) => f.id === farm.farmerId) : null

    if (!farm || !farmer) {
      return NextResponse.json({ error: "Farm or farmer not found" }, { status: 404 })
    }

    const generateCertificateNumber = () => {
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      return `ORG-${year}-${random}`
    }

    const newCertificate: Certificate = {
      id: (mockCertificates.length + 1).toString(),
      farmId: body.farmId,
      farmerName: farmer.name,
      farmName: farm.name,
      issueDate: body.issueDate,
      expiryDate: body.expiryDate,
      status: "active",
      certificateNumber: generateCertificateNumber(),
      cropTypes: body.cropTypes,
    }

    mockCertificates.push(newCertificate)

    return NextResponse.json(newCertificate, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 })
  }
}

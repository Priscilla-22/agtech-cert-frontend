import { type NextRequest, NextResponse } from "next/server"
import { mockCertificates } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const certificate = mockCertificates.find((c) => c.id === params.id)

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificate" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const certificateIndex = mockCertificates.findIndex((c) => c.id === params.id)

    if (certificateIndex === -1) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    mockCertificates[certificateIndex] = {
      ...mockCertificates[certificateIndex],
      ...body,
    }

    return NextResponse.json(mockCertificates[certificateIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const certificateIndex = mockCertificates.findIndex((c) => c.id === params.id)

    if (certificateIndex === -1) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    mockCertificates[certificateIndex].status = "revoked"

    return NextResponse.json({ message: "Certificate revoked successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to revoke certificate" }, { status: 500 })
  }
}

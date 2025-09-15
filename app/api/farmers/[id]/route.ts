import { type NextRequest, NextResponse } from "next/server"
import { mockFarmers } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const farmer = mockFarmers.find((f) => f.id === params.id)

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    return NextResponse.json(farmer)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch farmer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const farmerIndex = mockFarmers.findIndex((f) => f.id === params.id)

    if (farmerIndex === -1) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    mockFarmers[farmerIndex] = {
      ...mockFarmers[farmerIndex],
      ...body,
    }

    return NextResponse.json(mockFarmers[farmerIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update farmer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const farmerIndex = mockFarmers.findIndex((f) => f.id === params.id)

    if (farmerIndex === -1) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    mockFarmers.splice(farmerIndex, 1)

    return NextResponse.json({ message: "Farmer deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete farmer" }, { status: 500 })
  }
}

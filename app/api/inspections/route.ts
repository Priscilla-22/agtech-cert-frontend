import { type NextRequest, NextResponse } from "next/server"
import { mockInspections, mockFarms, mockFarmers } from "@/lib/mock-data"
import type { Inspection } from "@/lib/types"

export async function GET() {
  try {
    return NextResponse.json(mockInspections)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 })
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

    const newInspection: Inspection = {
      id: (mockInspections.length + 1).toString(),
      farmId: body.farmId,
      farmerName: farmer.name,
      farmName: farm.name,
      inspectorName: body.inspectorName,
      scheduledDate: body.scheduledDate,
      status: "pending",
      notes: body.notes,
    }

    mockInspections.push(newInspection)

    return NextResponse.json(newInspection, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inspection" }, { status: 500 })
  }
}

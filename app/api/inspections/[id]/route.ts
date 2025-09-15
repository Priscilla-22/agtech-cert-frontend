import { type NextRequest, NextResponse } from "next/server"
import { mockInspections } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const inspection = mockInspections.find((i) => i.id === params.id)

    if (!inspection) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
    }

    return NextResponse.json(inspection)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inspection" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const inspectionIndex = mockInspections.findIndex((i) => i.id === params.id)

    if (inspectionIndex === -1) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
    }

    const updatedInspection = {
      ...mockInspections[inspectionIndex],
      ...body,
      completedDate: body.status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
    }

    mockInspections[inspectionIndex] = updatedInspection

    return NextResponse.json(updatedInspection)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inspection" }, { status: 500 })
  }
}

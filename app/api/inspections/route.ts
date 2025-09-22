import { NextRequest, NextResponse } from "next/server"
import { fetchAllInspections, createInspection } from "@/lib/services/inspection-service"

export async function GET() {
  try {
    const inspections = await fetchAllInspections()
    return NextResponse.json(inspections)
  } catch {
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const inspection = await createInspection(body)

    if (!inspection) {
      return NextResponse.json({ error: "Failed to create inspection" }, { status: 400 })
    }

    return NextResponse.json(inspection, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create inspection" }, { status: 500 })
  }
}

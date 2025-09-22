import { NextRequest, NextResponse } from "next/server"
import { fetchInspectionById, updateInspection, deleteInspection } from "@/lib/services/inspection-service"

interface Params {
  id: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const inspection = await fetchInspectionById(params.id)

    if (!inspection) {
      return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
    }

    return NextResponse.json(inspection)
  } catch {
    return NextResponse.json({ error: "Failed to fetch inspection" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json()
    const inspection = await updateInspection(params.id, body)

    if (!inspection) {
      return NextResponse.json({ error: "Failed to update inspection" }, { status: 400 })
    }

    return NextResponse.json(inspection)
  } catch {
    return NextResponse.json({ error: "Failed to update inspection" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const result = await deleteInspection(params.id)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to delete inspection" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Failed to delete inspection" }, { status: 500 })
  }
}

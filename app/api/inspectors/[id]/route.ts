import { NextRequest, NextResponse } from "next/server"
import { fetchInspectorById, updateInspector, deleteInspector } from "@/lib/services/inspector-service"

interface Params {
  id: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const inspector = await fetchInspectorById(params.id)

    if (!inspector) {
      return NextResponse.json({ error: "Inspector not found" }, { status: 404 })
    }

    return NextResponse.json(inspector)
  } catch {
    return NextResponse.json({ error: "Failed to fetch inspector" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json()
    const inspector = await updateInspector(params.id, body)

    if (!inspector) {
      return NextResponse.json({ error: "Failed to update inspector" }, { status: 400 })
    }

    return NextResponse.json(inspector)
  } catch {
    return NextResponse.json({ error: "Failed to update inspector" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const result = await deleteInspector(params.id)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to delete inspector" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Failed to delete inspector" }, { status: 500 })
  }
}
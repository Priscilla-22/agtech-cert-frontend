import { NextRequest, NextResponse } from "next/server"
import { fetchFarmById, updateFarm, deleteFarm } from "@/lib/services/farm-service"

interface Params {
  id: string
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const farm = await fetchFarmById(params.id)

    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    return NextResponse.json(farm)
  } catch {
    return NextResponse.json({ error: "Failed to fetch farm" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json()
    const farm = await updateFarm(params.id, body)

    if (!farm) {
      return NextResponse.json({ error: "Failed to update farm" }, { status: 400 })
    }

    return NextResponse.json(farm)
  } catch {
    return NextResponse.json({ error: "Failed to update farm" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const result = await deleteFarm(params.id)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to delete farm" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Failed to delete farm" }, { status: 500 })
  }
}
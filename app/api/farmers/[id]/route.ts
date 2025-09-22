import { NextRequest, NextResponse } from "next/server"
import { fetchFarmerById, updateFarmer, deleteFarmer } from "@/lib/services/farmer-service"
import { FarmerUpdateData } from "@/lib/types/farmer"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const farmer = await fetchFarmerById(params.id)

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    return NextResponse.json(farmer)
  } catch {
    return NextResponse.json({ error: "Failed to fetch farmer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: FarmerUpdateData = await request.json()
    const farmer = await updateFarmer(params.id, body)

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    return NextResponse.json(farmer)
  } catch {
    return NextResponse.json({ error: "Failed to update farmer" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteFarmer(params.id)

    if (!result.success) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    return NextResponse.json({ message: result.message || "Farmer deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Failed to delete farmer" }, { status: 500 })
  }
}
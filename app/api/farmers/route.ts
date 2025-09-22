import { NextRequest, NextResponse } from "next/server"
import { fetchAllFarmers, createFarmer } from "@/lib/services/farmer-service"
import { FarmerCreateData } from "@/lib/types/farmer"

export async function GET() {
  try {
    const farmers = await fetchAllFarmers()
    return NextResponse.json(farmers)
  } catch {
    return NextResponse.json({ error: "Failed to fetch farmers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FarmerCreateData = await request.json()
    const farmer = await createFarmer(body)

    if (!farmer) {
      return NextResponse.json({ error: "Failed to create farmer" }, { status: 400 })
    }

    return NextResponse.json(farmer, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create farmer" }, { status: 500 })
  }
}
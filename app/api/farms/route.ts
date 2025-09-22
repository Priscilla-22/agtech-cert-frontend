import { NextRequest, NextResponse } from "next/server"
import { fetchAllFarmsWithParams, createFarm } from "@/lib/services/farm-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = {
      farmerId: searchParams.get('farmerId'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const farms = await fetchAllFarmsWithParams(params)
    return NextResponse.json(farms)
  } catch {
    return NextResponse.json({ error: "Failed to fetch farms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const farm = await createFarm(body)

    if (!farm) {
      return NextResponse.json({ error: "Failed to create farm" }, { status: 400 })
    }

    return NextResponse.json(farm, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create farm" }, { status: 500 })
  }
}
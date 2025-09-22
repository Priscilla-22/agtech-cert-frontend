import { NextRequest, NextResponse } from "next/server"
import { fetchAllInspectors, createInspector } from "@/lib/services/inspector-service"

export async function GET() {
  try {
    const inspectors = await fetchAllInspectors()
    return NextResponse.json(inspectors)
  } catch {
    return NextResponse.json({ error: "Failed to fetch inspectors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const inspector = await createInspector(body)

    if (!inspector) {
      return NextResponse.json({ error: "Failed to create inspector" }, { status: 400 })
    }

    return NextResponse.json(inspector, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create inspector" }, { status: 500 })
  }
}
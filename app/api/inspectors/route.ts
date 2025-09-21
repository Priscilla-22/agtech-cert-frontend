import { type NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = "http://localhost:3002/api"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/inspectors`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`)
    }

    const inspectors = await response.json()
    return NextResponse.json(inspectors)
  } catch (error) {
    console.error("Inspectors API error:", error)
    return NextResponse.json({ error: "Failed to fetch inspectors from backend" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_BASE_URL}/inspectors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`)
    }

    const newInspector = await response.json()
    return NextResponse.json(newInspector, { status: 201 })
  } catch (error) {
    console.error("Create inspector API error:", error)
    return NextResponse.json({ error: "Failed to create inspector" }, { status: 500 })
  }
}
import { type NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = "http://localhost:3002/api"

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/farmers`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`)
    }

    const farmers = await response.json()
    return NextResponse.json(farmers)
  } catch (error) {
    console.error("Farmers API error:", error)
    return NextResponse.json({ error: "Failed to fetch farmers from backend" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_BASE_URL}/farmers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`)
    }

    const newFarmer = await response.json()
    return NextResponse.json(newFarmer, { status: 201 })
  } catch (error) {
    console.error("Create farmer API error:", error)
    return NextResponse.json({ error: "Failed to create farmer" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/inspections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const inspections = await response.json()
    return NextResponse.json(inspections)
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/inspections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const newInspection = await response.json()
    return NextResponse.json(newInspection, { status: 201 })
  } catch (error) {
    console.error('Error creating inspection:', error)
    return NextResponse.json({ error: "Failed to create inspection" }, { status: 500 })
  }
}

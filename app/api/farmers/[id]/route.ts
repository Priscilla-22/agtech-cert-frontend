import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/farmers/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
      }
      throw new Error(`Backend responded with ${response.status}`)
    }

    const farmer = await response.json()
    return NextResponse.json(farmer)
  } catch (error) {
    console.error('Error fetching farmer:', error)
    return NextResponse.json({ error: "Failed to fetch farmer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/farmers/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
      }
      throw new Error(`Backend responded with ${response.status}`)
    }

    const updatedFarmer = await response.json()
    return NextResponse.json(updatedFarmer)
  } catch (error) {
    console.error('Error updating farmer:', error)
    return NextResponse.json({ error: "Failed to update farmer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/farmers/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
      }
      throw new Error(`Backend responded with ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting farmer:', error)
    return NextResponse.json({ error: "Failed to delete farmer" }, { status: 500 })
  }
}

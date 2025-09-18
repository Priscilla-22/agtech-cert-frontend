import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/inspections/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
      }
      throw new Error(`Backend responded with ${response.status}`)
    }

    const inspection = await response.json()
    return NextResponse.json(inspection)
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return NextResponse.json({ error: "Failed to fetch inspection" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/inspections/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
      }
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const updatedInspection = await response.json()
    return NextResponse.json(updatedInspection)
  } catch (error) {
    console.error('Error updating inspection:', error)
    return NextResponse.json({ error: "Failed to update inspection" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/inspections/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Inspection not found" }, { status: 404 })
      }
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting inspection:', error)
    return NextResponse.json({ error: "Failed to delete inspection" }, { status: 500 })
  }
}

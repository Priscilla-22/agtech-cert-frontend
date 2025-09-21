import { type NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = "http://localhost:3002/api"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/inspectors/${params.id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Inspector not found" }, { status: 404 })
      }
      throw new Error(`Backend request failed with status ${response.status}`)
    }

    const inspector = await response.json()
    return NextResponse.json(inspector)
  } catch (error) {
    console.error("Inspector API error:", error)
    return NextResponse.json({ error: "Failed to fetch inspector from backend" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_BASE_URL}/inspectors/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Inspector not found" }, { status: 404 })
      }
      throw new Error(`Backend request failed with status ${response.status}`)
    }

    const updatedInspector = await response.json()
    return NextResponse.json(updatedInspector)
  } catch (error) {
    console.error("Update inspector API error:", error)
    return NextResponse.json({ error: "Failed to update inspector" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/inspectors/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Inspector not found" }, { status: 404 })
      }
      throw new Error(`Backend request failed with status ${response.status}`)
    }

    return NextResponse.json({ message: "Inspector deleted successfully" })
  } catch (error) {
    console.error("Delete inspector API error:", error)
    return NextResponse.json({ error: "Failed to delete inspector" }, { status: 500 })
  }
}
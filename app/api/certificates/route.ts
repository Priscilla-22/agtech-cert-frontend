import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/certificates`)
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }
    const certificates = await response.json()
    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const certificate = await response.json()
    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 })
  }
}

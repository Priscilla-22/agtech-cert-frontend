import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { farmerId: string } }
) {
  try {
    const { farmerId } = params

    if (!farmerId) {
      return NextResponse.json({ error: "Farmer ID is required" }, { status: 400 })
    }

    // Make request to backend API
    const response = await fetch(`${API_BASE_URL}/farms/farmer/${farmerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Ensure we get fresh data
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
      }
      throw new Error(`Backend API error: ${response.status}`)
    }

    const farms = await response.json()
    return NextResponse.json(farms)
  } catch (error) {
    console.error('Error fetching farms by farmer ID:', error)
    return NextResponse.json({ error: "Failed to fetch farms" }, { status: 500 })
  }
}
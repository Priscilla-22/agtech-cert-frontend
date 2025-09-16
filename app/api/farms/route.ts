import { NextRequest, NextResponse } from 'next/server'
import { api as backendApi } from '@/lib/backend-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const farmerId = searchParams.get('farmerId')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Build query parameters
    const params = new URLSearchParams()
    if (farmerId) params.append('farmerId', farmerId)
    if (search) params.append('search', search)
    if (limit) params.append('limit', limit)
    if (offset) params.append('offset', offset)

    const queryString = params.toString()
    const url = `http://localhost:3002/api/farms${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch farms' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Farms API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch('http://localhost:3002/api/farms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Failed to create farm' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Farm creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
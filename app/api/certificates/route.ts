import { NextRequest, NextResponse } from "next/server"
import { getList, post } from "@/lib/utils/http"

export async function GET() {
  try {
    const certificates = await getList('/certificates')
    return NextResponse.json(certificates)
  } catch {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const certificate = await post('/certificates', body)

    if (!certificate) {
      return NextResponse.json({ error: "Failed to create certificate" }, { status: 400 })
    }

    return NextResponse.json(certificate, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 })
  }
}

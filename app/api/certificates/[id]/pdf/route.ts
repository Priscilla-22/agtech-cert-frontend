import { type NextRequest, NextResponse } from "next/server"
import { API_CONFIG } from "@/lib/config"
import { auth } from "@/lib/firebase"

const getAuthHeaders = async (request: NextRequest): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {}

  // Try to get auth header from the request
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    headers.Authorization = authHeader
  }

  return headers
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get authentication headers
    const authHeaders = await getAuthHeaders(request)

    // Proxy to backend PDF endpoint to use PDFService
    const backendUrl = `${API_CONFIG.BASE_URL}/certificates/${params.id}/pdf`
    const response = await fetch(backendUrl, {
      headers: {
        ...authHeaders
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
      }
      throw new Error(`Backend returned ${response.status}`)
    }

    const pdfBuffer = await response.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${params.id}.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('PDF proxy error:', error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}


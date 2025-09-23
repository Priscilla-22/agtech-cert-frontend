import { type NextRequest, NextResponse } from "next/server"
import { API_CONFIG } from "@/lib/config"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Proxy to backend PDF endpoint to use PDFService
    const backendUrl = `${API_CONFIG.BASE_URL}/certificates/${params.id}/pdf`
    const response = await fetch(backendUrl)

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


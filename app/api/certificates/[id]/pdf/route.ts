import { type NextRequest, NextResponse } from "next/server"
import { fetchCertificateById } from "@/lib/services/certificate-service"
import { generateCertificateHTML } from "@/lib/services/certificate-template"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const certificate = await fetchCertificateById(params.id)

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    const htmlContent = generateCertificateHTML(certificate)

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="certificate-${certificate.certificateNumber}.html"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { mockCertificates } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const certificate = mockCertificates.find((c) => c.id === params.id)

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    const pdfContent = generatePDFContent(certificate)

    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generatePDFContent(certificate: any) {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 500
>>
stream
BT
/F1 24 Tf
50 750 Td
(ORGANIC CERTIFICATION) Tj
0 -50 Td
/F1 16 Tf
(Certificate Number: ${certificate.certificateNumber}) Tj
0 -30 Td
(Farmer: ${certificate.farmerName}) Tj
0 -30 Td
(Farm: ${certificate.farmName}) Tj
0 -30 Td
(Issue Date: ${certificate.issueDate}) Tj
0 -30 Td
(Expiry Date: ${certificate.expiryDate}) Tj
0 -30 Td
(Crops: ${certificate.cropTypes.join(", ")}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000826 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
901
%%EOF`
}

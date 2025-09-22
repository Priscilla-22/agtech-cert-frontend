import { type NextRequest, NextResponse } from "next/server"
import { fetchCertificateById, updateCertificate, revokeCertificate } from "@/lib/services/certificate-service"
import { CertificateUpdateData } from "@/lib/types/certificate"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const certificate = await fetchCertificateById(params.id)

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificate" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: CertificateUpdateData = await request.json()
    const certificate = await updateCertificate(params.id, body)

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await revokeCertificate(params.id)

    if (!success) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Certificate revoked successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to revoke certificate" }, { status: 500 })
  }
}

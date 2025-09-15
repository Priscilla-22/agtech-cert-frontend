import { NextResponse } from "next/server"

const BACKEND_BASE_URL = "http://localhost:3002/api"

export async function GET() {
  try {
    // Fetch data from backend APIs
    const [farmersRes, inspectionsRes, certificatesRes] = await Promise.all([
      fetch(`${BACKEND_BASE_URL}/farmers`, { cache: 'no-store' }),
      fetch(`${BACKEND_BASE_URL}/inspections`, { cache: 'no-store' }),
      fetch(`${BACKEND_BASE_URL}/certificates`, { cache: 'no-store' })
    ])

    if (!farmersRes.ok) {
      throw new Error(`Failed to fetch farmers: ${farmersRes.status}`)
    }
    if (!inspectionsRes.ok) {
      throw new Error(`Failed to fetch inspections: ${inspectionsRes.status}`)
    }
    if (!certificatesRes.ok) {
      throw new Error(`Failed to fetch certificates: ${certificatesRes.status}`)
    }

    const farmers = await farmersRes.json()
    const inspections = await inspectionsRes.json()
    const certificates = await certificatesRes.json()

    // Calculate stats from real data
    const totalFarmers = farmers.length
    const activeFarmers = farmers.filter((f: any) => f.status === "active").length
    const pendingInspections = inspections.filter((i: any) => i.status === "pending").length
    const completedInspections = inspections.filter((i: any) => i.status === "completed").length
    const activeCertificates = certificates.filter((c: any) => c.status === "active").length
    const expiredCertificates = certificates.filter((c: any) => c.status === "expired").length
    const pendingCertifications = farmers.filter((f: any) => f.certificationStatus === "pending").length

    const expiringSoon = certificates.filter((c: any) => {
      const expiryDate = new Date(c.expiryDate)
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      return c.status === "active" && expiryDate <= thirtyDaysFromNow
    }).length

    const averageInspectionScore = completedInspections.length > 0
      ? Math.round(
          completedInspections.reduce((acc: number, i: any) => acc + (i.score || 0), 0) /
          completedInspections.length
        )
      : 0

    const stats = {
      farmers: {
        total: totalFarmers,
        active: activeFarmers,
        inactive: totalFarmers - activeFarmers,
        pendingCertification: pendingCertifications,
      },
      inspections: {
        total: inspections.length,
        pending: pendingInspections,
        completed: completedInspections,
        failed: inspections.filter((i: any) => i.status === "failed").length,
        averageScore: averageInspectionScore,
      },
      certificates: {
        total: certificates.length,
        active: activeCertificates,
        expired: expiredCertificates,
        revoked: certificates.filter((c: any) => c.status === "revoked").length,
        expiringSoon: expiringSoon,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats from backend" },
      { status: 500 }
    )
  }
}

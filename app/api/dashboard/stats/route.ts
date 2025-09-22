import { NextResponse } from "next/server"
import { generateDashboardStats } from "@/lib/services/dashboard-service"

export async function GET() {
  try {
    const stats = await generateDashboardStats()
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
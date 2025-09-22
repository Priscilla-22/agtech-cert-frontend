"use client"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  ClipboardCheck,
  Award,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Filter,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Footer } from "@/components/layout/footer"
import { generateDashboardStats } from "@/lib/services/dashboard-service"
import { fetchAllFarmers } from "@/lib/services/farmer-service"
import { fetchAllInspections } from "@/lib/services/inspection-service"
import { fetchAllCertificates } from "@/lib/services/certificate-service"
import {
  SimpleDashboardStats,
  MonthlyData,
  CertificationData,
  ActivityItem,
  DateRange,
  DashboardFilters,
  StatItem,
  DashboardInspection,
  DashboardCertificate
} from "@/lib/types/dashboard"
import { Farmer } from "@/lib/types/farmer"
import { EnhancedChart } from "@/components/ui/enhanced-chart"
import { MaterialChart } from "@/components/ui/material-chart"
import { useEffect, useState } from "react"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { DashboardFiltersComponent } from "@/components/dashboard/dashboard-filters"

function DashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [dashboardStats, setDashboardStats] = useState<SimpleDashboardStats | null>(null)
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [inspections, setInspections] = useState<DashboardInspection[]>([])
  const [certificates, setCertificates] = useState<DashboardCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Global filter state
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchFilter, setSearchFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // filters
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>({
    dateRange: { from: undefined, to: undefined },
    statusFilter: "all",
    searchFilter: "",
    typeFilter: "all"
  })

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)

        const [farmersData, inspectionsData, certificatesData, stats] = await Promise.all([
          fetchAllFarmers(),
          fetchAllInspections(),
          fetchAllCertificates(),
          generateDashboardStats()
        ])

        setFarmers(farmersData || [])
        setInspections((inspectionsData || []).map((inspection: any) => ({
          id: inspection.id,
          status: inspection.status || 'pending',
          scheduledDate: inspection.scheduledDate,
          createdAt: inspection.createdAt,
          updatedAt: inspection.updatedAt,
          farmerName: inspection.farmerName
        })))
        setCertificates((certificatesData || []).map((cert: any) => ({
          id: cert.id,
          status: cert.status || 'active',
          issueDate: cert.issueDate,
          createdAt: cert.createdAt,
          farmerName: cert.farmerName,
          certificationType: cert.certificationType
        })))

        if (stats && typeof stats === 'object' && 'totalFarmers' in stats) {
          setDashboardStats(stats as SimpleDashboardStats)
        } else {
          setDashboardStats({
            totalFarmers: farmersData?.length || 0,
            activeCertificates: certificatesData?.filter((c: any) => c.status === 'active')?.length || 0,
            pendingInspections: inspectionsData?.filter((i: any) => i.status === 'pending')?.length || 0,
            monthlyRevenue: 0
          })
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
        setError(errorMessage)

        toast({
          variant: "destructive",
          title: "Dashboard Loading Error",
          description: "Unable to load dashboard data. Please check your connection and try again."
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  function generateMonthlyData(): MonthlyData[] {
    if (!inspections.length && !certificates.length) return []

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()
    const monthlyData: MonthlyData[] = []

    for (let i = 0; i < 6; i++) {
      const currentMonth = new Date().getMonth()
      const monthIndex = (currentMonth - 5 + i + 12) % 12
      const month = months[monthIndex]

      const monthInspections = inspections.filter((inspection: DashboardInspection) => {
        const inspectionDate = new Date(inspection.scheduledDate || inspection.createdAt || '')
        return inspectionDate.getMonth() === monthIndex && inspectionDate.getFullYear() === currentYear
      }).length

      const monthCertificates = certificates.filter((cert: DashboardCertificate) => {
        const certDate = new Date(cert.issueDate || cert.createdAt || '')
        return certDate.getMonth() === monthIndex && certDate.getFullYear() === currentYear
      }).length

      monthlyData.push({
        month,
        farmers: Math.floor(farmers.length / 6) + (i * 2),
        inspections: monthInspections,
        certificates: monthCertificates
      })
    }

    return monthlyData
  }

  function generateCertificationData(): CertificationData[] {
    if (!certificates.length) return []

    const typeCount: Record<string, number> = {}
    certificates.forEach((cert: DashboardCertificate) => {
      const type = cert.certificationType || 'Other'
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
    return Object.entries(typeCount).map(([name, value], index): CertificationData => ({
      name,
      value,
      color: colors[index % colors.length]
    }))
  }

  function generateRecentActivity(): ActivityItem[] {
    const activity: ActivityItem[] = []

    const recentInspections = inspections
      .sort((a: DashboardInspection, b: DashboardInspection) => {
        const dateA = new Date(a.updatedAt || a.scheduledDate || '').getTime()
        const dateB = new Date(b.updatedAt || b.scheduledDate || '').getTime()
        return dateB - dateA
      })
      .slice(0, 2)

    recentInspections.forEach((inspection: DashboardInspection) => {
      activity.push({
        id: `inspection-${inspection.id}`,
        type: 'inspection' as const,
        title: `Inspection ${inspection.status}`,
        farmer: inspection.farmerName || '-',
        time: new Date(inspection.updatedAt || inspection.scheduledDate || '').toLocaleString(),
        status: inspection.status as ActivityItem['status']
      })
    })

    const recentCertificates = certificates
      .sort((a: DashboardCertificate, b: DashboardCertificate) => {
        const dateA = new Date(a.issueDate).getTime()
        const dateB = new Date(b.issueDate).getTime()
        return dateB - dateA
      })
      .slice(0, 2)

    recentCertificates.forEach((cert: DashboardCertificate) => {
      activity.push({
        id: `cert-${cert.id}`,
        type: 'certificate' as const,
        title: 'Certificate issued',
        farmer: cert.farmerName || '-',
        time: new Date(cert.issueDate).toLocaleString(),
        status: 'success' as const
      })
    })

    return activity.slice(0, 4)
  }

  if (loading) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-600">Error loading dashboard: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const stats: StatItem[] = [
    {
      title: "Total Farmers",
      value: dashboardStats?.totalFarmers?.toString() || "0",
      icon: Users,
      color: "text-emerald-600",
    },
    {
      title: "Active Certifications",
      value: dashboardStats?.activeCertificates?.toString() || "0",
      icon: Award,
      color: "text-green-600",
    },
    {
      title: "Pending Inspections",
      value: dashboardStats?.pendingInspections?.toString() || "0",
      icon: ClipboardCheck,
      color: "text-orange-600",
    },
    {
      title: "This Month Revenue",
      value: `KES ${dashboardStats?.monthlyRevenue?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ]

  function handleResetFilters() {
    setDateRange({ from: undefined, to: undefined })
    setStatusFilter("all")
    setSearchFilter("")
    setTypeFilter("all")
  }

  function handleApplyFilters() {
    setAppliedFilters({
      dateRange,
      statusFilter,
      searchFilter,
      typeFilter
    })
  }

  function hasActiveFilters() {
    return dateRange.from ||
           statusFilter !== "all" ||
           searchFilter !== "" ||
           typeFilter !== "all"
  }

  const monthlyData = generateMonthlyData()
  const certificationData = generateCertificationData()
  const recentActivity = generateRecentActivity()

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">

      <div className="flex min-h-screen relative z-10">
        {/* Mobile sidebar overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden sidebar-overlay opacity-0 invisible transition-all duration-300"
          onClick={() => {
            const sidebar = document.querySelector('[data-sidebar]')
            if (sidebar) {
              sidebar.classList.add('-translate-x-full')
              sidebar.classList.remove('translate-x-0')
              document.querySelector('.sidebar-overlay')?.classList.add('opacity-0', 'invisible')
              document.querySelector('.sidebar-overlay')?.classList.remove('opacity-100', 'visible')
            }
          }}
        />

        <Sidebar />

        <div className="flex-1 flex flex-col w-full md:w-auto">
          <Navbar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-16 pb-20 md:pb-96">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent tracking-tight">Dashboard</h1>
                  <p className="text-base text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Welcome back, <span className="font-medium text-foreground">{user?.email?.split('@')[0] || 'User'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      hasActiveFilters()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    {hasActiveFilters() ? 'Filters Active' : 'Filter'}
                    {hasActiveFilters() && (
                      <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-medium">
                        {[
                          dateRange.from ? 1 : 0,
                          statusFilter !== "all" ? 1 : 0,
                          searchFilter !== "" ? 1 : 0,
                          typeFilter !== "all" ? 1 : 0
                        ].reduce((a, b) => a + b, 0)}
                      </span>
                    )}
                  </button>
                  <Badge variant="outline" className="px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </Badge>
                </div>
              </div>

              <DashboardFiltersComponent
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                dateRange={dateRange}
                setDateRange={setDateRange}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                appliedFilters={appliedFilters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />

              <StatsOverview stats={stats} />

              <div className="grid gap-8 lg:grid-cols-2 mt-24">
                <MaterialChart
                  title="Monthly Overview"
                  description="Farmers, inspections, and certificates over time"
                  data={monthlyData}
                  config={{
                    farmers: { label: "Farmers", color: "#3b82f6" },
                    inspections: { label: "Inspections", color: "#f59e0b" },
                    certificates: { label: "Certificates", color: "#10b981" },
                  }}
                  defaultChartType="line"
                  allowedTypes={["line", "bar"]}
                  height={300}
                />

                <MaterialChart
                  title="Certification Types"
                  description="Distribution of certification categories"
                  data={certificationData}
                  config={{
                    organic: { label: "Organic Crop", color: "#10b981" },
                    livestock: { label: "Organic Livestock", color: "#3b82f6" },
                    processing: { label: "Processing", color: "#f59e0b" },
                    wild: { label: "Wild Harvest", color: "#8b5cf6" },
                  }}
                  defaultChartType="pie"
                  allowedTypes={["pie", "bar"]}
                  height={300}
                />
              </div>

              <div className="grid gap-8 lg:grid-cols-3 mt-20">
                <EnhancedChart
                  title="Monthly Performance"
                  description="Comparative analysis of key metrics"
                  data={monthlyData}
                  config={{
                    farmers: { label: "New Farmers", color: "#3b82f6" },
                    inspections: { label: "Inspections", color: "#f59e0b" },
                    certificates: { label: "Certificates", color: "#10b981" },
                  }}
                  defaultChartType="bar"
                  allowedTypes={["bar", "line", "pie"]}
                  height="h-[300px]"
                  className="lg:col-span-2"
                />

                <RecentActivity activities={recentActivity} />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

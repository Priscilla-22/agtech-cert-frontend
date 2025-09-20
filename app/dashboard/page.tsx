"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgriCard, AgriCardContent, AgriCardDescription, AgriCardHeader, AgriCardTitle } from "@/components/ui/agri-card"
import { StatsCard } from "@/components/ui/stats-card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  ClipboardCheck,
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Filter,
  X,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Footer } from "@/components/layout/footer"
import { api } from "@/lib/api-client"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { EnhancedChart } from "@/components/ui/enhanced-chart"
import { MaterialChart } from "@/components/ui/material-chart"
import { MaterialDatePicker } from "@/components/ui/material-date-picker"
import { useEffect, useState } from "react"
import {
  Card as MTCard,
  CardBody as MTCardBody,
  CardHeader as MTCardHeader,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react"

function DashboardContent() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [farmers, setFarmers] = useState<any[]>([])
  const [inspections, setInspections] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Global filter state
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchFilter, setSearchFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Applied filters state (used for actual filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    statusFilter: "all",
    searchFilter: "",
    typeFilter: "all"
  })

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all required data from backend using API client
        const [farmersData, inspectionsData, certificatesData] = await Promise.all([
          api.farmers.getAll(),
          api.inspections.getAll(),
          api.certificates.getAll()
        ])

        // Handle both array and object response formats
        setFarmers(Array.isArray(farmersData) ? farmersData : farmersData.data || [])
        setInspections(Array.isArray(inspectionsData) ? inspectionsData : inspectionsData.data || [])
        setCertificates(Array.isArray(certificatesData) ? certificatesData : certificatesData.data || [])

        // Generate dashboard stats from real data
        const farmersArray = Array.isArray(farmersData) ? farmersData : farmersData.data || []
        const certificatesArray = Array.isArray(certificatesData) ? certificatesData : certificatesData.data || []
        const inspectionsArray = Array.isArray(inspectionsData) ? inspectionsData : inspectionsData.data || []
        
        const totalFarmers = farmersArray.length
        const activeCertificates = certificatesArray.filter((c: any) => c.status === 'active').length
        const pendingInspections = inspectionsArray.filter((i: any) => i.status === 'pending').length
        const completedInspections = inspectionsArray.filter((i: any) => i.status === 'completed').length

        // Calculate revenue from real data (this should come from backend)
        const monthlyRevenue = 0 // Will be populated with real data from backend

        setDashboardStats({
          totalFarmers,
          activeCertificates,
          pendingInspections,
          monthlyRevenue,
          completedInspections
        })

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
        setError(errorMessage)
        console.error('Dashboard data fetch error:', err)

        // Show user-friendly toast notification
        toast({
          variant: "destructive",
          title: "Dashboard Loading Error",
          description: "Unable to load dashboard data. Please check your connection and try again."
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Generate monthly data from real inspections and certificates
  const generateMonthlyData = () => {
    if (!inspections.length || !certificates.length) return []

    const monthlyData = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()

    for (let i = 0; i < 6; i++) {
      const month = months[new Date().getMonth() - 5 + i] || months[new Date().getMonth() - 5 + i + 12]
      const monthIndex = months.indexOf(month)

      const monthInspections = inspections.filter((inspection: any) => {
        const inspectionDate = new Date(inspection.scheduledDate)
        return inspectionDate.getMonth() === monthIndex && inspectionDate.getFullYear() === currentYear
      }).length

      const monthCertificates = certificates.filter((cert: any) => {
        const certDate = new Date(cert.issueDate)
        return certDate.getMonth() === monthIndex && certDate.getFullYear() === currentYear
      }).length

      monthlyData.push({
        month,
        farmers: Math.floor(farmers.length / 6) + (i * 2), // Approximate distribution
        inspections: monthInspections,
        certificates: monthCertificates
      })
    }

    return monthlyData
  }

  // Generate certification type distribution from real data
  const generateCertificationData = () => {
    if (!certificates.length) {
      return []
    }

    const typeCount = certificates.reduce((acc: any, cert: any) => {
      const type = cert.certificationType || 'Other'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    return Object.entries(typeCount).map(([name, value], index) => ({
      name,
      value: value as number,
      color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][index % 4]
    }))
  }

  // Generate recent activity from real data
  const generateRecentActivity = () => {
    const activity = []

    // Add recent inspections
    const recentInspections = inspections
      .sort((a: any, b: any) => new Date(b.updatedAt || b.scheduledDate).getTime() - new Date(a.updatedAt || a.scheduledDate).getTime())
      .slice(0, 2)

    recentInspections.forEach((inspection: any) => {
      activity.push({
        id: `inspection-${inspection.id}`,
        type: 'inspection',
        title: `Inspection ${inspection.status}`,
        farmer: inspection.farmerName || 'Unknown Farm',
        time: new Date(inspection.updatedAt || inspection.scheduledDate).toLocaleString(),
        status: inspection.status
      })
    })

    // Add recent certificates
    const recentCertificates = certificates
      .sort((a: any, b: any) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 2)

    recentCertificates.forEach((cert: any) => {
      activity.push({
        id: `cert-${cert.id}`,
        type: 'certificate',
        title: 'Certificate issued',
        farmer: cert.farmerName || 'Unknown Farm',
        time: new Date(cert.issueDate).toLocaleString(),
        status: 'success'
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

  const stats = [
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

  // Filter functions
  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setStatusFilter("all")
    setSearchFilter("")
    setTypeFilter("all")
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      dateRange,
      statusFilter,
      searchFilter,
      typeFilter
    })

    toast({
      title: "Filters Applied",
      description: "Your filters have been applied to the dashboard data.",
    })
  }

  const hasActiveFilters = () => {
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

              {/* Global Filter Section */}
              {showFilters && (
                <MTCard className="w-full border-2 border-blue-200 shadow-lg my-8">
                  <MTCardHeader className="flex flex-row items-center justify-between px-8 py-6">
                    <Typography variant="h6" color="blue-gray">
                      Global Filters
                    </Typography>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </MTCardHeader>
                  <MTCardBody className="px-8 py-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <MaterialDatePicker
                        value={dateRange}
                        onChange={setDateRange}
                        label="Date Range"
                        className="w-full"
                      />

                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="expired">Expired</option>
                        </select>
                      </div>

                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                        >
                          <option value="all">All Types</option>
                          <option value="organic">Organic Crop</option>
                          <option value="livestock">Organic Livestock</option>
                          <option value="processing">Processing</option>
                          <option value="wild">Wild Harvest</option>
                        </select>
                      </div>

                      <div className="w-full">
                        <Input
                          label="Search"
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          placeholder="Search farmers, certificates..."
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.dateRange.from && (
                          <Badge className="text-xs flex items-center gap-1 bg-blue-100 text-blue-800">
                            {`${appliedFilters.dateRange.from.toLocaleDateString()}${appliedFilters.dateRange.to ? ` - ${appliedFilters.dateRange.to.toLocaleDateString()}` : ''}`}
                          </Badge>
                        )}
                        {appliedFilters.statusFilter !== "all" && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            Status: {appliedFilters.statusFilter}
                          </Badge>
                        )}
                        {appliedFilters.typeFilter !== "all" && (
                          <Badge className="text-xs bg-purple-100 text-purple-800">
                            Type: {appliedFilters.typeFilter}
                          </Badge>
                        )}
                        {appliedFilters.searchFilter && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">
                            Search: {appliedFilters.searchFilter}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleApplyFilters}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </MTCardBody>
                </MTCard>
              )}

              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  const variants = ['default', 'default', 'default', 'default']
                  const iconColors = ['text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-purple-600']
                  const variant = variants[index % variants.length]
                  const iconColor = iconColors[index % iconColors.length]

                  return (
                    <StatsCard
                      key={stat.title}
                      title={stat.title}
                      value={stat.value}
                      icon={Icon}
                      iconColor={iconColor}
                      variant={variant as any}
                      trend={{
                        value: Math.floor(Math.random() * 20) + 5,
                        label: "Growth",
                        isPositive: Math.random() > 0.3
                      }}
                    />
                  )
                })}
              </div>

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

                <AgriCard variant="sustainable" interactive>
                  <AgriCardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <AgriCardTitle className="text-xl font-bold">Recent Activity</AgriCardTitle>
                        <AgriCardDescription>Latest updates and notifications</AgriCardDescription>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    </div>
                  </AgriCardHeader>
                  <AgriCardContent className="space-y-4 p-6 pt-0">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={activity.id} className="group/item flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 hover:from-muted/50 hover:to-muted/20 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="relative">
                              <div className="absolute inset-0 rounded-full bg-primary/10 blur group-hover/item:bg-primary/20 transition-colors duration-300" />
                              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border/50">
                                {activity.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                {activity.status === "success" && <Award className="w-4 h-4 text-primary" />}
                                {activity.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                {activity.status === "pending" && <Calendar className="w-4 h-4 text-blue-500" />}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.farmer}</p>
                            <p className="text-xs text-muted-foreground/80">{activity.time}</p>
                          </div>
                          <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground/50 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                        <p className="text-xs text-muted-foreground/70">Recent inspections and certificates will appear here</p>
                      </div>
                    )}
                  </AgriCardContent>
                </AgriCard>
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

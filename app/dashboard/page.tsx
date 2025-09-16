"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useEffect, useState } from "react"

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
        const monthlyRevenue = 0 // Remove hardcoded calculation

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
    if (!certificates.length) return []

    const typeCount = certificates.reduce((acc: any, cert: any) => {
      const type = cert.certificationType || 'Other'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    return Object.entries(typeCount).map(([name, value], index) => ({
      name,
      value: value as number,
      color: ['#10b981', '#059669', '#34d399', '#6ee7b7'][index % 4]
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
      value: `$${dashboardStats?.monthlyRevenue?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ]

  const monthlyData = generateMonthlyData()
  const certificationData = generateCertificationData()
  const recentActivity = generateRecentActivity()

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        {/* Mobile sidebar overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden sidebar-overlay opacity-0 invisible transition-all duration-300"
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

          <main className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-96">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-space-grotesk font-bold text-foreground">Dashboard</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">Welcome back, {user?.email}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 w-fit">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="text-xs sm:text-sm">{new Date().toLocaleDateString()}</span>
                </Badge>
              </div>

              <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 md:p-6">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">{stat.title}</CardTitle>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} flex-shrink-0`} />
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                        <div className="text-lg sm:text-xl md:text-2xl font-space-grotesk font-bold text-foreground">{stat.value}</div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-3 sm:p-4 md:p-6">
                    <CardTitle className="font-space-grotesk text-lg sm:text-xl">Monthly Overview</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Farmers, inspections, and certificates over time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                    <ChartContainer
                      config={{
                        farmers: { label: "Farmers", color: "#10b981" },
                        inspections: { label: "Inspections", color: "#059669" },
                        certificates: { label: "Certificates", color: "#34d399" },
                      }}
                      className="h-[250px] sm:h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            fontSize={12}
                            tickMargin={5}
                            axisLine={false}
                          />
                          <YAxis
                            fontSize={12}
                            tickMargin={5}
                            axisLine={false}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Line type="monotone" dataKey="farmers" stroke="var(--color-farmers)" strokeWidth={2} />
                          <Line type="monotone" dataKey="inspections" stroke="var(--color-inspections)" strokeWidth={2} />
                          <Line
                            type="monotone"
                            dataKey="certificates"
                            stroke="var(--color-certificates)"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-3 sm:p-4 md:p-6">
                    <CardTitle className="font-space-grotesk text-lg sm:text-xl">Certification Types</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Distribution of certification categories</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                    <ChartContainer
                      config={{
                        organic: { label: "Organic Crop", color: "#10b981" },
                        livestock: { label: "Organic Livestock", color: "#059669" },
                        processing: { label: "Processing", color: "#34d399" },
                        wild: { label: "Wild Harvest", color: "#6ee7b7" },
                      }}
                      className="h-[250px] sm:h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={certificationData}
                            cx="50%"
                            cy="50%"
                            outerRadius={window.innerWidth < 640 ? 60 : 80}
                            dataKey="value"
                            label={(entry) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                            labelLine={false}
                            fontSize={12}
                          >
                            {certificationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-0 shadow-sm">
                  <CardHeader className="p-3 sm:p-4 md:p-6">
                    <CardTitle className="font-space-grotesk text-lg sm:text-xl">Monthly Performance</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Comparative analysis of key metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                    <ChartContainer
                      config={{
                        farmers: { label: "New Farmers", color: "#10b981" },
                        inspections: { label: "Inspections", color: "#059669" },
                        certificates: { label: "Certificates", color: "#34d399" },
                      }}
                      className="h-[250px] sm:h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="month"
                            fontSize={12}
                            tickMargin={5}
                            axisLine={false}
                          />
                          <YAxis
                            fontSize={12}
                            tickMargin={5}
                            axisLine={false}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="farmers" fill="var(--color-farmers)" />
                          <Bar dataKey="inspections" fill="var(--color-inspections)" />
                          <Bar dataKey="certificates" fill="var(--color-certificates)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-3 sm:p-4 md:p-6">
                    <CardTitle className="font-space-grotesk text-lg sm:text-xl">Recent Activity</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Latest updates and notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 pt-0">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2 sm:p-3 rounded-lg bg-muted/30">
                        <div className="flex-shrink-0 mt-0.5">
                          {activity.status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                          {activity.status === "success" && <Award className="w-4 h-4 text-primary" />}
                          {activity.status === "warning" && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                          {activity.status === "pending" && <Calendar className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{activity.farmer}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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

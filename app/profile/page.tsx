"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin, Shield, Calendar, LogOut, Edit, Save, Tractor, Eye, Building2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useRouter } from "next/navigation"
import { fetchProfileStats, generateProfileData, ProfileStats, ProfileData } from "@/lib/services/profile-stats"
import { api } from "@/lib/api-client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

function ProfileContent() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.displayName || "Agronomist User",
    email: user?.email || "",
    phone: "",
    address: "",
    role: "Agronomist",
    department: "Organic Certification Department",
    licenseNumber: "",
    experience: ""
  })
  const [stats, setStats] = useState<ProfileStats>({
    farmersTotal: 0,
    inspectionsCompleted: 0,
    certificatesIssued: 0,
    successRate: 0
  })
  const [userFarms, setUserFarms] = useState<any[]>([])
  const [farmsLoading, setFarmsLoading] = useState(false)

  useEffect(() => {
    const loadUserFarms = async () => {
      if (!user?.email) return

      try {
        setFarmsLoading(true)

        const farmersResponse = await api.farmers.getAll({ search: user.email })
        const farmers = Array.isArray(farmersResponse) ? farmersResponse : farmersResponse.data || []

        const currentFarmer = farmers.find((farmer: any) => farmer.email === user.email)

        if (currentFarmer) {
          const farmsResponse = await api.farms.getByFarmerId(currentFarmer.id.toString())
          const farms = Array.isArray(farmsResponse) ? farmsResponse : farmsResponse.data || []
          setUserFarms(farms)
        }
      } catch (error) {
        console.error("Error loading user farms:", error)
        setUserFarms([])
      } finally {
        setFarmsLoading(false)
      }
    }

    loadUserFarms()
  }, [user])

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true)
        const statsData = await fetchProfileStats()
        setStats(statsData)

        if (user) {
          setProfile(prev => generateProfileData(user, prev))
        }
      } catch (error) {
        // Error handling is done in the service
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
    }
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-background">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6 pb-96">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                  <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Overview Card */}
              <Card className="md:col-span-1">
                <CardHeader className="text-center">
                  <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <CardDescription>{profile.role}</CardDescription>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Verified Account</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "2023"}</span>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full mt-6"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Details Form */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                      ) : (
                        <Input id="name" value={profile.name} disabled />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={profile.email} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      ) : (
                        <Input id="phone" value={profile.phone} disabled />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input id="licenseNumber" value={profile.licenseNumber} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={profile.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Textarea id="address" value={profile.address} disabled rows={3} />
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={profile.role} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" value={profile.department} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    {isEditing ? (
                      <Textarea
                        id="experience"
                        value={profile.experience}
                        onChange={(e) => handleChange("experience", e.target.value)}
                        rows={2}
                      />
                    ) : (
                      <Textarea id="experience" value={profile.experience} disabled rows={2} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registered Farms Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Registered Farms ({userFarms.length})
                    </CardTitle>
                    <CardDescription>Farms associated with your account</CardDescription>
                  </div>
                  <Link href="/farms/new">
                    <Button>
                      <Tractor className="w-4 h-4 mr-2" />
                      Add Farm
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {farmsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-muted-foreground">Loading farms...</span>
                  </div>
                ) : userFarms.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-2 text-sm font-medium text-muted-foreground">No farms registered</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Get started by registering your first farm.
                    </p>
                    <div className="mt-6">
                      <Link href="/farms/new">
                        <Button>
                          <Tractor className="w-4 h-4 mr-2" />
                          Register Your First Farm
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {userFarms.map((farm: any) => (
                      <Card key={farm.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 min-w-0 flex-1">
                              <CardTitle className="text-lg truncate">{farm.farmName}</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{farm.location}</span>
                              </div>
                            </div>
                            <Link href={`/farms/${farm.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Size</span>
                              <p className="text-sm font-medium">{farm.totalArea} ha</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <Badge
                                variant="secondary"
                                className={
                                  farm.certificationStatus === 'certified'
                                    ? "bg-green-100 text-green-800"
                                    : farm.certificationStatus === 'pending'
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {farm.certificationStatus}
                              </Badge>
                            </div>
                          </div>

                          {farm.cropTypes && farm.cropTypes.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-sm text-muted-foreground">Crops</span>
                              <div className="flex flex-wrap gap-1">
                                {farm.cropTypes.slice(0, 3).map((crop: string) => (
                                  <Badge key={crop} variant="outline" className="text-xs">
                                    {crop}
                                  </Badge>
                                ))}
                                {farm.cropTypes.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{farm.cropTypes.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Farmers Registered</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : stats.farmersTotal}
                  </div>
                  <p className="text-xs text-muted-foreground">Total registered</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inspections Completed</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : stats.inspectionsCompleted}
                  </div>
                  <p className="text-xs text-muted-foreground">Successfully completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : stats.certificatesIssued}
                  </div>
                  <p className="text-xs text-muted-foreground">Active certificates</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : `${stats.successRate}%`}
                  </div>
                  <p className="text-xs text-muted-foreground">Certification approval</p>
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

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
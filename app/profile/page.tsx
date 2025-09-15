"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin, Shield, Calendar, LogOut, Edit, Save } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useRouter } from "next/navigation"

function ProfileContent() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.displayName || "Agronomist User",
    email: user?.email || "",
    phone: "+254712345678",
    address: "P.O Box 123, Nairobi",
    role: "Agronomist",
    department: "Organic Certification Department",
    licenseNumber: "AGR-2023-001",
    experience: "5+ years in organic farming certification"
  })

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    // TODO: Save profile data to backend API
    console.log("Saving profile:", profile)
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

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Farmers Registered</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inspections Completed</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">Total this year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
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
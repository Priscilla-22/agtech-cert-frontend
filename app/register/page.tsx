"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Eye, EyeOff, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Separator } from "@/components/ui/separator"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [step, setStep] = useState(1) // 1 for account creation, 2 for profile completion
  const router = useRouter()
  const { signUp, signInWithGoogle, user } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password)
      // After successful signup and email verification, user can complete profile
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true)

    try {
      await signInWithGoogle()
      // After Google signup, show profile completion form
      setStep(2)
    } catch (error) {
      console.error("Google registration error:", error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleProfileCompletion = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Register user profile with backend
      // This will be handled by the AuthContext
      router.push("/dashboard")
    } catch (error) {
      console.error("Profile completion error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-3 sm:p-4 safe-area-top safe-area-bottom">
      <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-16 sm:w-32 h-16 sm:h-32 bg-primary/10 organic-shape floating-animation" />
      <div
        className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-12 sm:w-24 h-12 sm:h-24 bg-accent/10 organic-shape-alt floating-animation"
        style={{ animationDelay: "2s" }}
      />

      <Card className="w-full max-w-sm sm:max-w-md shadow-lg border-0 mx-auto">
        <CardHeader className="space-y-3 sm:space-y-4 text-center p-4 sm:p-6">
          <div className="mx-auto w-10 sm:w-12 h-10 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-space-grotesk">Create account</CardTitle>
            <CardDescription className="text-sm sm:text-base">Join GreenCert to manage organic certifications</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0">
          {step === 1 ? (
          <form onSubmit={handleRegister} className="mobile-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-responsive-sm">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className="h-11 sm:h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-responsive-sm">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className="h-11 sm:h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-responsive-sm">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-11 sm:h-12 pl-10 text-base"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-responsive-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="h-11 sm:h-12 pr-10 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-responsive-sm">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  className="h-11 sm:h-12 pr-10 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-sm sm:text-base" disabled={isLoading}>
              <Mail className="w-4 h-4 mr-2" />
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 sm:h-12 text-sm sm:text-base"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading}
          >
            <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="truncate">{isGoogleLoading ? "Signing up..." : "Continue with Google"}</span>
          </Button>
          ) : (
          <form onSubmit={handleProfileCompletion} className="mobile-form">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-responsive-sm">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254 700 123 456"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                className="h-11 sm:h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-responsive-sm">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                className="h-11 sm:h-12 text-base"
              />
            </div>

            <Button type="submit" className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? "Completing profile..." : "Complete Profile"}
            </Button>
          </form>
          )}

          {step === 1 && (
          <div className="mt-4 sm:mt-6 text-center">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

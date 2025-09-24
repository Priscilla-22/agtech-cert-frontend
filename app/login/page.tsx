"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Leaf, Eye, EyeOff, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()
  const { signIn, signInWithGoogle } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)

    try {
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error) {
      console.error("Google login error:", error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/40 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 organic-shape floating-animation" />
      <div
        className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-accent/5 to-primary/5 organic-shape-alt floating-animation"
        style={{ animationDelay: "2s" }}
      />

      <Card className="w-full max-w-4xl shadow-2xl border-0 mx-auto bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

        {/* Two Column Layout inside the Card */}
        <div className="relative z-10 grid lg:grid-cols-2 min-h-[600px]">

          {/* Left Column - Login Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center lg:text-left space-y-6">
                <div className="mx-auto lg:mx-0 relative w-fit">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg">
                    <Leaf className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">Welcome back</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">Sign in to your Pesira account</CardDescription>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl blur-sm" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="relative h-12 text-base bg-gradient-to-r from-muted/10 to-muted/5 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl blur-sm" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="relative h-12 pr-12 text-base bg-gradient-to-r from-muted/10 to-muted/5 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10 rounded-lg transition-all duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors duration-300" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Mail className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">{isLoading ? "Signing in..." : "Sign in with Email"}</span>
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                </div>
                <div className="relative flex justify-center text-sm uppercase tracking-wider">
                  <span className="bg-gradient-to-r from-card/90 to-card/90 px-4 py-1 text-muted-foreground font-medium rounded-full">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base border-2 border-border/30 hover:border-primary/30 bg-gradient-to-r from-background/50 to-background/30 hover:from-muted/20 hover:to-muted/10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg className="w-5 h-5 mr-3 flex-shrink-0 relative z-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="relative z-10 font-semibold">{isGoogleLoading ? "Signing in..." : "Continue with Google"}</span>
              </Button>

              <div className="mt-8 text-center">
                <div className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-semibold hover:underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="hidden lg:flex bg-gradient-to-br from-muted/20 to-muted/10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-sm">
                <Image
                  src="/agronomist.png"
                  alt="Agronomist working in field"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhoWeAreSection } from "@/components/sections/who-we-are"
import {
  Users,
  Building2,
  ClipboardCheck,
  Award,
  TrendingUp,
  ArrowRight,
  Leaf,
  Shield,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = ["/pic1.png", "/pic2.png", "/pic3.png"]

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }


  const features = [
    {
      icon: Shield,
      title: "Trusted Certification",
      description: "Industry-standard organic certification process with full compliance tracking",
    },
    {
      icon: CheckCircle,
      title: "Streamlined Process",
      description: "Simplified workflows that reduce paperwork and speed up certification",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Stay informed with instant notifications and progress tracking",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-auto">
          <div className="relative">
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `linear-gradient(to bottom right,
                  #f0fdf4,
                  #ecfdf5,
                  rgba(31, 52, 8, 0.05),
                  #f0fdfa
                )`
              }}
            />
            {/* Leaf-like decorative elements */}
            <div
              className="absolute top-20 left-20 w-32 h-32 floating-animation"
              style={{
                backgroundColor: 'rgba(31, 52, 8, 0.12)',
                borderRadius: '50% 0 50% 0',
                transform: 'rotate(45deg)',
                clipPath: 'ellipse(70% 90% at 30% 50%)'
              }}
            />
            <div
              className="absolute top-32 left-32 w-20 h-20 floating-animation"
              style={{
                backgroundColor: 'rgba(31, 52, 8, 0.08)',
                borderRadius: '50% 0 50% 0',
                transform: 'rotate(-30deg)',
                clipPath: 'ellipse(80% 85% at 40% 60%)',
                animationDelay: "1s"
              }}
            />
            <div
              className="absolute bottom-20 right-20 w-24 h-24 floating-animation"
              style={{
                backgroundColor: 'rgba(31, 52, 8, 0.1)',
                borderRadius: '0 50% 0 50%',
                transform: 'rotate(-45deg)',
                clipPath: 'ellipse(85% 75% at 60% 40%)',
                animationDelay: "2s"
              }}
            />
            <div
              className="absolute bottom-32 right-40 w-16 h-16 floating-animation"
              style={{
                backgroundColor: 'rgba(31, 52, 8, 0.06)',
                borderRadius: '50% 0 50% 0',
                transform: 'rotate(60deg)',
                clipPath: 'ellipse(90% 80% at 50% 70%)',
                animationDelay: "3s"
              }}
            />

            <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="max-w-6xl mx-auto">
                <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden">
                  <div
                    className="flex transition-transform duration-1000 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {heroImages.map((image, index) => (
                      <div key={index} className="min-w-full h-full relative">
                        <div className={`grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center h-full ${
                          index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                        }`}>
                          <div className={`space-y-8 text-center lg:text-left ${
                            index % 2 === 1 ? 'lg:col-start-2' : ''
                          }`}>
                            <div className="space-y-4">
                              <Badge className="bg-primary/10 text-foreground border-primary/20 hover:bg-primary/20">
                                <Leaf className="w-3 h-3 mr-1" />
                                Organic Certification Platform
                              </Badge>
                              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold text-foreground leading-tight">
                                Growing Trust in
                                <span className="text-primary block">Organic Agriculture</span>
                              </h1>
                              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mx-auto lg:mx-0">
                                Comprehensive platform for Agronomists to manage farmer certification, conduct inspections,
                                and issue organic certificates.
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                              <Link href="/login">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 w-full sm:w-auto">
                                  Sign In
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                              <Link href="/register">
                                <Button variant="outline" size="lg" className="px-6 sm:px-8 bg-transparent w-full sm:w-auto">
                                  Get Started
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <div className={`relative ${
                            index % 2 === 1 ? 'lg:col-start-1' : ''
                          }`}>
                            <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
                              <Image
                                src={image}
                                alt={`Agriculture scene ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-primary' : 'bg-primary/30'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Card
                      key={feature.title}
                      className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl font-space-grotesk" style={{ color: '#1f3408' }}>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

            </div>
          </div>

          {/* Who We Are Section */}
          <WhoWeAreSection />

          <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">
              <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-space-grotesk font-bold text-foreground">Ready to get certified?</h3>
                      <p className="text-muted-foreground">
                        Join thousands of farmers who trust our platform for their organic certification needs.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <Link href="/register">
                        <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button variant="outline" className="w-full sm:w-auto">Sign In</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

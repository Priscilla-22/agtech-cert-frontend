import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GreenCert - Organic Certification Made Simple",
  description:
    "Streamline your organic certification process with our comprehensive platform for farmers, inspectors, and certification bodies.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Agbalumo:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  )
}

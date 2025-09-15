import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
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
      <body className={`font-sans ${poppins.variable} ${agbalumo.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

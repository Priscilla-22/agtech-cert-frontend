"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, ClipboardCheck, Award, BarChart3 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Farmers", href: "/farmers", icon: Users },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Certificates", href: "/certificates", icon: Award },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6">
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Users, Building2, ClipboardCheck, Award, ChevronLeft, ChevronRight, Leaf } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Farmers", href: "/farmers", icon: Users },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Certificates", href: "/certificates", icon: Award },
]

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="sidebar-overlay fixed inset-0 bg-black/50 z-40 md:hidden opacity-0 invisible transition-all duration-300"
        onClick={() => {
          const sidebar = document.querySelector('[data-sidebar]')
          const overlay = document.querySelector('.sidebar-overlay')
          if (sidebar) {
            sidebar.classList.add('-translate-x-full')
            sidebar.classList.remove('translate-x-0')
            overlay?.classList.add('opacity-0', 'invisible')
            overlay?.classList.remove('opacity-100', 'visible')
          }
        }}
      />

      <div
        data-sidebar
        className={cn(
          "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "md:translate-x-0", // Always visible on desktop
          "-translate-x-full md:relative md:flex", // Hidden by default on mobile, slide-out drawer
          "fixed md:relative z-50 h-full md:h-auto", // Fixed positioning on mobile
          isExpanded ? "w-64" : "w-16",
        )}
      >
      {/* Pesira Logo Section */}
      <div className={cn("p-4 border-b border-sidebar-border", !isExpanded && "p-2")}>
        <div className="group relative flex justify-center">
          <div className={cn(
            "relative transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm",
            isExpanded ? "w-20 h-20" : "w-12 h-12"
          )}>
            <Image
              src="/pesira-logo .png"
              alt="Pesira Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          {/* Company name tooltip - only show when collapsed or on hover when expanded */}
          <div className={cn(
            "absolute left-full ml-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 z-50",
            !isExpanded
              ? "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
          )}>
            <div className="bg-background border border-border rounded-md shadow-lg px-3 py-2 whitespace-nowrap">
              <span className="text-sm font-medium text-sidebar-foreground">Agronomist Platform</span>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background border-l border-b border-border rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-space-grotesk font-bold text-lg text-sidebar-foreground">CertTracker</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-left",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !isExpanded && "justify-center px-2",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && <span className="truncate">{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", !isExpanded && "justify-center")}>
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-accent-foreground">
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground truncate">Inspector</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Users, Building2, ClipboardCheck, Award, ChevronLeft, ChevronRight, Leaf, UserCheck } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Farmers", href: "/farmers", icon: Users },
  { name: "Farms", href: "/farms", icon: Building2 },
  { name: "Inspectors", href: "/inspectors", icon: UserCheck },
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
          "relative flex flex-col bg-gradient-to-b from-sidebar/95 to-sidebar/90 backdrop-blur-xl border-r border-sidebar-border/50 transition-all duration-300 ease-in-out shadow-xl",
          "md:translate-x-0", // Always visible on desktop
          "-translate-x-full md:relative md:flex", // Hidden by default on mobile, slide-out drawer
          "fixed md:relative z-50 h-full md:h-auto", // Fixed positioning on mobile
          isExpanded ? "w-72" : "w-16",
        )}
      >
      {/* Pesira Logo Section */}
      <div className={cn("p-6 border-b border-sidebar-border/30", !isExpanded && "p-4")}>
        <div className="group relative flex justify-center">
          <div className={cn(
            "relative transition-all duration-500 group-hover:scale-110 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm shadow-lg border border-primary/20",
            isExpanded ? "w-16 h-16" : "w-12 h-12"
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300" />
            <Image
              src="/pesira-logo .png"
              alt="Pesira Logo"
              fill
              className="object-contain p-2 relative z-10"
              priority
            />
          </div>
          {isExpanded && (
            <div className="ml-4 flex flex-col justify-center">
              <h2 className="text-lg font-bold bg-gradient-to-r from-sidebar-foreground to-primary bg-clip-text text-transparent">Pesira</h2>
              <p className="text-xs text-sidebar-foreground/70 font-medium">Agronomist Platform</p>
            </div>
          )}
          {/* Company name tooltip - only show when collapsed */}
          {!isExpanded && (
            <div className={cn(
              "absolute left-full ml-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
            )}>
              <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl px-4 py-3 whitespace-nowrap">
                <span className="text-sm font-semibold text-sidebar-foreground">Pesira</span>
                <p className="text-xs text-muted-foreground">Agronomist Platform</p>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background/95 border-l border-b border-border/50 rotate-45 backdrop-blur-sm"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end p-4 border-b border-sidebar-border/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sidebar-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur opacity-0 hover:opacity-100 transition-opacity duration-300" />
            {isExpanded ? <ChevronLeft className="w-4 h-4 relative z-10" /> : <ChevronRight className="w-4 h-4 relative z-10" />}
          </div>
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <div className="group relative">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 text-left transition-all duration-300 rounded-xl h-12 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02]"
                      : "text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/50 hover:to-sidebar-accent/30 hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02]",
                    !isExpanded && "justify-center px-0",
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-sm" />
                  )}
                  <div className="relative flex items-center gap-4 w-full">
                    <div className={cn(
                      "flex items-center justify-center rounded-lg transition-all duration-300",
                      isActive ? "text-primary-foreground" : "text-sidebar-foreground group-hover:text-primary",
                      !isExpanded ? "w-8 h-8" : "w-6 h-6"
                    )}>
                      <Icon className={cn(
                        "flex-shrink-0 transition-all duration-300",
                        !isExpanded ? "w-5 h-5" : "w-5 h-5",
                        isActive && "drop-shadow-sm"
                      )} />
                    </div>
                    {isExpanded && (
                      <span className="truncate font-medium text-sm tracking-wide">{item.name}</span>
                    )}
                  </div>
                </Button>
                {!isExpanded && (
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl px-3 py-2 whitespace-nowrap">
                      <span className="text-sm font-medium text-sidebar-foreground">{item.name}</span>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background/95 border-l border-b border-border/50 rotate-45 backdrop-blur-sm"></div>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border/30">
        <div className={cn("flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-sidebar-accent/20 to-sidebar-accent/10 border border-sidebar-border/20 hover:from-sidebar-accent/30 hover:to-sidebar-accent/20 transition-all duration-300 group cursor-pointer", !isExpanded && "justify-center p-2")}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur group-hover:blur-md transition-all duration-300" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center border-2 border-primary/20 shadow-lg">
              <span className="text-sm font-bold text-primary-foreground">
                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          </div>
          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.email?.split('@')[0] || 'User'}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-sidebar-foreground/70 truncate font-medium">Inspector</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

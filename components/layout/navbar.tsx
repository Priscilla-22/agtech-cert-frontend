"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Sun, Moon, User, LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  const [isDark, setIsDark] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 bg-white/20 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm">
              <Image
                src="/pesira-logo-nobg.png?v=1"
                alt="Pesira Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
            <div>
              <h2 className="text-lg font-space-grotesk font-semibold" style={{ color: '#1f3408' }}>
                Pesira
              </h2>
              <p className="text-xs text-muted-foreground">Agronomist Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Link href="/login">
              <Button
                className="text-white font-medium"
                style={{ backgroundColor: '#1f3408' }}
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => {
            // Toggle mobile sidebar
            const sidebar = document.querySelector('[data-sidebar]')
            const overlay = document.querySelector('.sidebar-overlay')
            if (sidebar) {
              const isOpen = sidebar.classList.contains('translate-x-0')
              if (isOpen) {
                sidebar.classList.add('-translate-x-full')
                sidebar.classList.remove('translate-x-0')
                overlay?.classList.add('opacity-0', 'invisible')
                overlay?.classList.remove('opacity-100', 'visible')
              } else {
                sidebar.classList.remove('-translate-x-full')
                sidebar.classList.add('translate-x-0')
                overlay?.classList.remove('opacity-0', 'invisible')
                overlay?.classList.add('opacity-100', 'visible')
              }
            }
          }}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search - hidden on small screens */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search farmers, farms, or certificates..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-primary">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[90vw]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="font-medium">Inspection Due</div>
                <div className="text-sm text-muted-foreground">Green Valley Farm inspection scheduled for tomorrow</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="font-medium">Certificate Expiring</div>
                <div className="text-sm text-muted-foreground">Sunrise Organic Farm certificate expires in 30 days</div>
                <div className="text-xs text-muted-foreground">1 day ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <div className="font-medium">New Application</div>
                <div className="text-sm text-muted-foreground">
                  Fresh Fields Farm submitted certification application
                </div>
                <div className="text-xs text-muted-foreground">3 days ago</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="group relative">
            <div className="flex items-center gap-2 h-auto py-2 px-2 md:px-3 hover:bg-muted/50 rounded-md cursor-pointer">
              <User className="w-4 h-4" />
              <div className="flex flex-col items-start gap-0 hidden lg:flex">
                <span className="text-sm font-medium leading-tight">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
                <span className="text-xs text-muted-foreground leading-tight">Agronomist</span>
              </div>
            </div>
            <div className="absolute right-0 top-full mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-background border border-border rounded-md shadow-lg p-1">
                <div
                  onClick={() => router.push('/profile')}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted rounded-sm cursor-pointer"
                >
                  Profile
                </div>
                <div className="h-px bg-border my-1"></div>
                <div
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-muted rounded-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

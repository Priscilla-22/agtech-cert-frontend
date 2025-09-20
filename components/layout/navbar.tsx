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
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
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
          <div className="relative max-w-lg flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl blur-sm" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
              <Input
                placeholder="Search farmers, farms, or certificates..."
                className="pl-12 pr-4 h-10 bg-gradient-to-r from-muted/20 to-muted/10 border border-border/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-300 hover:from-muted/30 hover:to-muted/20"
              />
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="sm" className="md:hidden relative group rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-300">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Search className="w-4 h-4 relative z-10 group-hover:text-primary transition-colors duration-300" />
          </Button>

          <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex relative group rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-300">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 group-hover:text-primary transition-colors duration-300">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative group rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-300">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Bell className="w-4 h-4 relative z-10 group-hover:text-primary transition-colors duration-300" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-gradient-to-r from-primary to-accent border border-primary/20 shadow-lg animate-pulse">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[90vw] bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl">
              <DropdownMenuLabel className="text-lg font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent px-4 py-3">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <DropdownMenuItem className="flex flex-col items-start gap-2 p-4 m-2 rounded-lg hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-300 group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Inspection Due</div>
                </div>
                <div className="text-sm text-muted-foreground pl-4">Green Valley Farm inspection scheduled for tomorrow</div>
                <div className="text-xs text-muted-foreground/70 pl-4">2 hours ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-2 p-4 m-2 rounded-lg hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-300 group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Certificate Expiring</div>
                </div>
                <div className="text-sm text-muted-foreground pl-4">Sunrise Organic Farm certificate expires in 30 days</div>
                <div className="text-xs text-muted-foreground/70 pl-4">1 day ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-2 p-4 m-2 rounded-lg hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-300 group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">New Application</div>
                </div>
                <div className="text-sm text-muted-foreground pl-4">
                  Fresh Fields Farm submitted certification application
                </div>
                <div className="text-xs text-muted-foreground/70 pl-4">3 days ago</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="group relative">
            <div className="flex items-center gap-3 h-auto py-2 px-3 md:px-4 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md border border-transparent hover:border-border/20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur group-hover:blur-md transition-all duration-300" />
                <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center border border-primary/20 shadow-sm">
                  <span className="text-xs font-bold text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-0 hidden lg:flex">
                <span className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-300">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground leading-tight font-medium">Agronomist</span>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-full mt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl p-2">
                <div
                  onClick={() => router.push('/profile')}
                  className="flex items-center w-full px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 rounded-lg cursor-pointer transition-all duration-300 group/item font-medium"
                >
                  <User className="w-4 h-4 mr-3 text-muted-foreground group-hover/item:text-primary transition-colors duration-300" />
                  <span className="group-hover/item:text-primary transition-colors duration-300">Profile</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-1"></div>
                <div
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50/50 dark:hover:from-red-950/20 dark:hover:to-red-950/10 rounded-lg cursor-pointer transition-all duration-300 group/item font-medium"
                >
                  <LogOut className="w-4 h-4 mr-3 group-hover/item:scale-110 transition-transform duration-300" />
                  <span className="group-hover/item:text-red-700 dark:group-hover/item:text-red-400 transition-colors duration-300">Logout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

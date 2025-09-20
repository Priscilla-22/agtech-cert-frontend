import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  blur?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", blur = "md", children, ...props }, ref) => {
    const variants = {
      default: "from-card/60 to-card/40 border-border/50",
      primary: "from-primary/10 to-accent/10 border-primary/20",
      success: "from-green-500/10 to-emerald-500/10 border-green-500/20",
      warning: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
      danger: "from-red-500/10 to-rose-500/10 border-red-500/20",
    }

    const blurLevels = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-gradient-to-br",
          variants[variant],
          blurLevels[blur],
          "group hover:scale-[1.02] hover:-translate-y-1",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
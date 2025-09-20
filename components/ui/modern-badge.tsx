import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernBadgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 hover:from-primary/20 hover:to-accent/20",
        secondary:
          "bg-gradient-to-r from-secondary/60 to-secondary/40 text-secondary-foreground border-secondary/30",
        success:
          "bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
        warning:
          "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
        danger:
          "bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-700 border-red-500/20 dark:text-red-400",
        outline:
          "bg-gradient-to-r from-background/80 to-background/60 text-foreground border-border hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "px-3 py-1 text-xs h-6",
        sm: "px-2 py-0.5 text-xs h-5",
        lg: "px-4 py-2 text-sm h-8",
        xl: "px-6 py-3 text-base h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ModernBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modernBadgeVariants> {
  icon?: React.ReactNode
  pulse?: boolean
}

function ModernBadge({ className, variant, size, icon, pulse, children, ...props }: ModernBadgeProps) {
  return (
    <div className={cn(modernBadgeVariants({ variant, size }), className)} {...props}>
      {pulse && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse" />
      )}
      <div className="relative z-10 flex items-center gap-1">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    </div>
  )
}

export { ModernBadge, modernBadgeVariants }
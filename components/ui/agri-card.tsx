import * as React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface AgriCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'organic' | 'sustainable' | 'precision' | 'inspection' | 'certificate' | 'farmer'
  status?: 'active' | 'pending' | 'completed' | 'expired' | 'warning'
  interactive?: boolean
  icon?: LucideIcon
  iconColor?: string
}

const AgriCard = React.forwardRef<HTMLDivElement, AgriCardProps>(
  ({ className, variant = 'organic', status, interactive = false, icon: Icon, iconColor, children, ...props }, ref) => {

    const variants = {
      organic: {
        bg: 'bg-card',
        border: 'border border-border',
        accent: 'from-transparent to-transparent'
      },
      sustainable: {
        bg: 'bg-card',
        border: 'border border-border',
        accent: 'from-transparent to-transparent'
      },
      precision: {
        bg: 'bg-card',
        border: 'border border-border',
        accent: 'from-transparent to-transparent'
      },
      inspection: {
        bg: 'bg-card',
        border: 'border border-border',
        accent: 'from-transparent to-transparent'
      },
      certificate: {
        bg: 'bg-card',
        border: 'border border-border',
        accent: 'from-transparent to-transparent'
      },
      farmer: {
        bg: 'bg-card',
        border: 'border border-border',
        accent: 'from-transparent to-transparent'
      }
    }

    const statusStyles = {
      active: 'ring-2 ring-emerald-500/30 shadow-emerald-500/20',
      pending: 'ring-2 ring-amber-500/30 shadow-amber-500/20',
      completed: 'ring-2 ring-blue-500/30 shadow-blue-500/20',
      expired: 'ring-2 ring-red-500/30 shadow-red-500/20',
      warning: 'ring-2 ring-orange-500/30 shadow-orange-500/20'
    }

    const variantStyle = variants[variant]

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden rounded-xl transition-all duration-200 ease-out',

          // Variant styles
          variantStyle.bg,
          variantStyle.border,

          // Status styles
          status && statusStyles[status],

          // Shadow and elevation
          'shadow-sm hover:shadow-md',

          // Interactive styles
          interactive && 'cursor-pointer',

          className
        )}
        {...props}
      >

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

      </div>
    )
  }
)

AgriCard.displayName = "AgriCard"

const AgriCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-20 px-6 py-5 space-y-2', className)}
      {...props}
    />
  )
)
AgriCardHeader.displayName = "AgriCardHeader"

const AgriCardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-lg font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors duration-300', className)}
      {...props}
    />
  )
)
AgriCardTitle.displayName = "AgriCardTitle"

const AgriCardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm text-muted-foreground leading-relaxed', className)}
      {...props}
    />
  )
)
AgriCardDescription.displayName = "AgriCardDescription"

const AgriCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-20 px-6 pb-4', className)}
      {...props}
    />
  )
)
AgriCardContent.displayName = "AgriCardContent"

const AgriCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-20 px-6 py-4 mt-auto border-t border-border/30 bg-gradient-to-r from-transparent via-background/20 to-transparent', className)}
      {...props}
    />
  )
)
AgriCardFooter.displayName = "AgriCardFooter"

export {
  AgriCard,
  AgriCardHeader,
  AgriCardTitle,
  AgriCardDescription,
  AgriCardContent,
  AgriCardFooter
}
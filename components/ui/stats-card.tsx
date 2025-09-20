import * as React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'agricultural'
  className?: string
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, description, icon: Icon, iconColor, trend, variant = 'default', className }, ref) => {
    const variants = {
      default: {
        bg: 'bg-card',
        border: 'border-border',
        icon: 'text-muted-foreground',
        iconBg: 'bg-muted/10'
      },
      primary: {
        bg: 'bg-card',
        border: 'border-border',
        icon: 'text-primary',
        iconBg: 'bg-primary/5'
      },
      success: {
        bg: 'bg-card',
        border: 'border-border',
        icon: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-500/5'
      },
      warning: {
        bg: 'bg-card',
        border: 'border-border',
        icon: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-500/5'
      },
      danger: {
        bg: 'bg-card',
        border: 'border-border',
        icon: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-500/5'
      },
      agricultural: {
        bg: 'bg-card',
        border: 'border-border',
        icon: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-500/5'
      }
    }

    const variantStyle = variants[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ease-out cursor-default',
          variantStyle.bg,
          variantStyle.border,
          className
        )}
      >

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {title}
                </h3>
                <span className="text-3xl font-bold text-foreground font-mono tracking-tight block">
                  {value}
                </span>
                {description && (
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {Icon && (
              <div className="relative">
                {/* Icon container */}
                <div className={cn(
                  'relative w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300',
                  variantStyle.iconBg,
                  variantStyle.border,
                )}>
                  <Icon className={cn('w-6 h-6 transition-colors duration-300', iconColor || variantStyle.icon)} />
                </div>
              </div>
            )}
          </div>

          {/* Progress indicator */}
          {trend && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{trend.label}</span>
                  <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                    trend.isPositive === true ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                    trend.isPositive === false ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-muted text-muted-foreground'
                  )}>
                    <span>{trend.isPositive === true ? '↗' : trend.isPositive === false ? '↘' : '•'}</span>
                    <span>{trend.value}%</span>
                  </div>
                </div>
                <span className="font-medium">vs last month</span>
              </div>
            </div>
          )}
        </div>

      </div>
    )
  }
)

StatsCard.displayName = "StatsCard"

export { StatsCard }
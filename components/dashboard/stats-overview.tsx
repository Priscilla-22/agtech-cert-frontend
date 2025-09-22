"use client"

import { StatsCard } from "@/components/ui/stats-card"
import { StatItem } from "@/lib/types/dashboard"

interface StatsOverviewProps {
  stats: StatItem[]
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
      {stats.map((stat: StatItem, index: number) => {
        const Icon = stat.icon
        const variants = ['default', 'default', 'default', 'default']
        const iconColors = ['text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-purple-600']
        const variant = variants[index % variants.length]
        const iconColor = iconColors[index % iconColors.length]

        return (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={Icon}
            iconColor={iconColor}
            variant={variant}
            trend={{
              value: Math.floor(Math.random() * 20) + 5,
              label: "Growth",
              isPositive: Math.random() > 0.3
            }}
          />
        )
      })}
    </div>
  )
}
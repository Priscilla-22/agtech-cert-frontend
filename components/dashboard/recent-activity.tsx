"use client"

import { AgriCard, AgriCardContent, AgriCardDescription, AgriCardHeader, AgriCardTitle } from "@/components/ui/agri-card"
import { Calendar, CheckCircle2, Award, AlertTriangle } from "lucide-react"
import { ActivityItem } from "@/lib/types/dashboard"

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  function getActivityIcon(status: string) {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case "success":
        return <Award className="w-4 h-4 text-primary" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case "pending":
        return <Calendar className="w-4 h-4 text-blue-500" />
      default:
        return <Calendar className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <AgriCard variant="sustainable" interactive>
      <AgriCardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <AgriCardTitle className="text-xl font-bold">Recent Activity</AgriCardTitle>
            <AgriCardDescription>Latest updates and notifications</AgriCardDescription>
          </div>
          <div className="w-3 h-3 rounded-full bg-muted-foreground" />
        </div>
      </AgriCardHeader>
      <AgriCardContent className="space-y-4 p-6 pt-0">
        {activities.length > 0 ? (
          activities.map((activity: ActivityItem) => (
            <div key={activity.id} className="group/item flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 hover:from-muted/50 hover:to-muted/20 transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="flex-shrink-0 mt-0.5">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur group-hover/item:bg-primary/20 transition-colors duration-300" />
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border/50">
                    {getActivityIcon(activity.status)}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.farmer}</p>
                <p className="text-xs text-muted-foreground/80">{activity.time}</p>
              </div>
              <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground/70">Recent inspections and certificates will appear here</p>
          </div>
        )}
      </AgriCardContent>
    </AgriCard>
  )
}
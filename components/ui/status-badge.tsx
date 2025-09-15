import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "approved" | "rejected" | "expired"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    active: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
    inactive: "bg-gray-50 text-gray-700 hover:bg-gray-50 border border-gray-200",
    pending: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border border-yellow-200",
    approved: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
    rejected: "bg-red-50 text-red-700 hover:bg-red-50 border border-red-200",
    expired: "bg-red-50 text-red-700 hover:bg-red-50 border border-red-200",
  }

  return (
    <Badge variant="secondary" className={cn(variants[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "approved" | "rejected" | "expired" | "draft" | "submitted" | "scheduled" | "in_progress" | "completed" | "failed" | "cancelled" | "renewal_pending" | "revoked" | "suspended"
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
    draft: "bg-gray-50 text-gray-700 hover:bg-gray-50 border border-gray-200",
    submitted: "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200",
    scheduled: "bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200",
    in_progress: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border border-yellow-200",
    completed: "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200",
    failed: "bg-red-50 text-red-700 hover:bg-red-50 border border-red-200",
    cancelled: "bg-gray-50 text-gray-700 hover:bg-gray-50 border border-gray-200",
    renewal_pending: "bg-orange-50 text-orange-700 hover:bg-orange-50 border border-orange-200",
    revoked: "bg-red-50 text-red-700 hover:bg-red-50 border border-red-200",
    suspended: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border border-yellow-200",
  }

  const statusLabels = {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    expired: "Expired",
    draft: "Draft",
    submitted: "Submitted",
    scheduled: "Scheduled",
    in_progress: "In Progress",
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
    renewal_pending: "Awaiting Renewal",
    revoked: "Revoked",
    suspended: "Suspended"
  }

  return (
    <Badge variant="secondary" className={cn(variants[status], className)}>
      {statusLabels[status]}
    </Badge>
  )
}

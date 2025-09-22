"use client"

import { Badge } from "@/components/ui/badge"
import { MaterialDatePicker } from "@/components/ui/material-date-picker"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import {
  Card as MTCard,
  CardBody as MTCardBody,
  CardHeader as MTCardHeader,
  Typography,
} from "@material-tailwind/react"
import { DateRange, DashboardFilters } from "@/lib/types/dashboard"

interface DashboardFiltersProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  searchFilter: string
  setSearchFilter: (search: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  appliedFilters: DashboardFilters
  onApplyFilters: () => void
  onResetFilters: () => void
}

export function DashboardFiltersComponent({
  showFilters,
  setShowFilters,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  searchFilter,
  setSearchFilter,
  typeFilter,
  setTypeFilter,
  appliedFilters,
  onApplyFilters,
  onResetFilters,
}: DashboardFiltersProps) {
  const { toast } = useToast()

  function handleApplyFilters() {
    onApplyFilters()
    toast({
      title: "Filters Applied",
      description: "Your filters have been applied to the dashboard data.",
    })
  }

  if (!showFilters) return null

  return (
    <MTCard className="w-full border-2 border-blue-200 shadow-lg my-8">
      <MTCardHeader className="flex flex-row items-center justify-between px-8 py-6">
        <Typography variant="h6" className="text-blue-gray-800">
          Global Filters
        </Typography>
        <button
          onClick={() => setShowFilters(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </MTCardHeader>
      <MTCardBody className="px-8 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MaterialDatePicker
            value={dateRange}
            onChange={setDateRange}
            label="Date Range"
            className="w-full"
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="organic">Organic Crop</option>
              <option value="livestock">Organic Livestock</option>
              <option value="processing">Processing</option>
              <option value="wild">Wild Harvest</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search farmers, certificates..."
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {appliedFilters.dateRange.from && (
              <Badge className="text-xs flex items-center gap-1 bg-blue-100 text-blue-800">
                {appliedFilters.dateRange.from.toLocaleDateString()}
                {appliedFilters.dateRange.to && ` - ${appliedFilters.dateRange.to.toLocaleDateString()}`}
              </Badge>
            )}
            {appliedFilters.statusFilter !== "all" && (
              <Badge className="text-xs bg-green-100 text-green-800">
                Status: {appliedFilters.statusFilter}
              </Badge>
            )}
            {appliedFilters.typeFilter !== "all" && (
              <Badge className="text-xs bg-purple-100 text-purple-800">
                Type: {appliedFilters.typeFilter}
              </Badge>
            )}
            {appliedFilters.searchFilter && (
              <Badge className="text-xs bg-yellow-100 text-yellow-800">
                Search: {appliedFilters.searchFilter}
              </Badge>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </MTCardBody>
    </MTCard>
  )
}
"use client"

import * as React from "react"
import { useState } from "react"
import {
  Input,
  Typography,
  Button,
  Card,
  CardBody,
} from "@material-tailwind/react"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import "react-day-picker/dist/style.css"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface MaterialDatePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  label?: string
  className?: string
}

const MaterialDatePicker: React.FC<MaterialDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date range",
  label = "Date Range",
  className
}) => {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange>(value || { from: undefined, to: undefined })

  const handleSelect = (selectedRange: DateRange | undefined) => {
    const newRange = selectedRange || { from: undefined, to: undefined }
    setRange(newRange)
    if (onChange) {
      onChange(newRange)
    }
  }

  const formatDateRange = (dateRange: DateRange) => {
    if (!dateRange.from) return ""
    if (!dateRange.to) return format(dateRange.from, "MMM dd, yyyy")
    return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
  }

  const clearSelection = () => {
    const newRange = { from: undefined, to: undefined }
    setRange(newRange)
    if (onChange) {
      onChange(newRange)
    }
    setOpen(false)
  }

  const applySelection = () => {
    setOpen(false)
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Input
              label={label}
              value={formatDateRange(range)}
              placeholder={placeholder}
              readOnly
              icon={<CalendarDaysIcon className="w-4 h-4" />}
              className="cursor-pointer"
              containerProps={{ className: "cursor-pointer" }}
              onClick={() => setOpen(!open)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Card className="border-0 shadow-lg">
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Select Date Range
              </Typography>

              <DayPicker
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={2}
                className="border-0"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "space-x-1 flex items-center",
                  nav_button: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: "inline-flex items-center justify-center rounded-md text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  day_range_end: "day-range-end",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "day-outside text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                  day_hidden: "invisible",
                }}
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Clear
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applySelection}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { MaterialDatePicker }
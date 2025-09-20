"use client"

import * as React from "react"
import { useState, useRef } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip
} from "recharts"
import {
  Download,
  MoreVertical,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartData {
  [key: string]: any
}

interface EnhancedChartProps {
  title: string
  description?: string
  data: ChartData[]
  config: Record<string, { label: string; color: string }>
  defaultChartType?: 'line' | 'bar' | 'pie'
  allowedTypes?: ('line' | 'bar' | 'pie')[]
  className?: string
  height?: string
}

const EnhancedChart: React.FC<EnhancedChartProps> = ({
  title,
  description,
  data,
  config,
  defaultChartType = 'line',
  allowedTypes = ['line', 'bar', 'pie'],
  className,
  height = "h-[300px]"
}) => {
  const [chartType, setChartType] = useState(defaultChartType)
  const [isExporting, setIsExporting] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  const downloadChart = async (format: 'png' | 'svg' | 'csv') => {
    setIsExporting(true)
    const filename = title.toLowerCase().replace(/\s+/g, '-')

    try {
      if (format === 'csv') {
        // Convert data to CSV
        const headers = Object.keys(data[0] || {})
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        return
      }

      if (!chartRef.current) return
      if (format === 'svg') {
        // Find SVG element in the chart
        const svgElement = chartRef.current.querySelector('svg')
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement)
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(svgBlob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.svg`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      } else if (format === 'png') {
        // Convert SVG to Canvas then to PNG
        const svgElement = chartRef.current.querySelector('svg')
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()

          canvas.width = svgElement.clientWidth || 800
          canvas.height = svgElement.clientHeight || 400

          // Set white background
          if (ctx) {
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }

          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(svgBlob)

          img.onload = () => {
            ctx?.drawImage(img, 0, 0)
            canvas.toBlob((blob) => {
              if (blob) {
                const pngUrl = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = pngUrl
                a.download = `${filename}.png`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(pngUrl)
              }
            })
            URL.revokeObjectURL(url)
          }

          img.src = url
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Failed to export ${format.toUpperCase()}. Please try again.`)
    } finally {
      setIsExporting(false)
    }
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChart3 className="w-4 h-4" />
      case 'line': return <LineChartIcon className="w-4 h-4" />
      case 'pie': return <PieChartIcon className="w-4 h-4" />
      default: return <TrendingUp className="w-4 h-4" />
    }
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {Object.entries(config).map(([key, { color }]) => (
              <Bar key={key} dataKey={key} fill={color} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        )

      case 'pie':
        // For pie charts, we need to transform the data
        const pieData = Object.entries(config).map(([key, { label, color }]) => ({
          name: label,
          value: data.reduce((sum, item) => sum + (item[key] || 0), 0),
          color
        }))

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        )

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {Object.entries(config).map(([key, { color }]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
              />
            ))}
          </LineChart>
        )
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          {allowedTypes.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  {getChartIcon(chartType)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {allowedTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setChartType(type)}
                    className={cn(
                      "flex items-center gap-2",
                      chartType === type && "bg-accent"
                    )}
                  >
                    {getChartIcon(type)}
                    <span className="capitalize">{type} Chart</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Download Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Download className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => downloadChart('png')}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Download PNG'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => downloadChart('svg')}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Download SVG'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => downloadChart('csv')}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="w-4 h-4 mr-2" />
                Full Screen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div ref={chartRef} className={cn(height)}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export { EnhancedChart }
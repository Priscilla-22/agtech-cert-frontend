"use client"

import * as React from "react"
import { useState } from "react"
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react"
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
  ChartBarIcon,
  ChartPieIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"
import {
  LineChartIcon,
} from "lucide-react"

interface ChartData {
  [key: string]: any
}

interface MaterialChartProps {
  title: string
  description?: string
  data: ChartData[]
  config: Record<string, { label: string; color: string }>
  defaultChartType?: 'line' | 'bar' | 'pie'
  allowedTypes?: ('line' | 'bar' | 'pie')[]
  className?: string
  height?: number
}

const MaterialChart: React.FC<MaterialChartProps> = ({
  title,
  description,
  data,
  config,
  defaultChartType = 'line',
  allowedTypes = ['line', 'bar', 'pie'],
  className,
  height = 300
}) => {
  const [chartType, setChartType] = useState(defaultChartType)
  const [isExporting, setIsExporting] = useState(false)

  const downloadChart = async (format: 'png' | 'svg' | 'csv') => {
    setIsExporting(true)
    const filename = title.toLowerCase().replace(/\s+/g, '-')

    try {
      if (format === 'csv') {
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
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <ChartBarIcon className="w-4 h-4" />
      case 'line': return <LineChartIcon className="w-4 h-4" />
      case 'pie': return <ChartPieIcon className="w-4 h-4" />
      default: return <ChartBarIcon className="w-4 h-4" />
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
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            {Object.entries(config).map(([key, { color }]) => (
              <Bar key={key} dataKey={key} fill={color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        )

      case 'pie':
        // Handle pie data format (already structured with name, value, color)
        const pieData = data.length > 0 && data[0].name ? data :
          Object.entries(config).map(([key, { label, color }]) => ({
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
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-1">
            {title}
          </Typography>
          {description && (
            <Typography variant="small" color="gray" className="font-normal">
              {description}
            </Typography>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          {allowedTypes.length > 1 && (
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'pie')}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              {allowedTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          )}

          {/* Download Button */}
          <button
            onClick={() => downloadChart('csv')}
            disabled={isExporting}
            className="text-xs px-1.5 py-0.5 text-white rounded-md hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#f4a261' }}
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

export { MaterialChart }
"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { FileText, Download, FileSpreadsheet } from "lucide-react"

export type ExportFormat = 'pdf' | 'excel' | 'csv'

interface ExportButtonProps {
  format: ExportFormat
  data: any[]
  filename?: string
  title?: string
  subtitle?: string
  onExportStart?: () => void
  onExportComplete?: () => void
  onExportError?: (error: Error) => void
  className?: string
  disabled?: boolean
}

export function ExportButton({
  format,
  data,
  filename,
  title = 'Data Export',
  subtitle,
  onExportStart,
  onExportComplete,
  onExportError,
  className = '',
  disabled = false
}: ExportButtonProps) {
  const handleExport = async () => {
    if (disabled || !data || data.length === 0) {
      onExportError?.(new Error('No data available for export'))
      return
    }

    onExportStart?.()

    try {
      if (format === 'pdf') {
        const { exportToPDF } = await import('@/lib/exports/pdfExporter')
        await exportToPDF({
          data,
          filename: filename || `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
          title,
          subtitle
        })
      } else if (format === 'excel') {
        const { exportToExcel } = await import('@/lib/exports/excelExporter')
        await exportToExcel({
          data,
          filename: filename || `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`,
          title
        })
      } else if (format === 'csv') {
        const { exportToCSV } = await import('@/lib/exports/csvExporter')
        await exportToCSV({
          data,
          filename: filename || `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
          title,
          subtitle
        })
      }

      onExportComplete?.()
    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
      onExportError?.(error instanceof Error ? error : new Error(`Failed to export ${format}`))
    }
  }

  const buttonConfig = {
    pdf: {
      icon: FileText,
      label: 'PDF',
      color: '#A8C5E2'
    },
    excel: {
      icon: Download,
      label: 'Excel',
      color: '#16a34a'
    },
    csv: {
      icon: FileSpreadsheet,
      label: 'CSV',
      color: '#f59e0b'
    }
  }

  const config = buttonConfig[format]
  const Icon = config.icon

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className={`h-10 px-4 py-2 text-sm font-medium hover:opacity-90 transition-all duration-200 rounded-md border border-gray-300 ${className}`}
      style={{
        backgroundColor: config.color,
        color: format === 'excel' ? '#ffffff' : format === 'csv' ? '#ffffff' : '#1f2937'
      }}
    >
      <Icon className="w-4 h-4 mr-2" />
      <span>{config.label}</span>
    </Button>
  )
}
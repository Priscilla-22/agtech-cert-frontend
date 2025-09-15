"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, Download, FileText } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  onDownloadPDF?: () => void
  onDownloadExcel?: () => void
  showSearch?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  onDownloadPDF,
  onDownloadExcel,
  showSearch = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isMobileView, setIsMobileView] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Check for mobile view
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile card view
  const renderMobileView = () => (
    <div className="space-y-3">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <div key={row.id} className="mobile-card">
            <div className="mobile-card-content">
              {row.getVisibleCells().map((cell, index) => {
                const column = cell.column.columnDef as any
                const header = column.header
                const value = cell.getValue()

                // Skip row number column in mobile view
                if (cell.column.id === 'row-number') return null

                return (
                  <div key={cell.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-muted-foreground text-sm">
                      {typeof header === 'string' ? header : ''}
                    </span>
                    <div className="text-right">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="mobile-card">
          <div className="mobile-card-content text-center py-8">
            <p className="text-muted-foreground">No results.</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {(searchKey && showSearch) || (onDownloadPDF || onDownloadExcel) ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {searchKey && showSearch && (
            <div className="relative flex-1 max-w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Download Buttons */}
          {(onDownloadPDF || onDownloadExcel) && (
            <div className="flex items-center gap-2 md:gap-3">
              {onDownloadPDF && (
                <Button
                  onClick={onDownloadPDF}
                  className="flex-1 md:flex-none rounded-full px-3 md:px-4 py-2 text-sm font-medium hover:opacity-90 transition-all duration-200"
                  style={{ backgroundColor: '#A8C5E2', color: '#1f2937' }}
                >
                  <FileText className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">PDF</span>
                </Button>
              )}
              {onDownloadExcel && (
                <Button
                  onClick={onDownloadExcel}
                  className="flex-1 md:flex-none rounded-full px-3 md:px-4 py-2 text-white text-sm font-medium hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  <Download className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Excel</span>
                </Button>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Mobile View */}
      <div className="md:hidden">
        {renderMobileView()}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block rounded-md border overflow-auto">
        <Table>
          <TableHeader style={{ backgroundColor: '#CBDDE9' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b-2 border-gray-200" style={{ backgroundColor: '#CBDDE9' }}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-gray-900 py-4 px-6 border-r border-gray-300 last:border-r-0" style={{ backgroundColor: '#CBDDE9' }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground text-center md:text-left">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="text-sm text-muted-foreground px-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

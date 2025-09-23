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

  // Check for mobile view (under 640px shows cards, above shows table with horizontal scroll)
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 640) // Changed to sm breakpoint instead of md
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

      {/* Mobile Card View */}
      <div className="sm:hidden">
        {renderMobileView()}
      </div>

      {/* Tablet and Desktop Table View with Horizontal Scroll */}
      <div className="hidden sm:block rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
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
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground text-center md:text-left">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center justify-center gap-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* First Page */}
          {table.getState().pagination.pageIndex > 2 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50"
              >
                1
              </Button>
              {table.getState().pagination.pageIndex > 3 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
            </>
          )}

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
            const currentPage = table.getState().pagination.pageIndex
            const totalPages = table.getPageCount()

            // Calculate the range of pages to show
            let startPage = Math.max(0, currentPage - 2)
            let endPage = Math.min(totalPages - 1, startPage + 4)

            // Adjust start if we're near the end
            if (endPage - startPage < 4) {
              startPage = Math.max(0, endPage - 4)
            }

            const pageIndex = startPage + i

            if (pageIndex > endPage) return null

            const isCurrentPage = pageIndex === currentPage

            return (
              <Button
                key={pageIndex}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(pageIndex)}
                className={`w-10 h-10 p-0 rounded-full ${
                  isCurrentPage
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageIndex + 1}
              </Button>
            )
          })}

          {/* Last Page */}
          {table.getState().pagination.pageIndex < table.getPageCount() - 3 && table.getPageCount() > 5 && (
            <>
              {table.getState().pagination.pageIndex < table.getPageCount() - 4 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50"
              >
                {table.getPageCount()}
              </Button>
            </>
          )}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-10 h-10 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

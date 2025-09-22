"use client"

import { StatusBadge } from "@/components/ui/status-badge"
import type { ColumnDef } from "@tanstack/react-table"
import { Farmer } from "@/lib/types/farmer"
import { FarmerActions } from "./farmer-actions"

export function createFarmerColumns(onDelete: (farmerId: string) => void): ColumnDef<Farmer>[] {
  return [
    {
      id: "row-number",
      header: "#",
      cell: ({ row }) => (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {row.index + 1}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "totalFarms",
      header: "Farms",
      cell: ({ row }) => <span className="font-medium">{row.getValue("totalFarms")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "certificationStatus",
      header: "Certification",
      cell: ({ row }) => <StatusBadge status={row.getValue("certificationStatus")} />,
    },
    {
      accessorKey: "registrationDate",
      header: "Registered",
      cell: ({ row }) => {
        const date = new Date(row.getValue("registrationDate"))
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const farmer = row.original
        return <FarmerActions farmer={farmer} onDelete={onDelete} />
      },
    },
  ]
}
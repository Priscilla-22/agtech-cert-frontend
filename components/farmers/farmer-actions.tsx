"use client"

import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteFarmer } from "@/lib/services/farmer-service"
import { Farmer } from "@/lib/types/farmer"

interface FarmerActionsProps {
  farmer: Farmer
  onDelete: (farmerId: string) => void
}

export function FarmerActions({ farmer, onDelete }: FarmerActionsProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    const confirmed = confirm(
      `Are you sure you want to delete ${farmer.name}? This action cannot be undone and will also delete all associated farms and data.`
    )

    if (!confirmed) {
      setShowMenu(false)
      return
    }

    try {
      setIsDeleting(true)
      await deleteFarmer(farmer.id)
      onDelete(farmer.id)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete farmer. Please try again.'
      alert(errorMessage)
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  function handleView() {
    router.push(`/farmers/${farmer.id}`)
    setShowMenu(false)
  }

  function handleEdit() {
    router.push(`/farmers/${farmer.id}/edit`)
    setShowMenu(false)
  }

  return (
    <div className="relative flex items-center justify-center">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-muted"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Open actions menu"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          <div className="absolute right-0 top-8 z-50 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              onClick={handleView}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              onClick={handleEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Farmer
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center disabled:opacity-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete Farmer'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
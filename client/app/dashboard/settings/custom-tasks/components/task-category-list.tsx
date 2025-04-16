"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Trash2, FolderOpen, AlertTriangle } from "lucide-react"
import { EmptyState } from "./empty-state-custom"
import type { TaskCategory } from "../types"

interface TaskCategoryListProps {
  categories: TaskCategory[]
  onRemoveCategory: (id: string) => void
}

export function TaskCategoryList({ categories, onRemoveCategory }: TaskCategoryListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<TaskCategory | null>(null)

  const handleDeleteClick = (category: TaskCategory) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      onRemoveCategory(categoryToDelete.id)
      toast.success(`Category "${categoryToDelete.name}" removed successfully`)
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {categories.length === 0 ? (
        <EmptyState
          title="No Categories"
          description="Create your first category to organize your tasks"
          icon={<FolderOpen className="h-10 w-10 text-muted-foreground" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: category.color }}></div>
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.color}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)} className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="mt-4">
                  <Badge variant="outline">{/* TODO: Add task count */} tasks</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the category "{categoryToDelete?.name}"? This action cannot be undone.
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Warning:</p>
                  <p className="mt-1 text-sm">
                    Tasks in this category will not be deleted, but they will be moved to "Uncategorized".
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remove Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

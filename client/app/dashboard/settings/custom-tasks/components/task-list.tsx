"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Search, AlertTriangle, Activity } from "lucide-react"
import { EmptyState } from "./empty-state-custom"
import { TaskCard } from "./task-card"
import type { CustomTask, TaskCategory } from "../types"

interface TaskListProps {
  tasks: CustomTask[]
  categories: TaskCategory[]
  onRemoveTask: (id: string) => void
}

export function TaskList({ tasks, categories, onRemoveTask }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<CustomTask | null>(null)

  const handleDeleteClick = (task: CustomTask) => {
    setTaskToDelete(task)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (taskToDelete) {
      onRemoveTask(taskToDelete.id)
      toast.success(`Task "${taskToDelete.name}" removed successfully`)
      setDeleteDialogOpen(false)
      setTaskToDelete(null)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.placeholder.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesCategory = categoryFilter ? task.categoryId === categoryFilter : true
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true

    return matchesSearch && matchesCategory && matchesPriority
  })

  const getTasksByCategory = () => {
    const tasksByCategory: Record<string, CustomTask[]> = {}

    categories.forEach((category) => {
      tasksByCategory[category.id] = filteredTasks.filter((task) => task.categoryId === category.id)
    })

    // Add uncategorized tasks
    tasksByCategory["uncategorized"] = filteredTasks.filter(
      (task) => !categories.some((category) => category.id === task.categoryId),
    )

    return tasksByCategory
  }

  const tasksByCategory = getTasksByCategory()

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#6b7280"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Task Filters</CardTitle>
          <CardDescription>Filter tasks by name, category, or priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tasks..."
                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={categoryFilter || ""}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={priorityFilter || ""}
                onChange={(e) => setPriorityFilter(e.target.value || null)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No Tasks Found"
          description={
            searchQuery || categoryFilter || priorityFilter
              ? "Try adjusting your filters to find what you're looking for"
              : "Create your first task to get started"
          }
          icon={<Activity className="h-10 w-10 text-muted-foreground" />}
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="by-category">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  categoryName={getCategoryName(task.categoryId)}
                  categoryColor={getCategoryColor(task.categoryId)}
                  onDelete={() => handleDeleteClick(task)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="by-category">
            <div className="space-y-6">
              {Object.entries(tasksByCategory).map(([categoryId, tasks]) => {
                if (tasks.length === 0) return null

                return (
                  <div key={categoryId} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(categoryId) }}
                      ></div>
                      <h3 className="text-lg font-medium">{getCategoryName(categoryId)}</h3>
                      <Badge variant="outline">{tasks.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          categoryName={getCategoryName(task.categoryId)}
                          categoryColor={getCategoryColor(task.categoryId)}
                          onDelete={() => handleDeleteClick(task)}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the task "{taskToDelete?.name}"? This action cannot be undone.
              {taskToDelete?.clients && taskToDelete.clients.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      This task is currently assigned to {taskToDelete.clients.length} client(s):
                    </p>
                    <ul className="list-disc list-inside mt-1 text-sm">
                      {taskToDelete.clients.map((client) => (
                        <li key={client.id}>{client.name}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm">
                      Removing this task will also remove it from these clients' required tasks.
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remove Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

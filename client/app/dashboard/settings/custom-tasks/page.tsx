"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskList } from "./components/task-list"
import { TaskUsageStats } from "./components/task-usage-stats"
import { TaskCategoryList } from "./components/task-category-list"
import { Plus, ListChecks, BarChart2, FolderPlus } from "lucide-react"
import { useCustomTasks } from "./hooks/use-custom-tasks"
import type { CustomTask, TaskCategory } from "./types"

export default function CustomTasksPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("tasks")
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)
    const { tasks, categories, addTask, removeTask, addCategory, removeCategory } = useCustomTasks()

    const handleCategoryCreated = (category: TaskCategory) => {
        addCategory(category)
        setIsCreatingCategory(false)
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Custom Tasks</h1>
                <p className="text-muted-foreground">
                    Create and manage custom tasks for care workers to complete during visits
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList>
                        <TabsTrigger value="tasks" className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4" />
                            <span>Tasks</span>
                        </TabsTrigger>
                        <TabsTrigger value="categories" className="flex items-center gap-2">
                            <FolderPlus className="h-4 w-4" />
                            <span>Categories</span>
                        </TabsTrigger>
                        <TabsTrigger value="usage" className="flex items-center gap-2">
                            <BarChart2 className="h-4 w-4" />
                            <span>Usage</span>
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === "tasks" && (
                        <Button
                            onClick={() => router.push("/dashboard/settings/custom-tasks/create")}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Task</span>
                        </Button>
                    )}

                    {activeTab === "categories" && (
                        <Button onClick={() => setIsCreatingCategory(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add Category</span>
                        </Button>
                    )}
                </div>

                <TabsContent value="tasks">
                    <TaskList tasks={tasks} categories={categories} onRemoveTask={removeTask} />
                </TabsContent>

                <TabsContent value="categories">
                    {isCreatingCategory ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Category</CardTitle>
                                <CardDescription>Define a new category to organize your tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">
                                                Category Name
                                            </label>
                                            <input
                                                id="name"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="e.g., Health Monitoring, Safety Checks"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="color" className="text-sm font-medium">
                                                Category Color
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    id="color"
                                                    className="w-10 h-10 p-1 rounded border"
                                                    defaultValue="#4f46e5"
                                                />
                                                <input
                                                    id="colorHex"
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    defaultValue="#4f46e5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsCreatingCategory(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleCategoryCreated({
                                                    id: crypto.randomUUID(),
                                                    name: "Health Monitoring",
                                                    color: "#4f46e5",
                                                })
                                            }
                                        >
                                            Create Category
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <TaskCategoryList categories={categories} onRemoveCategory={removeCategory} />
                    )}
                </TabsContent>

                <TabsContent value="usage">
                    <TaskUsageStats tasks={tasks} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

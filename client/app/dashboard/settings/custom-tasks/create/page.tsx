"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TaskCreator } from "../components/task-creator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { CustomTask, TaskCategory } from "../types"

// Mock data - replace with your actual data fetching logic
const mockCategories: TaskCategory[] = [
    { id: "1", name: "Health Monitoring", color: "#FF0000" },
    { id: "2", name: "Medication", color: "#00FF00" },
    { id: "3", name: "Personal Care", color: "#0000FF" },
]

export default function CreateTaskPage() {
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)

    const handleTaskCreated = async (task: CustomTask) => {
        setIsCreating(true)
        try {
            // TODO: Add your API call here to save the task
            console.log("Task created:", task)
            router.push("/dashboard/settings/custom-tasks")
        } catch (error) {
            console.error("Failed to create task:", error)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-8 w-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold">Create New Task</h1>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <TaskCreator
                    categories={mockCategories}
                    onTaskCreated={handleTaskCreated}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    )
} 
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"
import { IconSelector } from "./icon-selector"
import type { CustomTask, TaskCategory } from "../types"

interface TaskCreatorProps {
  categories: TaskCategory[]
  onTaskCreated: (task: CustomTask) => void
  onCancel: () => void
  editTask?: CustomTask
}

export function TaskCreator({ categories, onTaskCreated, onCancel, editTask }: TaskCreatorProps) {
  const [name, setName] = useState(editTask?.name || "")
  const [placeholder, setPlaceholder] = useState(editTask?.placeholder || "")
  const [selectedIcon, setSelectedIcon] = useState(editTask?.icon || "activity")
  const [categoryId, setCategoryId] = useState(editTask?.categoryId || categories[0]?.id || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(editTask?.priority || "medium")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "as-needed">(editTask?.frequency || "as-needed")
  const [nameError, setNameError] = useState("")

  const validateForm = () => {
    let isValid = true

    if (!name.trim()) {
      setNameError("Task name is required")
      isValid = false
    } else {
      setNameError("")
    }

    return isValid
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const newTask: CustomTask = {
      id: editTask?.id || crypto.randomUUID(),
      name,
      placeholder,
      icon: selectedIcon,
      categoryId,
      priority,
      frequency,
      createdAt: editTask?.createdAt || new Date().toISOString(),
      clients: editTask?.clients || [],
    }

    onTaskCreated(newTask)
    toast.success(`Task "${name}" ${editTask ? "updated" : "created"} successfully`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Task Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Blood Pressure Check, Medication Reminder"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>{nameError}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Once you've added a task, you can't change the name. You can remove it and add a new one if you need to make
            changes.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder Text</Label>
          <Textarea
            id="placeholder"
            placeholder="e.g., Record blood pressure in mmHg format (systolic/diastolic)"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            The text that will appear in the input field to prompt care workers with example inputs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Priority Level</Label>
          <RadioGroup value={priority} onValueChange={(value: any) => setPriority(value)} className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="cursor-pointer">
                Low
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="cursor-pointer">
                High
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Icon</Label>
          <p className="text-xs text-muted-foreground mb-2">
            This will be shown to care workers in their app and in your reports.
          </p>
          <IconSelector selectedIcon={selectedIcon} onSelectIcon={setSelectedIcon} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{editTask ? "Update Task" : "Create Task"}</Button>
      </div>
    </div>
  )
}

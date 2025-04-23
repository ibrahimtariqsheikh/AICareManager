"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, X, Clock, Save, Pencil, Trash2, AlertTriangle, Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { useAppDispatch, useAppSelector } from "@/state/redux"
import {
    addVisit,
    removeVisit,
    setCurrentTemplate,
    clearCurrentTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    activateTemplate,
    type Template,
} from "@/state/slices/templateSlice"
import type { User } from "@/types/prismaTypes"

interface ScheduleTemplateProps {
    user: User
}

export const ScheduleTemplate = ({ user }: ScheduleTemplateProps) => {
    const dispatch = useAppDispatch()
    const { templates, currentTemplate, visitSlots } = useAppSelector((state) => state.template)

    const [isAddVisitOpen, setIsAddVisitOpen] = useState(false)
    const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false)
    const [isDeleteTemplateOpen, setIsDeleteTemplateOpen] = useState(false)
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [startTime, setStartTime] = useState("12:00")
    const [endTime, setEndTime] = useState("15:00")
    const [endType, setEndType] = useState("same")
    const [selectedCareWorker, setSelectedCareWorker] = useState("")
    const [careWorkerCount, setCareWorkerCount] = useState("1")
    const [templateName, setTemplateName] = useState("")
    const [templateDescription, setTemplateDescription] = useState("")
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const careWorkers = ["Abdul Ahmed", "Trish Donnell", "Sarah Johnson", "Michael Brown"]

    const handleDayToggle = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day))
        } else {
            setSelectedDays([...selectedDays, day])
        }
    }

    const handleAddVisit = () => {
        if (selectedDays.length === 0) {
            toast.error("Please select at least one day")
            return
        }

        const newVisits = selectedDays.map((day, index) => ({
            id: `new-${Date.now()}-${index}`,
            day,
            startTime,
            endTime,
            careWorker: selectedCareWorker || "Unallocated",
        }))

        dispatch(addVisit(newVisits))
        setIsAddVisitOpen(false)
        setSelectedDays([])

        toast.success(`Added ${newVisits.length} visit${newVisits.length > 1 ? "s" : ""} to schedule`)
    }

    const handleRemoveVisit = (id: string) => {
        dispatch(removeVisit(id))
        toast.success("Visit removed from schedule")
    }

    const handleSaveTemplate = () => {
        if (visitSlots.length === 0) {
            toast.error("Please add at least one visit to the schedule")
            return
        }

        setIsEditTemplateOpen(true)
    }

    const handleCreateTemplate = () => {
        if (!templateName.trim()) {
            toast.error("Please enter a template name")
            return
        }

        const newTemplate: Template = {
            id: `template-${Date.now()}`,
            name: templateName,
            description: templateDescription,
            visits: [...visitSlots],
            isActive: false,
            lastUpdated: new Date().toISOString(),
        }

        dispatch(addTemplate(newTemplate))
        setIsEditTemplateOpen(false)
        setTemplateName("")
        setTemplateDescription("")

        toast.success(`Template "${templateName}" created successfully`)
    }

    const handleEditTemplate = (template: Template) => {
        // Create a deep copy of the template's visits to ensure they're not lost
        const visitsCopy = template.visits.map((visit) => ({ ...visit }))

        // First update the local state
        setTemplateName(template.name)
        setTemplateDescription(template.description)

        // Then dispatch actions to update Redux state
        dispatch(clearCurrentTemplate()) // Clear first to avoid any state conflicts

        // Use setTimeout to ensure the state update happens in the next tick
        setTimeout(() => {
            dispatch(setCurrentTemplate(template))

            // Force update the visitSlots directly if needed
            if (visitsCopy.length > 0) {
                dispatch(addVisit(visitsCopy))
            }

            console.log("Editing template with visits:", visitsCopy)
            toast.info(`Editing template "${template.name}"`)
        }, 0)

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleDuplicateTemplate = (template: Template) => {
        const duplicatedTemplate: Template = {
            ...template,
            id: `template-${Date.now()}`,
            name: `${template.name} (Copy)`,
            isActive: false,
            lastUpdated: new Date().toISOString(),
        }

        dispatch(addTemplate(duplicatedTemplate))
        toast.success(`Duplicated template "${template.name}"`)
    }

    const handleUpdateTemplate = () => {
        if (!currentTemplate) return
        if (!templateName.trim()) {
            toast.error("Please enter a template name")
            return
        }

        const updatedTemplate: Template = {
            ...currentTemplate,
            name: templateName,
            description: templateDescription,
            visits: [...visitSlots],
            lastUpdated: new Date().toISOString(),
        }

        dispatch(updateTemplate(updatedTemplate))
        setIsEditTemplateOpen(false)
        setTemplateName("")
        setTemplateDescription("")

        toast.success(`Template "${templateName}" updated successfully`)
    }

    const handleDeleteTemplate = (template: Template) => {
        setTemplateToDelete(template)
        setIsDeleteTemplateOpen(true)
    }

    const confirmDeleteTemplate = () => {
        if (!templateToDelete) return

        dispatch(deleteTemplate(templateToDelete.id))
        setIsDeleteTemplateOpen(false)
        setTemplateToDelete(null)
        toast.success(`Template "${templateToDelete.name}" deleted`)
    }

    const handleActivateTemplate = (template: Template) => {
        dispatch(activateTemplate(template.id))
        toast.success(`Template "${template.name}" activated`)
    }

    const handleCancelEditing = () => {
        dispatch(clearCurrentTemplate())
        setTemplateName("")
        setTemplateDescription("")
        toast.info("Cancelled editing template")
    }

    useEffect(() => {
        if (currentTemplate) {
            console.log("Current template changed, visits:", currentTemplate.visits)
            // This ensures the visits are properly loaded when the current template changes
        }
    }, [currentTemplate])

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold">
                            {currentTemplate ? (
                                <span className="flex items-center gap-2">
                                    <span>Editing Template:</span>
                                    <span className="text-blue-600">{currentTemplate.name}</span>
                                </span>
                            ) : (
                                "Weekly Visit Schedule"
                            )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {currentTemplate
                                ? `Last updated: ${new Date(currentTemplate.lastUpdated).toLocaleDateString()}`
                                : `Create a recurring visit schedule for ${user?.firstName} ${user?.lastName}`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isAddVisitOpen} onOpenChange={setIsAddVisitOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Visit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add visits</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            Select (multiple) days<span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {daysOfWeek.map((day) => (
                                                <Button
                                                    key={day}
                                                    type="button"
                                                    variant={selectedDays.includes(day) ? "default" : "outline"}
                                                    className={`rounded-full ${selectedDays.includes(day) ? "bg-blue-600" : ""}`}
                                                    onClick={() => handleDayToggle(day)}
                                                >
                                                    {day.substring(0, 3)}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start-time">
                                                Start<span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex">
                                                <Input id="start-day" value={selectedDays[0] || ""} readOnly className="rounded-r-none" />
                                                <div className="relative">
                                                    <Input
                                                        id="start-time"
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                        className="rounded-l-none"
                                                    />
                                                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="end-time">
                                                Time<span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end-type">
                                            End<span className="text-red-500">*</span>
                                        </Label>
                                        <RadioGroup value={endType} onValueChange={setEndType} className="flex space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="same" id="same-day" />
                                                <Label htmlFor="same-day">Same day</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="next" id="next-day" />
                                                <Label htmlFor="next-day">Next day</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="all-day" />
                                        <Label htmlFor="all-day">All day visit</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="client-charge-rate">Client charge rate</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard">Standard Rate</SelectItem>
                                                <SelectItem value="premium">Premium Rate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="visit-type">Client visit type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="regular">Regular Visit</SelectItem>
                                                <SelectItem value="assessment">Assessment</SelectItem>
                                                <SelectItem value="medication">Medication</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>How many care workers are required?</Label>
                                        <RadioGroup value={careWorkerCount} onValueChange={setCareWorkerCount} className="flex space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="1" id="one-worker" />
                                                <Label htmlFor="one-worker">1</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="2" id="two-workers" />
                                                <Label htmlFor="two-workers">2</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="default-worker">Select first default care worker</Label>
                                        <Select value={selectedCareWorker} onValueChange={setSelectedCareWorker}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Unallocated" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {careWorkers.map((worker) => (
                                                    <SelectItem key={worker} value={worker}>
                                                        {worker}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAddVisit}>
                                        Save
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" onClick={handleSaveTemplate}>
                            <Save className="h-4 w-4 mr-2" />
                            {currentTemplate ? "Update Template" : "Save Template"}
                        </Button>

                        {currentTemplate && (
                            <Button variant="outline" onClick={handleCancelEditing}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel Editing
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-4">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="flex flex-col">
                            <h4 className="font-medium mb-2">{day}s</h4>
                            <div className="space-y-2">
                                {visitSlots
                                    .filter((slot) => slot.day === day)
                                    .map((slot) => (
                                        <div
                                            key={slot.id}
                                            className="border border-dashed rounded-md p-3 relative hover:border-gray-400 transition-colors"
                                        >
                                            <button
                                                className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                                                onClick={() => handleRemoveVisit(slot.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="text-xs text-gray-500">
                                                {slot.startTime} to {slot.endTime}
                                            </div>
                                            <div className="text-sm font-medium">{slot.careWorker}</div>
                                        </div>
                                    ))}
                                {visitSlots.filter((slot) => slot.day === day).length === 0 && (
                                    <div
                                        className="border border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setSelectedDays([day])
                                            setIsAddVisitOpen(true)
                                        }}
                                    >
                                        <span className="text-xs">Add visit</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Saved Templates</h3>

                {currentTemplate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-center">
                        <div className="text-blue-700">
                            <p className="font-medium">Editing template: {currentTemplate.name}</p>
                            <p className="text-sm">
                                Make your changes to the weekly schedule above, then click "Update Template" to save.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className={`border rounded-md p-4 hover:border-blue-500 cursor-pointer transition-colors ${template.isActive ? "border-blue-500 bg-blue-50" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{template.name}</h4>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${template.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                >
                                    {template.isActive ? "Active" : "Draft"}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">{template.visits.length} visits per week</div>
                            <div className="text-xs text-gray-500 mb-3">
                                Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    onClick={() => handleEditTemplate(template)}
                                >
                                    <Pencil className="h-3.5 w-3.5 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    onClick={() => handleDuplicateTemplate(template)}
                                >
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                    Duplicate
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                    onClick={() => handleDeleteTemplate(template)}
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    Delete
                                </Button>
                                {!template.isActive && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                        onClick={() => handleActivateTemplate(template)}
                                    >
                                        Activate
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div
                        className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer h-[140px]"
                        onClick={() => {
                            dispatch(clearCurrentTemplate())
                            setTemplateName("")
                            setTemplateDescription("")
                            setIsEditTemplateOpen(true)
                        }}
                    >
                        <Plus className="h-5 w-5 mb-1" />
                        <span className="text-sm">Create New Template</span>
                    </div>
                </div>
            </Card>

            {/* Template Edit Dialog */}
            <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{currentTemplate ? "Update Template" : "Save Template"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="template-name">
                                Template Name<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="template-name"
                                placeholder="e.g., Standard Weekly Schedule"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="template-description">Description</Label>
                            <Textarea
                                id="template-description"
                                placeholder="Describe the purpose of this template..."
                                rows={3}
                                value={templateDescription}
                                onChange={(e) => setTemplateDescription(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            This template contains {visitSlots.length} visit{visitSlots.length !== 1 ? "s" : ""}.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={currentTemplate ? handleUpdateTemplate : handleCreateTemplate}
                            disabled={!templateName.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {currentTemplate ? "Update" : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteTemplateOpen} onOpenChange={setIsDeleteTemplateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Delete Template</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-amber-800">
                                    Are you sure you want to delete "{templateToDelete?.name}"?
                                </p>
                                <p className="text-sm text-amber-700 mt-1">
                                    This action cannot be undone. This will permanently delete the template and all of its associated
                                    visits.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteTemplateOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteTemplate}>
                            Delete Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

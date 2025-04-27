"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, X, Save, Pencil, Trash2, AlertTriangle, Copy, User2, DollarSign } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
    useCreateScheduleTemplateMutation,
    useDeleteScheduleTemplateMutation,
    useGetScheduleTemplatesQuery,
    useUpdateScheduleTemplateMutation,
    useActivateScheduleTemplateMutation,
    useDeactivateScheduleTemplateMutation,
} from "@/state/api"

import { useAppDispatch, useAppSelector } from "@/state/redux"
import {
    setCurrentTemplate,
    clearCurrentTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    activateTemplate,
    setTemplatesFromApi,
    addVisitInTemplate,
    removeVisitInTemplate,
    deactivateTemplate,
} from "@/state/slices/templateSlice"
import type {
    RateSheet,
    TemplateVisitDay,
    User,
    VisitType,
    ScheduleTemplate as ScheduleTemplateType,
    TemplateVisit,
} from "@/types/prismaTypes"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
interface ScheduleTemplateProps {
    user: User
}

export const ScheduleTemplate = ({ user }: ScheduleTemplateProps) => {
    const dispatch = useAppDispatch()
    const { templates, currentTemplate } = useAppSelector((state) => state.template)

    const [isAddVisitOpen, setIsAddVisitOpen] = useState(false)
    const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false)
    const [isDeleteTemplateOpen, setIsDeleteTemplateOpen] = useState(false)
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [startTime, setStartTime] = useState("12:00")
    const [endTime, setEndTime] = useState("15:00")
    const [endType, setEndType] = useState("same")
    const [selectedCareWorker, setSelectedCareWorker] = useState("")
    const [selectedCareWorker2, setSelectedCareWorker2] = useState("")
    const [selectedRateSheet, setSelectedRateSheet] = useState("")
    const [selectedVisitType, setSelectedVisitType] = useState("")
    const [careWorkerCount, setCareWorkerCount] = useState("1")
    const [templateName, setTemplateName] = useState("")
    const [templateDescription, setTemplateDescription] = useState("")
    const [templateToDelete, setTemplateToDelete] = useState<ScheduleTemplateType | null>(null)
    const [updateScheduleTemplate] = useUpdateScheduleTemplateMutation()
    const [deleteScheduleTemplate] = useDeleteScheduleTemplateMutation()
    const [createScheduleTemplate] = useCreateScheduleTemplateMutation()
    const [activateScheduleTemplate] = useActivateScheduleTemplateMutation()
    const [deactivateScheduleTemplate] = useDeactivateScheduleTemplateMutation()
    const careWorkers = useAppSelector((state) => state.user.careWorkers)

    const handleDayToggle = (day: string) => {
        const dayString = day.toUpperCase()
        if (selectedDays.includes(dayString)) {
            setSelectedDays(selectedDays.filter((d) => d !== dayString))
        } else {
            setSelectedDays([...selectedDays, dayString])
        }
    }

    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
    const agency = useAppSelector((state) => state.agency.agency)
    const rateSheets = agency?.rateSheets
    const visitTypes = user?.visitTypes
    const selectedCareWorkerName = careWorkers.find((worker) => worker.id === selectedCareWorker)?.fullName
    const selectedCareWorker2Name = careWorkers.find((worker) => worker.id === selectedCareWorker2)?.fullName

    const { data: scheduleTemplates } = useGetScheduleTemplatesQuery(
        { userId: user.id, agencyId: agency?.id },
        { skip: !user.id || !agency?.id },
    )

    useEffect(() => {
        if (scheduleTemplates && Array.isArray(scheduleTemplates)) {
            console.log("Raw schedule templates from API:", scheduleTemplates)
            const serializedTemplates = scheduleTemplates.map((template) => ({
                ...template,
                lastUpdated: template.lastUpdated instanceof Date ? template.lastUpdated.toISOString() : template.lastUpdated,
                createdAt: template.createdAt instanceof Date ? template.createdAt.toISOString() : template.createdAt,
                updatedAt: template.updatedAt instanceof Date ? template.updatedAt.toISOString() : template.updatedAt,
                visits:
                    template.visits?.map((visit: TemplateVisit) => ({
                        ...visit,
                        createdAt: visit.createdAt instanceof Date ? visit.createdAt.toISOString() : visit.createdAt,
                        updatedAt: visit.updatedAt instanceof Date ? visit.updatedAt.toISOString() : visit.updatedAt,
                    })) || [],
            }))
            console.log("Serialized templates for Redux:", serializedTemplates)
            dispatch(setTemplatesFromApi(serializedTemplates))
        }
    }, [scheduleTemplates, dispatch])

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
            careWorkerId: selectedCareWorker || "Unallocated",
            careWorker2Id: careWorkerCount === "2" ? selectedCareWorker2 || "Unallocated" : null,
            careWorker3Id: null,
            rateSheetId: selectedRateSheet || null,
            clientVisitTypeId: selectedVisitType || null,
            name: "Visit",
            description: "Scheduled visit",
            endStatus: "SAME_DAY",
            isAllDayVisit: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }))

        console.log("New visits:", newVisits)

        dispatch(addVisitInTemplate(newVisits))
        setIsAddVisitOpen(false)
        setSelectedDays([])
        setSelectedRateSheet("")
        setSelectedVisitType("")

        toast.success(`Added ${newVisits.length} visit${newVisits.length > 1 ? "s" : ""} to schedule`)
    }

    const handleRemoveVisit = (id: string) => {
        dispatch(removeVisitInTemplate(id))
        toast.success("Visit removed from schedule")
    }

    const handleSaveTemplate = async () => {
        try {
            if (!currentTemplate) {
                toast.error("No template is currently being edited")
                return
            }

            if (!currentTemplate.visits || currentTemplate.visits.length === 0) {
                toast.error("Please add at least one visit to the schedule")
                return
            }

            // Deduplicate visits by ID before saving
            const uniqueVisitsMap = new Map()
            currentTemplate.visits.forEach((visit: TemplateVisit) => {
                if (!uniqueVisitsMap.has(visit.id)) {
                    uniqueVisitsMap.set(visit.id, visit)
                }
            })

            const uniqueVisits = Array.from(uniqueVisitsMap.values())

            // Create a clean copy of the template to avoid mutation issues
            const updatedTemplate: ScheduleTemplateType = {
                ...currentTemplate,
                name: currentTemplate.name,
                description: currentTemplate.description,
                visits: uniqueVisits.map((visit: TemplateVisit) => ({ ...visit })),
                lastUpdated: new Date().toISOString(),
            }

            // Make sure we're not sending any any undefined values
            Object.keys(updatedTemplate).forEach((key) => {
                if (updatedTemplate[key as keyof ScheduleTemplateType] === undefined) {
                    delete updatedTemplate[key as keyof ScheduleTemplateType]
                }
            })

            console.log("Saving template:", updatedTemplate)
            const response = await updateScheduleTemplate(updatedTemplate).unwrap()
            console.log("Update response:", response)

            dispatch(updateTemplate(updatedTemplate))
            setIsEditTemplateOpen(false)
            toast.success(`Template "${currentTemplate.name}" updated successfully`)
        } catch (error: any) {
            console.error("Error saving template:", error)
            toast.error(error?.data?.error || "Failed to save template")
        }
    }

    const handleCreateTemplate = async () => {
        if (!templateName.trim()) {
            toast.error("Please enter a template name")
            return
        }

        try {
            // Create a clean template object with required fields
            const newTemplate: ScheduleTemplateType = {
                id: `template-${Date.now()}`,
                name: templateName.trim(),
                description: templateDescription.trim(),
                visits: Array.isArray(currentTemplate?.visits)
                    ? currentTemplate.visits.map((visit: TemplateVisit) => ({ ...visit }))
                    : [],
                isActive: false,
                lastUpdated: new Date().toISOString(),
                userId: user.id,
                agencyId: agency?.id,
            }

            // Make sure we're not sending any undefined values
            Object.keys(newTemplate).forEach((key) => {
                if (newTemplate[key as keyof ScheduleTemplateType] === undefined) {
                    delete newTemplate[key as keyof ScheduleTemplateType]
                }
            })

            console.log("Creating new template:", newTemplate)
            const response = await createScheduleTemplate(newTemplate).unwrap()
            console.log("Create response:", response)

            dispatch(addTemplate(response))
            setIsEditTemplateOpen(false)
            setTemplateName("")
            setTemplateDescription("")
            toast.success(`Template "${templateName}" created successfully`)
        } catch (error: any) {
            console.error("Error creating template:", error)
            toast.error(error?.data?.error || "Failed to create template")
        }
    }

    const handleEditTemplate = (template: ScheduleTemplateType) => {
        // Deduplicate visits by ID before setting them
        const uniqueVisitsMap = new Map()
        if (Array.isArray(template.visits)) {
            template.visits.forEach((visit: TemplateVisit) => {
                if (!uniqueVisitsMap.has(visit.id)) {
                    uniqueVisitsMap.set(visit.id, { ...visit })
                }
            })
        }

        const visitsCopy = Array.from(uniqueVisitsMap.values())

        setTemplateName(template.name)
        setTemplateDescription(template.description)

        dispatch(clearCurrentTemplate())

        setTimeout(() => {
            dispatch(
                setCurrentTemplate({
                    ...template,
                    visits: [], // Start with empty visits to avoid duplicates
                }),
            )

            if (visitsCopy.length > 0) {
                dispatch(addVisitInTemplate(visitsCopy))
            }

            toast.info(`Editing template "${template.name}"`)
        }, 0)

        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleDuplicateTemplate = (template: ScheduleTemplateType) => {
        const duplicatedTemplate: ScheduleTemplateType = {
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

        const updatedTemplate: ScheduleTemplateType = {
            ...currentTemplate,
            name: templateName,
            description: templateDescription,
            visits: [...currentTemplate.visits],
            lastUpdated: new Date().toISOString(),
        }

        dispatch(updateTemplate(updatedTemplate))
        setIsEditTemplateOpen(false)
        setTemplateName("")
        setTemplateDescription("")
        setIsAddVisitOpen(false)


        toast.success(`Template "${templateName}" updated successfully`)
    }

    const handleDeleteTemplate = async (template: ScheduleTemplateType) => {
        try {
            await deleteScheduleTemplate(template.id).unwrap()
            dispatch(deleteTemplate(template.id))
            setIsDeleteTemplateOpen(false)
            setTemplateToDelete(null)
            toast.success(`Template "${template.name}" deleted `)
        } catch (error: any) {
            toast.error("Error deleting template", error.data?.error)
        }
    }

    const confirmDeleteTemplate = () => {
        if (!templateToDelete) return

        dispatch(deleteTemplate(templateToDelete.id))
        setIsDeleteTemplateOpen(false)
        setTemplateToDelete(null)
        toast.success(`Template "${templateToDelete.name}" deleted`)
    }

    const toggleActiveTemplate = async (template: ScheduleTemplateType) => {
        try {
            if (!template.isActive) {
                // If template is not active, activate it
                const response = await activateScheduleTemplate({ id: template.id, userId: user.id }).unwrap()
                dispatch(activateTemplate(template.id))
                toast.success(`Template "${template.name}" activated`)
            } else {
                // If template is already active, deactivate it
                const response = await deactivateScheduleTemplate({ id: template.id }).unwrap()
                dispatch(deactivateTemplate(template.id))
                toast.success(`Template "${template.name}" deactivated`)
            }
        } catch (error: any) {
            toast.error("Error toggling template activation", error.data?.error)
        }
    }

    const handleCancelEditing = () => {
        dispatch(clearCurrentTemplate())
        setTemplateName("")
        setTemplateDescription("")
        toast.info("Cancelled editing template")
    }

    useEffect(() => {
        if (currentTemplate) {
            console.log("Current template:", currentTemplate)
        }
    }, [currentTemplate])

    const findCareWorkerName = (workerId: string | null | undefined) => {
        if (!workerId) return null
        const worker = careWorkers.find((worker) => worker.id === workerId)
        return worker ? worker.fullName : null
    }

    const findRateSheetName = (rateSheetId: string | null | undefined) => {
        if (!rateSheetId || !rateSheets) return null
        const rateSheet = rateSheets.find((sheet: RateSheet) => sheet.id === rateSheetId)
        return rateSheet ? rateSheet.name : null
    }

    const findVisitTypeName = (clientVisitTypeId: string | null | undefined) => {
        if (!clientVisitTypeId || !visitTypes) return null
        const visitType = visitTypes.find((type: VisitType) => type.id === clientVisitTypeId)
        return visitType ? visitType.name : null
    }

    console.log("Templates:", templates)

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Your Templates{" "}
                    <span className="text-[10px] text-neutral-500">
                        ({templates.length}/{3})
                    </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <>
                        {[...templates]
                            .sort((a, b) => {
                                if (a.isActive && !b.isActive) return -1
                                if (!a.isActive && b.isActive) return 1
                                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            })
                            .map((template) => (
                                <div
                                    key={template.id}
                                    className={`border border-neutral-200 rounded-md p-4 hover:border-blue-500 transition-colors duration-200 ${template.isActive ? "border-blue-50/50" : ""}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium">{template.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full  bg-neutral-100 text-neutral-800`}>
                                                {template.visits?.length || 0} visits
                                            </span>

                                            <span
                                                onClick={() => toggleActiveTemplate(template)}
                                                className={cn(
                                                    `text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors duration-150`,
                                                    template.isActive ? "bg-green-100 text-green-800 " : "bg-neutral-100 text-neutral-800",
                                                )}
                                            >
                                                {template.isActive ? "Active" : "Draft"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs text-neutral-700 mb-1">{template.description}</div>

                                    </div>
                                    <div>                                        <div className="flex items-center gap-2 mt-4">
                                        {template.visits.length > 0 && (
                                            <>
                                                <div className="text-xs text-neutral-800 mb-1 font-medium bg-neutral-100 px-2 py-1 rounded-md border border-neutral-200 w-fit flex items-center gap-1">
                                                    <User2 className="h-3.5 w-3.5 mr-1" />
                                                    {findCareWorkerName(template.visits[0].careWorkerId) || "Unallocated"}
                                                </div>
                                                <div className="text-xs text-neutral-800 mb-1 font-medium bg-neutral-100 px-2 py-1 rounded-md border border-neutral-200 w-fit flex items-center gap-1">
                                                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                                                    {findRateSheetName(template.visits[0].rateSheetId) || "None"}
                                                </div>
                                            </>
                                        )}
                                    </div></div>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 px-2 py-1 rounded-md text-sm flex items-center justify-center transition-colors duration-150"
                                            onClick={() => handleEditTemplate(template)}
                                        >
                                            <Pencil className="h-3.5 w-3.5 mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 px-2 py-1 rounded-md text-sm flex items-center justify-center transition-colors duration-150"
                                            onClick={() => handleDuplicateTemplate(template)}
                                        >
                                            <Copy className="h-3.5 w-3.5 mr-1" />
                                            Copy
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 px-2 py-1 rounded-md text-sm flex items-center justify-center transition-colors duration-150"
                                            onClick={() => handleDeleteTemplate(template)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </>

                    {templates.length < 3 && (
                        <div
                            className="h-full border border-dashed border-neutral-300 rounded-md p-4 flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                            onClick={() => {
                                dispatch(clearCurrentTemplate())
                                setTemplateName("")
                                setTemplateDescription("")
                                setIsEditTemplateOpen(true)
                            }}
                        >
                            <div>
                                <Plus className="h-5 w-5 mb-1" />
                            </div>
                            <span className="text-sm">Create New Template</span>
                        </div>
                    )}
                </div>
            </Card>
            {currentTemplate && (
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
                            <p className="text-xs text-muted-foreground">
                                {currentTemplate
                                    ? `Last updated: ${format(new Date(currentTemplate.updatedAt || ""), "MMMM dd, yyyy")}`
                                    : `Create a recurring visit schedule for ${user?.firstName} ${user?.lastName}`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Dialog open={isAddVisitOpen} onOpenChange={setIsAddVisitOpen}>
                                <DialogContent className="sm:max-w-[500px]">
                                    <div>
                                        <DialogHeader>
                                            <DialogTitle>Add visits</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-6 py-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Select</Label>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {daysOfWeek.map((day) => (
                                                        <Button
                                                            key={day}
                                                            type="button"
                                                            variant={selectedDays.includes(day) ? "default" : "outline"}
                                                            className={`rounded-full ${selectedDays.includes(day) ? "bg-blue-600" : ""}`}
                                                            onClick={() => handleDayToggle(day as TemplateVisitDay)}
                                                        >
                                                            {day.substring(0, 3)}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="start-time">Start Time</Label>
                                                    <div className="flex">
                                                        <div className="relative">
                                                            <Input
                                                                id="start-time"
                                                                type="time"
                                                                value={startTime}
                                                                onChange={(e) => setStartTime(e.target.value)}
                                                                className="rounded-l-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="end-time">End Time</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="end-time"
                                                            type="time"
                                                            value={endTime}
                                                            onChange={(e) => setEndTime(e.target.value)}
                                                        />
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
                                                <Select value={selectedRateSheet} onValueChange={setSelectedRateSheet}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="None" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {rateSheets.map((rateSheet: RateSheet) => (
                                                            <SelectItem key={rateSheet.id} value={rateSheet.id}>
                                                                {rateSheet.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="visit-type">Client visit type</Label>
                                                <Select value={selectedVisitType} onValueChange={setSelectedVisitType}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="None" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {visitTypes && visitTypes.length > 0 ? (
                                                            visitTypes.map((type: VisitType) => (
                                                                <SelectItem key={type.id} value={type.id}>
                                                                    {type.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <SelectItem value="WEEKLY_CHECKUP">Weekly Checkup</SelectItem>
                                                                <SelectItem value="APPOINTMENT">Appointment</SelectItem>
                                                                <SelectItem value="HOME_VISIT">Home Visit</SelectItem>
                                                                <SelectItem value="CHECKUP">Checkup</SelectItem>
                                                                <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                                                <SelectItem value="ROUTINE">Routine</SelectItem>
                                                                <SelectItem value="OTHER">Other</SelectItem>
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>How many care workers are required?</Label>
                                                <RadioGroup
                                                    value={careWorkerCount}
                                                    onValueChange={setCareWorkerCount}
                                                    className="flex space-x-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="1" id="one-worker" />
                                                        <Label htmlFor="one-worker">1</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {careWorkerCount === "2" && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="second-worker">Select second care worker</Label>
                                                    <Select value={selectedCareWorker2} onValueChange={setSelectedCareWorker2}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Unallocated" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {careWorkers.map((worker) => (
                                                                <SelectItem key={worker.id} value={worker.id}>
                                                                    {worker.fullName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label htmlFor="default-worker">Select first default care worker</Label>
                                                <Select value={selectedCareWorker} onValueChange={setSelectedCareWorker}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Unallocated" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {careWorkers.map((worker: User) => (
                                                            <SelectItem key={worker.id} value={worker.id}>
                                                                {worker.fullName}
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
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {currentTemplate && (
                                <Button variant="outline" onClick={handleCancelEditing}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel Editing
                                </Button>
                            )}

                            <Button onClick={handleSaveTemplate}>
                                <Save className="h-4 w-4 mr-2" />
                                {currentTemplate ? "Update Template" : "Save Template"}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {daysOfWeek.map((day) => {
                            const dayString = day.toLowerCase()
                            const dayStringProper = dayString.charAt(0).toUpperCase() + dayString.slice(1)

                            // Get unique visits for this day by ID to prevent duplicates
                            const dayVisits = currentTemplate?.visits
                                .filter((slot: TemplateVisit) => slot.day === day)
                                // Use a Map to ensure uniqueness by ID
                                .reduce((unique: Map<string, TemplateVisit>, visit: TemplateVisit) => {
                                    if (!unique.has(visit.id)) {
                                        unique.set(visit.id, visit)
                                    }
                                    return unique
                                }, new Map())

                            const uniqueVisits = Array.from(dayVisits?.values() || [])

                            return (
                                <div key={day} className="flex flex-col">
                                    <h4 className="font-medium mb-2">{dayStringProper}</h4>
                                    <div className="space-y-2">
                                        <>
                                            {uniqueVisits.map((slot: TemplateVisit) => {
                                                console.log("Slot:", slot)
                                                return (
                                                    <div
                                                        key={slot.id}
                                                        className="border border-dashed rounded-md p-3 relative hover:border-gray-400 transition-colors duration-150"
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
                                                        <div className="text-sm font-medium">
                                                            {findCareWorkerName(slot.careWorkerId) || "Unallocated"}
                                                            {slot.careWorker2Id && findCareWorkerName(slot.careWorker2Id) && (
                                                                <>
                                                                    <br />
                                                                    <span className="text-xs text-gray-500">
                                                                        + {findCareWorkerName(slot.careWorker2Id)}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {(slot.rateSheetId || slot.clientVisitTypeId) && (
                                                            <div className="mt-1 flex gap-1 flex-wrap">
                                                                {slot.rateSheetId && (
                                                                    <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
                                                                        £ {findRateSheetName(slot.rateSheetId)}
                                                                    </span>
                                                                )}
                                                                {slot.clientVisitTypeId && (
                                                                    <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-800 rounded-md border border-green-100">
                                                                        {findVisitTypeName(slot.clientVisitTypeId)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </>
                                        {uniqueVisits.length === 0 && (
                                            <div
                                                className="border border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
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
                            )
                        })}
                    </div>
                </Card>
            )}

            {/* Template Edit Dialog */}
            <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <div>
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
                                This template contains {currentTemplate?.visits?.length || 0} visit
                                {(currentTemplate?.visits?.length || 0) !== 1 ? "s" : ""}.
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (currentTemplate) {
                                        handleUpdateTemplate()
                                        setIsEditTemplateOpen(false)
                                    } else {
                                        handleCreateTemplate()
                                    }
                                }}
                                disabled={!templateName.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {currentTemplate ? "Update" : "Save"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteTemplateOpen} onOpenChange={setIsDeleteTemplateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <div>
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
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

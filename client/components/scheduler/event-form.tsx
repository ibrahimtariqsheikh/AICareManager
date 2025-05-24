"use client"

import type React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { isBefore, format, addMonths, subMonths } from "date-fns"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form"

import { useAppDispatch, useAppSelector } from "../../state/redux"
import { addLeaveEvent, updateLeaveEvent, deleteLeaveEvent } from "../../state/slices/leaveSlice"
import { CustomSelect } from "../ui/custom-select"
import { CustomInput } from "../ui/custom-input"
import { cn } from "../../lib/utils"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useCreateLeaveEventMutation } from "../../state/api"

const formSchema = z.object({
    clientId: z.string({
        required_error: "Please select a client",
    }),
    leaveType: z.enum([
        "ANNUAL_LEAVE",
        "SICK_LEAVE",
        "PUBLIC_HOLIDAY",
        "UNPAID_LEAVE",
        "MATERNITY_LEAVE",
        "PATERNITY_LEAVE",
        "BEREAVEMENT_LEAVE",
        "EMERGENCY_LEAVE",
        "MEDICAL_APPOINTMENT",
        "TOIL"
    ], {
        required_error: "Please select a leave type",
    }),
    startDate: z.date({
        required_error: "Please select a start date",
    }),
    endDate: z.date({
        required_error: "Please select an end date",
    }),
    notes: z.string().optional(),
    payRate: z.number().min(0, "Pay rate must be a positive number").optional(),
}).refine((data) => !isBefore(data.endDate, data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
})

type FormValues = z.infer<typeof formSchema>

interface EventFormProps {
    isOpen: boolean
    onClose: () => void
    event?: any
    isNew?: boolean
    spaceTheme?: boolean
    userId: string
    agencyId: string
}

export function EventForm({ isOpen, onClose, event, isNew = false, spaceTheme = false, userId, agencyId }: EventFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [startCalendarOpen, setStartCalendarOpen] = useState(false)
    const [endCalendarOpen, setEndCalendarOpen] = useState(false)
    const startCalendarRef = useRef<HTMLDivElement>(null)
    const endCalendarRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const clients = useAppSelector((state) => state.user.clients)
    const [createLeaveEvent] = useCreateLeaveEventMutation()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientId: "",
            leaveType: "ANNUAL_LEAVE",
            startDate: new Date(),
            endDate: new Date(),
            notes: "",
            payRate: undefined,
        },
    })

    // Log form state changes
    useEffect(() => {
        const subscription = form.watch((value) => {
            console.log("Form values changed:", value);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    // Set form values when editing an existing event
    useEffect(() => {
        if (event && !isNew) {
            console.log("Setting form values from event:", event);
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            form.reset({
                clientId: event.clientId,
                leaveType: event.leaveType || "ANNUAL_LEAVE",
                startDate,
                endDate,
                notes: event.notes || "",
                payRate: event.payRate,
            })
        }
    }, [event, isNew, form])

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)
            console.log("Form data before submission:", data);

            const eventData = {
                id: event?.id || Date.now().toString(),
                title: `${data.leaveType.replace("_", " ")}`,
                start: data.startDate,
                end: data.endDate,
                date: data.startDate,
                leaveType: data.leaveType,
                notes: data.notes || "",
                userId: data.clientId,
                payRate: data.payRate,
                color: getLeaveTypeColor(data.leaveType),
            }

            console.log("Event data being dispatched:", eventData);


            console.log("agencyId", agencyId)

            if (isNew) {
                // Create leave event through API
                const response = await createLeaveEvent({
                    userId: data.clientId,
                    startDate: data.startDate.toISOString(),
                    endDate: data.endDate.toISOString(),
                    notes: data.notes || "",
                    payRate: data.payRate || 0,
                    eventType: data.leaveType,
                    color: getLeaveTypeColor(data.leaveType),
                    agencyId
                }).unwrap()

                // Update local state
                dispatch(addLeaveEvent({ ...eventData, id: response.id }))
                toast.success("Leave request created successfully")
            } else {
                dispatch(updateLeaveEvent(eventData))
                toast.success("Leave request updated successfully")
            }

            onClose()
        } catch (error) {
            console.error("Error saving leave request:", error)
            toast.error(`Failed to ${isNew ? "create" : "update"} leave request`)
        } finally {
            setIsLoading(false)
        }
    }

    const getLeaveTypeColor = (leaveType: string) => {
        switch (leaveType) {
            case "ANNUAL_LEAVE":
                return "#4CAF50" // Green
            case "SICK_LEAVE":
                return "#F44336" // Red
            case "PUBLIC_HOLIDAY":
                return "#2196F3" // Blue
            case "UNPAID_LEAVE":
                return "#9E9E9E" // Grey
            case "MATERNITY_LEAVE":
                return "#E91E63" // Pink
            case "PATERNITY_LEAVE":
                return "#9C27B0" // Purple
            case "BEREAVEMENT_LEAVE":
                return "#795548" // Brown
            case "EMERGENCY_LEAVE":
                return "#FF9800" // Orange
            case "MEDICAL_APPOINTMENT":
                return "#00BCD4" // Cyan
            case "TOIL":
                return "#FFC107" // Amber
            default:
                return "#9E9E9E" // Grey
        }
    }

    const handleDelete = async () => {
        if (!event?.id) return

        try {
            dispatch(deleteLeaveEvent(event.id))
            toast.success("Leave request deleted successfully")
            onClose()
        } catch (error) {
            console.error("Error deleting leave request:", error)
            toast.error("Failed to delete leave request")
        }
    }

    const goToPreviousMonth = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentMonth((prevMonth) => subMonths(prevMonth, 1))
    }

    const goToNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))
    }

    const handleDateSelect = (e: React.MouseEvent, newDate: Date, field: any, isStartDate: boolean) => {
        e.stopPropagation()
        e.preventDefault()
        console.log("Date selected:", newDate, isStartDate ? "start" : "end")
        field.onChange(newDate)
        if (isStartDate) {
            setStartCalendarOpen(false)
        } else {
            setEndCalendarOpen(false)
        }
    }

    // Add click outside handler for calendars
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
                setStartCalendarOpen(false)
            }
            if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
                setEndCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }
        }}>
            <DialogContent className={`sm:max-w-[600px] ${spaceTheme ? "dark-dialog" : ""}`}>
                <DialogHeader>
                    <DialogTitle>{isNew ? "Request Leave" : "Edit Leave Request"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client</FormLabel>
                                        <CustomSelect
                                            placeholder="Select a client"
                                            options={clients.map((client) => ({
                                                value: client.id,
                                                label: client.fullName,
                                            }))}
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="leaveType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Leave Type</FormLabel>
                                        <CustomSelect
                                            placeholder="Select leave type"
                                            options={[
                                                { value: "ANNUAL_LEAVE", label: "Annual Leave" },
                                                { value: "SICK_LEAVE", label: "Sick Leave" },
                                                { value: "PUBLIC_HOLIDAY", label: "Public Holiday" },
                                                { value: "UNPAID_LEAVE", label: "Unpaid Leave" },
                                                { value: "MATERNITY_LEAVE", label: "Maternity Leave" },
                                                { value: "PATERNITY_LEAVE", label: "Paternity Leave" },
                                                { value: "BEREAVEMENT_LEAVE", label: "Bereavement Leave" },
                                                { value: "EMERGENCY_LEAVE", label: "Emergency Leave" },
                                                { value: "MEDICAL_APPOINTMENT", label: "Medical Appointment Leave" },
                                                { value: "TOIL", label: "Time Off in Lieu (TOIL)" },
                                            ]}
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                            className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Start Date</FormLabel>
                                        <div className="relative">
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground",
                                                    spaceTheme && "bg-neutral-800 border-neutral-700"
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setStartCalendarOpen(!startCalendarOpen)
                                                    setEndCalendarOpen(false)
                                                }}
                                                type="button"
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>

                                            {startCalendarOpen && (
                                                <div
                                                    ref={startCalendarRef}
                                                    className={`absolute top-full left-0 z-50 mt-1 w-[320px] rounded-md border ${spaceTheme ? "bg-slate-900 border-slate-700" : "bg-popover border-border"
                                                        } p-3 shadow-md`}
                                                >
                                                    <div className="flex items-center justify-between py-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className={`h-7 w-7 ${spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}`}
                                                            onClick={goToPreviousMonth}
                                                            type="button"
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                        <div className={`text-center font-medium ${spaceTheme ? "text-white" : ""}`}>
                                                            {format(currentMonth, "MMMM yyyy")}
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className={`h-7 w-7 ${spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}`}
                                                            onClick={goToNextMonth}
                                                            type="button"
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1 py-2">
                                                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                                            <div
                                                                key={day}
                                                                className={`text-center text-sm ${spaceTheme ? "text-slate-400" : "text-muted-foreground"}`}
                                                            >
                                                                {day}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {Array.from({ length: 42 }, (_, i) => {
                                                            const date = new Date(currentMonth)
                                                            date.setDate(1)
                                                            const firstDay = date.getDay()
                                                            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
                                                            const daysInPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate()

                                                            let day: number
                                                            let month = date.getMonth()
                                                            let year = date.getFullYear()
                                                            let isCurrentMonth = true

                                                            if (i < firstDay) {
                                                                day = daysInPrevMonth - (firstDay - i - 1)
                                                                month = month - 1
                                                                if (month < 0) {
                                                                    month = 11
                                                                    year = year - 1
                                                                }
                                                                isCurrentMonth = false
                                                            } else if (i >= firstDay && i < firstDay + daysInMonth) {
                                                                day = i - firstDay + 1
                                                            } else {
                                                                day = i - (firstDay + daysInMonth) + 1
                                                                month = month + 1
                                                                if (month > 11) {
                                                                    month = 0
                                                                    year = year + 1
                                                                }
                                                                isCurrentMonth = false
                                                            }

                                                            const dateToCheck = new Date(year, month, day)
                                                            const isSelected =
                                                                field.value &&
                                                                dateToCheck.getDate() === new Date(field.value).getDate() &&
                                                                dateToCheck.getMonth() === new Date(field.value).getMonth() &&
                                                                dateToCheck.getFullYear() === new Date(field.value).getFullYear()

                                                            const isToday =
                                                                dateToCheck.getDate() === new Date().getDate() &&
                                                                dateToCheck.getMonth() === new Date().getMonth() &&
                                                                dateToCheck.getFullYear() === new Date().getFullYear()

                                                            const isDisabled = dateToCheck < new Date("1900-01-01")

                                                            return (
                                                                <Button
                                                                    key={i}
                                                                    variant={isSelected ? "default" : isToday ? "outline" : "ghost"}
                                                                    className={cn(
                                                                        "h-9 w-9 p-0 font-normal",
                                                                        !isCurrentMonth && "text-muted-foreground opacity-50",
                                                                        isSelected && "bg-primary text-primary-foreground",
                                                                        isToday && !isSelected && "border border-primary text-primary",
                                                                        isDisabled && "opacity-50 cursor-not-allowed",
                                                                        spaceTheme && "hover:bg-slate-800"
                                                                    )}
                                                                    type="button"
                                                                    disabled={isDisabled}
                                                                    onClick={(e) => handleDateSelect(e, dateToCheck, field, true)}
                                                                >
                                                                    {day}
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>End Date</FormLabel>
                                        <div className="relative">
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground",
                                                    spaceTheme && "bg-neutral-800 border-neutral-700"
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setEndCalendarOpen(!endCalendarOpen)
                                                    setStartCalendarOpen(false)
                                                }}
                                                type="button"
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>

                                            {endCalendarOpen && (
                                                <div
                                                    ref={endCalendarRef}
                                                    className={`absolute top-full left-0 z-50 mt-1 w-[320px] rounded-md border ${spaceTheme ? "bg-slate-900 border-slate-700" : "bg-popover border-border"
                                                        } p-3 shadow-md`}
                                                >
                                                    <div className="flex items-center justify-between py-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className={`h-7 w-7 ${spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}`}
                                                            onClick={goToPreviousMonth}
                                                            type="button"
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                        <div className={`text-center font-medium ${spaceTheme ? "text-white" : ""}`}>
                                                            {format(currentMonth, "MMMM yyyy")}
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className={`h-7 w-7 ${spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}`}
                                                            onClick={goToNextMonth}
                                                            type="button"
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1 py-2">
                                                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                                            <div
                                                                key={day}
                                                                className={`text-center text-sm ${spaceTheme ? "text-slate-400" : "text-muted-foreground"}`}
                                                            >
                                                                {day}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {Array.from({ length: 42 }, (_, i) => {
                                                            const date = new Date(currentMonth)
                                                            date.setDate(1)
                                                            const firstDay = date.getDay()
                                                            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
                                                            const daysInPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate()

                                                            let day: number
                                                            let month = date.getMonth()
                                                            let year = date.getFullYear()
                                                            let isCurrentMonth = true

                                                            if (i < firstDay) {
                                                                day = daysInPrevMonth - (firstDay - i - 1)
                                                                month = month - 1
                                                                if (month < 0) {
                                                                    month = 11
                                                                    year = year - 1
                                                                }
                                                                isCurrentMonth = false
                                                            } else if (i >= firstDay && i < firstDay + daysInMonth) {
                                                                day = i - firstDay + 1
                                                            } else {
                                                                day = i - (firstDay + daysInMonth) + 1
                                                                month = month + 1
                                                                if (month > 11) {
                                                                    month = 0
                                                                    year = year + 1
                                                                }
                                                                isCurrentMonth = false
                                                            }

                                                            const dateToCheck = new Date(year, month, day)
                                                            const isSelected =
                                                                field.value &&
                                                                dateToCheck.getDate() === new Date(field.value).getDate() &&
                                                                dateToCheck.getMonth() === new Date(field.value).getMonth() &&
                                                                dateToCheck.getFullYear() === new Date(field.value).getFullYear()

                                                            const isToday =
                                                                dateToCheck.getDate() === new Date().getDate() &&
                                                                dateToCheck.getMonth() === new Date().getMonth() &&
                                                                dateToCheck.getFullYear() === new Date().getFullYear()

                                                            const startDate = form.getValues("startDate")
                                                            const isDisabled =
                                                                dateToCheck < new Date("1900-01-01") ||
                                                                (startDate && dateToCheck < startDate)

                                                            return (
                                                                <Button
                                                                    key={i}
                                                                    variant={isSelected ? "default" : isToday ? "outline" : "ghost"}
                                                                    className={cn(
                                                                        "h-9 w-9 p-0 font-normal",
                                                                        !isCurrentMonth && "text-muted-foreground opacity-50",
                                                                        isSelected && "bg-primary text-primary-foreground",
                                                                        isToday && !isSelected && "border border-primary text-primary",
                                                                        isDisabled && "opacity-50 cursor-not-allowed",
                                                                        spaceTheme && "hover:bg-slate-800"
                                                                    )}
                                                                    type="button"
                                                                    disabled={isDisabled}
                                                                    onClick={(e) => handleDateSelect(e, dateToCheck, field, false)}
                                                                >
                                                                    {day}
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="payRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pay Rate (£/hour)</FormLabel>
                                    <FormControl>
                                        <CustomInput
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Enter pay rate per hour"
                                            value={field.value?.toString() ?? ""}
                                            onChange={(value: string) => {
                                                field.onChange(value ? parseFloat(value) : undefined);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>Optional: Enter the hourly pay rate for this leave period</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <CustomInput
                                            placeholder="Add any additional notes here..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Optional notes about your leave request</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            {!isNew && (
                                <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
                                    Delete
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className={spaceTheme ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : ""}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                                        {isNew ? "Creating..." : "Updating..."}
                                    </>
                                ) : (
                                    <>{isNew ? "Request Leave" : "Update Leave Request"}</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

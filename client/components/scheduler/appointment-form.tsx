"use client"

import type React from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react"
import { format, addMonths, subMonths, setHours, setMinutes, isBefore, isAfter } from "date-fns"
import { cn } from "../../lib/utils"

import { useState, useEffect, useRef, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { toast } from "sonner"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form"

import { useAppSelector, useAppDispatch } from "../../state/redux"
import { addEvent, updateEvent, deleteEvent } from "../../state/slices/scheduleSlice"
import { setClients, setOfficeStaff } from "../../state/slices/userSlice"

import {
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
    useGetUserByIdQuery,
} from "../../state/api"
import type { RateSheet, VisitType } from "@/types/prismaTypes"

const formSchema = z.object({
    agencyId: z
        .string({
            required_error: "Agency ID is required",
        })
        .optional(),
    clientId: z.string({
        required_error: "Please select a client",
    }),
    userId: z.string({
        required_error: "Please select a staff member",
    }),
    date: z.date({
        required_error: "Please select a date",
    }),
    startTime: z.string({
        required_error: "Please select a start time",
    }),
    endTime: z.string({
        required_error: "Please select an end time",
    }),
    type: z.string({
        required_error: "Please select an appointment type",
    }),
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"], {
        required_error: "Please select a status",
    }),
    notes: z.string().optional(),
    rateSheetId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AppointmentFormProps {
    isOpen: boolean
    onClose: () => void
    event?: any
    isNew?: boolean
    spaceTheme?: boolean
}

// Generate time options in 10-minute intervals
const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
            const hourStr = hour.toString().padStart(2, "0")
            const minuteStr = minute.toString().padStart(2, "0")
            const time = `${hourStr}:${minuteStr}`
            const label = format(setMinutes(setHours(new Date(), hour), minute), "h:mm a")
            options.push({ value: time, label })
        }
    }
    return options
}

export function AppointmentForm({ isOpen, onClose, event, isNew = false, spaceTheme = false }: AppointmentFormProps) {
    const [availableStaff, setAvailableStaff] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [visitTypes, setVisitTypes] = useState<VisitType[]>([])
    const [rateSheets, setRateSheets] = useState<RateSheet[]>([])

    const allTimeOptions = useMemo(() => generateTimeOptions(), [])
    const [availableEndTimes, setAvailableEndTimes] = useState(allTimeOptions)
    const calendarRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const [createSchedule] = useCreateScheduleMutation()
    const [updateSchedule] = useUpdateScheduleMutation()
    const [deleteSchedule] = useDeleteScheduleMutation()

    const user = useAppSelector((state: any) => state.user.user)
    const { careWorkers = [], clients = [], officeStaff = [] } = useAppSelector((state: any) => state.user)
    const agency = useAppSelector((state: any) => state.agency.agency)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agencyId: user?.userInfo?.agencyId || "",
            clientId: "",
            userId: "",
            date: new Date(),
            startTime: "09:00",
            endTime: "10:00",
            type: "APPOINTMENT",
            status: "PENDING",
            notes: "",
            rateSheetId: "",
        },
    })

    const selectedClientId = form.watch("clientId")
    const selectedUserId = form.watch("userId")
    const startTime = form.watch("startTime")
    const endTime = form.watch("endTime")

    const { data: clientData } = useGetUserByIdQuery(selectedClientId, {
        skip: !selectedClientId,
    })

    // Update visit types when client data changes
    useEffect(() => {
        if (clientData?.data?.visitTypes) {
            setVisitTypes(clientData.data.visitTypes)
        } else {
            setVisitTypes([])
        }
    }, [clientData])

    // Update rate sheets when agency data changes
    useEffect(() => {
        if (agency.rateSheets?.length) {
            // Filter out any invalid rate sheets and sort to prioritize showing values first
            const validRateSheets = agency.rateSheets.filter((sheet) => sheet && sheet.id && (sheet.name || sheet.value))

            // Sort rate sheets to prioritize those with values
            const sortedRateSheets = validRateSheets.sort((a, b) => {
                // First prioritize sheets with values
                if (a.value && !b.value) return -1
                if (!a.value && b.value) return 1

                // Then prioritize by name if both have values or both don't have values
                if (a.name && b.name) return a.name.localeCompare(b.name)
                if (a.name) return -1
                if (b.name) return 1

                return 0
            })

            setRateSheets(sortedRateSheets)
        } else {
            setRateSheets([])
        }
    }, [agency])

    // Update available end times based on start time
    useEffect(() => {
        if (startTime) {
            const [startHour, startMinute] = startTime.split(":").map(Number) as [number, number]
            const startDate = setMinutes(setHours(new Date(), startHour), startMinute)
            const filteredEndTimes = allTimeOptions.filter((option) => {
                const [endHour, endMinute] = option.value.split(":").map(Number) as [number, number]
                const endDate = setMinutes(setHours(new Date(), endHour), endMinute)
                return isAfter(endDate, startDate)
            })

            setAvailableEndTimes(filteredEndTimes)

            if (endTime) {
                const [endHour, endMinute] = endTime.split(":").map(Number) as [number, number]
                const endDate = setMinutes(setHours(new Date(), endHour), endMinute)

                if (isBefore(endDate, startDate)) {
                    const nextHour = (startHour + 1) % 24
                    const nextTime = `${nextHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`
                    form.setValue("endTime", nextTime)
                }
            }
        }
    }, [startTime, allTimeOptions, endTime, form])

    // Update staff and clients from Redux state
    useEffect(() => {
        setAvailableStaff(careWorkers || [])

        // Only dispatch if we have data to set
        if (clients?.length) {
            dispatch(setClients(clients))
        }

        if (officeStaff?.length) {
            dispatch(setOfficeStaff(officeStaff))
        }

        // Set agency ID from auth state
        if (user?.userInfo?.agencyId) {
            form.setValue("agencyId", user.userInfo.agencyId)
        }
    }, [clients, careWorkers, officeStaff, user?.userInfo?.agencyId, form, dispatch])

    // Set form values when editing an existing event
    useEffect(() => {
        if (event && !isNew) {
            const startTimestamp = (event.shiftStart ?? event.start) as number | string | Date
            const endTimestamp = (event.shiftEnd ?? event.end) as number | string | Date

            if (startTimestamp === undefined || endTimestamp === undefined) {
                return
            }

            const startDate = new Date(startTimestamp)
            const endDate = new Date(endTimestamp)
            const appointmentDate = new Date(event.date || startDate)

            form.reset({
                agencyId: event.agencyId || user?.userInfo?.agencyId || "",
                clientId: event.clientId || "",
                userId: event.userId || event.resourceId || "",
                date: appointmentDate,
                startTime: format(startDate, "HH:mm"),
                endTime: format(endDate, "HH:mm"),
                type: event.type || "APPOINTMENT",
                status: event.status || "PENDING",
                notes: event.notes || "",
                rateSheetId: event.rateSheetId || "",
            })

            // Set the current month to the event's month
            setCurrentMonth(appointmentDate)
        }
    }, [event, isNew, user?.userInfo?.agencyId, form])

    // Add click outside handler for calendar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const onSubmit = async (data: FormValues) => {
        try {
            if (data.endTime <= data.startTime) {
                toast.error("End time must be after start time")
                return
            }

            if (!data.agencyId) {
                toast.error("Agency ID is required")
                return
            }

            setIsLoading(true)

            // Combine date and time
            const [startHour, startMinute] = data.startTime.split(":").map(Number) as [number, number]
            const [endHour, endMinute] = data.endTime.split(":").map(Number) as [number, number]

            const startDateTime = new Date(data.date)
            startDateTime.setHours(startHour, startMinute)

            const endDateTime = new Date(data.date)
            endDateTime.setHours(endHour, endMinute)

            const scheduleData = {
                agencyId: data.agencyId,
                clientId: data.clientId,
                userId: data.userId,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                type: data.type,
                status: data.status,
                notes: data.notes || "",
                rateSheetId: data.rateSheetId || "",
            }

            try {
                let response
                if (isNew) {
                    response = await createSchedule(scheduleData).unwrap()
                    toast.success("Appointment created successfully")
                } else {
                    response = await updateSchedule({ id: event.id, ...scheduleData }).unwrap()
                    toast.success("Appointment updated successfully")
                }

                // Dispatch to Redux store
                const eventData = {
                    id: response.id,
                    title: response.title,
                    start: startDateTime,
                    end: endDateTime,
                    date: data.date,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    resourceId: response.userId,
                    clientId: response.clientId,
                    type: response.type,
                    status: response.status,
                    notes: response.notes || "",
                    color: response.color,
                    careWorker: response.user,
                    client: response.client,
                    rateSheetId: response.rateSheetId,
                }

                if (isNew) {
                    dispatch(addEvent(eventData as any))
                } else {
                    dispatch(updateEvent(eventData as any))
                }

                onClose()
            } catch (error: any) {
                console.error("Error saving appointment:", error)
                if (error.data?.conflict) {
                    const { type, id } = error.data.conflict
                    const entity =
                        type === "care worker" ? careWorkers.find((w: any) => w.id === id) : clients.find((c: any) => c.id === id)
                    const name = entity ? `${entity.fullName}` : type
                    toast.error(`${name} already has an appointment scheduled during this time`)
                } else {
                    toast.error(`Failed to ${isNew ? "create" : "update"} appointment`)
                }
            }
        } catch (error) {
            console.error("Error in form submission:", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
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

    const handleDateSelect = (e: React.MouseEvent, newDate: Date) => {
        e.stopPropagation()
        e.preventDefault()
        form.setValue("date", newDate)
        setCalendarOpen(false)
    }

    // Handle appointment deletion
    const handleDelete = async () => {
        if (!event?.id) return

        try {
            await deleteSchedule(event.id).unwrap()
            dispatch(deleteEvent(event.id))
            toast.success("Appointment deleted successfully")
            onClose()
        } catch (error) {
            console.error("Error deleting appointment:", error)
            toast.error("Failed to delete appointment")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`sm:max-w-[600px] ${spaceTheme ? "dark-dialog" : ""}`}>
                <DialogHeader>
                    <DialogTitle>{isNew ? "Create New Appointment" : "Edit Appointment"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || ""} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                    <SelectValue placeholder="Select a client" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                {clients.map((client: any) => (
                                                    <SelectItem key={client.id} value={client.id}>
                                                        {client.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Care Worker</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || ""} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                    <SelectValue placeholder="Select a care worker" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                {availableStaff.map((staffMember) => (
                                                    <SelectItem key={staffMember.id} value={staffMember.id}>
                                                        {staffMember.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date</FormLabel>
                                                <div className="relative">
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground",
                                                            spaceTheme && "bg-slate-800 border-slate-700 text-white",
                                                        )}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setCalendarOpen(!calendarOpen)
                                                        }}
                                                        type="button"
                                                    >
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>

                                                    {calendarOpen && (
                                                        <div
                                                            ref={calendarRef}
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
                                                                        // Previous month
                                                                        day = daysInPrevMonth - (firstDay - i - 1)
                                                                        month = month - 1
                                                                        if (month < 0) {
                                                                            month = 11
                                                                            year = year - 1
                                                                        }
                                                                        isCurrentMonth = false
                                                                    } else if (i >= firstDay && i < firstDay + daysInMonth) {
                                                                        // Current month
                                                                        day = i - firstDay + 1
                                                                    } else {
                                                                        // Next month
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

                                                                    return (
                                                                        <Button
                                                                            key={i}
                                                                            variant={isSelected ? "default" : isToday ? "outline" : "ghost"}
                                                                            className={cn(
                                                                                "h-9 w-9 p-0 font-normal",
                                                                                !isCurrentMonth && "text-muted-foreground opacity-50",
                                                                                isSelected && "bg-primary text-primary-foreground",
                                                                                isToday && !isSelected && "border border-primary text-primary",
                                                                                spaceTheme && "hover:bg-slate-800",
                                                                            )}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                const newDate = new Date(year, month, day)
                                                                                handleDateSelect(e, newDate)
                                                                            }}
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
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time From</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                            <SelectValue placeholder="Select start time" />
                                                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent
                                                        className={`h-[200px] ${spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}`}
                                                    >
                                                        {allTimeOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time To</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                            <SelectValue placeholder="Select end time" />
                                                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent
                                                        className={`h-[200px] ${spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}`}
                                                    >
                                                        {availableEndTimes.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visit Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || ""} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="CANCELED">Canceled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="rateSheetId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Rate Sheet</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                    <SelectValue placeholder="Select rate sheet" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}>
                                                {rateSheets && rateSheets.length > 0 ? (
                                                    rateSheets.map((rateSheet: RateSheet) => (
                                                        <SelectItem key={rateSheet.id} value={rateSheet.id}>
                                                            <div className="flex items-center justify-between w-full">
                                                                {rateSheet.value ? (
                                                                    <span className="font-medium">
                                                                        ${rateSheet.value} - {rateSheet.name}
                                                                    </span>
                                                                ) : (
                                                                    <span>{rateSheet.name}</span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="NO_RATE_SHEET">No rate sheets available</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add any additional notes here..."
                                            className={`resize-none ${spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Optional notes about the appointment</FormDescription>
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
                                    <>{isNew ? "Create Appointment" : "Update Appointment"}</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

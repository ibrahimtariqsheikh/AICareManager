"use client"

import type React from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { format, addMonths, subMonths, setHours, setMinutes, isBefore, isAfter } from "date-fns"
import { cn } from "../../lib/utils"

import { useState, useEffect, useRef, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
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
import { CustomSelect } from "../ui/custom-select"
import { CustomInput } from "../ui/custom-input"

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
    spaceTheme?: boolean
    initialEvent?: any
}

interface EditAppointmentFormProps extends AppointmentFormProps {
    event: any
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

export function CreateAppointmentForm({ isOpen, onClose, spaceTheme = false, initialEvent }: AppointmentFormProps) {
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

    const user = useAppSelector((state: any) => state.user.user)
    const { careWorkers = [], clients = [], officeStaff = [] } = useAppSelector((state: any) => state.user)
    const agency = useAppSelector((state: any) => state.agency.agency)

        ("INITIAL EVENT", initialEvent)

        ("CLIENT ID", initialEvent?.clientId)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agencyId: user?.userInfo?.agencyId || "",
            clientId: initialEvent?.clientId || "",
            userId: initialEvent?.userId || "",
            date: initialEvent?.date || new Date(),
            startTime: initialEvent?.startTime || "09:00",
            endTime: initialEvent?.endTime || "10:00",
            type: initialEvent?.type || "APPOINTMENT",
            status: initialEvent?.status || "PENDING",
            notes: initialEvent?.notes || "",
            rateSheetId: initialEvent?.rateSheetId || "",
        },
    })

    const selectedClientId = form.watch("clientId")
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
            const validRateSheets = agency.rateSheets.filter((sheet: RateSheet) => sheet && sheet.id && (sheet.name || sheet.value))

            // Sort rate sheets to prioritize those with values
            const sortedRateSheets = validRateSheets.sort((a: RateSheet, b: RateSheet) => {
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
                type: data.type as "APPOINTMENT" | "WEEKLY_CHECKUP" | "HOME_VISIT" | "CHECKUP" | "EMERGENCY" | "ROUTINE" | "OTHER",
                status: data.status,
                notes: data.notes || "",
                rateSheetId: data.rateSheetId || "",
            }

            try {
                const response = await createSchedule(scheduleData).unwrap()
                toast.success("Appointment created successfully")

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

                dispatch(addEvent(eventData as any))
                onClose()
            } catch (error: any) {
                toast.error(error.error)
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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`sm:max-w-[600px] ${spaceTheme ? "dark-dialog" : ""}`}>
                <DialogHeader>
                    <DialogTitle>Create New Appointment</DialogTitle>
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
                                        <CustomSelect
                                            placeholder="Select a client"
                                            options={clients.map((client: any) => ({
                                                value: client.id,
                                                label: client.fullName,
                                            }))}
                                            onChange={(value: string) => field.onChange(value)}
                                            value={field.value || initialEvent?.clientId}
                                        />
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
                                        <CustomSelect
                                            placeholder="Select a care worker"
                                            options={availableStaff.map((staffMember) => ({
                                                value: staffMember.id,
                                                label: staffMember.fullName,
                                            }))}
                                            onChange={(value: string) => field.onChange(value)}
                                            value={field.value || initialEvent?.userId}
                                        />
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
                                                            spaceTheme && "bg-neutral-800 border-neutral-700 ",
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
                                                <CustomSelect
                                                    placeholder="Select start time"
                                                    options={allTimeOptions}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value || ""}
                                                    className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                                />
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
                                                <CustomSelect
                                                    placeholder="Select end time"
                                                    options={availableEndTimes}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value || ""}
                                                    className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                                />
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
                                        <CustomSelect
                                            placeholder="Select type"
                                            options={
                                                visitTypes && visitTypes.length > 0
                                                    ? visitTypes.map((type: VisitType) => ({
                                                        value: type.id,
                                                        label: type.name,
                                                    }))
                                                    : [
                                                        { value: "WEEKLY_CHECKUP", label: "Weekly Checkup" },
                                                        { value: "APPOINTMENT", label: "Appointment" },
                                                        { value: "HOME_VISIT", label: "Home Visit" },
                                                        { value: "CHECKUP", label: "Checkup" },
                                                        { value: "EMERGENCY", label: "Emergency" },
                                                        { value: "ROUTINE", label: "Routine" },
                                                        { value: "OTHER", label: "Other" },
                                                    ]
                                            }
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                            className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                        />
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
                                        <CustomSelect
                                            placeholder="Select status"
                                            options={[
                                                { value: "PENDING", label: "Pending" },
                                                { value: "CONFIRMED", label: "Confirmed" },
                                                { value: "COMPLETED", label: "Completed" },
                                                { value: "CANCELED", label: "Canceled" },
                                            ]}
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                            className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                        />
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
                                        <CustomSelect
                                            placeholder="Select rate sheet"
                                            options={
                                                rateSheets && rateSheets.length > 0
                                                    ? rateSheets.map((rateSheet: RateSheet) => ({
                                                        value: rateSheet.id,
                                                        label: rateSheet.value
                                                            ? `$${rateSheet.value} - ${rateSheet.name}`
                                                            : rateSheet.name,
                                                    }))
                                                    : [{ value: "NO_RATE_SHEET", label: "No rate sheets available" }]
                                            }
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                            className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                        />
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
                                        <CustomInput
                                            placeholder="Add any additional notes here..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Optional notes about the appointment</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
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
                                        Creating...
                                    </>
                                ) : (
                                    "Create Appointment"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export function EditAppointmentForm({ isOpen, onClose, event, spaceTheme = false }: EditAppointmentFormProps) {
    const [availableStaff, setAvailableStaff] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentMonth] = useState(new Date())
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [visitTypes, setVisitTypes] = useState<VisitType[]>([])
    const [rateSheets, setRateSheets] = useState<RateSheet[]>([])

    const allTimeOptions = useMemo(() => generateTimeOptions(), [])
    const [availableEndTimes, setAvailableEndTimes] = useState(allTimeOptions)
    const calendarRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const [updateSchedule] = useUpdateScheduleMutation()
    const [deleteSchedule] = useDeleteScheduleMutation()

    const user = useAppSelector((state: any) => state.user.user)
    const { careWorkers = [], clients = [], officeStaff = [] } = useAppSelector((state: any) => state.user)
    const agency = useAppSelector((state: any) => state.agency.agency)

        ("EDITING EVENT", event)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agencyId: event?.agencyId || user?.userInfo?.agencyId || "",
            clientId: event?.clientId || "",
            userId: event?.userId || event?.resourceId || "",
            date: event?.date ? new Date(event.date) : new Date(),
            startTime: event?.startTime || "09:00",
            endTime: event?.endTime || "10:00",
            type: event?.type || "APPOINTMENT",
            status: event?.status || "PENDING",
            notes: event?.notes || "",
            rateSheetId: event?.rateSheetId || "",
        },
    })

    // Update visit types when client data changes
    useEffect(() => {
        if (clients?.visitTypes) {
            setVisitTypes(clients.visitTypes)
        } else {
            setVisitTypes([])
        }
    }, [clients])

    // Update rate sheets when agency data changes
    useEffect(() => {
        if (agency.rateSheets?.length) {
            // Filter out any invalid rate sheets and sort to prioritize showing values first
            const validRateSheets = agency.rateSheets.filter((sheet: RateSheet) => sheet && sheet.id && (sheet.name || sheet.value))

            // Sort rate sheets to prioritize those with values
            const sortedRateSheets = validRateSheets.sort((a: RateSheet, b: RateSheet) => {
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
        if (form.getValues("startTime")) {
            const [startHour, startMinute] = form.getValues("startTime").split(":").map(Number) as [number, number]
            const startDate = setMinutes(setHours(new Date(), startHour), startMinute)
            const filteredEndTimes = allTimeOptions.filter((option) => {
                const [endHour, endMinute] = option.value.split(":").map(Number) as [number, number]
                const endDate = setMinutes(setHours(new Date(), endHour), endMinute)
                return isAfter(endDate, startDate)
            })

            setAvailableEndTimes(filteredEndTimes)

            if (form.getValues("endTime")) {
                const [endHour, endMinute] = form.getValues("endTime").split(":").map(Number) as [number, number]
                const endDate = setMinutes(setHours(new Date(), endHour), endMinute)

                if (isBefore(endDate, startDate)) {
                    const nextHour = (startHour + 1) % 24
                    const nextTime = `${nextHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`
                    form.setValue("endTime", nextTime)
                }
            }
        }
    }, [form.getValues("startTime"), allTimeOptions, form.getValues("endTime"), form])

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
                type: data.type as "APPOINTMENT" | "WEEKLY_CHECKUP" | "HOME_VISIT" | "CHECKUP" | "EMERGENCY" | "ROUTINE" | "OTHER",
                status: data.status,
                notes: data.notes || "",
                rateSheetId: data.rateSheetId || "",
            }

            try {
                const response = await updateSchedule({ id: event.id, ...scheduleData }).unwrap()
                toast.success("Appointment updated successfully")

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

                dispatch(updateEvent(eventData as any))
                onClose()
            } catch (error: any) {
                ("ERROR", error)
                toast.error("An unexpected error occurred")
            }
        } catch (error) {
            ("ERROR", error)
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!event?.id) return

        try {
            ("deleting appointment", event.id)
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
                    <DialogTitle>Edit Appointment</DialogTitle>
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
                                        <CustomSelect
                                            placeholder="Select a client"
                                            options={clients.map((client: any) => ({
                                                value: client.id,
                                                label: client.fullName,
                                            }))}
                                            onChange={(value: string) => field.onChange(value)}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                        />
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
                                        <CustomSelect
                                            placeholder="Select a care worker"
                                            options={availableStaff.map((staffMember) => ({
                                                value: staffMember.id,
                                                label: staffMember.fullName,
                                            }))}
                                            onChange={(value: string) => field.onChange(value)}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                        />
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
                                                            spaceTheme && "bg-neutral-800 border-neutral-700 ",
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
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        setCalendarOpen(!calendarOpen)
                                                                    }}
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
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        setCalendarOpen(!calendarOpen)
                                                                    }}
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
                                                                            onClick={() => {
                                                                                const newDate = new Date(year, month, day)
                                                                                field.onChange(newDate)
                                                                                setCalendarOpen(false)
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
                                                <CustomSelect
                                                    placeholder="Select start time"
                                                    options={allTimeOptions}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value || ""}
                                                    className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                                />
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
                                                <CustomSelect
                                                    placeholder="Select end time"
                                                    options={availableEndTimes}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value || ""}
                                                    className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                                />
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
                                        <CustomSelect
                                            placeholder="Select type"
                                            options={
                                                visitTypes && visitTypes.length > 0
                                                    ? visitTypes.map((type: VisitType) => ({
                                                        value: type.id,
                                                        label: type.name,
                                                    }))
                                                    : [
                                                        { value: "WEEKLY_CHECKUP", label: "Weekly Checkup" },
                                                        { value: "APPOINTMENT", label: "Appointment" },
                                                        { value: "HOME_VISIT", label: "Home Visit" },
                                                        { value: "CHECKUP", label: "Checkup" },
                                                        { value: "EMERGENCY", label: "Emergency" },
                                                        { value: "ROUTINE", label: "Routine" },
                                                        { value: "OTHER", label: "Other" },
                                                    ]
                                            }
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                            className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                        />
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
                                        <CustomSelect
                                            placeholder="Select status"
                                            options={[
                                                { value: "PENDING", label: "Pending" },
                                                { value: "CONFIRMED", label: "Confirmed" },
                                                { value: "COMPLETED", label: "Completed" },
                                                { value: "CANCELED", label: "Canceled" },
                                            ]}
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                            className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                        />
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
                                        <CustomSelect
                                            placeholder="Select rate sheet"
                                            options={
                                                rateSheets && rateSheets.length > 0
                                                    ? rateSheets.map((rateSheet: RateSheet) => ({
                                                        value: rateSheet.id,
                                                        label: rateSheet.value
                                                            ? `$${rateSheet.value} - ${rateSheet.name}`
                                                            : rateSheet.name,
                                                    }))
                                                    : [{ value: "NO_RATE_SHEET", label: "No rate sheets available" }]
                                            }
                                            onChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value || ""}
                                            className={spaceTheme ? "bg-slate-800 border-slate-700 text-white" : ""}
                                        />
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
                                        <CustomInput
                                            placeholder="Add any additional notes here..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Optional notes about the appointment</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
                                Delete
                            </Button>
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
                                        Updating...
                                    </>
                                ) : (
                                    "Update Appointment"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
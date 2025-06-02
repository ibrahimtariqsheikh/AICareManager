"use client"

import { useState, useMemo, useEffect } from "react"
import { format } from "date-fns"

import { useMediaQuery } from "../../../hooks/use-mobile"
import { useTheme } from "next-themes"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { Button } from "../../ui/button"
import type { AppointmentEvent, ProcessedCalendarEvent } from "./types"
import { useGetAgencySchedulesQuery, useGetAgencyLeaveEventsQuery } from "../../../state/api"
import { useAppSelector, useAppDispatch } from "../../../state/redux"
import { setCurrentDate } from "../../../state/slices/calendarSlice"
import type { LeaveEvent } from "../../../types/prismaTypes"

import { CustomCalendar } from "./custom-calender"
import type { CalendarProps } from "./types"
import { setEvents } from "@/state/slices/scheduleSlice"


export function Calendar({ onEventSelect }: CalendarProps) {
    const dispatch = useAppDispatch()
    const { activeView, currentDate: currentDateStr } = useAppSelector((state) => state.calendar)
    const [, setIsFormOpen] = useState(false)
    const [, setEditingEvent] = useState<AppointmentEvent | null>(null)

    const { theme } = useTheme()

    const {
        officeStaff,
        careWorkers,
        clients,
    } = useAppSelector((state) => state.user)

    const { user } = useAppSelector((state) => state.user)

    const {
        sidebarMode } = useAppSelector((state) => state.schedule)

    const currentDate = useMemo(() => {
        const date = new Date(currentDateStr)
        return isNaN(date.getTime()) ? new Date() : date
    }, [currentDateStr])

    const { data: _, isLoading: isSchedulesLoading } = useGetAgencySchedulesQuery(user?.userInfo?.agencyId || "")
    const { data: leaveEvents } = useGetAgencyLeaveEventsQuery(user?.userInfo?.agencyId || "")

    const schedules = useAppSelector((state) => state.schedule.agencySchedules)
    console.log("schedules", schedules)

    const processedEvents = useMemo(() => {
        const scheduleEvents = schedules.map(schedule => {
            if (!schedule.date) return null;
            const dateStr = schedule.date as string;
            const dateParts = dateStr.split("T")[0].split("-");
            if (dateParts.length !== 3) return null;
            const y = Number(dateParts[0]);
            const m = Number(dateParts[1]);
            const d = Number(dateParts[2]);
            if (!y || !m || !d) return null;
            const date = new Date(y, m - 1, d);
            const [startHours, startMinutes] = schedule.startTime.split(":").map(Number) as [number, number];
            const [endHours, endMinutes] = schedule.endTime.split(":").map(Number) as [number, number];

            const start = new Date(date);
            start.setHours(startHours, startMinutes, 0, 0);

            const end = new Date(date);
            end.setHours(endHours, endMinutes, 0, 0);

            // If the event is unassigned (userId is null), create an unallocated visit
            if (!schedule.userId) {
                return {
                    id: schedule.id,
                    title: `${schedule.client?.fullName || 'Unknown Client'}`,
                    start,
                    end,
                    date,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    resourceId: schedule.userId,
                    clientId: schedule.clientId,
                    type: schedule.type,
                    status: schedule.status,
                    notes: schedule.notes ?? "",
                    color: schedule.color || '#10b981',
                    careWorker: {
                        fullName: 'Unassigned',
                    },
                    client: {
                        fullName: schedule.client?.fullName || 'Unknown Client',
                    },
                    isUnallocated: true,
                    duration: (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes),
                    visitType: schedule.type,
                    priority: 'medium',
                    cost: 0
                };
            }

            const processedEvent: ProcessedCalendarEvent = {
                id: schedule.id,
                title: `${schedule.user?.fullName || 'Unassigned'}`,
                start,
                end,
                date,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                resourceId: schedule.userId,
                clientId: schedule.clientId,
                type: schedule.type,
                status: schedule.status,
                notes: schedule.notes ?? "",
                color: schedule.color || '#10b981',
                careWorker: {
                    fullName: schedule.user?.fullName || 'Unassigned',
                },
                client: {
                    fullName: schedule.client?.fullName || 'Unknown Client',
                },
                isLeaveEvent: false,
            }

            return processedEvent
        }).filter(Boolean) as ProcessedCalendarEvent[]

        const processedLeaveEvents = (leaveEvents || []).map((leave: LeaveEvent) => {
            const start = new Date(leave.startDate)
            const end = new Date(leave.endDate)

            // For leave events that span multiple days, create separate events for each day
            const events: ProcessedCalendarEvent[] = []
            const currentDate = new Date(start)

            while (currentDate <= end) {
                const dayStart = new Date(currentDate)
                const dayEnd = new Date(currentDate)

                // Set time to start of day for multi-day events
                if (currentDate.getTime() === start.getTime()) {
                    dayStart.setHours(start.getHours(), start.getMinutes(), 0, 0)
                } else {
                    dayStart.setHours(0, 0, 0, 0)
                }

                // Set time to end of day for multi-day events
                if (currentDate.getTime() === end.getTime()) {
                    dayEnd.setHours(end.getHours(), end.getMinutes(), 0, 0)
                } else {
                    dayEnd.setHours(23, 59, 59, 999)
                }

                events.push({
                    id: `${leave.id}-${currentDate.toISOString()}`,
                    title: `${leave.eventType.replace("_", " ")}`,
                    start: dayStart,
                    end: dayEnd,
                    date: new Date(currentDate),
                    startTime: format(dayStart, "HH:mm"),
                    endTime: format(dayEnd, "HH:mm"),
                    resourceId: leave.userId || "",
                    clientId: leave.userId || "",
                    type: "LEAVE",
                    status: "CONFIRMED",
                    notes: leave.notes || "",
                    color: leave.color || getLeaveTypeColor(leave.eventType),
                    careWorker: {
                        fullName: leave.user?.fullName || "Unknown",
                    },
                    client: {
                        fullName: leave.user?.fullName || "Unknown",
                    },
                    isLeaveEvent: true,
                    leaveType: leave.eventType,
                })

                currentDate.setDate(currentDate.getDate() + 1)
            }

            return events
        }).flat()

        // Separate unallocated visits from regular events
        const unallocatedVisits = scheduleEvents.filter(event => event.isUnallocated);
        const regularEvents = scheduleEvents.filter(event => !event.isUnallocated);

        return [...regularEvents, ...processedLeaveEvents, ...unallocatedVisits]
    }, [schedules, leaveEvents])

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

    const isMobile = useMediaQuery("(max-width: 768px)")

    const handleDateChange = (date: Date) => {
        if (date instanceof Date && !isNaN(date.getTime())) {
            dispatch(setCurrentDate(date.toISOString()))
        }
    }

    const handleEventSelect = (event: any) => {
        console.log("EVENT", event)
        if (!event) {
            setEditingEvent(null)
            setIsFormOpen(false)
            return
        }

        const formattedEvent = {
            ...event,
            clientId: event.clientId || event.userId,
            start: new Date(event.start),
            end: new Date(event.end),
            date: new Date(event.date),
            startTime: event.startTime || format(new Date(event.start), "HH:mm"),
            endTime: event.endTime || format(new Date(event.end), "HH:mm"),
        }
        setEditingEvent(formattedEvent)
        setIsFormOpen(true)
        if (onEventSelect) {
            onEventSelect(event)
        }
    }

    const handleEventUpdate = (updatedEvent: any) => {
        console.log("Event updated:", updatedEvent)
    }


    useEffect(() => {
        dispatch(setEvents(processedEvents as AppointmentEvent[]))
    }, [dispatch, processedEvents])

    const handleCreateAppointment = () => {
        const defaultEvent = {
            start: new Date(currentDate),
            end: new Date(new Date(currentDate).setHours(currentDate.getHours() + 1)),
            date: currentDate,
            type: "APPOINTMENT",
            status: "PENDING",
            notes: "",
        }
        setEditingEvent(defaultEvent as any)
        setIsFormOpen(true)
    }

    const isDark = theme === "dark"

    const getEventTypeLabel = (type: string) => {
        switch (type) {
            case "HOME_VISIT":
                return "Home Visit"
            case "VIDEO_CALL":
                return "Video Call"
            case "HOSPITAL":
                return "Hospital"
            case "IN_PERSON":
                return "In Person"
            case "AUDIO_CALL":
                return "Audio Call"
            default:
                return type
        }
    }

    return (
        <div className={`flex flex-col h-full w-full relative`}>

            <div className="flex flex-1 h-full relative z-10 gap-3 overflow-hidden">
                <div
                    className={`${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"} border rounded-lg overflow-hidden transition-all duration-200 ease-in-out flex-1`}
                >
                    {schedules.length === 0 && !isSchedulesLoading ? (
                        <div className="flex-1 h-full flex flex-col items-center justify-center">
                            <div className="text-center max-w-md">
                                <div
                                    className={`w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
                                >
                                    <CalendarIcon className={`h-6 w-6 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                                </div>
                                <h3 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-slate-800"}`}>
                                    Create a schedule
                                </h3>
                                <p className={`mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    You don't have any appointments scheduled. Create your first appointment to get started.
                                </p>
                                <Button
                                    onClick={handleCreateAppointment}
                                    className="mx-auto"
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Create Appointment
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <CustomCalendar
                            currentDate={currentDate}
                            activeView={activeView}
                            onSelectEvent={handleEventSelect}
                            onEventUpdate={handleEventUpdate}
                            onNavigate={handleDateChange}
                            isLoading={isSchedulesLoading}
                            staffMembers={[...careWorkers, ...officeStaff]}
                            isMobile={isMobile}
                            sidebarMode={sidebarMode}
                            clients={clients}
                            getEventTypeLabel={getEventTypeLabel}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

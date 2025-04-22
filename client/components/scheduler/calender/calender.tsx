"use client"

import { useState, useMemo, useEffect } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { useTheme } from "next-themes"
import { CalendarIcon, PlusCircle, PlusIcon } from "lucide-react"
import { Button } from "../../ui/button"
import type { AppointmentEvent, ProcessedCalendarEvent } from "./types"
import { useGetAgencySchedulesQuery } from "../../../state/api"
import { useAppSelector, useAppDispatch } from "../../../state/redux"
import { setCurrentDate } from "../../../state/slices/calendarSlice"
import { AppointmentForm } from "../appointment-form"

import { CustomCalendar } from "./custom-calender"
import type { CalendarProps } from "./types"
import { setEvents } from "@/state/slices/scheduleSlice"


export function Calendar({ onEventSelect }: CalendarProps) {
    const dispatch = useAppDispatch()
    const { activeView, currentDate: currentDateStr } = useAppSelector((state) => state.calendar)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<AppointmentEvent | null>(null)

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

    const { data: agencySchedulesData, isLoading: isSchedulesLoading } = useGetAgencySchedulesQuery(user?.userInfo?.agencyId || "")
    console.log('Agency Schedules:', agencySchedulesData)

    const schedules = useAppSelector((state) => state.schedule.agencySchedules)


    const processedEvents = useMemo(() => {
        if (!schedules || schedules.length === 0) return []

        return schedules.map(schedule => {
            const [y, m, d] = schedule.date.split("T")[0].split("-").map(Number)
            const date = new Date(y, m - 1, d);
            const [startHours, startMinutes] = schedule.startTime.split(":").map(Number) as [number, number];
            const [endHours, endMinutes] = schedule.endTime.split(":").map(Number) as [number, number];

            const start = new Date(date);
            start.setHours(startHours, startMinutes, 0, 0);

            const end = new Date(date);
            end.setHours(endHours, endMinutes, 0, 0);

            const processedEvent: ProcessedCalendarEvent = {
                id: schedule.id,
                title: `${schedule.client.fullName} - ${schedule.type}`,
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
                    fullName: schedule.user!.fullName,
                },
                client: {
                    fullName: schedule.client!.fullName,
                },
            }

            return processedEvent
        })

    }, [schedules])



    const isMobile = useMediaQuery("(max-width: 768px)")

    const handleDateChange = (date: Date) => {
        if (date instanceof Date && !isNaN(date.getTime())) {
            dispatch(setCurrentDate(date.toISOString()))
        }
    }

    const handleEventSelect = (event: any) => {
        if (!event.id) {
            const defaultEvent = {
                start: new Date(event.start),
                end: new Date(event.end),
                date: new Date(event.start),
                startTime: format(new Date(event.start), "HH:mm"),
                endTime: format(new Date(event.end), "HH:mm"),
                type: "APPOINTMENT",
                status: "PENDING",
                notes: "",
            }
            setEditingEvent(defaultEvent as any)
        } else {
            const formattedEvent = {
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
                date: new Date(event.date),
                startTime: event.startTime || format(new Date(event.start), "HH:mm"),
                endTime: event.endTime || format(new Date(event.end), "HH:mm"),
            }
            setEditingEvent(formattedEvent)
        }
        setIsFormOpen(true)
        if (onEventSelect && event.id) {
            onEventSelect(event)
        }
    }

    const handleEventUpdate = (updatedEvent: any) => {
        console.log("Event updated:", updatedEvent)
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingEvent(null)
    }

    useEffect(() => {
        dispatch(setEvents(processedEvents as AppointmentEvent[]))
    }, [dispatch, processedEvents])

    const handleCreateAppointment = () => {
        const defaultEvent = {
            start: new Date(currentDate),
            end: new Date(new Date(currentDate).setHours(currentDate.getHours() + 1)),
            date: currentDate,
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
        <div className={`flex flex-col h-full w-full relative ${isDark ? "dark-theme" : ""}`}>
            {isDark && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 opacity-90"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-500/10 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-500/10 blur-3xl rounded-full"></div>
                </div>
            )}
            <div className="flex flex-1 h-full relative z-10 gap-3 overflow-hidden">
                <div
                    className={`${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"} border rounded-lg overflow-hidden transition-all duration-200 ease-in-out flex-1`}
                >
                    {schedules.length === 0 && !isSchedulesLoading ? (
                        <div className="flex-1 h-full flex flex-col items-center justify-center p-8">
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
                            spaceTheme={theme === "dark"}

                            getEventTypeLabel={getEventTypeLabel}
                        />
                    )}
                </div>
            </div>
            {isMobile && (
                <Button
                    onClick={handleCreateAppointment}
                    size="icon"
                    className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-20 ${isDark ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        }`}
                >
                    <PlusCircle className="h-6 w-6" />
                    <span className="sr-only">New Appointment</span>
                </Button>
            )}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent
                    className={`${isDark ? "bg-slate-900 border-slate-800 text-white" : ""} max-w-lg w-full max-h-[90vh] overflow-auto`}
                >
                    <VisuallyHidden>
                        <DialogTitle>{editingEvent?.id ? "Edit Appointment" : "New Appointment"}</DialogTitle>
                    </VisuallyHidden>
                    <AppointmentForm
                        isOpen={true}
                        onClose={handleFormClose}
                        event={editingEvent}
                        isNew={!editingEvent?.id}

                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import moment from "moment"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { useTheme } from "next-themes"
import { CalendarIcon, Moon, PlusCircle, PlusIcon, Sun } from "lucide-react"
import { Button } from "../../ui/button"
import type { AppointmentEvent, ProcessedCalendarEvent } from "./types"
import { useGetAgencySchedulesQuery, useGetSchedulesQuery } from "../../../state/api"
import { useAppSelector, useAppDispatch } from "../../../state/redux"
import { setCurrentDate } from "../../../state/slices/calendarSlice"
import { AppointmentForm } from "../appointment-form"

import { CustomCalendar } from "./custom-calender"
import type { CalendarProps } from "./types"

// Helper function to deserialize an event
function deserializeEvent(event: any) {
    return {
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        date: new Date(event.date),
    }
}

export function Calendar({ view, onEventSelect, dateRange }: CalendarProps) {
    const dispatch = useAppDispatch()
    const { activeView, currentDate: currentDateStr } = useAppSelector((state) => state.calendar)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<AppointmentEvent | null>(null)
    const { theme, setTheme } = useTheme()

    // Get data from Redux store
    const {
        officeStaff,
        careWorkers,
        clients,
        loading: isLoading,
    } = useAppSelector((state) => state.user)

    // Get user info from Redux store
    const { user } = useAppSelector((state) => state.user)

    // Get schedule data from Redux store
    const {
        events,
        filteredEvents,
        sidebarMode,
        loading: isScheduleLoading
    } = useAppSelector((state) => state.schedule)

    // Convert currentDate string to Date object
    const currentDate = useMemo(() => {
        const date = new Date(currentDateStr)
        return isNaN(date.getTime()) ? new Date() : date
    }, [currentDateStr])

    const { data: agencySchedulesData, isLoading: isSchedulesLoading } = useGetAgencySchedulesQuery(user?.userInfo?.agencyId || "")
    console.log('Agency Schedules:', agencySchedulesData)

    const schedules = useAppSelector((state) => state.schedule.agencySchedules)

    // Process events to match calendar format
    const processedEvents = useMemo(() => {
        if (!schedules || schedules.length === 0) return []

        return schedules.map(schedule => {
            // Parse the date and times
            const date = new Date(schedule.date)
            const [startHours, startMinutes] = schedule.startTime.split(':').map(Number)
            const [endHours, endMinutes] = schedule.endTime.split(':').map(Number)

            // Create start and end Date objects
            const start = new Date(date)
            start.setHours(startHours, startMinutes, 0, 0)

            const end = new Date(date)
            end.setHours(endHours, endMinutes, 0, 0)

            const processedEvent: ProcessedCalendarEvent = {
                id: schedule.id,
                title: `${schedule.client.firstName} ${schedule.client.lastName} - ${schedule.type}`,
                start,
                end,
                date,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                resourceId: schedule.userId,
                clientId: schedule.clientId,
                type: schedule.type,
                status: schedule.status,
                notes: schedule.notes,
                color: schedule.color || '#10b981',
                careWorker: {
                    firstName: schedule.user.firstName,
                    lastName: schedule.user.lastName
                },
                client: {
                    firstName: schedule.client.firstName,
                    lastName: schedule.client.lastName
                }
            }

            return processedEvent
        })
    }, [schedules])

    // Media queries for responsive design
    const isMobile = useMediaQuery("(max-width: 768px)")

    // Handle date change
    const handleDateChange = (date: Date) => {
        if (date instanceof Date && !isNaN(date.getTime())) {
            dispatch(setCurrentDate(date.toISOString()))
        }
    }

    const handleEventSelect = (event: any) => {
        // If this is a slot selection (new event), create a default event
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
            // For existing events, ensure all required fields are present
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

    // Handle event updates from drag operations
    const handleEventUpdate = (updatedEvent: any) => {
        // In a real app, you would update the event in your database
        console.log("Event updated:", updatedEvent)
    }

    // Handle form close with refresh
    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingEvent(null)
        // Refresh data would be handled by Redux
    }

    // Create a new appointment
    const handleCreateAppointment = () => {
        // Create a default event with the current date
        const defaultEvent = {
            start: new Date(currentDate),
            end: new Date(new Date(currentDate).setHours(currentDate.getHours() + 1)),
            date: currentDate,
        }
        setEditingEvent(defaultEvent as any)
        setIsFormOpen(true)
    }

    // Check if we have any data
    const hasNoData = !isScheduleLoading && !events.length && !filteredEvents.length

    const isDark = theme === "dark"

    // Get event type label
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
            {/* Dark mode background with improved gradient */}
            {isDark && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 opacity-90"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-500/10 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-500/10 blur-3xl rounded-full"></div>
                </div>
            )}

            {/* Main content area with improved layout */}
            <div className="flex flex-1 h-full relative z-10 gap-3 overflow-hidden">
                {/* Main calendar area with improved styling */}
                <div
                    className={`${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"} border rounded-lg overflow-hidden transition-all duration-200 ease-in-out flex-1`}
                >
                    {schedules.length === 0 ? (
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
                            events={processedEvents}
                            getEventTypeLabel={getEventTypeLabel}
                        />
                    )}
                </div>
            </div>

            {/* Mobile floating action button for creating appointments */}
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

            {/* Appointment form dialog with improved styling */}
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


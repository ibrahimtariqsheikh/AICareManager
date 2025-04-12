"use client"
import { useEffect } from "react"
import { CustomDayView } from "./views/custom-day-view"
import { CustomWeekView } from "./views/custom-week-view"
import { CustomMonthView } from "./views/custom-month-view"
import type { AppointmentEvent, StaffMember, Client, SidebarMode, ProcessedCalendarEvent } from "./types"
import { Skeleton } from "../../ui/skeleton"
import { format } from "date-fns"
import { filterEvents, getEventColor } from "./calender-utils"
import { useAppSelector } from "@/state/redux"

interface CustomCalendarProps {
    currentDate: Date
    activeView: "day" | "week" | "month"
    onSelectEvent: (event: any) => void
    onEventUpdate: (event: any) => void
    onNavigate: (date: Date) => void
    isLoading: boolean
    staffMembers: StaffMember[]
    isMobile: boolean
    sidebarMode: SidebarMode
    clients: Client[]
    spaceTheme?: boolean
    events: ProcessedCalendarEvent[]
    getEventTypeLabel: (type: string) => string
}

export function CustomCalendar({
    currentDate,
    activeView,
    onSelectEvent,
    onEventUpdate,
    onNavigate,
    isLoading,
    staffMembers,
    isMobile,
    sidebarMode,
    clients,
    spaceTheme,
    events,
    getEventTypeLabel,
}: CustomCalendarProps) {
    const getEventDurationInMinutes = (event: AppointmentEvent) => {
        const start = new Date(event.start)
        const end = new Date(event.end)
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    }

    // Log events for debugging
    useEffect(() => {
        console.log("Calendar received events:", events.length)
        console.log("Sample processed event:", events[0])
    }, [events])

    if (isLoading) {
        return (
            <div className="w-full h-full p-4">
                <Skeleton className="w-full h-full" />
            </div>
        )
    }

    // Render the appropriate view based on activeView
    return (
        <div className="h-full w-full calendar-scrollbar">
            {activeView === "day" && (
                <CustomDayView
                    date={currentDate}
                    events={events}
                    onSelectEvent={onSelectEvent}
                    onEventUpdate={onEventUpdate}
                    spaceTheme={spaceTheme}
                    clients={clients}
                />
            )}

            {activeView === "week" && (
                <CustomWeekView
                    date={currentDate}
                    events={events}
                    onSelectEvent={onSelectEvent}
                    onEventUpdate={onEventUpdate}
                    staffMembers={staffMembers}
                    getEventDurationInMinutes={getEventDurationInMinutes}
                    spaceTheme={spaceTheme}
                />
            )}

            {activeView === "month" && (
                <CustomMonthView
                    date={currentDate}
                    events={events}
                    onSelectEvent={onSelectEvent}
                    onDateSelect={onNavigate}
                    staffMembers={staffMembers}
                    getEventDurationInMinutes={getEventDurationInMinutes}
                    getEventTypeLabel={getEventTypeLabel}
                    spaceTheme={spaceTheme}
                    clients={clients}
                    sidebarMode={sidebarMode}
                />
            )}
        </div>
    )
}

export default CustomCalendar

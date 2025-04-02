"use client"
import { useEffect } from "react"
import { CustomDayView } from "./views/custom-day-view"
import { CustomWeekView } from "./views/custom-week-view"
import { CustomMonthView } from "./views/custom-month-view"
import type { AppointmentEvent, StaffMember, Client, SidebarMode } from "./types"
import { Skeleton } from "../../ui/skeleton"

interface CustomCalendarProps {
    events: AppointmentEvent[]
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
}

export function CustomCalendar({
    events,
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
}: CustomCalendarProps) {
    // Ensure dates are properly parsed
    const processedEvents = events.map((event) => ({
        ...event,
        start: event.start instanceof Date ? event.start : new Date(event.start),
        end: event.end instanceof Date ? event.end : new Date(event.end),
    }))

    // Calculate event duration in minutes
    const getEventDurationInMinutes = (event: AppointmentEvent) => {
        const start = new Date(event.start)
        const end = new Date(event.end)
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    }

    // Log events for debugging
    useEffect(() => {
        console.log("Calendar received events:", events.length)
        console.log("Processed events:", processedEvents.length)
    }, [events, processedEvents.length])

    if (isLoading) {
        return (
            <div className="w-full h-full p-4">
                <Skeleton className="w-full h-full" />
            </div>
        )
    }

    // Render the appropriate view based on activeView
    return (
        <div className={`h-full w-full calendar-scrollbar ${spaceTheme ? "dark-calendar" : "light-theme"}`}>
            {activeView === "day" && (
                <CustomDayView
                    date={currentDate}
                    events={processedEvents}
                    onSelectEvent={onSelectEvent}
                    onEventUpdate={onEventUpdate}
                    staffMembers={staffMembers}
                    getEventDurationInMinutes={getEventDurationInMinutes}
                    spaceTheme={spaceTheme}
                    clients={clients}
                    sidebarMode={sidebarMode}
                />
            )}

            {activeView === "week" && (
                <CustomWeekView
                    date={currentDate}
                    events={processedEvents}
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
                    events={processedEvents}
                    onSelectEvent={onSelectEvent}
                    onDateSelect={onNavigate}
                    staffMembers={staffMembers}
                    getEventDurationInMinutes={getEventDurationInMinutes}
                    spaceTheme={spaceTheme}
                    clients={clients}
                    sidebarMode={sidebarMode}
                />
            )}
        </div>
    )
}

export default CustomCalendar


"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card } from "../../../components/ui/card"
import { Loader2, PlusCircle } from 'lucide-react'
import type { AppointmentEvent } from "./types"
import { CustomMonthView } from "./views/custom-month-view"
import { CustomWeekView } from "./views/custom-week-view"
import { CustomDayView } from "./views/custom-day-view"
import { Button } from "../../ui/button"

interface CustomCalendarProps {
    events: AppointmentEvent[]
    currentDate: Date
    activeView: "day" | "week" | "month"
    onSelectEvent: (event: AppointmentEvent) => void
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
    onNavigate: (date: Date) => void
    isLoading: boolean
    staffMembers: any[]
    getEventDurationInMinutes: (event: any) => number
    isMobile: boolean
    sidebarMode?: "staff" | "clients"
    toggleStaffSelection?: (staffId: string) => void
    toggleClientSelection?: (clientId: string) => void
    toggleEventTypeSelection?: (typeId: string) => void
    selectAllStaff?: () => void
    deselectAllStaff?: () => void
    selectAllClients?: () => void
    deselectAllClients?: () => void
    toggleSidebarMode?: () => void
    clients?: any[]
    eventTypes?: any[]
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
    getEventDurationInMinutes,
    isMobile,
    sidebarMode = "staff",
    toggleStaffSelection = () => { },
    toggleClientSelection = () => { },
    toggleEventTypeSelection = () => { },
    selectAllStaff = () => { },
    deselectAllStaff = () => { },
    selectAllClients = () => { },
    deselectAllClients = () => { },
    toggleSidebarMode = () => { },
    clients = [],
    eventTypes = [],
    spaceTheme = false,
}: CustomCalendarProps) {
    const calendarRef = useRef<HTMLDivElement>(null)
    const [calendarHeight, setCalendarHeight] = useState("calc(90vh - 120px)")

    // Update calendar height based on container size
    useEffect(() => {
        const updateHeight = () => {
            if (calendarRef.current) {
                const containerHeight = calendarRef.current.offsetHeight
                setCalendarHeight(`${containerHeight}px`)
            }
        }

        updateHeight()
        window.addEventListener("resize", updateHeight)
        return () => window.removeEventListener("resize", updateHeight)
    }, [])

    // Memoize the day view to prevent unnecessary re-renders
    const dayView = useMemo(() => {
        if (activeView !== "day") return null

        return (
            <CustomDayView
                date={currentDate}
                events={events}
                onSelectEvent={onSelectEvent}
                onEventUpdate={onEventUpdate}
                min={new Date(new Date().setHours(7, 0, 0))}
                max={new Date(new Date().setHours(19, 0, 0))}
                staffMembers={staffMembers}
                getEventDurationInMinutes={getEventDurationInMinutes}
                clients={clients}
                eventTypes={eventTypes}
                sidebarMode={sidebarMode}
                toggleStaffSelection={toggleStaffSelection}
                toggleClientSelection={toggleClientSelection}
                toggleEventTypeSelection={toggleEventTypeSelection}
                selectAllStaff={selectAllStaff}
                deselectAllStaff={deselectAllStaff}
                selectAllClients={selectAllClients}
                deselectAllClients={deselectAllClients}
                toggleSidebarMode={toggleSidebarMode}
                spaceTheme={spaceTheme}
                showSidebar={true} // Always show sidebar in day view
            />
        )
    }, [
        activeView,
        currentDate,
        events,
        onSelectEvent,
        onEventUpdate,
        staffMembers,
        clients,
        eventTypes,
        sidebarMode,
        toggleStaffSelection,
        toggleClientSelection,
        toggleEventTypeSelection,
        selectAllStaff,
        deselectAllStaff,
        selectAllClients,
        deselectAllClients,
        toggleSidebarMode,
        spaceTheme,
        getEventDurationInMinutes,
    ])

    // Memoize the week view
    const weekView = useMemo(() => {
        if (activeView !== "week") return null

        return (
            <CustomWeekView
                date={currentDate}
                events={events}
                onSelectEvent={onSelectEvent}
                onEventUpdate={onEventUpdate}
                staffMembers={staffMembers}
                getEventDurationInMinutes={getEventDurationInMinutes}
                spaceTheme={spaceTheme}
            />
        )
    }, [
        activeView,
        currentDate,
        events,
        onSelectEvent,
        onEventUpdate,
        staffMembers,
        getEventDurationInMinutes,
        spaceTheme,
    ])

    // Memoize the month view
    const monthView = useMemo(() => {
        if (activeView !== "month") return null

        return (
            <CustomMonthView
                date={currentDate}
                events={events}
                onSelectEvent={onSelectEvent}
                onDateSelect={(date) => onNavigate(date)}
                staffMembers={staffMembers}
                getEventDurationInMinutes={getEventDurationInMinutes}
                spaceTheme={spaceTheme}
            />
        )
    }, [activeView, currentDate, events, onSelectEvent, onNavigate, staffMembers, getEventDurationInMinutes, spaceTheme])

    const cardClasses = spaceTheme
        ? "flex-1 shadow-lg border border-indigo-500/20 rounded-lg overflow-hidden p-0 h-full bg-slate-900/60 backdrop-blur-sm"
        : "flex-1 shadow-sm border border-gray-100 rounded-lg overflow-hidden p-0 h-full"

    // Check if we have events for the current view
    const hasEventsInCurrentView = events.length > 0

    return (
        <Card className={cardClasses}>
            {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[500px]">
                    <Loader2 className={`h-6 w-6 ${spaceTheme ? "text-purple-400" : "text-blue-500"} animate-spin`} />
                </div>
            ) : !hasEventsInCurrentView ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className={`mb-4 ${spaceTheme ? "text-slate-400" : "text-gray-400"}`}>
                        {activeView === "day" ? (
                            <span>No appointments scheduled for this day</span>
                        ) : activeView === "week" ? (
                            <span>No appointments scheduled for this week</span>
                        ) : (
                            <span>No appointments scheduled for this month</span>
                        )}
                    </div>
                    <Button
                        onClick={() => {
                            // Create a default event with the current date
                            const defaultEvent = {
                                start: new Date(currentDate),
                                end: new Date(new Date(currentDate).setHours(currentDate.getHours() + 1)),
                                date: currentDate,
                            }
                            onSelectEvent(defaultEvent as any)
                        }}
                        className={spaceTheme ? "bg-purple-600 hover:bg-purple-700" : ""}
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Appointment
                    </Button>
                </div>
            ) : (
                <div className="h-full flex flex-col overflow-hidden" ref={calendarRef}>
                    {activeView === "day" && dayView}
                    {activeView === "week" && weekView}
                    {activeView === "month" && monthView}
                </div>
            )}
        </Card>
    )
}


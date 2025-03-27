"use client"

import { useState, useEffect } from "react"
import moment from "moment"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { AppointmentEvent } from "../types"
import { Button } from "../../../ui/button"
import { cn } from "../../../../lib/utils"

// Add spaceTheme prop to the component interface
interface CustomMonthViewProps {
    date: Date
    events: AppointmentEvent[]
    onSelectEvent: (event: AppointmentEvent) => void
    onDateSelect: (date: Date) => void
    staffMembers: any[]
    getEventDurationInMinutes: (event: any) => number
    spaceTheme?: boolean
    clients?: any[]
    eventTypes?: any[]
    sidebarMode?: any
    toggleStaffSelection?: (staffId: string) => void
    toggleClientSelection?: (clientId: string) => void
    toggleEventTypeSelection?: (typeId: string) => void
    selectAllStaff?: () => void
    deselectAllStaff?: () => void
    selectAllClients?: () => void
    deselectAllClients?: () => void
    toggleSidebarMode?: () => void
}

// Update the function to accept the spaceTheme prop
export function CustomMonthView({
    date,
    events,
    onSelectEvent,
    onDateSelect,
    staffMembers,
    getEventDurationInMinutes,
    spaceTheme = false,
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
}: CustomMonthViewProps) {
    const [calendar, setCalendar] = useState<Date[][]>([])
    const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({})

    // Generate calendar days for the month
    useEffect(() => {
        const startDate = moment(date).startOf("month").startOf("week")
        const endDate = moment(date).endOf("month").endOf("week")

        const calendarDays: Date[][] = []
        let week: Date[] = []

        let day = startDate.clone()
        while (day.isSameOrBefore(endDate, "day")) {
            week.push(day.toDate())

            if (week.length === 7) {
                calendarDays.push([...week])
                week = []
            }

            day = day.add(1, "day")
        }

        setCalendar(calendarDays)
    }, [date])

    // Get events for a specific day
    const getEventsForDay = (day: Date) => {
        return events.filter((event) => moment(event.start).isSame(day, "day"))
    }

    // Toggle expanded day view
    const toggleDayExpand = (dateStr: string) => {
        setExpandedDays((prev) => ({
            ...prev,
            [dateStr]: !prev[dateStr],
        }))
    }

    // Format event time
    const formatEventTime = (event: AppointmentEvent) => {
        return moment(event.start).format("h:mm A")
    }

    // Update the getEventBackground function to use more subtle colors in dark mode
    const getEventBackground = (event: AppointmentEvent) => {
        if (spaceTheme) {
            switch (event.type) {
                case "HOME_VISIT":
                    return "bg-green-900/30 border-l-4 border-green-500"
                case "VIDEO_CALL":
                    return "bg-blue-900/30 border-l-4 border-blue-500"
                case "HOSPITAL":
                    return "bg-green-900/30 border-l-4 border-green-500"
                case "IN_PERSON":
                    return "bg-amber-900/30 border-l-4 border-amber-500"
                case "AUDIO_CALL":
                    return "bg-red-900/30 border-l-4 border-red-500"
                default:
                    return "bg-zinc-800/30 border-l-4 border-zinc-700"
            }
        } else {
            switch (event.type) {
                case "HOME_VISIT":
                    return "bg-green-50 border-l-4 border-green-500"
                case "VIDEO_CALL":
                    return "bg-blue-50 border-l-4 border-blue-500"
                case "HOSPITAL":
                    return "bg-green-50 border-l-4 border-green-500"
                case "IN_PERSON":
                    return "bg-amber-50 border-l-4 border-amber-500"
                case "AUDIO_CALL":
                    return "bg-red-50 border-l-4 border-red-500"
                default:
                    return "bg-gray-50 border-l-4 border-gray-500"
            }
        }
    }

    // Get staff color
    const getStaffColor = (event: AppointmentEvent) => {
        const staff = staffMembers.find((s) => s.id === event.resourceId)
        return staff?.color || "#888888"
    }

    return (
        <div className="h-full flex flex-col">
            {/* Day headers */}
            <div className={`grid grid-cols-7 border-b ${spaceTheme ? "border-zinc-800" : ""}`}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                    <div
                        key={i}
                        className={`p-2 text-center text-sm font-medium ${spaceTheme ? "text-zinc-400" : "text-gray-500"}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-7 auto-rows-fr h-full">
                    {calendar.flat().map((day, i) => {
                        const dateStr = moment(day).format("YYYY-MM-DD")
                        const isCurrentMonth = moment(day).isSame(date, "month")
                        const isToday = moment(day).isSame(moment(), "day")
                        const dayEvents = getEventsForDay(day)
                        const hasEvents = dayEvents.length > 0
                        const isExpanded = expandedDays[dateStr]

                        // Determine how many events to show before "more" button
                        const eventsToShow = isExpanded ? dayEvents : dayEvents.slice(0, 2)
                        const hasMore = dayEvents.length > 2 && !isExpanded

                        return (
                            <div
                                key={i}
                                className={cn(
                                    "border-b border-r p-1 relative transition-all duration-200",
                                    isCurrentMonth ? (spaceTheme ? "bg-black" : "bg-white") : spaceTheme ? "bg-zinc-900" : "bg-gray-50",
                                    isToday ? (spaceTheme ? "bg-zinc-800" : "bg-blue-50") : "",
                                    hasEvents ? "min-h-[100px]" : "min-h-[60px]", // Smaller height for days without events
                                    spaceTheme ? "border-zinc-800 text-white" : "",
                                )}
                                onClick={() => onDateSelect(day)}
                            >
                                {/* Day number */}
                                <div
                                    className={cn(
                                        "text-sm font-medium p-1 rounded-full w-7 h-7 flex items-center justify-center",
                                        isToday
                                            ? spaceTheme
                                                ? "bg-green-600 text-white"
                                                : "bg-blue-500 text-white"
                                            : spaceTheme
                                                ? "text-white"
                                                : "text-gray-700",
                                    )}
                                >
                                    {moment(day).date()}
                                </div>

                                {/* Events */}
                                <div className="mt-1 space-y-1">
                                    {eventsToShow.map((event, idx) => (
                                        <motion.div
                                            key={event.id}
                                            className={cn("text-xs p-1 rounded cursor-pointer event-card", getEventBackground(event))}
                                            style={{
                                                borderLeftColor: getStaffColor(event),
                                            }}
                                            whileHover={{
                                                y: -1,
                                                boxShadow: spaceTheme ? "0 0 8px rgba(0,0,0,0.5)" : "0 2px 4px rgba(0,0,0,0.1)",
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onSelectEvent(event)
                                            }}
                                        >
                                            <div className={`font-medium truncate ${spaceTheme ? "text-white" : ""}`}>{event.title}</div>
                                            <div className={`${spaceTheme ? "text-zinc-300" : "text-gray-500"}`}>
                                                {formatEventTime(event)}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Show more button */}
                                    {hasMore && (
                                        <Button
                                            variant={spaceTheme ? "outline" : "ghost"}
                                            size="sm"
                                            className={`text-xs w-full h-6 mt-1 ${spaceTheme ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleDayExpand(dateStr)
                                            }}
                                        >
                                            +{dayEvents.length - 2} more
                                            <ChevronDown className="h-3 w-3 ml-1" />
                                        </Button>
                                    )}

                                    {/* Show less button */}
                                    {isExpanded && (
                                        <Button
                                            variant={spaceTheme ? "outline" : "ghost"}
                                            size="sm"
                                            className={`text-xs w-full h-6 mt-1 ${spaceTheme ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleDayExpand(dateStr)
                                            }}
                                        >
                                            Show less
                                            <ChevronDown className="h-3 w-3 ml-1 rotate-180" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


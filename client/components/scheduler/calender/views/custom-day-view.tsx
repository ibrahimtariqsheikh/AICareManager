"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import moment from "moment"
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Video,
    Building2,
    Phone,
    User,
    Clock,
    Calendar,
    GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { AppointmentEvent } from "../types"
import { getStaffColor } from "../calender-utils"

interface CustomDayViewProps {
    date: Date
    events: AppointmentEvent[]
    onSelectEvent: (event: AppointmentEvent) => void
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
    min?: Date
    max?: Date
    staffMembers: any[]
    getEventDurationInMinutes?: (event: any) => number
    spaceTheme?: boolean
    showSidebar?: boolean
    slotHeight?: number
    minutesPerSlot?: number
}

export function CustomDayView({
    date,
    events,
    onSelectEvent,
    onEventUpdate,
    min = new Date(new Date().setHours(7, 0, 0)),
    max = new Date(new Date().setHours(19, 0, 0)),
    staffMembers,
    getEventDurationInMinutes = (event) => {
        const start = moment(event.start)
        const end = moment(event.end)
        return end.diff(start, "minutes")
    },
    spaceTheme = false,
    showSidebar = true,
    slotHeight = 12,
    minutesPerSlot = 10,
}: CustomDayViewProps) {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const eventRefs = useRef<{ [key: string]: HTMLElement }>({})

    // State
    const [scrollPosition, setScrollPosition] = useState(0)
    const [eventPositions, setEventPositions] = useState<{ [key: string]: any }>({})
    const [displayEvents, setDisplayEvents] = useState<{ [key: string]: AppointmentEvent }>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; time: string } | null>(null)

    // Constants
    const startHour = min.getHours()
    const endHour = max.getHours()
    const slotsPerHour = 60 / minutesPerSlot

    // Computed values
    const timeSlots = useMemo(() => {
        const slotCount = (endHour - startHour) * slotsPerHour + 1
        return Array.from({ length: slotCount }, (_, i) => {
            const hour = Math.floor(i / slotsPerHour) + startHour
            const minutes = (i % slotsPerHour) * minutesPerSlot
            return new Date(new Date(date).setHours(hour, minutes, 0, 0))
        })
    }, [date, startHour, endHour, minutesPerSlot, slotsPerHour])

    const totalHeight = timeSlots.length * slotHeight

    // Filter events for the current day
    const dayEvents = useMemo(() => {
        return events.filter((event) => {
            const eventDate = moment(event.start)
            return eventDate.isSame(date, "day")
        })
    }, [events, date])

    // Initialize display events
    useEffect(() => {
        const eventMap: { [key: string]: AppointmentEvent } = {}
        dayEvents.forEach((event) => {
            const processedEvent = {
                ...event,
                start: moment(event.start).toDate(),
                end: moment(event.end).toDate(),
                date: event.date ? moment(event.date).toDate() : moment(event.start).toDate(),
            }
            eventMap[event.id] = processedEvent
        })
        setDisplayEvents(eventMap)
    }, [dayEvents])

    // Calculate positions for events
    useEffect(() => {
        if (!timelineRef.current) return

        try {
            const positions: { [key: string]: any } = {}
            const containerWidth = timelineRef.current.clientWidth - 60

            // Sort events by start time
            const sortedEvents = [...dayEvents].sort(
                (a, b) => moment(a.start).valueOf() - moment(b.start).valueOf()
            )

            // Column allocation tracking
            const timeSlotColumns: { [timeSlot: number]: number[] } = {}

            sortedEvents.forEach((event) => {
                const eventStart = moment(event.start)
                const eventEnd = moment(event.end)

                // Calculate top position and height
                const startMinutes = (eventStart.hours() - startHour) * 60 + eventStart.minutes()
                const endMinutes = (eventEnd.hours() - startHour) * 60 + eventEnd.minutes()

                const roundedStartMinutes = Math.round(startMinutes / minutesPerSlot) * minutesPerSlot
                const roundedEndMinutes = Math.round(endMinutes / minutesPerSlot) * minutesPerSlot
                const roundedDuration = Math.max(roundedEndMinutes - roundedStartMinutes, minutesPerSlot)

                const top = (roundedStartMinutes / minutesPerSlot) * slotHeight + 10
                const height = Math.max((roundedDuration / minutesPerSlot) * slotHeight, 20)

                // Find overlapping events for column placement
                const overlappingEvents = sortedEvents.filter((otherEvent) => {
                    if (otherEvent.id === event.id) return false

                    const otherStart = moment(otherEvent.start)
                    const otherEnd = moment(otherEvent.end)

                    return (
                        (eventStart.isBefore(otherEnd) && eventEnd.isAfter(otherStart)) ||
                        (otherStart.isBefore(eventEnd) && otherEnd.isAfter(eventStart))
                    )
                })

                // Calculate time slot range this event occupies
                const startSlot = Math.floor(roundedStartMinutes / minutesPerSlot)
                const endSlot = Math.ceil(roundedEndMinutes / minutesPerSlot)

                // Find first available column
                let column = 0
                let maxColumns = 1

                // Check all occupied columns in the time range
                for (let slot = startSlot; slot <= endSlot; slot++) {
                    if (!timeSlotColumns[slot]) {
                        timeSlotColumns[slot] = []
                    }

                    // Find first available column
                    while (timeSlotColumns[slot].includes(column)) {
                        column++
                    }

                    // Update max columns needed
                    maxColumns = Math.max(maxColumns, column + 1)
                }

                // Mark this column as used for all time slots this event covers
                for (let slot = startSlot; slot <= endSlot; slot++) {
                    timeSlotColumns[slot].push(column)
                }

                // Calculate event position and width
                const totalColumns = maxColumns
                const columnWidth = containerWidth / totalColumns
                const left = column * columnWidth
                const width = columnWidth - 4



                // Store position data
                positions[event.id] = {
                    top,
                    left,
                    width,
                    height,
                    column,
                    totalColumns,
                    startMinutes: roundedStartMinutes,
                    durationMinutes: roundedDuration,
                    originalEvent: { ...event },
                }
            })

            setEventPositions(positions)
        } catch (error) {
            console.error("Error calculating event positions:", error)
        }
    }, [dayEvents, startHour, minutesPerSlot, slotHeight])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (timelineRef.current) {
                const containerWidth = timelineRef.current.clientWidth - 60

                setEventPositions((prev) => {
                    const updated = { ...prev }

                    Object.keys(updated).forEach((eventId) => {
                        const pos = updated[eventId]
                        const columnWidth = containerWidth / pos.totalColumns
                        updated[eventId] = {
                            ...pos,
                            width: columnWidth - 4,
                            left: 60 + pos.column * columnWidth,
                        }
                    })

                    return updated
                })
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [timelineRef, dayEvents])

    // Auto-scroll to current time on initial load
    useEffect(() => {
        const now = new Date()
        if (moment(now).isSame(date, "day") && containerRef.current) {
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()
            const minutesSinceStart = (currentHour - startHour) * 60 + currentMinute
            const scrollPos = (minutesSinceStart / minutesPerSlot) * slotHeight - 100
            containerRef.current.scrollTop = Math.max(0, scrollPos)
            setScrollPosition(containerRef.current.scrollTop)
        }
    }, [date, startHour, slotHeight, minutesPerSlot])

    // Add custom scrollbar style
    useEffect(() => {
        if (containerRef.current) {
            const styleId = "calendar-scrollbar-style"
            if (!document.getElementById(styleId)) {
                const style = document.createElement("style")
                style.id = styleId
                style.textContent = `
          .calendar-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .calendar-scrollbar::-webkit-scrollbar-track {
            background: ${spaceTheme ? "#1e293b" : "#f1f5f9"};
            border-radius: 4px;
          }
          .calendar-scrollbar::-webkit-scrollbar-thumb {
            background: ${spaceTheme ? "#475569" : "#cbd5e1"};
            border-radius: 4px;
          }
          .calendar-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${spaceTheme ? "#64748b" : "#94a3b8"};
          }
        `
                document.head.appendChild(style)
            }

            return () => {
                const styleElement = document.getElementById(styleId)
                if (styleElement) {
                    document.head.removeChild(styleElement)
                }
            }
        }
    }, [spaceTheme])

    // Handle scrolling
    const handleScroll = () => {
        if (containerRef.current) {
            setScrollPosition(containerRef.current.scrollTop)
        }
    }

    const scrollUp = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop -= 200
            setScrollPosition(containerRef.current.scrollTop)
        }
    }

    const scrollDown = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop += 200
            setScrollPosition(containerRef.current.scrollTop)
        }
    }

    // Time formatting helpers
    const formatTimeFromMinutes = (minutesFromStart: number) => {
        const hours = Math.floor(minutesFromStart / 60) + startHour
        const minutes = minutesFromStart % 60

        const displayHours = hours % 12 === 0 ? 12 : hours % 12
        const amPm = hours >= 12 ? "PM" : "AM"

        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${amPm}`
    }

    const getTimeFromGridPosition = (gridY: number) => {
        const gridUnits = Math.round(gridY / slotHeight)
        return gridUnits * minutesPerSlot
    }

    const getSnapPosition = (y: number) => {
        return Math.round(y / slotHeight) * slotHeight
    }

    // Drag event handlers
    const handleDragStart = (eventId: string) => {
        setActiveEvent(eventId)
        setIsDragging(true)
        document.body.style.cursor = "grabbing"

        const position = eventPositions[eventId]
        if (position) {
            const time = formatTimeFromMinutes(position.startMinutes)
            setDragTooltip({ eventId, time })
        }
    }

    const handleDrag = (eventId: string, info: any) => {
        const position = eventPositions[eventId]
        if (!position) return

        const rawNewTop = position.top + info.offset.y
        const snappedTop = getSnapPosition(rawNewTop)
        const minutesFromStart = getTimeFromGridPosition(snappedTop)
        const timeText = formatTimeFromMinutes(minutesFromStart)

        setDragTooltip({ eventId, time: timeText })
    }

    const handleDragEnd = (eventId: string, info: any) => {
        const position = eventPositions[eventId]
        if (!position) return

        document.body.style.cursor = ""
        setIsDragging(false)




        const minutesFromStart = getTimeFromGridPosition(position.top)
        const hours = Math.floor(minutesFromStart / 60) + startHour
        const minutes = minutesFromStart % 60

        // Ensure time is within bounds
        const clampedHours = Math.max(min.getHours(), Math.min(hours, max.getHours() - 1))

        // Create new dates
        const newStartDate = moment(date)
            .hour(clampedHours)
            .minute(minutes)
            .second(0)
            .millisecond(0)

        const durationInMinutes = position.durationMinutes
        const newEndDate = moment(newStartDate).add(durationInMinutes, "minutes")

        // Ensure end time is within bounds
        if (newEndDate.hour() > max.getHours() ||
            (newEndDate.hour() === max.getHours() && newEndDate.minute() > 0)) {
            // Adjust end time to max
            newEndDate.hour(max.getHours()).minute(0)

            // If resulting duration is too short, adjust start time instead
            const adjustedDuration = newEndDate.diff(newStartDate, "minutes")
            if (adjustedDuration < 30) {
                newStartDate.subtract(30 - adjustedDuration, "minutes")
            }
        }

        // Create updated event
        const updatedEvent = {
            ...position.originalEvent,
            start: newStartDate.toDate(),
            end: newEndDate.toDate(),
        }

        // Update display events
        setDisplayEvents((prev) => ({
            ...prev,
            [eventId]: updatedEvent,
        }))

        // Update position
        const updatedMinutesFromStart = (newStartDate.hour() - startHour) * 60 + newStartDate.minute()
        setEventPositions((prev) => ({
            ...prev,
            [eventId]: {
                ...prev[eventId],
                top: position.top,
                startMinutes: updatedMinutesFromStart,
                originalEvent: updatedEvent,
            },
        }))

        // Call update handler
        if (onEventUpdate) {
            onEventUpdate(updatedEvent)
            toast.success(`${updatedEvent.title} updated to ${newStartDate.format("h:mm A")}`)
        }

        // Clean up
        setDragTooltip(null)
        setActiveEvent(null)
    }

    // Style helpers
    const getEventBackground = (event: AppointmentEvent, isActive = false, isHovered = false) => {
        if (spaceTheme) {
            switch (event.type) {
                case "HOME_VISIT":
                    return isActive ? "bg-green-900/60" : isHovered ? "bg-green-900/40" : "bg-green-900/30"
                case "VIDEO_CALL":
                    return isActive ? "bg-blue-900/60" : isHovered ? "bg-blue-900/40" : "bg-blue-900/30"
                case "HOSPITAL":
                    return isActive ? "bg-green-900/60" : isHovered ? "bg-green-900/40" : "bg-green-900/30"
                case "IN_PERSON":
                    return isActive ? "bg-amber-900/60" : isHovered ? "bg-amber-900/40" : "bg-amber-900/30"
                case "AUDIO_CALL":
                    return isActive ? "bg-red-900/60" : isHovered ? "bg-red-900/40" : "bg-red-900/30"
                default:
                    return isActive ? "bg-slate-800/60" : isHovered ? "bg-slate-800/40" : "bg-slate-800/30"
            }
        } else {
            switch (event.type) {
                case "HOME_VISIT":
                    return isActive ? "bg-green-100" : isHovered ? "bg-green-50/80" : "bg-green-50"
                case "VIDEO_CALL":
                    return isActive ? "bg-blue-100" : isHovered ? "bg-blue-50/80" : "bg-blue-50"
                case "HOSPITAL":
                    return isActive ? "bg-green-100" : isHovered ? "bg-green-50/80" : "bg-green-50"
                case "IN_PERSON":
                    return isActive ? "bg-amber-100" : isHovered ? "bg-amber-50/80" : "bg-amber-50"
                case "AUDIO_CALL":
                    return isActive ? "bg-red-100" : isHovered ? "bg-red-50/80" : "bg-red-50"
                default:
                    return isActive ? "bg-gray-100" : isHovered ? "bg-gray-50/80" : "bg-gray-50"
            }
        }
    }

    const getEventAccentColor = (event: AppointmentEvent) => {
        switch (event.type) {
            case "HOME_VISIT":
                return "rgb(34, 197, 94)"
            case "VIDEO_CALL":
                return "rgb(59, 130, 246)"
            case "HOSPITAL":
                return "rgb(34, 197, 94)"
            case "IN_PERSON":
                return "rgb(245, 158, 11)"
            case "AUDIO_CALL":
                return "rgb(239, 68, 68)"
            default:
                return "rgb(107, 114, 128)"
        }
    }

    const getEventIcon = (type: string) => {
        switch (type) {
            case "HOME_VISIT":
                return <Home className="h-3.5 w-3.5" />
            case "VIDEO_CALL":
                return <Video className="h-3.5 w-3.5" />
            case "HOSPITAL":
                return <Building2 className="h-3.5 w-3.5" />
            case "AUDIO_CALL":
                return <Phone className="h-3.5 w-3.5" />
            case "IN_PERSON":
                return <User className="h-3.5 w-3.5" />
            default:
                return <Calendar className="h-3.5 w-3.5" />
        }
    }

    const getEventTypeLabel = (type: string) => {
        switch (type) {
            case "HOME_VISIT":
                return "Home Visit"
            case "VIDEO_CALL":
                return "Video Call"
            case "HOSPITAL":
                return "Hospital"
            case "IN_PERSON":
                return "In-Person"
            case "AUDIO_CALL":
                return "Audio Call"
            default:
                return "Appointment"
        }
    }

    const hasEventsInTimeSlot = (timeSlot: Date) => {
        const slotStart = moment(timeSlot)
        const slotEnd = moment(slotStart).add(minutesPerSlot, "minutes")

        return dayEvents.some((event) => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)
            return (
                (eventStart.isSameOrAfter(slotStart) && eventStart.isBefore(slotEnd)) ||
                (eventEnd.isAfter(slotStart) && eventEnd.isSameOrBefore(slotEnd)) ||
                (eventStart.isSameOrBefore(slotStart) && eventEnd.isSameOrAfter(slotEnd))
            )
        })
    }

    const getEventDuration = (event: AppointmentEvent) => {
        const duration = getEventDurationInMinutes(event)
        if (duration < 60) {
            return `${duration} min`
        }
        const hours = Math.floor(duration / 60)
        const minutes = duration % 60
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }

    // Theme-based style classes
    const headerTextClass = spaceTheme ? "text-white" : "text-gray-700"
    const timelineClass = spaceTheme ? "bg-slate-900" : "bg-white"
    const timeLabelsClass = spaceTheme ? "text-slate-400" : "text-gray-500"
    const currentTimeClass = spaceTheme ? "bg-green-500" : "bg-red-500"
    const gridLineClass = spaceTheme ? "border-slate-800" : "border-gray-100"
    const hourLineClass = spaceTheme ? "border-slate-700" : "border-gray-200"
    const halfHourLineClass = spaceTheme ? "border-slate-800" : "border-gray-100"
    const tooltipClass = spaceTheme
        ? "bg-slate-800 text-white border border-slate-700"
        : "bg-white text-black border border-gray-200"

    return (
        <div className="h-full flex flex-col p-4">
            <div className="flex justify-center items-center mb-3">
                <h3
                    className={`text-lg font-semibold text-center px-3 py-1.5 rounded-full "
                            }`}
                >
                    {moment(date).format("dddd, MMMM D, YYYY")}
                </h3>
            </div>


            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Scroll controls */}
                <div className="flex justify-end items-center mb-3 gap-2">
                    {/* <Button
                        variant={spaceTheme ? "outline" : "secondary"}
                        size="sm"
                        onClick={scrollUp}
                        disabled={scrollPosition <= 0}
                        className={`flex items-center gap-1 ${spaceTheme ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800" : ""
                            } ${scrollPosition <= 0 ? "opacity-50" : ""}`}
                    >
                        <ChevronLeft className="h-3.5 w-3.5 rotate-90" />
                        <span>Earlier</span>
                    </Button> */}
                    <div />
                    <div
                        className={`text-xs ${spaceTheme ? "text-slate-400 bg-slate-800/50" : "text-gray-500 bg-gray-100/70"
                            } flex items-center gap-1 px-3 py-1.5 rounded-full`}
                    >
                        <GripVertical className="h-3 w-3" />
                        <span>Drag events to reschedule</span>
                    </div>
                    <div
                        className={`text-xs ${spaceTheme ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"
                            } flex items-center gap-1 px-2.5 py-1 rounded-full`}
                    >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                        </span>
                    </div>

                    {/* <Button
                        variant={spaceTheme ? "outline" : "secondary"}
                        size="sm"
                        onClick={scrollDown}
                        disabled={scrollPosition >= totalHeight - (containerRef.current?.clientHeight || 0)}
                        className={`flex items-center gap-1 ${spaceTheme ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800" : ""
                            } ${scrollPosition >= totalHeight - (containerRef.current?.clientHeight || 0) ? "opacity-50" : ""
                            }`}
                    >
                        <span>Later</span>
                        <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                    </Button> */}
                </div>

                {/* Main timeline container */}
                <div
                    ref={containerRef}
                    className={`flex-1 overflow-y-auto overflow-x-hidden relative border rounded-xl shadow-md ${timelineClass} h-full calendar-scrollbar`}
                    onScroll={handleScroll}
                    style={{
                        minHeight: "300px",
                        maxHeight: "calc(100vh - 200px)",
                    }}
                >
                    <div className="relative min-h-full" style={{ height: `${totalHeight}px` }} ref={timelineRef}>
                        {/* Time labels column */}
                        <div
                            className={`absolute top-0 left-0 w-[60px] h-full border-r ${spaceTheme ? "border-slate-800 bg-slate-900/80" : "border-gray-200 bg-gray-50/80"
                                } z-10 backdrop-blur-sm`}
                        >
                            {timeSlots
                                .filter((_, i) => i % slotsPerHour === 0)
                                .map((time, i) => (
                                    <div
                                        key={i}
                                        className={`absolute ${timeLabelsClass} text-xs font-medium px-2 flex items-center justify-end w-full`}
                                        style={{ top: `${i * slotHeight * slotsPerHour}px`, height: `${slotHeight}px` }}
                                    >
                                        {moment(time).format("h A")}
                                    </div>
                                ))}
                        </div>

                        {/* Time grid */}
                        <div className="absolute left-[60px] right-0 top-0 bottom-0">
                            {timeSlots.map((time, i) => {
                                const hasEvents = hasEventsInTimeSlot(time)
                                const isHourMark = i % slotsPerHour === 0
                                const isHalfHourMark = i % (slotsPerHour / 2) === 0

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "absolute left-0 right-0 border-b transition-colors time-slot",
                                            isHourMark ? hourLineClass : isHalfHourMark ? halfHourLineClass : gridLineClass,
                                            hasEvents
                                                ? spaceTheme
                                                    ? "bg-slate-800/5"
                                                    : "bg-blue-50/5"
                                                : spaceTheme
                                                    ? "bg-slate-800/10"
                                                    : "bg-gray-50/30"
                                        )}
                                        style={{
                                            top: `${i * slotHeight}px`,
                                            height: `${slotHeight}px`,
                                            borderBottomWidth: isHourMark ? "2px" : "1px",
                                        }}
                                    >
                                        {isHourMark && (
                                            <div
                                                className={`absolute right-2 top-0 ${timeLabelsClass} text-[10px] opacity-60`}
                                                style={{ height: `${slotHeight}px` }}
                                            >
                                                {moment(time).format("h A")}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {/* Current time indicator */}
                            {moment(new Date()).isSame(date, "day") && (
                                <div
                                    className={`absolute left-0 right-0 h-0.5 z-20 ${currentTimeClass}`}
                                    style={{
                                        top: `${(((new Date().getHours() - startHour) * 60 + new Date().getMinutes()) /
                                            minutesPerSlot) *
                                            slotHeight
                                            }px`,
                                    }}
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full ${currentTimeClass} -mt-1.5 -ml-1.5 shadow-md flex items-center justify-center animate-pulse`}
                                    >
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                    <div
                                        className={`absolute -right-14 -top-3 text-xs font-medium ${spaceTheme ? "text-white bg-slate-800/80" : "text-gray-700 bg-white/80"
                                            } bg-opacity-75 px-2 py-0.5 rounded-full shadow-sm`}
                                    >
                                        {moment(new Date()).format("h:mm A")}
                                    </div>
                                </div>
                            )}

                            {/* Empty state */}
                            {dayEvents.length === 0 && (
                                <div
                                    className={`absolute inset-0 flex items-center justify-center ${spaceTheme ? "text-slate-400" : "text-gray-400"
                                        } text-sm`}
                                >
                                    <div className="text-center p-6 max-w-xs mx-auto">
                                        <div
                                            className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${spaceTheme ? "bg-slate-800/50" : "bg-gray-100"
                                                }`}
                                        >
                                            <Calendar className="h-8 w-8 opacity-40" />
                                        </div>
                                        <p className="font-medium">No events scheduled for this day</p>

                                    </div>
                                </div>
                            )}

                            {/* Events */}
                            <AnimatePresence>
                                {Object.entries(displayEvents).map(([eventId, event]) => {
                                    const position = eventPositions[eventId]
                                    if (!position) return null

                                    return (
                                        <motion.div
                                            key={eventId}
                                            ref={(el) => {
                                                if (el) eventRefs.current[eventId] = el
                                            }}
                                            layout
                                            initial={false}
                                            animate={{
                                                top: position.top,
                                                left: position.left,
                                                width: position.width,
                                                height: position.height,
                                                position: "absolute",
                                            }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            drag="y"
                                            dragMomentum={false}
                                            dragConstraints={{
                                                top: 0,
                                                bottom: totalHeight - position.height,
                                            }}
                                            dragElastic={0}
                                            dragTransition={{
                                                bounceStiffness: 0,
                                                bounceDamping: 0
                                            }}
                                            onDragStart={() => handleDragStart(eventId)}
                                            onDrag={(e, info) => handleDrag(eventId, info)}
                                            onDragEnd={(e, info) => handleDragEnd(eventId, info)}
                                            className={cn(
                                                "rounded-lg shadow-sm text-xs p-2 cursor-grab border",
                                                getEventBackground(event, activeEvent === eventId, hoveredEvent === eventId),
                                                spaceTheme ? "text-white border-slate-700" : "text-black border-gray-200"
                                            )}
                                            onClick={() => {
                                                if (!isDragging) {
                                                    onSelectEvent(event)
                                                }
                                            }}
                                            onMouseEnter={() => setHoveredEvent(eventId)}
                                            onMouseLeave={() => setHoveredEvent(null)}
                                        >
                                            <div className="flex items-center gap-1 mb-1">
                                                {getEventIcon(event.type)}
                                                <span className="font-medium truncate">{event.title}</span>
                                            </div>
                                            <div className="text-[10px] opacity-70">
                                                {moment(event.start).format("h:mm A")} -{" "}
                                                {moment(event.end).format("h:mm A")}
                                            </div>
                                            <div className="text-[10px] opacity-60">
                                                {getEventTypeLabel(event.type)} • {getEventDuration(event)}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>

                            {/* Drag tooltip */}
                            {dragTooltip && (
                                <div
                                    className={`pointer-events-none absolute z-50 px-2 py-1 rounded-md text-xs font-medium shadow-sm ${tooltipClass}`}
                                    style={{
                                        top: `${eventPositions[dragTooltip.eventId]?.top ?? 0 - 24}px`,
                                        left: `${eventPositions[dragTooltip.eventId]?.left ?? 0}px`,
                                    }}
                                >
                                    {dragTooltip.time}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
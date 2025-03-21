"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import moment from "moment"
import { motion, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight, Home, Video, Building2, Phone, User } from 'lucide-react'
import { Button } from "../../../ui/button"
import { cn } from "../../../../lib/utils"
import { toast } from "sonner"
import type { AppointmentEvent } from "../types"

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
    clients?: any[]
    eventTypes?: any[]
    sidebarMode?: "staff" | "clients"
    toggleStaffSelection?: (staffId: string) => void
    toggleClientSelection?: (clientId: string) => void
    toggleEventTypeSelection?: (typeId: string) => void
    selectAllStaff?: () => void
    deselectAllStaff?: () => void
    selectAllClients?: () => void
    deselectAllClients?: () => void
    toggleSidebarMode?: () => void
    showSidebar?: boolean
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
    showSidebar = true, // Add default value for showSidebar
}: CustomDayViewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [containerWidth, setContainerWidth] = useState(0)
    const [eventPositions, setEventPositions] = useState<{ [key: string]: any }>({})
    const [displayEvents, setDisplayEvents] = useState<{ [key: string]: AppointmentEvent }>({})
    const isDragging = useRef(false)

    // Memoize time slots to prevent unnecessary recalculations
    const timeSlots = useMemo(() => {
        const startHour = min.getHours()
        const endHour = max.getHours()
        const hoursCount = endHour - startHour

        return Array.from({ length: hoursCount * 6 + 1 }, (_, i) => {
            const hour = Math.floor(i / 6) + startHour
            const minutes = (i % 6) * 10
            return new Date(new Date(date).setHours(hour, minutes, 0, 0))
        })
    }, [date, min, max])

    // Calculate the width of each 10-minute slot (smaller)
    const slotWidth = 60 // pixels per 10 minutes (reduced from 100)
    const totalWidth = timeSlots.length * slotWidth

    // Memoize filtered events for the current day
    const dayEvents = useMemo(() => {
        return events.filter((event) => moment(event.start).isSame(date, "day"))
    }, [events, date])

    // Initialize display events
    useEffect(() => {
        const eventMap: { [key: string]: AppointmentEvent } = {}
        dayEvents.forEach((event) => {
            eventMap[event.id] = { ...event }
        })
        setDisplayEvents(eventMap)
    }, [dayEvents])

    // Update container width on resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }

        updateWidth()
        window.addEventListener("resize", updateWidth)

        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    // Calculate event positions
    useEffect(() => {
        if (!timelineRef.current) return

        const positions: { [key: string]: any } = {}
        const startHour = min.getHours()

        dayEvents.forEach((event, index) => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            // Calculate position and width
            const startMinutesSinceDayStart = (eventStart.hours() - startHour) * 60 + eventStart.minutes()
            const endMinutesSinceDayStart = (eventEnd.hours() - startHour) * 60 + eventEnd.minutes()
            const durationMinutes = endMinutesSinceDayStart - startMinutesSinceDayStart

            // Adjust for 10-minute slots
            const left = Math.round((startMinutesSinceDayStart / 10) * slotWidth)
            const width = Math.round((durationMinutes / 10) * slotWidth)

            // Calculate vertical position with improved stacking
            // Group events that overlap in time
            const overlappingEvents = dayEvents.filter((otherEvent) => {
                if (otherEvent.id === event.id) return false

                const otherStart = moment(otherEvent.start)
                const otherEnd = moment(otherEvent.end)

                return (
                    (eventStart.isBefore(otherEnd) && eventEnd.isAfter(otherStart)) ||
                    (otherStart.isBefore(eventEnd) && otherEnd.isAfter(eventStart))
                )
            })

            // Calculate row based on overlapping events
            let row = 0
            const usedRows = new Set<number>()

            overlappingEvents.forEach((otherEvent) => {
                if (positions[otherEvent.id]) {
                    usedRows.add(positions[otherEvent.id].row)
                }
            })

            // Find the first available row
            while (usedRows.has(row)) {
                row++
            }

            const rowHeight = 70 // Slightly smaller row height
            const top = row * rowHeight

            positions[event.id] = {
                left,
                width,
                top,
                row,
                height: rowHeight - 4,
                startMinutes: startMinutesSinceDayStart,
                durationMinutes,
                originalEvent: { ...event },
            }
        })

        setEventPositions(positions)
    }, [dayEvents, min, slotWidth])

    // Scroll to current time on initial render
    useEffect(() => {
        const now = new Date()
        if (moment(now).isSame(date, "day") && containerRef.current) {
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()
            const minutesSinceStart = (currentHour - min.getHours()) * 60 + currentMinute
            const scrollPos = (minutesSinceStart / 10) * slotWidth - containerWidth / 2
            containerRef.current.scrollLeft = Math.max(0, scrollPos)
            setScrollPosition(containerRef.current.scrollLeft)
        }
    }, [date, containerWidth, min, slotWidth])

    // Handle scroll
    const handleScroll = () => {
        if (containerRef.current) {
            setScrollPosition(containerRef.current.scrollLeft)
        }
    }

    // Handle scroll buttons
    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= containerWidth / 2
            setScrollPosition(containerRef.current.scrollLeft)
        }
    }

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += containerWidth / 2
            setScrollPosition(containerRef.current.scrollLeft)
        }
    }

    // Snap time to 10-minute intervals
    const snapTimeToGrid = (minutes: number): number => {
        return Math.round(minutes / 10) * 10
    }

    // Get background color based on event type
    const getEventBackground = (event: AppointmentEvent) => {
        if (spaceTheme) {
            switch (event.type) {
                case "HOME_VISIT":
                    return "home-visit"
                case "VIDEO_CALL":
                    return "video-call"
                case "HOSPITAL":
                    return "hospital"
                case "IN_PERSON":
                    return "in-person"
                case "AUDIO_CALL":
                    return "audio-call"
                default:
                    return "bg-slate-800/30 border-l-4 border-slate-500"
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

    // Get event icon based on type
    const getEventIcon = (type: string) => {
        switch (type) {
            case "HOME_VISIT":
                return <Home className="h-3 w-3" />
            case "VIDEO_CALL":
                return <Video className="h-3 w-3" />
            case "HOSPITAL":
                return <Building2 className="h-3 w-3" />
            case "AUDIO_CALL":
                return <Phone className="h-3 w-3" />
            case "IN_PERSON":
                return <User className="h-3 w-3" />
            default:
                return null
        }
    }

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
                return "In-Person"
            case "AUDIO_CALL":
                return "Audio Call"
            default:
                return "Appointment"
        }
    }

    // Check if a time slot has events
    const hasEventsInTimeSlot = (timeSlot: Date) => {
        const slotStart = moment(timeSlot)
        const slotEnd = moment(slotStart).add(10, "minutes")

        return dayEvents.some((event) => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            // Check if event overlaps with this time slot
            return (
                (eventStart.isSameOrAfter(slotStart) && eventStart.isBefore(slotEnd)) ||
                (eventEnd.isAfter(slotStart) && eventEnd.isSameOrBefore(slotEnd)) ||
                (eventStart.isSameOrBefore(slotStart) && eventEnd.isSameOrAfter(slotEnd))
            )
        })
    }

    // Handle drag end for events
    const handleDragEnd = (event: AppointmentEvent, info: PanInfo, position: any) => {
        if (!timelineRef.current) return

        // Calculate new time based on position
        const newLeft = Math.max(0, position.left + info.offset.x)

        // Calculate new row (vertical position)
        const newTop = position.top + info.offset.y
        const rowIndex = Math.floor(newTop / 70) // Adjusted for smaller row height
        const clampedRowIndex = Math.max(0, Math.min(5, rowIndex)) // Allow up to 6 rows
        const finalTop = clampedRowIndex * 70

        // Calculate new start time
        const minutesFromStart = Math.round((newLeft / slotWidth) * 10)
        const startHourOffset = Math.floor(minutesFromStart / 60)
        const startMinuteOffset = minutesFromStart % 60
        const roundedStartMinute = snapTimeToGrid(startMinuteOffset)

        // Create new start and end dates
        const newStartDate = moment(date)
            .hour(min.getHours() + startHourOffset)
            .minute(roundedStartMinute)
            .second(0)
            .millisecond(0)

        // Maintain the original duration
        const originalDurationMinutes = position.durationMinutes
        const roundedDurationMinutes = snapTimeToGrid(originalDurationMinutes)
        const newEndDate = moment(newStartDate).add(roundedDurationMinutes, "minutes")

        // Create updated event
        const updatedEvent: AppointmentEvent = {
            ...event,
            start: newStartDate.toDate(),
            end: newEndDate.toDate(),
        }

        // Update display events to immediately reflect changes
        setDisplayEvents((prev) => ({
            ...prev,
            [event.id]: updatedEvent,
        }))

        // Update event positions
        const updatedPositions = { ...eventPositions }
        updatedPositions[event.id] = {
            ...position,
            left: Math.round((minutesFromStart / 10) * slotWidth),
            top: finalTop,
            row: clampedRowIndex,
            startMinutes: minutesFromStart,
            durationMinutes: roundedDurationMinutes,
            originalEvent: { ...updatedEvent },
        }

        setEventPositions(updatedPositions)

        // Call onEventUpdate if provided
        if (onEventUpdate) {
            onEventUpdate(updatedEvent)
            toast.success("Event updated successfully")
        }
    }

    // Calculate the maximum number of rows needed for proper container height
    const maxRow = Object.values(eventPositions).reduce((max, pos) => Math.max(max, pos.row || 0), 0)
    const minContainerHeight = (maxRow + 1) * 70 + 20 // +20px for padding

    // Determine classes based on dark theme
    const headerTextClass = spaceTheme ? "text-white" : "text-gray-600"
    const buttonClass = spaceTheme ? "calendar-button" : ""
    const timelineClass = spaceTheme ? "calendar-grid" : "bg-white"
    const timeLabelsClass = spaceTheme ? "time-label" : "text-gray-600 border-r"
    const currentTimeClass = spaceTheme ? "current-time-indicator" : "bg-red-500"
    const gridLineClass = spaceTheme ? "border-slate-800" : "border-gray-100"
    const hourLineClass = spaceTheme ? "border-slate-700" : "border-gray-300"
    const halfHourLineClass = spaceTheme ? "border-slate-800" : "border-gray-200"

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-center items-center mb-4">
                <h3 className={`text-lg font-medium text-center ${headerTextClass}`}>
                    {moment(date).format("dddd, MMMM D, YYYY")}
                </h3>
            </div>

            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollLeft}
                        disabled={scrollPosition <= 0}
                        className={buttonClass}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollRight}
                        disabled={scrollPosition >= totalWidth - containerWidth}
                        className={buttonClass}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div
                    ref={containerRef}
                    className={`flex-1 overflow-x-auto overflow-y-auto relative border rounded-md shadow-sm ${timelineClass} h-full`}
                    onScroll={handleScroll}
                    style={{
                        width: "calc(100% - 16px)",
                        maxWidth: "100%",
                        overflowX: "auto",
                        marginRight: "16px",
                    }}
                >
                    {/* Time slots */}
                    <div
                        className="h-full"
                        style={{
                            width: `${totalWidth}px`,
                            minHeight: `${minContainerHeight}px`,
                            maxWidth: "none",
                        }}
                        ref={timelineRef}
                    >
                        {/* Time labels */}
                        <div
                            className={`flex h-8 border-b sticky top-0 z-10 ${spaceTheme ? "bg-slate-900/90 border-slate-700/50 backdrop-blur-md" : "bg-white"}`}
                        >
                            {timeSlots
                                .filter((_, i) => i % 6 === 0) // Show hour labels
                                .map((time, i) => (
                                    <div
                                        key={i}
                                        className={`flex-shrink-0 ${timeLabelsClass} text-xs font-medium px-2 flex items-center`}
                                        style={{ width: `${slotWidth * 6}px` }}
                                    >
                                        {moment(time).format("h:mm A")}
                                    </div>
                                ))}
                        </div>

                        {/* Time grid */}
                        <div className="flex h-[calc(100%-2rem)]">
                            {timeSlots.map((time, i) => {
                                const hasEvents = hasEventsInTimeSlot(time)
                                const isHourMark = i % 6 === 0
                                const isHalfHourMark = i % 3 === 0

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-shrink-0 h-full border-r transition-all duration-200 time-slot",
                                            isHourMark ? hourLineClass : isHalfHourMark ? halfHourLineClass : gridLineClass,
                                            hasEvents ? "" : spaceTheme ? "bg-slate-800/20" : "bg-gray-50/30",
                                        )}
                                        style={{ width: `${slotWidth}px` }}
                                    />
                                )
                            })}

                            {/* Current time indicator */}
                            {moment(new Date()).isSame(date, "day") && (
                                <div
                                    className={`absolute top-8 bottom-0 w-0.5 z-20 ${currentTimeClass}`}
                                    style={{
                                        left: `${Math.round((((new Date().getHours() - min.getHours()) * 60 + new Date().getMinutes()) / 10) * slotWidth)}px`,
                                    }}
                                >
                                    <div className={`w-2 h-2 rounded-full ${currentTimeClass} -ml-[3px] -mt-1`} />
                                </div>
                            )}

                            {/* Events */}
                            <div className="absolute top-8 left-0 right-0 bottom-0">
                                {dayEvents.map((event) => {
                                    const position = eventPositions[event.id]
                                    if (!position) return null

                                    // Use the display event for rendering (which will have updated times after drag)
                                    const displayEvent = displayEvents[event.id] || event
                                    const bgClass = getEventBackground(displayEvent)
                                    const typeLabel = getEventTypeLabel(displayEvent.type)
                                    const icon = getEventIcon(displayEvent.type)

                                    // Find staff member for this event
                                    const staffMember = staffMembers.find((s) => s.id === event.resourceId)
                                    const staffColor = staffMember?.color || "#888888"

                                    return (
                                        <motion.div
                                            key={event.id}
                                            className={cn("absolute p-2 rounded-md shadow-sm cursor-move event-card", bgClass)}
                                            style={{
                                                top: `${position.top}px`,
                                                left: `${position.left}px`,
                                                width: `${position.width}px`,
                                                height: `${position.height}px`,
                                                zIndex: isDragging.current ? 30 : 10,
                                            }}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                transition: { type: "spring", stiffness: 300, damping: 30 },
                                            }}
                                            whileHover={{
                                                zIndex: 20,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                scale: 1.02,
                                            }}
                                            drag
                                            dragConstraints={timelineRef}
                                            dragElastic={0}
                                            dragMomentum={false}
                                            onDragStart={() => {
                                                isDragging.current = true
                                            }}
                                            onDragEnd={(_, info) => {
                                                handleDragEnd(event, info, position)
                                                // Reset dragging state after a short delay
                                                setTimeout(() => {
                                                    isDragging.current = false
                                                }, 100)
                                            }}
                                            onClick={(e) => {
                                                // Only trigger select if not dragging
                                                if (!isDragging.current) {
                                                    onSelectEvent(event)
                                                }
                                            }}
                                        >
                                            <div className="flex flex-col h-full">
                                                <div className={`text-xs font-medium truncate ${spaceTheme ? "text-white" : ""}`}>
                                                    {displayEvent.title}
                                                </div>
                                                <div
                                                    className={`text-xs ${spaceTheme ? "text-slate-300" : "text-gray-600"} flex items-center gap-1`}
                                                >
                                                    <span>
                                                        {moment(displayEvent.start).format("h:mm A")} - {moment(displayEvent.end).format("h:mm A")}
                                                    </span>
                                                </div>
                                                {position.height >= 50 && (
                                                    <div
                                                        className={`text-xs ${spaceTheme ? "text-slate-300" : "text-gray-600"} flex items-center gap-1 mt-1`}
                                                    >
                                                        {icon}
                                                        <span>{typeLabel}</span>
                                                    </div>
                                                )}

                                                {position.height >= 60 && (
                                                    <div className="mt-auto flex items-center gap-1 pt-1">
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] text-white"
                                                            style={{ backgroundColor: staffColor }}
                                                        >
                                                            {staffMember?.name[0] || "?"}
                                                        </div>
                                                        <span className={`text-xs ${spaceTheme ? "text-slate-300" : "text-gray-600"} truncate`}>
                                                            {staffMember?.name || "Staff"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import moment from "moment"
import { motion } from "framer-motion"
import { ChevronDown, Calendar, Clock, MapPin, User, Users } from "lucide-react"
import type { AppointmentEvent } from "../types"
import { Button } from "../../../ui/button"
import { cn } from "../../../../lib/utils"
import { toast } from "sonner"

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
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
}

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
    onEventUpdate,
}: CustomMonthViewProps) {
    const [calendar, setCalendar] = useState<Date[][]>([])
    const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; date: string; time: string } | null>(null)
    const [ghostEvent, setGhostEvent] = useState<{ id: string; dayStr: string } | null>(null)
    const eventRefs = useRef<{ [key: string]: HTMLElement }>({})
    const dayRefs = useRef<{ [key: string]: HTMLElement }>({})
    const calendarRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const [displayEvents, setDisplayEvents] = useState<{ [key: string]: AppointmentEvent }>({})
    const [highlightedDay, setHighlightedDay] = useState<string | null>(null)
    const [eventBeingDragged, setEventBeingDragged] = useState<AppointmentEvent | null>(null)
    const [originalEventPosition, setOriginalEventPosition] = useState<{
        dateStr: string
        event: AppointmentEvent
    } | null>(null)
    const dragEventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 })
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

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

    // Initialize display events
    useEffect(() => {
        const eventMap: { [key: string]: AppointmentEvent } = {}
        events.forEach((event) => {
            eventMap[event.id] = { ...event }
        })
        setDisplayEvents(eventMap)
    }, [events])

    // Reset drag state when component unmounts or when drag is complete
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isDragging) {
                cancelDrag()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("pointerup", handlePointerUp)

        return () => {
            if (dragEventTimeoutRef.current) {
                clearTimeout(dragEventTimeoutRef.current)
            }
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("pointerup", handlePointerUp)
            document.body.style.cursor = ""
        }
    }, [isDragging])

    // Handle pointer up globally to catch if mouse released outside calendar
    const handlePointerUp = () => {
        if (isDragging && !ghostEvent) {
            cancelDrag()
        }
    }

    // Cancel the current drag operation and reset to original state
    const cancelDrag = () => {
        if (originalEventPosition) {
            // Revert the event to its original position
            if (eventBeingDragged) {
                toast.error("Drag cancelled - reverted to original position")
            }
        }
        cleanupDragState()
    }

    // Get events for a specific day
    const getEventsForDay = (day: Date) => {
        const dateStr = moment(day).format("YYYY-MM-DD")

        return events.filter((event) => {
            // During drag, filter out the active event from its original day
            if (isDragging && activeEvent === event.id && ghostEvent && ghostEvent.dayStr !== dateStr) {
                return false
            }

            return moment(event.start).isSame(day, "day")
        })
    }

    // Toggle expanded day view
    const toggleDayExpand = (dateStr: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setExpandedDays((prev) => ({
            ...prev,
            [dateStr]: !prev[dateStr],
        }))
    }

    // Format event time with precise minutes
    const formatEventTime = (event: AppointmentEvent) => {
        return moment(event.start).format("h:mm A")
    }

    // Format date and time for tooltip
    const formatDateTimeForTooltip = (date: Date | string, event: AppointmentEvent) => {
        const dateObj = date instanceof Date ? date : new Date(date);
        const dateText = moment(dateObj).format("ddd, MMM D");
        const timeText = moment(event.start instanceof Date ? event.start : new Date(event.start)).format("h:mm A");
        return { dateText, timeText };
    }

    // Get event background based on type and theme
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

    // Get event icon based on type
    const getEventIcon = (event: AppointmentEvent) => {
        switch (event.type) {
            case "HOME_VISIT":
                return <MapPin className="h-3 w-3" />
            case "VIDEO_CALL":
                return <Users className="h-3 w-3" />
            case "HOSPITAL":
                return <MapPin className="h-3 w-3" />
            case "IN_PERSON":
                return <User className="h-3 w-3" />
            case "AUDIO_CALL":
                return <User className="h-3 w-3" />
            default:
                return <Calendar className="h-3 w-3" />
        }
    }

    // Get staff color
    const getStaffColor = (event: AppointmentEvent) => {
        const staff = staffMembers.find((s) => s.id === event.resourceId)
        return staff?.color || "#888888"
    }

    // Handle drag start
    const handleDragStart = (eventId: string, e: MouseEvent | PointerEvent | TouchEvent) => {
        if (!displayEvents[eventId]) return

        // Set cursor style for the whole document
        document.body.style.cursor = "grabbing"

        // Prevent text selection during drag
        document.body.style.userSelect = "none"

        // Get event and day
        const event = displayEvents[eventId]
        const dateStr = moment(event.start).format("YYYY-MM-DD")

        // Store original event position for possible revert
        setOriginalEventPosition({
            dateStr,
            event: { ...event },
        })

        // Store event being dragged
        setEventBeingDragged(event)

        // Set active event
        setActiveEvent(eventId)
        setIsDragging(true)

        // Update ghost event and highlighted day
        setGhostEvent({ id: eventId, dayStr: dateStr })
        setHighlightedDay(dateStr)

        // Set tooltip with date and time
        const { dateText, timeText } = formatDateTimeForTooltip(event.start, event)
        setDragTooltip({ eventId, date: dateText, time: timeText })
    }

    // Find day cell under pointer with grid-aligned snapping
    const findDayUnderPointer = (clientX: number, clientY: number): { dateStr: string; element: HTMLElement } | null => {
        // Get all day cells
        const dayCells = Object.entries(dayRefs.current).map(([dateStr, element]) => {
            const rect = element.getBoundingClientRect()
            return {
                dateStr,
                element,
                rect,
                // Calculate distance from pointer to center of cell
                distance: Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2)),
            }
        })

        // First check if pointer is directly inside any cell
        const containingCell = dayCells.find(
            (cell) =>
                clientX >= cell.rect.left &&
                clientX <= cell.rect.right &&
                clientY >= cell.rect.top &&
                clientY <= cell.rect.bottom,
        )

        if (containingCell) {
            return {
                dateStr: containingCell.dateStr,
                element: containingCell.element,
            }
        }

        // If not in any cell, find the closest cell
        const sortedCells = [...dayCells].sort((a, b) => a.distance - b.distance)
        if (sortedCells.length > 0) {
            return {
                dateStr: sortedCells[0].dateStr,
                element: sortedCells[0].element,
            }
        }

        return null
    }

    // Handle drag
    const handleDrag = (eventId: string, info: any) => {
        if (!isDragging || !activeEvent || !displayEvents[eventId] || !eventBeingDragged) return

        // Get client coordinates
        const clientX = info.point.x
        const clientY = info.point.y

        // Find which day we're over using strict grid alignment
        const target = findDayUnderPointer(clientX, clientY)

        if (target && target.dateStr) {
            // Prevent excessive updates by using a timeout
            if (dragEventTimeoutRef.current) {
                clearTimeout(dragEventTimeoutRef.current)
            }

            dragEventTimeoutRef.current = setTimeout(() => {
                // Only update if we're over a different day than currently highlighted
                if (target.dateStr !== highlightedDay) {
                    // Update tooltip with day and original time
                    const targetDate = moment(target.dateStr, "YYYY-MM-DD").toDate()
                    const { dateText, timeText } = formatDateTimeForTooltip(targetDate, eventBeingDragged)
                    setDragTooltip({ eventId, date: dateText, time: timeText })

                    // Update ghost event and highlighted day
                    setHighlightedDay(target.dateStr)
                    setGhostEvent({ id: eventId, dayStr: target.dateStr })
                }
            }, 50) // Small timeout for performance
        }
    }

    // Handle drag end with precise grid snapping
    const handleDragEnd = (eventId: string, info: any) => {
        document.body.style.cursor = ""

        if (!isDragging || !activeEvent || !displayEvents[eventId] || !eventBeingDragged) {
            cleanupDragState()
            return
        }

        // Get pointer position
        const clientX = info.point.x
        const clientY = info.point.y

        // Find which day the event was dropped on with strict grid alignment
        const target = findDayUnderPointer(clientX, clientY)

        if (!target || !target.dateStr) {
            toast.error("Invalid drop location")
            cancelDrag()
            return
        }

        // Get the target day's boundaries for validation
        const targetRect = target.element.getBoundingClientRect()

        // Check if the pointer is significantly outside the target day cell
        const horizontalMargin = targetRect.width * 0.2 // 20% margin for horizontal tolerance
        const verticalMargin = targetRect.height * 0.2 // 20% margin for vertical tolerance

        const isTooFarLeft = clientX < targetRect.left - horizontalMargin
        const isTooFarRight = clientX > targetRect.right + horizontalMargin
        const isTooFarTop = clientY < targetRect.top - verticalMargin
        const isTooFarBottom = clientY > targetRect.bottom + verticalMargin

        if (isTooFarLeft || isTooFarRight || isTooFarTop || isTooFarBottom) {
            toast.error("Event must be dropped within a day cell")
            cancelDrag()
            return
        }

        // Calculate the new dates while preserving exact time
        const originalEvent = eventBeingDragged
        const originalStart = moment(originalEvent.start)
        const originalEnd = moment(originalEvent.end)
        const duration = originalEnd.diff(originalStart, "minutes")

        // Create new start date based on the target day, preserving original time
        const targetDate = moment(target.dateStr, "YYYY-MM-DD")
        const newStart = targetDate
            .hour(originalStart.hour())
            .minute(originalStart.minute())
            .second(0)
            .millisecond(0)
            .toDate()

        // Create new end date preserving duration
        const newEnd = moment(newStart).add(duration, "minutes").toDate()

        // Create updated event with precise time maintenance
        const updatedEvent = {
            ...originalEvent,
            start: newStart,
            end: newEnd,
        }

        // Update display events
        setDisplayEvents((prev) => ({
            ...prev,
            [eventId]: updatedEvent,
        }))

        // Call update callback with correct timing
        if (onEventUpdate) {
            onEventUpdate(updatedEvent)
            const formattedTime = moment(updatedEvent.start).format("h:mm A")
            toast.success(`Event moved to ${moment(newStart).format("ddd, MMM D")} at ${formattedTime}`)
        }

        // Clean up drag state
        cleanupDragState()
    }

    // Clean up all drag-related state
    const cleanupDragState = () => {
        if (dragEventTimeoutRef.current) {
            clearTimeout(dragEventTimeoutRef.current)
        }

        setActiveEvent(null)
        setIsDragging(false)
        setDragTooltip(null)
        setHighlightedDay(null)
        setGhostEvent(null)
        setEventBeingDragged(null)
        setOriginalEventPosition(null)
        document.body.style.userSelect = ""
        document.body.style.cursor = ""
    }

    // Handle click on a day cell
    const handleDayClick = (day: Date) => {
        if (!isDragging) {
            onDateSelect(day)
        }
    }

    // Handle click on an event
    const handleEventClick = (event: AppointmentEvent, e: React.MouseEvent) => {
        if (!isDragging) {
            e.stopPropagation()
            onSelectEvent(event)
        }
    }

    // Add this useEffect to set proper drag constraints based on the grid layout
    useEffect(() => {
        if (gridRef.current) {
            // Set a resize observer to update constraints when grid size changes
            const resizeObserver = new ResizeObserver(() => {
                if (gridRef.current) {
                    const gridRect = gridRef.current.getBoundingClientRect()
                    const cellWidth = gridRect.width / 7 // 7 days per week

                    // Update the drag constraints to snap to day cells
                    setDragConstraints({
                        top: 0,
                        left: 0,
                        right: gridRect.width,
                        bottom: gridRect.height,
                    })
                }
            })

            resizeObserver.observe(gridRef.current)

            return () => {
                if (gridRef.current) {
                    resizeObserver.unobserve(gridRef.current)
                }
            }
        }
    }, [])

    // Add this function to get the exact day cell position for snapping
    const getDayCellPosition = (dateStr: string) => {
        const element = dayRefs.current[dateStr]
        if (!element || !gridRef.current) return null

        const gridRect = gridRef.current.getBoundingClientRect()
        const cellRect = element.getBoundingClientRect()

        return {
            x: cellRect.left - gridRect.left + cellRect.width / 2,
            y: cellRect.top - gridRect.top + cellRect.height / 2,
            width: cellRect.width,
            height: cellRect.height,
        }
    }

    // Get staff name
    const getStaffName = (event: AppointmentEvent) => {
        const staff = staffMembers.find((s) => s.id === event.resourceId)
        return staff?.name || "Unassigned"
    }

    const tooltipClass = spaceTheme
        ? "bg-slate-800 text-white border border-slate-700"
        : "bg-white text-black border border-gray-200"

    return (
        <div className="h-full flex flex-col" ref={calendarRef}>
            {/* Month and year header */}
            <div className={`flex justify-center items-center py-2 ${spaceTheme ? "text-white" : "text-gray-800"}`}>
                <h2 className="text-xl font-semibold">{moment(date).format("MMMM YYYY")}</h2>
            </div>

            {/* Day headers */}
            <div
                className={`grid grid-cols-7 ${spaceTheme ? "bg-zinc-900 border-zinc-800" : "bg-gray-50 border-gray-200"} border-b rounded-t-lg`}
            >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                    <div
                        key={i}
                        className={`py-3 text-center text-sm font-medium ${spaceTheme ? "text-zinc-400" : "text-gray-500"
                            } ${i === 0 || i === 6 ? (spaceTheme ? "text-zinc-500" : "text-gray-400") : ""}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="flex-1 overflow-y-auto">
                <div
                    className={`grid grid-cols-7 auto-rows-fr h-full ${spaceTheme ? "bg-black" : "bg-white"
                        } rounded-b-lg shadow-sm`}
                    ref={gridRef}
                >
                    {calendar.flat().map((day, i) => {
                        const dateStr = moment(day).format("YYYY-MM-DD")
                        const isCurrentMonth = moment(day).isSame(date, "month")
                        const isToday = moment(day).isSame(moment(), "day")
                        const isWeekend = moment(day).day() === 0 || moment(day).day() === 6
                        const dayEvents = getEventsForDay(day)
                        const hasEvents = dayEvents.length > 0
                        const isExpanded = expandedDays[dateStr]
                        const isHighlighted = highlightedDay === dateStr && isDragging

                        // Determine how many events to show before "more" button
                        const eventsToShow = isExpanded ? dayEvents : dayEvents.slice(0, 2)
                        const hasMore = dayEvents.length > 2 && !isExpanded

                        return (
                            <div
                                key={i}
                                ref={(el) => {
                                    if (el) dayRefs.current[dateStr] = el
                                }}
                                data-date={dateStr}
                                className={cn(
                                    "border-b border-r p-1 relative transition-colors duration-100",
                                    isCurrentMonth
                                        ? spaceTheme
                                            ? isWeekend
                                                ? "bg-zinc-950"
                                                : "bg-black"
                                            : isWeekend
                                                ? "bg-gray-50"
                                                : "bg-white"
                                        : spaceTheme
                                            ? "bg-zinc-950/70 text-zinc-600"
                                            : "bg-gray-50/70 text-gray-400",
                                    isToday
                                        ? spaceTheme
                                            ? "ring-2 ring-inset ring-green-600/30"
                                            : "ring-2 ring-inset ring-blue-500/30"
                                        : "",
                                    hasEvents ? "min-h-[100px]" : "min-h-[60px]",
                                    isHighlighted ? (spaceTheme ? "bg-zinc-800/40" : "bg-blue-100/60") : "",
                                    spaceTheme ? "border-zinc-800 text-white" : "border-gray-200",
                                    "hover:bg-opacity-90 transition-all",
                                )}
                                onClick={() => handleDayClick(day)}
                            >
                                {/* Day number with better styling */}
                                <div className="flex justify-between items-center mb-1">
                                    <div
                                        className={cn(
                                            "text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center",
                                            isToday
                                                ? spaceTheme
                                                    ? "bg-green-600 text-white"
                                                    : "bg-blue-500 text-white"
                                                : isCurrentMonth
                                                    ? spaceTheme
                                                        ? "text-white"
                                                        : "text-gray-700"
                                                    : spaceTheme
                                                        ? "text-zinc-600"
                                                        : "text-gray-400",
                                        )}
                                    >
                                        {moment(day).date()}
                                    </div>

                                    {/* Show event count badge if there are events */}
                                    {hasEvents && !isExpanded && (
                                        <div
                                            className={cn(
                                                "text-xs px-1.5 py-0.5 rounded-full",
                                                spaceTheme ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-600",
                                            )}
                                        >
                                            {dayEvents.length}
                                        </div>
                                    )}
                                </div>

                                {/* Events */}
                                <div className="mt-1 space-y-1.5">
                                    {eventsToShow.map((event) => {
                                        const isActive = activeEvent === event.id
                                        const isHovered = hoveredEvent === event.id
                                        const displayEvent = displayEvents[event.id] || event
                                        const staffName = getStaffName(displayEvent)
                                        const eventIcon = getEventIcon(displayEvent)

                                        return (
                                            <div
                                                key={event.id}
                                                ref={(el) => {
                                                    if (el) eventRefs.current[event.id] = el
                                                }}
                                                className={cn(
                                                    "text-xs p-1.5 rounded-md cursor-grab active:cursor-grabbing event-card transition-all",
                                                    getEventBackground(displayEvent),
                                                    isActive ? "ring-2 ring-primary shadow-lg" : "",
                                                    isHovered ? "brightness-95" : "",
                                                )}
                                                style={{
                                                    borderLeftColor: getStaffColor(displayEvent),
                                                    borderLeftWidth: "4px",
                                                    boxShadow: isActive
                                                        ? spaceTheme
                                                            ? "0 8px 16px rgba(0,0,0,0.4)"
                                                            : "0 8px 16px rgba(0,0,0,0.2)"
                                                        : spaceTheme
                                                            ? "0 2px 4px rgba(0,0,0,0.3)"
                                                            : "0 1px 2px rgba(0,0,0,0.1)",
                                                    transform: isActive ? "scale(1.02)" : "scale(1)",
                                                    zIndex: isActive ? 50 : isHovered ? 20 : 10,
                                                    position: "relative",
                                                }}
                                                onMouseEnter={() => setHoveredEvent(event.id)}
                                                onMouseLeave={() => setHoveredEvent(null)}
                                            >
                                                {/* Draggable wrapper */}
                                                <motion.div
                                                    className="absolute inset-0 z-10"
                                                    drag
                                                    dragConstraints={gridRef}
                                                    dragElastic={0}
                                                    dragMomentum={false}
                                                    dragSnapToOrigin={false}
                                                    dragTransition={{
                                                        bounceStiffness: 600,
                                                        bounceDamping: 20,
                                                    }}
                                                    onDragStart={(e) => handleDragStart(event.id, e as MouseEvent | PointerEvent | TouchEvent)}
                                                    onDrag={(_, info) => handleDrag(event.id, info)}
                                                    onDragEnd={(_, info) => handleDragEnd(event.id, info)}
                                                    onClick={(e) => handleEventClick(event, e)}
                                                    whileDrag={{
                                                        scale: 1.05,
                                                        zIndex: 100,
                                                        boxShadow: spaceTheme ? "0 10px 20px rgba(0,0,0,0.5)" : "0 10px 20px rgba(0,0,0,0.3)",
                                                    }}
                                                />

                                                {/* Event content with improved layout */}
                                                <div className="flex flex-col relative z-0">
                                                    <div className="flex items-center gap-1 mb-0.5">
                                                        <div className={`font-medium truncate flex-1 ${spaceTheme ? "text-white" : ""}`}>
                                                            {displayEvent.title}
                                                        </div>
                                                    </div>

                                                    <div className={`flex items-center gap-1 ${spaceTheme ? "text-zinc-300" : "text-gray-500"}`}>
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-[10px]">{formatEventTime(displayEvent)}</span>
                                                    </div>

                                                    {/* Staff info */}
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: getStaffColor(displayEvent) }}
                                                        />
                                                        <span className={`text-[10px] truncate ${spaceTheme ? "text-zinc-400" : "text-gray-500"}`}>
                                                            {staffName}
                                                        </span>
                                                    </div>

                                                    {/* Event type */}
                                                    <div
                                                        className={`flex items-center gap-1 mt-1 ${spaceTheme ? "text-zinc-400" : "text-gray-500"}`}
                                                    >
                                                        {eventIcon}
                                                        <span className="text-[10px]">{displayEvent.type.replace(/_/g, " ").toLowerCase()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {/* Ghost event placeholder during drag with improved styling */}
                                    {isDragging && ghostEvent && ghostEvent.dayStr === dateStr && activeEvent && eventBeingDragged && (
                                        <div
                                            className={cn(
                                                "text-xs p-1.5 rounded-md border-2 border-dashed",
                                                getEventBackground(eventBeingDragged),
                                                spaceTheme ? "border-blue-500/80 bg-blue-900/30" : "border-blue-500/80 bg-blue-100/70",
                                            )}
                                            style={{
                                                borderLeftColor: getStaffColor(eventBeingDragged),
                                                borderLeftWidth: "4px",
                                            }}
                                        >
                                            <div className="flex flex-col">
                                                <div className={`font-medium truncate ${spaceTheme ? "text-white" : ""}`}>
                                                    {eventBeingDragged.title}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span className={`${spaceTheme ? "text-zinc-300" : "text-gray-500"}`}>
                                                        {formatEventTime(eventBeingDragged)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Show more button with improved styling */}
                                    {hasMore && (
                                        <Button
                                            variant={spaceTheme ? "outline" : "ghost"}
                                            size="sm"
                                            className={`text-xs w-full h-6 mt-1 ${spaceTheme
                                                ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800/50"
                                                : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                            onClick={(e) => toggleDayExpand(dateStr, e)}
                                        >
                                            +{dayEvents.length - 2} more
                                            <ChevronDown className="h-3 w-3 ml-1" />
                                        </Button>
                                    )}

                                    {/* Show less button with improved styling */}
                                    {isExpanded && (
                                        <Button
                                            variant={spaceTheme ? "outline" : "ghost"}
                                            size="sm"
                                            className={`text-xs w-full h-6 mt-1 ${spaceTheme
                                                ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800/50"
                                                : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                            onClick={(e) => toggleDayExpand(dateStr, e)}
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

            {/* Enhanced tooltip showing current drag date AND time */}
            {isDragging && activeEvent && dragTooltip && (
                <div
                    className={`fixed px-3 py-2 rounded-md ${tooltipClass} text-xs font-semibold shadow-xl z-[100] pointer-events-none`}
                    style={{
                        top: `${document.documentElement.scrollTop + 10}px`,
                        left: `${document.documentElement.scrollLeft + 10}px`,
                        opacity: 0.95,
                        transform: "translate(10px, 10px)", // Offset from cursor
                    }}
                >
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{dragTooltip.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs opacity-80">
                        <Clock className="h-3 w-3" />
                        <span>{dragTooltip.time}</span>
                    </div>
                </div>
            )}
        </div>
    )
}


"use client"

import React, { useState, useEffect, useRef } from "react"
import moment from "moment"
import { motion } from "framer-motion"
import { toast } from "sonner"
import type { AppointmentEvent } from "../types"
import { cn } from "../../../../lib/utils"
import { Home, Video, Building2, Phone, User, Calendar, GripVertical } from "lucide-react"
import { useAppSelector } from "@/state/redux"

interface CustomWeekViewProps {
    date: Date
    events: AppointmentEvent[]
    onSelectEvent: (event: AppointmentEvent) => void
    staffMembers: any[]
    getEventDurationInMinutes: (event: any) => number
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
    spaceTheme?: boolean
}

export function CustomWeekView(props: CustomWeekViewProps) {
    const {
        date,
        events,
        onSelectEvent,
        staffMembers,
        getEventDurationInMinutes,
        onEventUpdate,
        spaceTheme = false
    } = props

    // Get current date from Redux store
    const { currentDate: currentDateStr } = useAppSelector((state) => state.calendar)
    const currentDate = new Date(currentDateStr)

    // ====================== CONSTANTS ======================
    const HOURS = {
        START: 7,  // 7 AM
        END: 19    // 7 PM
    }
    const CELL_HEIGHT = 40 // pixels per 30-min slot
    const TIME_COLUMN_WIDTH = 60 // pixels for time gutter

    // ====================== REFS ======================
    const calendarContainerRef = useRef<HTMLDivElement>(null)
    const gridContainerRef = useRef<HTMLDivElement>(null)
    const isCurrentlyDragging = useRef(false)
    const eventElementsRef = useRef<Record<string, HTMLElement>>({})
    const resizeObserverRef = useRef<ResizeObserver | null>(null)

    // ====================== STATE ======================
    const [daysOfWeek, setDaysOfWeek] = useState<Date[]>([])
    const [timeIntervals, setTimeIntervals] = useState<string[]>([])
    const [eventLayoutData, setEventLayoutData] = useState<Record<string, any>>({})
    const [calendarDimensions, setCalendarDimensions] = useState({
        dayColumnWidth: 0,
        totalGridWidth: 0,
        totalGridHeight: 0
    })
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

    // ====================== DRAG AND DROP ======================
    interface DraggedEventState {
        event: AppointmentEvent | null
        originalPosition: any | null
        currentDayIndex: number | null
        currentMinutes: number | null
    }

    // Track the event being dragged and its original position
    const [draggedEvent, setDraggedEvent] = useState<DraggedEventState>({
        event: null,
        originalPosition: null,
        currentDayIndex: null,
        currentMinutes: null
    })

    // ====================== SETUP CALENDAR GRID ======================
    // Generate days and time intervals
    useEffect(() => {
        // Create array of days for this week
        const firstDayOfWeek = moment(date).startOf("week")
        const days = Array.from({ length: 7 }, (_, i) =>
            firstDayOfWeek.clone().add(i, "days").toDate()
        )
        setDaysOfWeek(days)

        // Create array of time slots
        const intervals = []
        for (let hour = HOURS.START; hour <= HOURS.END; hour++) {
            intervals.push(`${hour}:00`)
            intervals.push(`${hour}:30`)
        }
        setTimeIntervals(intervals)
    }, [date])

    // Add resize observer to handle screen size changes
    useEffect(() => {
        if (!gridContainerRef.current) return

        // Create a new ResizeObserver
        resizeObserverRef.current = new ResizeObserver(() => {
            if (!gridContainerRef.current || daysOfWeek.length === 0) return

            const gridWidth = gridContainerRef.current.offsetWidth
            const dayColumnWidth = (gridWidth - TIME_COLUMN_WIDTH) / 7
            const totalGridHeight = timeIntervals.length * CELL_HEIGHT

            setCalendarDimensions({
                dayColumnWidth,
                totalGridWidth: gridWidth,
                totalGridHeight
            })
        })

        // Start observing the grid container
        resizeObserverRef.current.observe(gridContainerRef.current)

        // Cleanup on unmount
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect()
            }
        }
    }, [daysOfWeek, timeIntervals])

    // Update event positions when calendar dimensions change
    useEffect(() => {
        if (!gridContainerRef.current || daysOfWeek.length === 0) return

        const { dayColumnWidth } = calendarDimensions
        const positions: Record<string, any> = {}
        const weekStart = moment(daysOfWeek[0]).startOf('day')
        const weekEnd = moment(daysOfWeek[6]).endOf('day')

        events.forEach(event => {
            try {
                const eventStart = moment(event.start)
                const eventEnd = moment(event.end)

                // Skip invalid dates or events outside the week
                if (!eventStart.isValid() || !eventEnd.isValid() ||
                    eventEnd.isBefore(weekStart) || eventStart.isAfter(weekEnd)) {
                    return
                }

                // Find which day column this event belongs to
                const dayIndex = eventStart.day()

                // Get event time details
                const startTime = {
                    hour: eventStart.hours(),
                    minute: eventStart.minutes()
                }
                const endTime = {
                    hour: eventEnd.hours(),
                    minute: eventEnd.minutes()
                }

                // Skip events outside visible hours
                const startDecimal = startTime.hour + startTime.minute / 60
                const endDecimal = endTime.hour + endTime.minute / 60
                if (endDecimal <= HOURS.START || startDecimal >= HOURS.END) {
                    return
                }

                // Calculate visible portion of event
                const visibleStart = Math.max(startDecimal, HOURS.START)
                const visibleEnd = Math.min(endDecimal, HOURS.END)

                // Convert to minutes from start of calendar view
                const startMinutes = (visibleStart - HOURS.START) * 60
                const endMinutes = (visibleEnd - HOURS.START) * 60
                const durationMinutes = endMinutes - startMinutes

                // Convert to pixels
                const top = (startMinutes / 30) * CELL_HEIGHT
                const height = Math.max((durationMinutes / 30) * CELL_HEIGHT, 20) // min height 20px
                const left = TIME_COLUMN_WIDTH + (dayIndex * dayColumnWidth) - 10
                const width = dayColumnWidth - 4 // 4px gap

                positions[event.id] = {
                    top,
                    left,
                    height,
                    width,
                    dayIndex,
                    startMinutes,
                    durationMinutes,
                    eventData: { ...event },
                    // Store original time for drag calculations
                    originalTimes: {
                        startHour: startTime.hour,
                        startMinute: startTime.minute,
                        endHour: endTime.hour,
                        endMinute: endTime.minute
                    }
                }
            } catch (error) {
                console.error(`Error positioning event ${event.id}:`, error)
            }
        })

        setEventLayoutData(positions)
    }, [events, daysOfWeek, calendarDimensions])

    // ====================== DRAG AND DROP ======================
    // Custom drag start handler
    const handleDragStart = (event: AppointmentEvent, position: any) => {
        isCurrentlyDragging.current = true
        setDraggedEvent({
            event,
            originalPosition: position,
            currentDayIndex: position.dayIndex,
            currentMinutes: position.startMinutes
        })
    }

    // Custom drag handler - updates position while dragging
    const handleDrag = (
        e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
        draggedState: DraggedEventState,
        info: { offset: { x: number, y: number } }
    ) => {
        if (!gridContainerRef.current || !draggedState.event) return

        const { dayColumnWidth } = calendarDimensions
        const originalPosition = draggedState.originalPosition

        // Calculate day column movement
        const newLeft = originalPosition.left + info.offset.x
        const newDayIndex = Math.max(0, Math.min(6,
            Math.floor((newLeft - TIME_COLUMN_WIDTH + (dayColumnWidth / 2)) / dayColumnWidth)
        ))

        // Calculate time movement
        const newTop = Math.max(0, originalPosition.top + info.offset.y)
        const newMinutes = Math.floor((newTop / CELL_HEIGHT) * 30)

        // Update current position in state
        setDraggedEvent(prev => ({
            ...prev,
            currentDayIndex: newDayIndex,
            currentMinutes: newMinutes
        }))

        // Update event position in real-time for visual feedback
        if (eventElementsRef.current[draggedState.event.id]) {
            const element = eventElementsRef.current[draggedState.event.id]

            // Position exactly at day column
            const snappedLeft = TIME_COLUMN_WIDTH + (newDayIndex * dayColumnWidth)
            element.style.left = `${snappedLeft}px`
            element.style.top = `${newTop}px`
        }
    }

    // Custom drag end handler
    const handleDragEnd = (dragInfo: { offset: { x: number, y: number } }) => {
        if (!gridContainerRef.current || !draggedEvent.event || draggedEvent.currentDayIndex === null) {
            isCurrentlyDragging.current = false
            return
        }

        const { dayColumnWidth } = calendarDimensions
        const event = draggedEvent.event
        const originalPosition = draggedEvent.originalPosition
        const newDayIndex = draggedEvent.currentDayIndex

        // Get time with 10-minute snapping
        const newMinutes = draggedEvent.currentMinutes || 0
        const snappedMinutes = Math.round(newMinutes / 10) * 10

        const newHours = HOURS.START + Math.floor(snappedMinutes / 60)
        const newMinutesValue = snappedMinutes % 60

        // Create new start date
        const newStartDate = moment(daysOfWeek[newDayIndex])
            .hour(newHours)
            .minute(newMinutesValue)
            .second(0)
            .millisecond(0)

        // Create new end date by adding original duration
        const newEndDate = moment(newStartDate)
            .add(originalPosition.durationMinutes, 'minutes')

        // Ensure end time doesn't exceed calendar bounds
        if (newEndDate.hour() > HOURS.END) {
            newEndDate.hour(HOURS.END).minute(0)
        }

        // Create updated event
        const updatedEvent: AppointmentEvent = {
            ...event,
            start: newStartDate.toDate(),
            end: newEndDate.toDate(),
            date: newStartDate.toDate()
        }

        // Calculate final position for visual update
        const updatedPosition = {
            ...originalPosition,
            top: (snappedMinutes / 30) * CELL_HEIGHT,
            left: TIME_COLUMN_WIDTH + (newDayIndex * dayColumnWidth),
            dayIndex: newDayIndex
        }

        // Update the event layout data
        setEventLayoutData(prev => ({
            ...prev,
            [event.id]: updatedPosition
        }))

        // Call onEventUpdate if provided
        if (onEventUpdate) {
            onEventUpdate(updatedEvent)
            toast.success("Appointment updated")
        }

        // Reset drag state
        setDraggedEvent({
            event: null,
            originalPosition: null,
            currentDayIndex: null,
            currentMinutes: null
        })

        // Reset dragging flag
        setTimeout(() => {
            isCurrentlyDragging.current = false
        }, 100)
    }

    // ====================== UTILITIES ======================
    // Format time label (e.g. "8 AM", "2:30 PM")
    const formatTimeLabel = (timeSlot: string): string => {
        const [hourStr, minuteStr] = timeSlot.split(":")
        const hour = parseInt(hourStr, 10)
        return `${hour % 12 || 12}${minuteStr === "00" ? "" : ":30"} ${hour >= 12 ? "PM" : "AM"}`
    }

    // Get event background color based on type
    const getEventBackground = (event: AppointmentEvent, isActive = false, isHovered = false) => {
        if (spaceTheme) {
            return isActive ? "bg-slate-800/60" : isHovered ? "bg-slate-800/40" : "bg-slate-800/30"
        } else {
            return isActive ? "bg-gray-100" : isHovered ? "bg-gray-50/80" : "bg-gray-50"
        }
    }

    // Get event icon based on type
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
                return type
        }
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

    // Check if a time slot has events (for styling)
    const hasEventsInCell = (day: Date, slotIndex: number): boolean => {
        const cellStart = moment(day)
            .hour(Math.floor(slotIndex / 2) + HOURS.START)
            .minute((slotIndex % 2) * 30)
        const cellEnd = moment(cellStart).add(30, "minutes")

        return events.some(event => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            // Skip if not on the same day
            if (!eventStart.isSame(day, "day")) return false

            // Check for overlap
            return (
                (eventStart.isSameOrAfter(cellStart) && eventStart.isBefore(cellEnd)) ||
                (eventEnd.isAfter(cellStart) && eventEnd.isSameOrBefore(cellEnd)) ||
                (eventStart.isSameOrBefore(cellStart) && eventEnd.isSameOrAfter(cellEnd))
            )
        })
    }

    // Auto-scroll to current time on initial load
    useEffect(() => {
        if (!calendarContainerRef.current) return

        const now = new Date()
        const currentHour = now.getHours()

        if (currentHour >= HOURS.START && currentHour <= HOURS.END) {
            const minutesFromStart = (currentHour - HOURS.START) * 60 + now.getMinutes()
            const scrollPosition = (minutesFromStart / 30) * CELL_HEIGHT - 100 // Show 100px above current time
            calendarContainerRef.current.scrollTop = Math.max(0, scrollPosition)
        }
    }, [timeIntervals])

    // ====================== RENDERING ======================
    return (
        <div className="h-full flex flex-col p-4">
            <div className="flex justify-center items-center mb-3">
                <h3
                    className={cn(
                        "text-lg font-semibold text-center px-3 py-1.5 rounded-full",

                    )}
                >
                    {moment(currentDate).startOf('week').format("MMM D")} - {moment(currentDate).endOf('week').format("MMM D, YYYY")}
                </h3>
            </div>

            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Controls and info row */}
                <div className="flex justify-end items-center mb-3 gap-2">
                    <div
                        className={cn(
                            "text-xs flex items-center gap-1 px-3 py-1.5 rounded-full",
                            spaceTheme ? "text-slate-400 bg-slate-800/50" : "text-gray-500 bg-gray-100/70"
                        )}
                    >
                        <GripVertical className="h-3 w-3" />
                        <span>Drag events to reschedule</span>
                    </div>
                    <div
                        className={cn(
                            "text-xs flex items-center gap-1 px-2.5 py-1 rounded-full",
                            spaceTheme ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"
                        )}
                    >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                            {events.length} {events.length === 1 ? "event" : "events"}
                        </span>
                    </div>
                </div>

                {/* Calendar grid */}
                <div className="h-full flex flex-col">
                    {/* ===== HEADER ROW WITH DAY NAMES ===== */}
                    <div className={cn("flex border-b", spaceTheme && "border-zinc-800")}>
                        {/* Empty cell above time column */}
                        <div className={cn("w-[60px] flex-shrink-0", spaceTheme && "text-zinc-400")} />

                        {/* Day header cells */}
                        <div className="flex-1 grid grid-cols-7">
                            {daysOfWeek.map((day, index) => {
                                const isToday = moment(day).isSame(moment(), "day")
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-2 text-center border-r",
                                            isToday && (spaceTheme ? "bg-zinc-900" : "bg-blue-50"),
                                            spaceTheme && "border-zinc-800 text-white"
                                        )}
                                    >
                                        {/* Day abbreviation */}
                                        <div className={cn("text-xs", spaceTheme ? "text-zinc-400" : "text-gray-500")}>
                                            {moment(day).format("ddd").toUpperCase()}
                                        </div>

                                        {/* Day number */}
                                        <div className={cn(
                                            "text-sm font-medium mt-1",
                                            isToday
                                                ? (spaceTheme ? "text-green-400" : "text-blue-500")
                                                : spaceTheme ? "text-white" : ""
                                        )}>
                                            {moment(day).format("D")}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ===== SCROLLABLE TIME GRID ===== */}
                    <div
                        ref={calendarContainerRef}
                        className={cn(
                            "flex-1 overflow-y-auto",
                            spaceTheme ? "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900" : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        )}
                    >
                        <div className={cn(
                            "flex relative min-h-full",
                            spaceTheme ? "bg-zinc-900" : "bg-gray-50"
                        )}>
                            {/* Left time labels column */}
                            <div className={cn("w-[60px] flex-shrink-0 border-r", spaceTheme ? "border-zinc-800" : "border-gray-200")}>
                                {timeIntervals.map((timeSlot, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "h-[40px] text-xs text-right pr-2 relative",
                                            spaceTheme ? "text-zinc-400" : "text-gray-500",
                                            index % 2 === 0 ? "text-[12px]" : "text-[10px]" // Make hour labels bolder, half-hours smaller
                                        )}
                                    >
                                        {/* Show only hour labels centered on the line */}
                                        {index % 2 === 0 && (
                                            <div className="absolute right-2 -top-[1px]">
                                                {formatTimeLabel(timeSlot)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="flex-1 grid grid-cols-7 relative" ref={gridContainerRef}>
                                {/* Grid cells background */}
                                {daysOfWeek.map((day, dayIndex) => (
                                    <div key={dayIndex} className={cn("border-r", spaceTheme ? "border-zinc-800" : "border-gray-200")}>
                                        {timeIntervals.map((_, slotIndex) => {
                                            const hasEvents = hasEventsInCell(day, slotIndex)
                                            const isHourLine = slotIndex % 2 === 0
                                            const isHalfHourLine = slotIndex % 2 === 1

                                            return (
                                                <div
                                                    key={slotIndex}
                                                    className={cn(
                                                        "h-[40px] border-b",
                                                        isHourLine && "border-b",
                                                        spaceTheme ? "border-zinc-800" : "border-gray-200"
                                                    )}
                                                />
                                            )
                                        })}
                                    </div>
                                ))}

                                {/* Current time indicator */}
                                {daysOfWeek.some(day => moment(day).isSame(moment(), "day")) && (
                                    <div
                                        className={cn(
                                            "absolute left-0 right-0 border-t-2 z-10",
                                            spaceTheme ? "border-green-500" : "border-red-500"
                                        )}
                                        style={{
                                            top: (() => {
                                                const now = new Date()
                                                const hour = now.getHours()
                                                const minute = now.getMinutes()

                                                if (hour < HOURS.START || hour > HOURS.END) return 0

                                                const minutesFromStart = (hour - HOURS.START) * 60 + minute
                                                return (minutesFromStart / 30) * CELL_HEIGHT
                                            })()
                                        }}
                                    >
                                        <div className={cn(
                                            "w-2 h-2 rounded-full -mt-1 -ml-1",
                                            spaceTheme ? "bg-green-500" : "bg-red-500"
                                        )} />
                                    </div>
                                )}

                                {/* Event cards */}
                                {events.map(event => {
                                    const position = eventLayoutData[event.id]
                                    if (!position) return null // Skip if position not calculated

                                    const isDragging = draggedEvent.event?.id === event.id
                                    const isHovered = hoveredEvent === event.id

                                    return (
                                        <motion.div
                                            key={event.id}
                                            ref={element => {
                                                if (element) eventElementsRef.current[event.id] = element
                                            }}
                                            className={cn(
                                                "absolute rounded-lg shadow-sm text-xs p-2 cursor-grab border",
                                                getEventBackground(event, isDragging, isHovered),
                                                spaceTheme ? "text-white border-slate-700" : "text-black border-gray-200"
                                            )}
                                            style={{
                                                top: `${position.top}px`,
                                                left: `${position.left}px`,
                                                height: `${position.height}px`,
                                                width: `${position.width}px`,
                                                zIndex: isDragging ? 30 : 10,
                                                boxShadow: isDragging
                                                    ? (spaceTheme ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.2)")
                                                    : (spaceTheme ? "0 2px 6px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)"),
                                                transform: isDragging ? "scale(1.02)" : "scale(1)",
                                                opacity: isDragging ? 0.9 : 1,
                                                transition: "box-shadow 0.2s, transform 0.2s, opacity 0.2s"
                                            }}
                                            onMouseDown={(e) => {
                                                if (e.button !== 0) return
                                                handleDragStart(event, position)
                                            }}
                                            onMouseEnter={() => setHoveredEvent(event.id)}
                                            onMouseLeave={() => setHoveredEvent(null)}
                                            onClick={e => {
                                                if (!isCurrentlyDragging.current) {
                                                    e.stopPropagation()
                                                    onSelectEvent(event)
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-1 mb-1">
                                                {getEventIcon(event.type)}
                                                <span className="font-medium truncate">{event.title}</span>
                                            </div>
                                            <div className={cn("text-[10px]", spaceTheme ? "text-slate-300" : "text-gray-500")}>
                                                {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
                                            </div>
                                            <div className={cn("text-[10px]", spaceTheme ? "text-slate-300" : "text-gray-500")}>
                                                {getEventTypeLabel(event.type)} • {getEventDuration(event)}
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
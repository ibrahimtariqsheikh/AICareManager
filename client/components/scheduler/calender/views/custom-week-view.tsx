"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import moment from "moment"
import { motion } from "framer-motion"
import type { AppointmentEvent } from "../types"
import { cn } from "../../../../lib/utils"
import { Home, Video, Building2, Phone, User, Calendar, Heart, Flag, DollarSign, Baby, AlertTriangle, Clock, Stethoscope, Timer } from "lucide-react"
import { useAppSelector } from "@/state/redux"

interface CustomWeekViewProps {
    date: Date
    onSelectEvent: (event: AppointmentEvent) => void
    staffMembers: any[]
    getEventDurationInMinutes: (event: any) => number
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
}

export function CustomWeekView(props: CustomWeekViewProps) {
    const {
        date,
        onSelectEvent,

    } = props

    // Get current date from Redux store
    useAppSelector((state) => state.calendar)
    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType)

    const filteredUsers = useAppSelector((state) => state.schedule.filteredUsers)
    const events = useAppSelector((state) => state.schedule.events || [])

    // ====================== CONSTANTS ======================
    const HOURS = {
        START: 7,  // 7 AM
        END: 19    // 7 PM
    }
    const CELL_HEIGHT = 40 // pixels per 30-min slot
    const TIME_COLUMN_WIDTH = 1

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
    const [, setHoveredEvent] = useState<string | null>(null)

    // Get the appropriate users based on activeScheduleUserType and filtered users

    // If no users are filtered, show all users

    // Update the staffMembers prop to use finalDisplayUsers

    // Filter events based on activeScheduleUserType and filtered users
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            switch (activeScheduleUserType) {
                case "clients":
                    return event.clientId && filteredUsers.clients.includes(event.clientId)
                case "careWorker":
                    return event.resourceId && filteredUsers.careWorkers.includes(event.resourceId)
                case "officeStaff":
                    return event.resourceId && filteredUsers.officeStaff.includes(event.resourceId)
                default:
                    return true
            }
        })
    }, [events, activeScheduleUserType, filteredUsers])

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

    useEffect(() => {
        if (!gridContainerRef.current || daysOfWeek.length === 0) return

        const { dayColumnWidth } = calendarDimensions
        const positions: Record<string, any> = {}
        const weekStart = moment(daysOfWeek[0]).startOf('day')
        const weekEnd = moment(daysOfWeek[6]).endOf('day')

        // Calculate the exact cell width dynamically
        const exactDayColumnWidth = dayColumnWidth ||
            ((gridContainerRef.current.offsetWidth - TIME_COLUMN_WIDTH) / 7)

        filteredEvents.forEach(event => {
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

                // Calculate the exact position within the column boundaries
                // This is the critical fix to ensure events stay within their day column
                const horizontalPadding = 4 // Small padding inside cell

                // Calculate left based on exact day index position
                const left = TIME_COLUMN_WIDTH + (dayIndex * exactDayColumnWidth) + horizontalPadding

                // Ensure width is constrained to the column width minus padding
                const width = exactDayColumnWidth - (horizontalPadding * 2)

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
    }, [filteredEvents, daysOfWeek, calendarDimensions])

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

    // ====================== UTILITIES ======================
    // Format time label (e.g. "8 AM", "2:30 PM")
    const formatTimeLabel = (timeSlot: string): string => {
        const [hourStr, minuteStr] = timeSlot.split(":")
        const hour = parseInt(hourStr || "0", 10)
        return `${hour % 12 || 12}${minuteStr === "00" ? "" : ":30"} ${hour >= 12 ? "PM" : "AM"}`
    }

    // Get event icon based on type
    const getEventIcon = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            switch (event.leaveType) {
                case "ANNUAL_LEAVE":
                    return <Calendar className="h-3 w-3" />
                case "SICK_LEAVE":
                    return <Heart className="h-3 w-3" />
                case "PUBLIC_HOLIDAY":
                    return <Flag className="h-3 w-3" />
                case "UNPAID_LEAVE":
                    return <DollarSign className="h-3 w-3" />
                case "MATERNITY_LEAVE":
                    return <Baby className="h-3 w-3" />
                case "PATERNITY_LEAVE":
                    return <User className="h-3 w-3" />
                case "BEREAVEMENT_LEAVE":
                    return <Heart className="h-3 w-3" />
                case "EMERGENCY_LEAVE":
                    return <AlertTriangle className="h-3 w-3" />
                case "MEDICAL_APPOINTMENT":
                    return <Stethoscope className="h-3 w-3" />
                case "TOIL":
                    return <Clock className="h-3 w-3" />
                default:
                    return <Calendar className="h-3 w-3" />
            }
        }

        switch (event.type) {
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
                return <Calendar className="h-3 w-3" />
        }
    }


    // Auto-scroll to current time on initial load
    useEffect(() => {
        if (!calendarContainerRef.current) return



    }, [timeIntervals])

    // Define event type styles

    // Get event background color based on type
    const getEventBackground = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as keyof typeof styles
            const styles = {
                annual_leave: {
                    bg: 'bg-green-50',
                    text: 'text-green-700'
                },
                sick_leave: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                public_holiday: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                unpaid_leave: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                maternity_leave: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                paternity_leave: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                bereavement_leave: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                emergency_leave: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                medical_appointment: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                toil: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                },
                default: {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700'
                }
            }
            const style = styles[leaveType] || styles.default
            return {
                bg: style.bg,
                text: style.text
            }
        }

        const defaultStyle = {
            bg: 'bg-blue-50',
            text: 'text-blue-700'
        }
        const style = defaultStyle
        return {
            bg: style.bg,
            text: style.text
        }
    }

    // ====================== RENDERING ======================
    return (
        <div className="h-full flex flex-col p-4">
            <div className="flex flex-col flex-1 h-full overflow-hidden border border-gray-200 rounded-lg">
                {/* Calendar grid */}
                <div className="h-full flex flex-col">
                    {/* ===== HEADER ROW WITH DAY NAMES ===== */}
                    <div className="flex border-b border-gray-200">
                        {/* Empty cell above time column */}
                        <div className="w-[60px] flex-shrink-0 border-r border-gray-200 bg-gray-50" />

                        {/* Day header cells */}
                        <div className="flex-1 grid grid-cols-7 bg-gray-50">
                            {daysOfWeek.map((day, index) => {
                                const isToday = moment(day).isSame(moment(), "day")
                                const isWeekend = index === 0 || index === 6
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-2 text-center border-r border-gray-200",
                                            isWeekend && "text-gray-400"
                                        )}
                                    >
                                        {/* Day abbreviation */}
                                        <div className="text-sm font-medium text-gray-500">
                                            {moment(day).format("ddd").toUpperCase()}
                                        </div>

                                        {/* Day number */}
                                        <div className={cn(
                                            "text-sm font-medium mt-1",
                                            isToday ? "text-blue-500" : "text-gray-700"
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
                        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    >
                        <div className="flex relative min-h-full bg-white">
                            {/* Left time labels column */}
                            <div className="w-[60px] flex-shrink-0 border-r border-gray-200 bg-gray-50">
                                {timeIntervals.map((timeSlot, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "h-[40px] text-xs text-right pr-2 relative text-gray-500",
                                            index % 2 === 0 ? "text-sm font-medium" : "text-xs"
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
                                {daysOfWeek.map((_day, dayIndex) => (
                                    <div key={dayIndex} className="border-r border-gray-200">
                                        {timeIntervals.map((_, slotIndex) => {
                                            const isHourLine = slotIndex % 2 === 0

                                            return (
                                                <div
                                                    key={slotIndex}
                                                    className={cn(
                                                        "h-[40px] border-b",
                                                        isHourLine && "border-b",
                                                        "border-gray-200"
                                                    )}
                                                />
                                            )
                                        })}
                                    </div>
                                ))}

                                {/* Current time indicator */}
                                {daysOfWeek.some(day => moment(day).isSame(moment(), "day")) && (
                                    <div
                                        className="absolute left-0 right-0 border-t-2 z-10 border-red-500"
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
                                        <div className="w-2 h-2 rounded-full -mt-1 -ml-1 bg-red-500" />
                                    </div>
                                )}

                                {/* Event cards */}
                                {filteredEvents.map(event => {
                                    const position = eventLayoutData[event.id]
                                    if (!position) return null // Skip if position not calculated

                                    const isDragging = draggedEvent.event?.id === event.id

                                    return (
                                        <motion.div
                                            key={event.id}
                                            ref={element => {
                                                if (element) eventElementsRef.current[event.id] = element
                                            }}
                                            className={cn(
                                                "absolute rounded-lg text-xs p-2 cursor-grab border-l-[3px]",
                                                event.isLeaveEvent ? "border-l-" + event.color : "border-l-blue-600",
                                                getEventBackground(event).text,
                                                getEventBackground(event).bg,
                                            )}
                                            style={{
                                                top: `${position.top}px`,
                                                left: `${position.left}px`,
                                                height: `${position.height}px`,
                                                width: `${position.width}px`,
                                                zIndex: isDragging ? 30 : 10,
                                                boxShadow: isDragging
                                                    ? "0 4px 12px rgba(0,0,0,0.2)"
                                                    : "0 1px 3px rgba(0,0,0,0.1)",
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
                                            <div className={cn("flex items-start gap-1 mb-1", "text-blue-800")}>
                                                <div className="flex-shrink-0 mt-0.5">{getEventIcon(event)}</div>
                                                <div className="font-medium break-words line-clamp-2 text-[11px]">{event.title}</div>
                                            </div>
                                            <div className={cn("text-[10px]", "text-blue-600 flex items-center gap-1")}>
                                                <Timer className="h-3 w-3" /><div>{moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}</div>
                                            </div>
                                            <div className={cn("text-[10px]", "text-blue-600 flex items-center gap-1")}>
                                                <User className="h-3 w-3" />
                                                <div className="truncate">{event.careWorker?.fullName}</div>
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
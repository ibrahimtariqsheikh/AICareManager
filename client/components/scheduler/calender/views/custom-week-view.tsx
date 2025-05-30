"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import moment from "moment"
import { motion, AnimatePresence } from "framer-motion"
import type { AppointmentEvent } from "../types"
import { cn } from "../../../../lib/utils"
import { Home, Video, Building2, Phone, User, Calendar, Heart, Flag, DollarSign, Baby, AlertTriangle, Clock, Stethoscope, Timer, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react"
import { useAppSelector } from "@/state/redux"

interface CustomWeekViewProps {
    date: Date
    onSelectEvent: (event: AppointmentEvent) => void
    staffMembers: any[]
    getEventDurationInMinutes: (event: any) => number
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
}

interface TimeSlotConflicts {
    [key: string]: { // key format: "dayIndex-timeSlot"
        events: AppointmentEvent[]
        isExpanded: boolean
        maxVisible: number
    }
}

export function CustomWeekView(props: CustomWeekViewProps) {
    const {
        date,
        onSelectEvent,
    } = props


    useAppSelector((state) => state.calendar)
    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType)
    const filteredUsers = useAppSelector((state) => state.schedule.filteredUsers)
    const events = useAppSelector((state) => state.schedule.events || [])


    const HOURS = {
        START: 7,
        END: 19
    }

    const CELL_HEIGHT = 40
    const TIME_COLUMN_WIDTH = 1
    const MIN_EVENT_HEIGHT = 32
    const COMPACT_EVENT_HEIGHT = 24
    const MAX_EVENTS_BEFORE_COLLAPSE = 3

    const calendarContainerRef = useRef<HTMLDivElement>(null)
    const gridContainerRef = useRef<HTMLDivElement>(null)
    const isCurrentlyDragging = useRef(false)
    const eventElementsRef = useRef<Record<string, HTMLElement>>({})
    const resizeObserverRef = useRef<ResizeObserver | null>(null)

    const [daysOfWeek, setDaysOfWeek] = useState<Date[]>([])
    const [timeIntervals, setTimeIntervals] = useState<string[]>([])
    const [eventLayoutData, setEventLayoutData] = useState<Record<string, any>>({})
    const [calendarDimensions, setCalendarDimensions] = useState({
        dayColumnWidth: 0,
        totalGridWidth: 0,
        totalGridHeight: 0
    })
    const [, setHoveredEvent] = useState<string | null>(null)
    const [timeSlotConflicts, setTimeSlotConflicts] = useState<TimeSlotConflicts>({})

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

    const [draggedEvent, setDraggedEvent] = useState<DraggedEventState>({
        event: null,
        originalPosition: null,
        currentDayIndex: null,
        currentMinutes: null
    })

    // ====================== CONFLICT DETECTION ======================
    const detectTimeSlotConflicts = (events: AppointmentEvent[]) => {
        const conflicts: TimeSlotConflicts = {}
        const weekStart = moment(daysOfWeek[0]).startOf('day')
        const weekEnd = moment(daysOfWeek[6]).endOf('day')

        // Group events by day and time slots
        const eventsByDayAndTime: Record<string, AppointmentEvent[]> = {}

        events.forEach(event => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            if (!eventStart.isValid() || !eventEnd.isValid() ||
                eventEnd.isBefore(weekStart) || eventStart.isAfter(weekEnd)) {
                return
            }

            const dayIndex = eventStart.day()
            const startHour = eventStart.hours()
            const startMinute = eventStart.minutes()
            const endHour = eventEnd.hours()
            const endMinute = eventEnd.minutes()

            // Generate 30-minute time slots this event spans
            let currentTime = moment(eventStart).startOf('hour')
            if (startMinute >= 30) {
                currentTime.add(30, 'minutes')
            }

            const eventEndTime = moment(eventEnd)

            while (currentTime.isBefore(eventEndTime)) {
                const timeSlotKey = `${dayIndex}-${currentTime.hours()}-${Math.floor(currentTime.minutes() / 30) * 30}`

                if (!eventsByDayAndTime[timeSlotKey]) {
                    eventsByDayAndTime[timeSlotKey] = []
                }
                eventsByDayAndTime[timeSlotKey].push(event)

                currentTime.add(30, 'minutes')
            }
        })

        // Identify conflicts (more than 1 event in same time slot)
        Object.entries(eventsByDayAndTime).forEach(([timeSlotKey, eventsInSlot]) => {
            if (eventsInSlot.length > 1) {
                conflicts[timeSlotKey] = {
                    events: eventsInSlot,
                    isExpanded: false,
                    maxVisible: MAX_EVENTS_BEFORE_COLLAPSE
                }
            }
        })

        return conflicts
    }

    // ====================== SETUP CALENDAR GRID ======================
    useEffect(() => {
        const firstDayOfWeek = moment(date).startOf("week")
        const days = Array.from({ length: 7 }, (_, i) =>
            firstDayOfWeek.clone().add(i, "days").toDate()
        )
        setDaysOfWeek(days)

        const intervals = []
        for (let hour = HOURS.START; hour <= HOURS.END; hour++) {
            intervals.push(`${hour}:00`)
            intervals.push(`${hour}:30`)
        }
        setTimeIntervals(intervals)
    }, [date])

    useEffect(() => {
        if (!gridContainerRef.current) return

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

        resizeObserverRef.current.observe(gridContainerRef.current)

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect()
            }
        }
    }, [daysOfWeek, timeIntervals])

    // Update conflicts when events change
    useEffect(() => {
        if (daysOfWeek.length > 0) {
            const conflicts = detectTimeSlotConflicts(filteredEvents)
            setTimeSlotConflicts(conflicts)
        }
    }, [filteredEvents, daysOfWeek])

    // Enhanced event positioning with conflict resolution
    useEffect(() => {
        if (!gridContainerRef.current || daysOfWeek.length === 0) return

        const { dayColumnWidth } = calendarDimensions
        const positions: Record<string, any> = {}
        const weekStart = moment(daysOfWeek[0]).startOf('day')
        const weekEnd = moment(daysOfWeek[6]).endOf('day')

        const exactDayColumnWidth = dayColumnWidth ||
            ((gridContainerRef.current.offsetWidth - TIME_COLUMN_WIDTH) / 7)

        filteredEvents.forEach((event, eventIndex) => {
            try {
                const eventStart = moment(event.start)
                const eventEnd = moment(event.end)

                if (!eventStart.isValid() || !eventEnd.isValid() ||
                    eventEnd.isBefore(weekStart) || eventStart.isAfter(weekEnd)) {
                    return
                }

                const dayIndex = eventStart.day()
                const startTime = {
                    hour: eventStart.hours(),
                    minute: eventStart.minutes()
                }
                const endTime = {
                    hour: eventEnd.hours(),
                    minute: eventEnd.minutes()
                }

                const startDecimal = startTime.hour + startTime.minute / 60
                const endDecimal = endTime.hour + endTime.minute / 60
                if (endDecimal <= HOURS.START || startDecimal >= HOURS.END) {
                    return
                }

                const visibleStart = Math.max(startDecimal, HOURS.START)
                const visibleEnd = Math.min(endDecimal, HOURS.END)

                const startMinutes = (visibleStart - HOURS.START) * 60
                const endMinutes = (visibleEnd - HOURS.START) * 60
                const durationMinutes = endMinutes - startMinutes

                // Check for conflicts in the primary time slot
                const primaryTimeSlotKey = `${dayIndex}-${startTime.hour}-${Math.floor(startTime.minute / 30) * 30}`
                const conflictInfo = timeSlotConflicts[primaryTimeSlotKey]

                let eventHeight = Math.max((durationMinutes / 30) * CELL_HEIGHT, MIN_EVENT_HEIGHT)
                let eventWidth = exactDayColumnWidth - 8 // Default width with padding
                let leftOffset = 0
                let isHidden = false

                if (conflictInfo) {
                    const eventPositionInConflict = conflictInfo.events.findIndex(e => e.id === event.id)
                    const totalConflictEvents = conflictInfo.events.length

                    if (!conflictInfo.isExpanded && eventPositionInConflict >= conflictInfo.maxVisible) {
                        // Hide events beyond the maximum visible limit
                        isHidden = true
                    } else {
                        // Adjust layout for visible events
                        if (totalConflictEvents > 1) {
                            // Use compact height when multiple events
                            eventHeight = Math.max(COMPACT_EVENT_HEIGHT, (durationMinutes / 30) * CELL_HEIGHT / 2)

                            if (conflictInfo.isExpanded) {
                                // Stack events vertically when expanded
                                const stackOffset = eventPositionInConflict * (eventHeight + 2)
                                positions[event.id] = {
                                    ...positions[event.id],
                                    stackOffset
                                }
                            } else {
                                // Side-by-side layout for non-expanded conflicts
                                const visibleEvents = Math.min(totalConflictEvents, conflictInfo.maxVisible)
                                eventWidth = (exactDayColumnWidth - 12) / visibleEvents // Distribute width
                                leftOffset = eventPositionInConflict * eventWidth
                            }
                        }
                    }
                }

                const top = (startMinutes / 30) * CELL_HEIGHT
                const horizontalPadding = 4
                const left = TIME_COLUMN_WIDTH + (dayIndex * exactDayColumnWidth) + horizontalPadding + leftOffset

                if (!isHidden) {
                    positions[event.id] = {
                        top,
                        left,
                        height: eventHeight,
                        width: eventWidth,
                        dayIndex,
                        startMinutes,
                        durationMinutes,
                        eventData: { ...event },
                        isInConflict: !!conflictInfo,
                        conflictKey: primaryTimeSlotKey,
                        isHidden: false,
                        originalTimes: {
                            startHour: startTime.hour,
                            startMinute: startTime.minute,
                            endHour: endTime.hour,
                            endMinute: endTime.minute
                        }
                    }
                }
            } catch (error) {
                console.error(`Error positioning event ${event.id}:`, error)
            }
        })

        setEventLayoutData(positions)
    }, [filteredEvents, daysOfWeek, calendarDimensions, timeSlotConflicts])

    // ====================== CONFLICT HANDLERS ======================
    const toggleTimeSlotExpansion = (timeSlotKey: string) => {
        setTimeSlotConflicts(prev => {
            const currentSlot = prev[timeSlotKey]
            if (!currentSlot) return prev

            return {
                ...prev,
                [timeSlotKey]: {
                    ...currentSlot,
                    isExpanded: !currentSlot.isExpanded
                }
            }
        })
    }

    const renderConflictIndicator = (timeSlotKey: string, dayIndex: number, timeSlot: string) => {
        const conflictInfo = timeSlotConflicts[timeSlotKey]
        if (!conflictInfo || conflictInfo.events.length <= conflictInfo.maxVisible) return null

        const hiddenCount = conflictInfo.events.length - conflictInfo.maxVisible
        const [hourStr, minuteStr] = timeSlot.split(':')
        const hour = hourStr ? parseInt(hourStr, 10) : 0
        const minute = minuteStr ? parseInt(minuteStr, 10) : 0
        const slotMinutes = (hour - HOURS.START) * 60 + minute
        const top = (slotMinutes / 30) * CELL_HEIGHT

        const { dayColumnWidth } = calendarDimensions
        const exactDayColumnWidth = dayColumnWidth ||
            ((gridContainerRef.current?.offsetWidth || 0 - TIME_COLUMN_WIDTH) / 7)

        return (
            <div
                className="absolute z-20 flex items-center justify-center"
                style={{
                    top: `${top + CELL_HEIGHT - 20}px`,
                    left: `${TIME_COLUMN_WIDTH + (dayIndex * exactDayColumnWidth) + 4}px`,
                    width: `${exactDayColumnWidth - 8}px`,
                    height: '16px'
                }}
            >
                <motion.button
                    onClick={() => toggleTimeSlotExpansion(timeSlotKey)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-full border border-blue-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MoreHorizontal className="h-3 w-3" />
                    <span>{conflictInfo.isExpanded ? 'Show Less' : `+${hiddenCount} more`}</span>
                    {conflictInfo.isExpanded ?
                        <ChevronUp className="h-3 w-3" /> :
                        <ChevronDown className="h-3 w-3" />
                    }
                </motion.button>
            </div>
        )
    }

    // ====================== DRAG AND DROP ======================
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
    const formatTimeLabel = (timeSlot: string): string => {
        const [hourStr, minuteStr] = timeSlot.split(":")
        const hour = parseInt(hourStr || "0", 10)
        return `${hour % 12 || 12}${minuteStr === "00" ? "" : ":30"} ${hour >= 12 ? "PM" : "AM"}`
    }

    const getEventIcon = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            switch (event.leaveType) {
                case "ANNUAL_LEAVE": return <Calendar className="h-3 w-3" />
                case "SICK_LEAVE": return <Heart className="h-3 w-3" />
                case "PUBLIC_HOLIDAY": return <Flag className="h-3 w-3" />
                case "UNPAID_LEAVE": return <DollarSign className="h-3 w-3" />
                case "MATERNITY_LEAVE": return <Baby className="h-3 w-3" />
                case "PATERNITY_LEAVE": return <User className="h-3 w-3" />
                case "BEREAVEMENT_LEAVE": return <Heart className="h-3 w-3" />
                case "EMERGENCY_LEAVE": return <AlertTriangle className="h-3 w-3" />
                case "MEDICAL_APPOINTMENT": return <Stethoscope className="h-3 w-3" />
                case "TOIL": return <Clock className="h-3 w-3" />
                default: return <Calendar className="h-3 w-3" />
            }
        }

        switch (event.type) {
            case "HOME_VISIT": return <Home className="h-3 w-3" />
            case "VIDEO_CALL": return <Video className="h-3 w-3" />
            case "HOSPITAL": return <Building2 className="h-3 w-3" />
            case "AUDIO_CALL": return <Phone className="h-3 w-3" />
            case "IN_PERSON": return <User className="h-3 w-3" />
            default: return <Calendar className="h-3 w-3" />
        }
    }

    const getEventBackground = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as keyof typeof styles
            const styles = {
                annual_leave: { bg: 'bg-green-50', text: 'text-green-700' },
                sick_leave: { bg: 'bg-blue-50', text: 'text-blue-700' },
                public_holiday: { bg: 'bg-blue-50', text: 'text-blue-700' },
                unpaid_leave: { bg: 'bg-blue-50', text: 'text-blue-700' },
                maternity_leave: { bg: 'bg-blue-50', text: 'text-blue-700' },
                paternity_leave: { bg: 'bg-blue-50', text: 'text-blue-700' },
                bereavement_leave: { bg: 'bg-blue-50', text: 'text-blue-700' },
                emergency_leave: { bg: 'bg-blue-50', text: 'text-blue-700' },
                medical_appointment: { bg: 'bg-blue-50', text: 'text-blue-700' },
                toil: { bg: 'bg-blue-50', text: 'text-blue-700' },
                default: { bg: 'bg-blue-50', text: 'text-blue-700' }
            }
            const style = styles[leaveType] || styles.default
            return { bg: style.bg, text: style.text }
        }

        return { bg: 'bg-blue-50', text: 'text-blue-700' }
    }

    // ====================== RENDERING ======================
    return (
        <div className="h-full flex flex-col p-4">
            <div className="flex flex-col flex-1 h-full overflow-hidden border border-gray-200 rounded-lg">
                <div className="h-full flex flex-col">
                    {/* ===== HEADER ROW WITH DAY NAMES ===== */}
                    <div className="flex border-b border-gray-200">
                        <div className="w-[60px] flex-shrink-0 border-r border-gray-200 bg-gray-50" />
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
                                        <div className="text-sm font-medium text-gray-500">
                                            {moment(day).format("ddd").toUpperCase()}
                                        </div>
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
                                        {timeIntervals.map((timeSlot, slotIndex) => {
                                            const isHourLine = slotIndex % 2 === 0
                                            const [hour, minute] = timeSlot.split(':').map(Number)
                                            const timeSlotKey = `${dayIndex}-${hour}-${minute}`

                                            return (
                                                <div key={slotIndex} className="relative">
                                                    <div
                                                        className={cn(
                                                            "h-[40px] border-b",
                                                            isHourLine && "border-b",
                                                            "border-gray-200"
                                                        )}
                                                    />
                                                    {/* Render conflict indicators */}
                                                    {renderConflictIndicator(timeSlotKey, dayIndex, timeSlot)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}

                                {/* Current time indicator */}
                                {daysOfWeek.some(day => moment(day).isSame(moment(), "day")) && (
                                    <div
                                        className="absolute left-0 right-0 border-t-2 z-30 border-red-500"
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
                                <AnimatePresence>
                                    {filteredEvents.map(event => {
                                        const position = eventLayoutData[event.id]
                                        if (!position || position.isHidden) return null

                                        const isDragging = draggedEvent.event?.id === event.id
                                        const isCompact = position.height <= COMPACT_EVENT_HEIGHT

                                        return (
                                            <motion.div
                                                key={event.id}
                                                ref={element => {
                                                    if (element) eventElementsRef.current[event.id] = element
                                                }}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                                className={cn(
                                                    "absolute rounded-lg text-xs p-1.5 cursor-grab border-l-[3px] shadow-sm hover:shadow-md transition-shadow",
                                                    event.isLeaveEvent ? "border-l-" + event.color : "border-l-blue-600",
                                                    getEventBackground(event).text,
                                                    getEventBackground(event).bg,
                                                    position.isInConflict && "ring-1 ring-blue-200",
                                                    isCompact && "p-1"
                                                )}
                                                style={{
                                                    top: `${position.top + (position.stackOffset || 0)}px`,
                                                    left: `${position.left}px`,
                                                    height: `${position.height}px`,
                                                    width: `${position.width}px`,
                                                    zIndex: isDragging ? 30 : (position.isInConflict ? 15 : 10),
                                                    boxShadow: isDragging
                                                        ? "0 4px 12px rgba(0,0,0,0.2)"
                                                        : position.isInConflict
                                                            ? "0 2px 6px rgba(59, 130, 246, 0.15)"
                                                            : "0 1px 3px rgba(0,0,0,0.1)",
                                                    transform: isDragging ? "scale(1.02)" : "scale(1)",
                                                    opacity: isDragging ? 0.9 : 1,
                                                    transition: "all 0.2s ease"
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
                                                {!isCompact ? (
                                                    <>
                                                        <div className={cn("flex items-start gap-1 mb-1", "text-blue-800")}>
                                                            <div className="flex-shrink-0 mt-0.5">{getEventIcon(event)}</div>
                                                            <div className="font-medium break-words line-clamp-2 text-[11px]">{event.title}</div>
                                                        </div>
                                                        <div className={cn("text-[10px]", "text-blue-600 flex items-center gap-1")}>
                                                            <Timer className="h-3 w-3" />
                                                            <div>{moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}</div>
                                                        </div>
                                                        <div className={cn("text-[10px]", "text-blue-600 flex items-center gap-1")}>
                                                            <User className="h-3 w-3" />
                                                            <div className="truncate">{event.careWorker?.fullName}</div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex-shrink-0">{getEventIcon(event)}</div>
                                                        <div className="font-medium text-[10px] truncate flex-1">{event.title}</div>
                                                        <div className="text-[9px] text-blue-600">{moment(event.start).format("h:mm")}</div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
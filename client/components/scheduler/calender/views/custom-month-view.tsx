"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import moment from "moment"
import { motion } from "framer-motion"
import { ChevronDown, Calendar, Clock, User, Home, Video, Building2, Phone, Heart, Flag, DollarSign, Baby, AlertTriangle, Stethoscope } from "lucide-react"
import type { AppointmentEvent, StaffMember, Client } from "../types"
import { cn } from "../../../../lib/utils"
import { toast } from "sonner"
import { useAppSelector } from "@/state/redux"
import { eventTypeStyles } from "../styles/event-colors"

interface CustomMonthViewProps {
    date: Date

    onSelectEvent: (event: AppointmentEvent) => void
    onDateSelect: (date: Date) => void
    staffMembers: any[]
    getEventDurationInMinutes: (event: any) => number
    getEventTypeLabel: (type: string) => string
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
    onSelectEvent,
    onDateSelect,
    getEventDurationInMinutes,
    getEventTypeLabel,
    spaceTheme = false,
    onEventUpdate,
}: CustomMonthViewProps) {
    const [calendar, setCalendar] = useState<Date[][]>([])
    const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; date: string; time: string } | null>(null)
    const [ghostEvent, setGhostEvent] = useState<{ id: string; dayStr: string } | null>(null)
    const eventRefs = useRef<Record<string, HTMLElement>>({})
    const dayRefs = useRef<Record<string, HTMLElement>>({})
    const calendarRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const [displayEvents, setDisplayEvents] = useState<Record<string, AppointmentEvent>>({})
    const [highlightedDay, setHighlightedDay] = useState<string | null>(null)
    const [eventBeingDragged, setEventBeingDragged] = useState<AppointmentEvent | null>(null)
    const [originalEventPosition, setOriginalEventPosition] = useState<{
        dateStr: string
        event: AppointmentEvent
    } | null>(null)
    const dragEventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
    const [cellHeights, setCellHeights] = useState<Record<string, number>>({})
    const cellRefs = useRef<Record<string, HTMLElement>>({})

    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType)
    const clients = useAppSelector((state) => state.user.clients || [])
    const careworkers = useAppSelector((state) => state.user.careWorkers || [])
    const officeStaff = useAppSelector((state) => state.user.officeStaff || [])
    const filteredUsers = useAppSelector((state) => state.schedule.filteredUsers)

    const events = useAppSelector((state) => state.schedule.events || [])

    // Get the appropriate users based on activeScheduleUserType and filtered users
    const displayUsers = (() => {
        let users: (Client | StaffMember)[] = []
        if (activeScheduleUserType === "clients") {
            users = clients.filter(client => filteredUsers.clients.includes(client.id))
        } else if (activeScheduleUserType === "careWorker") {
            users = careworkers.filter(worker => filteredUsers.careWorkers.includes(worker.id))
        } else if (activeScheduleUserType === "officeStaff") {
            users = officeStaff.filter(staff => filteredUsers.officeStaff.includes(staff.id))
        }
        return users
    })()

    // If no users are filtered, show all users
    const finalDisplayUsers = displayUsers.length > 0 ? displayUsers : (() => {
        if (activeScheduleUserType === "clients") return clients
        if (activeScheduleUserType === "careWorker") return careworkers
        if (activeScheduleUserType === "officeStaff") return officeStaff
        return [] as (Client | StaffMember)[]
    })()

    // Use finalDisplayUsers instead of staffMembers prop
    const displayStaffMembers = finalDisplayUsers

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

    // Initialize display events with filtered events
    useEffect(() => {
        const eventMap: Record<string, AppointmentEvent> = {}
        events.forEach((event) => {
            // Only include events that match the activeScheduleUserType
            const shouldInclude = (() => {
                switch (activeScheduleUserType) {
                    case "clients":
                        return event.clientId && clients.some(client => client.id === event.clientId)
                    case "careWorker":
                        return event.resourceId && careworkers.some(worker => worker.id === event.resourceId)
                    case "officeStaff":
                        return event.resourceId && officeStaff.some(staff => staff.id === event.resourceId)
                    default:
                        return false
                }
            })()

            if (shouldInclude) {
                eventMap[event.id] = { ...event }
            }
        })
        setDisplayEvents(eventMap)
    }, [events, activeScheduleUserType, clients, careworkers, officeStaff])

    // Cleanup function for drag operations
    const cleanupDragState = useCallback(() => {
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
    }, [])

    // Cancel the current drag operation and reset to original state
    const cancelDrag = useCallback(() => {
        if (originalEventPosition) {
            // Revert the event to its original position
            if (eventBeingDragged) {
                toast.error("Drag cancelled - reverted to original position")
            }
        }
        cleanupDragState()
    }, [originalEventPosition, eventBeingDragged, cleanupDragState])

    // Handle pointer up globally to catch if mouse released outside calendar
    const handlePointerUp = useCallback(() => {
        if (isDragging && !ghostEvent) {
            cancelDrag()
        }
    }, [isDragging, ghostEvent, cancelDrag])

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
    }, [isDragging, handlePointerUp, cancelDrag])

    // Get events for a specific day
    const getEventsForDay = useCallback((day: Date) => {
        const dateStr = moment(day).format("YYYY-MM-DD")

        return events.filter((event) => {
            // During drag, filter out the active event from its original day
            if (isDragging && activeEvent === event.id && ghostEvent && ghostEvent.dayStr !== dateStr) {
                return false
            }

            // Filter events based on activeScheduleUserType and filtered users
            const isSameDay = moment(event.start).isSame(day, "day")
            if (!isSameDay) return false

            switch (activeScheduleUserType) {
                case "clients":
                    return event.clientId && filteredUsers.clients.includes(event.clientId)
                case "careWorker":
                    return event.resourceId && filteredUsers.careWorkers.includes(event.resourceId)
                case "officeStaff":
                    return event.resourceId && filteredUsers.officeStaff.includes(event.resourceId)
                default:
                    return false
            }
        })
    }, [events, isDragging, activeEvent, ghostEvent, activeScheduleUserType, filteredUsers])

    // Toggle expanded day view
    const toggleDayExpand = useCallback((dateStr: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setExpandedDays((prev) => ({
            ...prev,
            [dateStr]: !prev[dateStr],
        }))
    }, [])

    // Format event time with precise minutes
    const formatEventTime = useCallback((event: AppointmentEvent) => {
        return moment(event.start).format("h:mm A")
    }, [])

    // Format date and time for tooltip
    const formatDateTimeForTooltip = useCallback((date: Date | string, event: AppointmentEvent) => {
        const dateObj = date instanceof Date ? date : new Date(date)
        const dateText = moment(dateObj).format("ddd, MMM D")
        const timeText = moment(event.start instanceof Date ? event.start : new Date(event.start)).format("h:mm A")
        return { dateText, timeText }
    }, [])

    // Get event background color based on type
    const getEventBackground = (event: AppointmentEvent, isActive = false, isHovered = false) => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as keyof typeof styles
            const styles = {
                annual_leave: {
                    bg: 'bg-green-50',
                    hoverBg: 'bg-green-100',
                    activeBg: 'bg-green-200',
                    text: 'text-green-700'
                },
                sick_leave: {
                    bg: 'bg-red-50',
                    hoverBg: 'bg-red-100',
                    activeBg: 'bg-red-200',
                    text: 'text-red-700'
                },
                public_holiday: {
                    bg: 'bg-blue-50',
                    hoverBg: 'bg-blue-100',
                    activeBg: 'bg-blue-200',
                    text: 'text-blue-700'
                },
                unpaid_leave: {
                    bg: 'bg-gray-50',
                    hoverBg: 'bg-gray-100',
                    activeBg: 'bg-gray-200',
                    text: 'text-gray-700'
                },
                maternity_leave: {
                    bg: 'bg-pink-50',
                    hoverBg: 'bg-pink-100',
                    activeBg: 'bg-pink-200',
                    text: 'text-pink-700'
                },
                paternity_leave: {
                    bg: 'bg-purple-50',
                    hoverBg: 'bg-purple-100',
                    activeBg: 'bg-purple-200',
                    text: 'text-purple-700'
                },
                bereavement_leave: {
                    bg: 'bg-brown-50',
                    hoverBg: 'bg-brown-100',
                    activeBg: 'bg-brown-200',
                    text: 'text-brown-700'
                },
                emergency_leave: {
                    bg: 'bg-orange-50',
                    hoverBg: 'bg-orange-100',
                    activeBg: 'bg-orange-200',
                    text: 'text-orange-700'
                },
                medical_appointment: {
                    bg: 'bg-cyan-50',
                    hoverBg: 'bg-cyan-100',
                    activeBg: 'bg-cyan-200',
                    text: 'text-cyan-700'
                },
                toil: {
                    bg: 'bg-amber-50',
                    hoverBg: 'bg-amber-100',
                    activeBg: 'bg-amber-200',
                    text: 'text-amber-700'
                },
                default: {
                    bg: 'bg-gray-50',
                    hoverBg: 'bg-gray-100',
                    activeBg: 'bg-gray-200',
                    text: 'text-gray-700'
                }
            }
            const style = styles[leaveType] || styles.default
            if (spaceTheme) {
                const bgColor = style.bg.replace('bg-', 'bg-').replace('-50', '-900/30')
                const hoverColor = style.hoverBg.replace('bg-', 'bg-').replace('-100', '-900/40')
                const activeColor = style.activeBg.replace('bg-', 'bg-').replace('-200', '-900/60')
                return {
                    bg: isActive ? activeColor : isHovered ? hoverColor : bgColor,
                    text: style.text.replace('text-', 'text-').replace('-700', '-300')
                }
            }
            return {
                bg: isActive ? style.activeBg : isHovered ? style.hoverBg : style.bg,
                text: style.text
            }
        }

        const type = event.type.toLowerCase()
        const styles = eventTypeStyles[type] || eventTypeStyles.meeting || {
            bg: 'bg-gray-50',
            hoverBg: 'bg-gray-100',
            activeBg: 'bg-gray-200',
            text: 'text-gray-700'
        }
        if (spaceTheme) {
            const bgColor = styles.bg.replace('bg-', 'bg-').replace('-50', '-900/30')
            const hoverColor = styles.hoverBg.replace('bg-', 'bg-').replace('-100', '-900/40')
            const activeColor = styles.activeBg.replace('bg-', 'bg-').replace('-200', '-900/60')
            return {
                bg: isActive ? activeColor : isHovered ? hoverColor : bgColor,
                text: 'text-white'
            }
        }
        return {
            bg: isActive ? styles.activeBg : isHovered ? styles.hoverBg : styles.bg,
            text: 'text-blue-800'
        }
    }



    // Get event icon based on type
    const getEventIcon = useCallback((event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            switch (event.leaveType) {
                case "ANNUAL_LEAVE":
                    return <Calendar className="h-3.5 w-3.5" />
                case "SICK_LEAVE":
                    return <Heart className="h-3.5 w-3.5" />
                case "PUBLIC_HOLIDAY":
                    return <Flag className="h-3.5 w-3.5" />
                case "UNPAID_LEAVE":
                    return <DollarSign className="h-3.5 w-3.5" />
                case "MATERNITY_LEAVE":
                    return <Baby className="h-3.5 w-3.5" />
                case "PATERNITY_LEAVE":
                    return <User className="h-3.5 w-3.5" />
                case "BEREAVEMENT_LEAVE":
                    return <Heart className="h-3.5 w-3.5" />
                case "EMERGENCY_LEAVE":
                    return <AlertTriangle className="h-3.5 w-3.5" />
                case "MEDICAL_APPOINTMENT":
                    return <Stethoscope className="h-3.5 w-3.5" />
                case "TOIL":
                    return <Clock className="h-3.5 w-3.5" />
                default:
                    return <Calendar className="h-3.5 w-3.5" />
            }
        }

        switch (event.type) {
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
    }, [])

    // Get staff color and name
    const getStaffInfo = useCallback((event: AppointmentEvent) => {
        const staffMember = displayStaffMembers.find((s) => s.id === event.resourceId)
        const staffName = staffMember ? `${staffMember.fullName}` : "Staff"
        return { staffName }
    }, [displayStaffMembers])

    // Find day cell under pointer with grid-aligned snapping
    const findDayUnderPointer = useCallback((clientX: number, clientY: number): { dateStr: string; element: HTMLElement } | null => {
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
            const firstCell = sortedCells[0]
            if (firstCell) {
                return {
                    dateStr: firstCell.dateStr,
                    element: firstCell.element,
                }
            }
        }

        return null
    }, [])

    // Handle drag start
    const handleDragStart = useCallback((eventId: string, _e: MouseEvent | PointerEvent | TouchEvent) => {
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
    }, [displayEvents, formatDateTimeForTooltip])

    // Handle drag
    const handleDrag = useCallback((eventId: string, info: any) => {
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
    }, [isDragging, activeEvent, displayEvents, eventBeingDragged, findDayUnderPointer, highlightedDay, formatDateTimeForTooltip])

    // Handle drag end with precise grid snapping
    const handleDragEnd = useCallback((eventId: string, info: any) => {
        document.body.style.cursor = ""

        if (!isDragging || !activeEvent || !displayEvents[eventId] || !eventBeingDragged) {
            cleanupDragState()
            return
        }

        // Get pointer position
        const clientX = info.point.x
        const clientY = info.point.y

        // Find which day the event was dropped on
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

        // Only update if the event matches the activeScheduleUserType
        const shouldUpdate = (() => {
            switch (activeScheduleUserType) {
                case "clients":
                    return updatedEvent.clientId && clients.some(client => client.id === updatedEvent.clientId)
                case "careWorker":
                    return updatedEvent.resourceId && careworkers.some(worker => worker.id === updatedEvent.resourceId)
                case "officeStaff":
                    return updatedEvent.resourceId && officeStaff.some(staff => staff.id === updatedEvent.resourceId)
                default:
                    return false
            }
        })()

        if (shouldUpdate) {
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
        } else {
            toast.error("Cannot move event to this view")
        }

        // Clean up drag state
        cleanupDragState()
    }, [isDragging, activeEvent, displayEvents, eventBeingDragged, findDayUnderPointer, cancelDrag, cleanupDragState, onEventUpdate, activeScheduleUserType, clients, careworkers, officeStaff])

    // Handle click on a day cell
    const handleDayClick = useCallback((day: Date) => {
        if (!isDragging) {
            onDateSelect(day)
        }
    }, [isDragging, onDateSelect])

    // Handle click on an event
    const handleEventClick = useCallback((event: AppointmentEvent, e: React.MouseEvent) => {
        if (!isDragging) {
            e.stopPropagation()
            onSelectEvent(event)
        }
    }, [isDragging, onSelectEvent])

    const tooltipClass = spaceTheme
        ? "bg-slate-800 text-white border border-slate-700"
        : "bg-white text-black border border-gray-200"

    const getEventDuration = useCallback((event: AppointmentEvent) => {
        const duration = getEventDurationInMinutes(event)
        if (duration < 60) {
            return `${duration} min`
        }
        const hours = Math.floor(duration / 60)
        const minutes = duration % 60
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }, [getEventDurationInMinutes])

    // Render event component
    const renderEvent = useCallback((event: AppointmentEvent, _isExpanded: boolean) => {
        const isActive = activeEvent === event.id
        const isHovered = hoveredEvent === event.id
        const displayEvent = displayEvents[event.id] || event
        const { staffName } = getStaffInfo(displayEvent)
        const eventIcon = getEventIcon(displayEvent)

        return (
            <div
                key={event.id}
                ref={(el) => {
                    if (el) eventRefs.current[event.id] = el
                }}
                className={cn(
                    "absolute rounded-lg text-xs p-2 cursor-grab max-w-full",
                    getEventBackground(event, isActive, isHovered).bg,
                    event.isLeaveEvent ? "border-l-4" : "border-l-2",
                    event.isLeaveEvent ? "border-l-" + event.color : "border-l-blue-600",
                    "min-w-0",
                )}
                style={{
                    borderLeftWidth: event.isLeaveEvent ? "4px" : "2px",
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
                    width: "calc(100% - 4px)", // Subtract padding
                    margin: "2px",
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
                    <div className={cn(
                        "flex items-center gap-1 mb-1",
                        event.isLeaveEvent ? "text-" + event.color : "text-blue-800"
                    )}>
                        {eventIcon}
                        <span className="font-medium truncate">{displayEvent.title}</span>
                    </div>

                    <div className={cn(
                        "text-[10px]",
                        event.isLeaveEvent ? "text-" + event.color : "text-blue-800"
                    )}>
                        {moment(displayEvent.start).format("h:mm A")} - {moment(displayEvent.end).format("h:mm A")}
                    </div>


                </div>
            </div>
        )
    }, [
        activeEvent,
        hoveredEvent,
        displayEvents,
        getStaffInfo,
        getEventIcon,
        getEventBackground,
        spaceTheme,
        handleDragStart,
        handleDrag,
        handleDragEnd,
        handleEventClick,
        getEventTypeLabel,
        getEventDuration,
        isDragging,
        ghostEvent,
        eventBeingDragged,
        formatEventTime
    ])

    // Render ghost event
    const renderGhostEvent = useCallback((dateStr: string) => {
        if (!isDragging || !ghostEvent || ghostEvent.dayStr !== dateStr || !activeEvent || !eventBeingDragged) {
            return null
        }

        return (
            <div
                className={cn(
                    "text-xs p-1.5 rounded-md border-2 border-dashed",
                    getEventBackground(eventBeingDragged, false, false).bg,
                    spaceTheme ? "border-slate-500/80 bg-slate-900/30" : "border-gray-500/80 bg-gray-100/70",
                )}
                style={{
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
        )
    }, [isDragging, ghostEvent, activeEvent, eventBeingDragged, getEventBackground, spaceTheme, getStaffInfo, formatEventTime])

    // Update the calculateVisibleEvents function
    const calculateVisibleEvents = useCallback((dayEvents: AppointmentEvent[]) => {
        const MAX_EVENTS = 4
        const hasMore = dayEvents.length > MAX_EVENTS
        const visibleEvents = dayEvents.slice(0, MAX_EVENTS)
        const remainingCount = dayEvents.length - MAX_EVENTS

        return {
            visibleEvents,
            hasMore,
            remainingCount
        }
    }, [])

    // Add effect to measure cell heights
    useEffect(() => {
        const updateCellHeights = () => {
            const heights: Record<string, number> = {}
            Object.entries(cellRefs.current).forEach(([dateStr, element]) => {
                if (element) {
                    heights[dateStr] = element.getBoundingClientRect().height
                }
            })
            setCellHeights(heights)
        }

        // Initial measurement
        updateCellHeights()

        // Update on window resize
        window.addEventListener('resize', updateCellHeights)
        return () => window.removeEventListener('resize', updateCellHeights)
    }, [calendar])

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col p-4">
            <div className="flex flex-col flex-1 h-full">
                {/* Calendar grid */}
                <div className="h-full flex flex-col border rounded-lg" ref={calendarRef}>
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
                    <div className="flex-1 overflow-y-auto h-full">
                        <div
                            className={`grid grid-cols-7 ${spaceTheme ? "bg-black" : "bg-white"} rounded-b-lg shadow-sm`}
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

                                // Calculate visible events
                                const { visibleEvents, hasMore, remainingCount } = isExpanded
                                    ? {
                                        visibleEvents: dayEvents,
                                        hasMore: false,
                                        remainingCount: 0
                                    }
                                    : calculateVisibleEvents(dayEvents)

                                return (
                                    <div
                                        key={i}
                                        ref={(el) => {
                                            if (el) {
                                                cellRefs.current[dateStr] = el
                                                dayRefs.current[dateStr] = el
                                            }
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
                                            hasEvents ? "min-h-[200px]" : "min-h-[60px]",
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
                                        <div className="mt-1 space-y-1.5 overflow-hidden">
                                            {visibleEvents.map((event) => renderEvent(event, isExpanded ?? false))}

                                            {/* Ghost event placeholder during drag */}
                                            {renderGhostEvent(dateStr)}

                                            {/* Show "more" button if not expanded */}
                                            {hasMore && (
                                                <button
                                                    className={cn(
                                                        "w-full text-[9px] flex items-center justify-center gap-1.5 px-2 py-[2px] rounded-full font-medium transition-colors",
                                                        spaceTheme
                                                            ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-zinc-100"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                                                    )}
                                                    onClick={(e) => toggleDayExpand(dateStr, e)}
                                                >
                                                    <ChevronDown className="h-3 w-3" />
                                                    View {remainingCount} more events
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {dragTooltip && (
                <div
                    className={`fixed z-50 px-2 py-1 rounded-md text-xs font-medium shadow-sm ${tooltipClass}`}
                    style={{
                        top: "12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    {dragTooltip.date} • {dragTooltip.time}
                </div>
            )}
        </div>
    )
}

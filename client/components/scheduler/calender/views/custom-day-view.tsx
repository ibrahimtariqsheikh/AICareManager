"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import moment from "moment"
import { toast } from "sonner"
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
    MoreVertical,
    Maximize2,
    Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/state/redux"

// Define types
export interface AppointmentEvent {
    id: string
    title: string
    start: Date
    end: Date
    type: string
    clientId?: string
    date?: Date
    resourceId?: string
    status?: string
    notes?: string
    chargeRate?: number
    color?: string
}

export interface Client {
    id: string
    firstName: string
    lastName: string
    profile?: {
        avatarUrl?: string
    }
}

interface CustomDayViewProps {
    date: Date
    events: AppointmentEvent[]
    onSelectEvent: (event: AppointmentEvent) => void
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
    min?: Date
    max?: Date
    clients?: Client[] // Make clients a prop instead of using Redux
    spaceTheme?: boolean
    showSidebar?: boolean
    slotHeight?: number
    minutesPerSlot?: number
    sidebarMode?: string
    initialHeight?: number | string
    initialWidth?: number | string
    staffMembers?: any[]
    getEventDurationInMinutes?: (event: any) => number
}

export function CustomDayView({
    date,
    events,
    onSelectEvent,
    onEventUpdate,
    min = new Date(new Date().setHours(7, 0, 0)),
    max = new Date(new Date().setHours(19, 0, 0)),
    clients: propClients,
    spaceTheme = false,
    showSidebar = true,
    slotHeight = 60,
    minutesPerSlot = 30,
    initialHeight = "600px",
    initialWidth = "100%",
    staffMembers = [],
    getEventDurationInMinutes = (event) => {
        const start = moment(event.start)
        const end = moment(event.end)
        return end.diff(start, "minutes")
    },
}: CustomDayViewProps) {
    // Get clients from props or Redux as fallback
    const reduxClients = useAppSelector((state) => state.user.clients || [])
    const clients = propClients || reduxClients

    // Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const resizeHandleRef = useRef<HTMLDivElement>(null)
    const calendarContainerRef = useRef<HTMLDivElement>(null)

    // State
    const [eventPositions, setEventPositions] = useState<Record<string, any>>({})
    const [displayEvents, setDisplayEvents] = useState<Record<string, AppointmentEvent>>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; time: string } | null>(null)
    const [calendarHeight, setCalendarHeight] = useState<string | number>(initialHeight)
    const [calendarWidth, setCalendarWidth] = useState<string | number>(initialWidth)
    const [isResizing, setIsResizing] = useState<boolean>(false)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [originalDimensions, setOriginalDimensions] = useState<{ height: string | number; width: string | number }>({
        height: initialHeight,
        width: initialWidth,
    })

    // Constants
    const startHour = min.getHours()
    const endHour = max.getHours()
    const slotsPerHour = 60 / minutesPerSlot
    const slotWidth = 100 // Width of each time slot in pixels
    const rowHeight = 80 // Fixed height for each client row

    // Generate time slots
    const timeSlots = Array.from({ length: (endHour - startHour) * slotsPerHour + 1 }, (_, i) => {
        const hour = Math.floor(i / slotsPerHour) + startHour
        const minutes = (i % slotsPerHour) * minutesPerSlot
        return new Date(new Date(date).setHours(hour, minutes, 0, 0))
    })

    const totalWidth = timeSlots.length * slotWidth

    // Group events by client
    const eventsByClient = (() => {
        const clientEvents: Record<string, AppointmentEvent[]> = {
            unallocated: [],
        }

        // Initialize with empty arrays for all clients
        clients.forEach((client) => {
            clientEvents[client.id] = []
        })

        // Filter events for the current day and group by client
        events
            .filter((event) => moment(event.start).isSame(date, "day"))
            .forEach((event) => {
                if (event.clientId && clientEvents[event.clientId]) {
                    clientEvents[event.clientId].push(event)
                } else {
                    clientEvents["unallocated"].push(event)
                }
            })

        return clientEvents
    })()

    // Initialize display events
    useEffect(() => {
        const eventMap: Record<string, AppointmentEvent> = {}
        events
            .filter((event) => moment(event.start).isSame(date, "day"))
            .forEach((event) => {
                const processedEvent = {
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    date: event.date ? new Date(event.date) : new Date(event.start),
                }
                eventMap[event.id] = processedEvent
            })
        setDisplayEvents(eventMap)
    }, [events, date])

    // Calculate positions for events
    useEffect(() => {
        if (!timelineRef.current) return

        const positions: Record<string, any> = {}

        Object.values(displayEvents).forEach((event) => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            // Calculate left position and width
            const startMinutes = (eventStart.hours() - startHour) * 60 + eventStart.minutes()
            const endMinutes = (eventEnd.hours() - startHour) * 60 + eventEnd.minutes()

            const left = (startMinutes / minutesPerSlot) * slotWidth
            const width = ((endMinutes - startMinutes) / minutesPerSlot) * slotWidth

            // Store position data
            positions[event.id] = {
                left,
                width: Math.max(width, 50), // Minimum width for visibility
                originalEvent: { ...event },
                startMinutes,
                durationMinutes: endMinutes - startMinutes,
            }
        })

        setEventPositions(positions)
    }, [displayEvents, startHour, minutesPerSlot, slotWidth])

    // Watch for changes in initialHeight and initialWidth props
    useEffect(() => {
        setCalendarHeight(initialHeight)
        setCalendarWidth(initialWidth)
    }, [initialHeight, initialWidth])

    // Sync header with content scroll
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current && headerRef.current) {
                headerRef.current.scrollLeft = containerRef.current.scrollLeft
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("scroll", handleScroll)
            return () => container.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // Auto-scroll to current time on initial load
    useEffect(() => {
        const now = new Date()
        if (moment(now).isSame(date, "day") && containerRef.current) {
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()
            const minutesSinceStart = (currentHour - startHour) * 60 + currentMinute
            const scrollPos = (minutesSinceStart / minutesPerSlot) * slotWidth - 200
            containerRef.current.scrollLeft = Math.max(0, scrollPos)
        }
    }, [date, startHour, slotWidth, minutesPerSlot])

    // Add custom scrollbar style
    useEffect(() => {
        const styleId = "calendar-scrollbar-style"
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style")
            style.id = styleId
            style.textContent = `
        .calendar-scrollbar::-webkit-scrollbar {
          height: 8px;
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
        
        /* Add resize styles */
        .resize-handle {
          position: absolute;
          z-index: 30;
          cursor: nwse-resize;
        }
        .resize-handle:hover::before,
        .resize-handle:active::before {
          opacity: 1;
        }
        .resize-handle::before {
          content: '';
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 10px;
          height: 10px;
          border-right: 2px solid ${spaceTheme ? "#64748b" : "#94a3b8"};
          border-bottom: 2px solid ${spaceTheme ? "#64748b" : "#94a3b8"};
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        
        /* Add client row separator */
        .client-row {
          border-bottom: 2px solid ${spaceTheme ? "#1e293b" : "#e2e8f0"};
          position: relative;
          overflow: visible;
        }
        
        /* Add client row hover effect */
        .client-row:hover {
          background-color: ${spaceTheme ? "rgba(30, 41, 59, 0.3)" : "rgba(241, 245, 249, 0.5)"};
        }
        
        /* Add client name label */
        .client-name-label {
          position: absolute;
          left: 8px;
          top: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          color: ${spaceTheme ? "#94a3b8" : "#64748b"};
          z-index: 5;
          pointer-events: none;
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
    }, [spaceTheme])

    // Resize handlers
    const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
        e.preventDefault()
        setIsResizing(true)
        document.body.style.cursor = "nwse-resize"
        document.addEventListener("mousemove", handleResize)
        document.addEventListener("mouseup", handleResizeEnd)
    }, [])

    const handleResize = useCallback(
        (e: MouseEvent) => {
            if (!calendarContainerRef.current || !isResizing) return

            const container = calendarContainerRef.current.getBoundingClientRect()
            const newWidth = Math.max(600, e.clientX - container.left)
            const newHeight = Math.max(400, e.clientY - container.top)

            setCalendarWidth(newWidth)
            setCalendarHeight(newHeight)

            // Force re-render for event positions
            setEventPositions((prev) => ({ ...prev }))
        },
        [isResizing],
    )

    const handleResizeEnd = useCallback(() => {
        setIsResizing(false)
        document.body.style.cursor = ""
        document.removeEventListener("mousemove", handleResize)
        document.removeEventListener("mouseup", handleResizeEnd)
    }, [handleResize])

    // Set up resize handlers
    useEffect(() => {
        const resizeHandle = resizeHandleRef.current
        if (resizeHandle) {
            resizeHandle.addEventListener("mousedown", handleResizeStart)
        }

        return () => {
            if (resizeHandle) {
                resizeHandle.removeEventListener("mousedown", handleResizeStart)
            }
            document.removeEventListener("mousemove", handleResize)
            document.removeEventListener("mouseup", handleResizeEnd)
        }
    }, [handleResizeStart, handleResize, handleResizeEnd])

    // Toggle fullscreen function
    const toggleFullscreen = useCallback(() => {
        if (!isFullscreen) {
            // Save current dimensions before going fullscreen
            setOriginalDimensions({
                height: calendarHeight,
                width: calendarWidth,
            })

            // Set to fullscreen
            setCalendarHeight("100vh")
            setCalendarWidth("100%")
            setIsFullscreen(true)
        } else {
            // Restore original dimensions
            setCalendarHeight(originalDimensions.height)
            setCalendarWidth(originalDimensions.width)
            setIsFullscreen(false)
        }

        // Force re-render for event positions
        setEventPositions((prev) => ({ ...prev }))
    }, [isFullscreen, calendarHeight, calendarWidth, originalDimensions])

    // Scroll controls
    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 300
        }
    }

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 300
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

    // Get client name from client ID
    const getClientName = (clientId: string) => {
        if (clientId === "unallocated") return "Unallocated"
        const client = clients.find((c) => c.id === clientId)
        return client ? `${client.firstName} ${client.lastName}` : "Unknown Client"
    }

    // Drag event handlers
    const handleDragStart = (eventId: string, clientId: string) => {
        setActiveEvent(eventId)
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

        // Calculate new time based on drag position
        const newLeft = position.left + info.offset.x
        const minutesFromStart = Math.round((newLeft / slotWidth) * minutesPerSlot)
        const timeText = formatTimeFromMinutes(minutesFromStart)

        setDragTooltip({ eventId, time: timeText })
    }

    const handleDragEnd = (eventId: string, info: any, clientId: string) => {
        const position = eventPositions[eventId]
        if (!position) return

        document.body.style.cursor = ""

        // Calculate new time based on final position
        const newLeft = position.left + info.offset.x
        const minutesFromStart = Math.round((newLeft / slotWidth) * minutesPerSlot)

        // Ensure time is within bounds
        const clampedMinutes = Math.max(
            0,
            Math.min(minutesFromStart, (endHour - startHour) * 60 - position.durationMinutes),
        )

        const hours = Math.floor(clampedMinutes / 60) + startHour
        const minutes = clampedMinutes % 60

        // Create new dates
        const newStartDate = moment(date).hour(hours).minute(minutes).second(0).millisecond(0)
        const durationInMinutes = position.durationMinutes
        const newEndDate = moment(newStartDate).add(durationInMinutes, "minutes")

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
        const updatedLeft = (clampedMinutes / minutesPerSlot) * slotWidth
        setEventPositions((prev) => ({
            ...prev,
            [eventId]: {
                ...prev[eventId],
                left: updatedLeft,
                startMinutes: clampedMinutes,
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
                    return isActive ? "bg-purple-900/60" : isHovered ? "bg-purple-900/40" : "bg-purple-900/30"
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
                    return isActive ? "bg-purple-100" : isHovered ? "bg-purple-50/80" : "bg-purple-50"
                case "IN_PERSON":
                    return isActive ? "bg-amber-100" : isHovered ? "bg-amber-50/80" : "bg-amber-50"
                case "AUDIO_CALL":
                    return isActive ? "bg-red-100" : isHovered ? "bg-red-50/80" : "bg-red-50"
                default:
                    return isActive ? "bg-gray-100" : isHovered ? "bg-gray-50/80" : "bg-gray-50"
            }
        }
    }

    const getEventBorderColor = (event: AppointmentEvent) => {
        switch (event.type) {
            case "HOME_VISIT":
                return "border-green-300"
            case "VIDEO_CALL":
                return "border-blue-300"
            case "HOSPITAL":
                return "border-purple-300"
            case "IN_PERSON":
                return "border-amber-300"
            case "AUDIO_CALL":
                return "border-red-300"
            default:
                return "border-gray-300"
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
    const clientSidebarClass = spaceTheme ? "bg-slate-900 border-slate-700" : "bg-gray-50 border-gray-200"
    const resizeButtonClass = spaceTheme
        ? "absolute bottom-3 right-3 z-30 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-1.5 shadow-md"
        : "absolute bottom-3 right-3 z-30 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-md"

    return (
        <div
            ref={calendarContainerRef}
            className="relative p-4"
            style={{
                width: calendarWidth,
                height: calendarHeight,
                maxWidth: "100%",
                transition: isResizing ? "none" : "width 0.3s, height 0.3s",
                position: "relative",
            }}
        >
            {/* Date header */}
            <div className="flex justify-center items-center mb-3">
                <h3 className={`text-lg font-semibold text-center px-3 py-1.5 rounded-full ${headerTextClass}`}>
                    {moment(date).format("dddd, MMMM D, YYYY")}
                </h3>
            </div>

            <div className="flex flex-col flex-1 h-full overflow-hidden" style={{ height: "calc(100% - 60px)" }}>
                {/* Scroll controls and information display */}
                <div className="flex justify-between items-center mb-3 gap-2">
                    <div className="flex items-center gap-2">
                        <div
                            className={`text-xs ${spaceTheme ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"
                                } flex items-center gap-1 px-2.5 py-1 rounded-full`}
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {Object.values(displayEvents).length} {Object.values(displayEvents).length === 1 ? "event" : "events"}
                            </span>
                        </div>

                        <div
                            className={`text-xs ${spaceTheme ? "text-slate-400 bg-slate-800/50" : "text-gray-500 bg-gray-100/70"
                                } flex items-center gap-1 px-3 py-1.5 rounded-full`}
                        >
                            <Clock className="h-3 w-3" />
                            <span>
                                {startHour}:00 - {endHour}:00
                            </span>
                        </div>

                        {/* Display current width and height */}
                        <div
                            className={`text-xs ${spaceTheme ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"
                                } flex items-center gap-1 px-2.5 py-1 rounded-full`}
                        >
                            <span>
                                {typeof calendarWidth === "number" ? `${Math.round(calendarWidth)}px` : calendarWidth} ×
                                {typeof calendarHeight === "number" ? `${Math.round(calendarHeight)}px` : calendarHeight}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={spaceTheme ? "outline" : "secondary"}
                            size="sm"
                            onClick={scrollLeft}
                            className={`flex items-center gap-1 ${spaceTheme ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800" : ""
                                }`}
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span>Earlier</span>
                        </Button>

                        <Button
                            variant={spaceTheme ? "outline" : "secondary"}
                            size="sm"
                            onClick={scrollRight}
                            className={`flex items-center gap-1 ${spaceTheme ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800" : ""
                                }`}
                        >
                            <span>Later</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Main timeline container */}
                <div className={`flex flex-1 border rounded-xl shadow-md ${timelineClass} h-full overflow-hidden`}>
                    {/* Client sidebar */}
                    {showSidebar && (
                        <div className={`w-48 shrink-0 border-r ${clientSidebarClass} overflow-y-auto`}>
                            {/* Unallocated section */}
                            <div className={`p-3 border-b ${clientSidebarClass} sticky top-0 z-10`}>
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Unallocated</div>
                                    <div className={`text-xs px-1.5 py-0.5 rounded-full ${spaceTheme ? "bg-slate-800" : "bg-gray-200"}`}>
                                        {eventsByClient["unallocated"]?.length || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Clients */}
                            {clients.map((client) => (
                                <div key={client.id} className={`p-3 border-b ${clientSidebarClass} hover:bg-opacity-80`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage
                                                    src={client.profile?.avatarUrl || "/placeholder.svg"}
                                                    alt={`${client.firstName} ${client.lastName}`}
                                                />
                                                <AvatarFallback>
                                                    {client.firstName?.[0]}
                                                    {client.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium truncate">
                                                {client.firstName} {client.lastName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div
                                                className={`text-xs px-1.5 py-0.5 rounded-full ${spaceTheme ? "bg-slate-800" : "bg-gray-200"}`}
                                            >
                                                {eventsByClient[client.id]?.length || 0}
                                            </div>
                                            <button className="text-gray-500 hover:text-gray-700">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Timeline section */}
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                        {/* Fixed time header - separate scrollable container */}
                        <div
                            ref={headerRef}
                            className="calendar-scrollbar overflow-x-hidden"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            <div
                                className={`sticky top-0 z-10 border-b ${spaceTheme ? "border-slate-800 bg-slate-900/95" : "border-gray-200 bg-white/95"
                                    } backdrop-blur-sm`}
                            >
                                <div className="flex">
                                    {timeSlots
                                        .filter((_, i) => i % slotsPerHour === 0)
                                        .map((time, i) => (
                                            <div
                                                key={i}
                                                className={`flex-shrink-0 ${timeLabelsClass} text-xs font-medium px-2 py-2 text-center border-r ${gridLineClass}`}
                                                style={{ width: `${slotWidth * slotsPerHour}px` }}
                                            >
                                                {moment(time).format("h:mm A")}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Scrollable timeline content */}
                        <div
                            ref={containerRef}
                            className="overflow-x-auto overflow-y-auto calendar-scrollbar flex-1"
                            style={{ height: "calc(100% - 33px)" }}
                            onScroll={() => {
                                if (headerRef.current && containerRef.current) {
                                    headerRef.current.scrollLeft = containerRef.current.scrollLeft
                                }
                            }}
                        >
                            <div ref={timelineRef} className="relative" style={{ width: `${totalWidth}px`, minHeight: "100%" }}>
                                {/* Vertical grid lines */}
                                {timeSlots.map((time, i) => {
                                    const isHourMark = i % slotsPerHour === 0
                                    const isHalfHourMark = i % (slotsPerHour / 2) === 0 && !isHourMark

                                    return (
                                        <div
                                            key={i}
                                            className={`absolute top-0 bottom-0 border-r ${isHourMark ? hourLineClass : isHalfHourMark ? halfHourLineClass : gridLineClass}`}
                                            style={{
                                                left: `${i * slotWidth}px`,
                                                borderRightWidth: isHourMark ? "2px" : "1px",
                                                height: "100%",
                                                zIndex: 1,
                                            }}
                                        />
                                    )
                                })}

                                {/* Current time indicator */}
                                {moment(new Date()).isSame(date, "day") && (
                                    <div
                                        className={`absolute top-0 bottom-0 w-0.5 z-20 ${currentTimeClass}`}
                                        style={{
                                            left: `${(((new Date().getHours() - startHour) * 60 + new Date().getMinutes()) / minutesPerSlot) * slotWidth}px`,
                                            height: "100%",
                                        }}
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full ${currentTimeClass} -ml-1.5 shadow-md flex items-center justify-center animate-pulse`}
                                        >
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Client rows with clear boundaries */}
                                <div className="relative" style={{ height: `${(clients.length + 1) * rowHeight}px` }}>
                                    {/* Unallocated row */}
                                    <div
                                        className="client-row absolute w-full border-b-2"
                                        style={{
                                            top: 0,
                                            height: `${rowHeight}px`,
                                            borderColor: spaceTheme ? "#1e293b" : "#e2e8f0",
                                            zIndex: 2,
                                        }}
                                    >
                                        <div className="client-name-label">Unallocated</div>
                                        {eventsByClient["unallocated"].map((event) => {
                                            const pos = eventPositions[event.id]
                                            if (!pos) return null

                                            const isActive = activeEvent === event.id
                                            const isHovered = hoveredEvent === event.id

                                            return (
                                                <motion.div
                                                    key={event.id}
                                                    className={cn(
                                                        "absolute p-2 text-xs rounded-md shadow-md border",
                                                        getEventBackground(event, isActive, isHovered),
                                                        getEventBorderColor(event),
                                                        "cursor-grab active:cursor-grabbing",
                                                    )}
                                                    style={{
                                                        left: `${pos.left || 0}px`,
                                                        width: `${pos.width || 50}px`,
                                                        top: "24px", // Adjusted to make room for client name
                                                        height: `${rowHeight - 32}px`, // Constrain to row height
                                                        zIndex: isActive ? 50 : 10,
                                                        overflow: "hidden",
                                                    }}
                                                    drag="x"
                                                    dragConstraints={timelineRef}
                                                    dragMomentum={false}
                                                    onDragStart={() => handleDragStart(event.id, "unallocated")}
                                                    onDrag={(e, info) => handleDrag(event.id, info)}
                                                    onDragEnd={(e, info) => handleDragEnd(event.id, info, "unallocated")}
                                                    onMouseEnter={() => setHoveredEvent(event.id)}
                                                    onMouseLeave={() => setHoveredEvent(null)}
                                                    onClick={() => onSelectEvent(event)}
                                                    whileDrag={{ scale: 1.05 }}
                                                >
                                                    <div className="flex items-center gap-1 font-medium truncate">
                                                        {getEventIcon(event.type)}
                                                        <span>{event.title}</span>
                                                    </div>
                                                    <div className="text-[10px] mt-1 text-muted-foreground">
                                                        {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>

                                    {/* Client rows */}
                                    {clients.map((client, index) => (
                                        <div
                                            key={client.id}
                                            className="client-row absolute w-full border-b-2"
                                            style={{
                                                top: `${(index + 1) * rowHeight}px`,
                                                height: `${rowHeight}px`,
                                                borderColor: spaceTheme ? "#1e293b" : "#e2e8f0",
                                                zIndex: 2,
                                            }}
                                        >
                                            <div className="client-name-label">
                                                {client.firstName} {client.lastName}
                                            </div>
                                            {eventsByClient[client.id]?.map((event) => {
                                                const pos = eventPositions[event.id]
                                                if (!pos) return null

                                                const isActive = activeEvent === event.id
                                                const isHovered = hoveredEvent === event.id

                                                return (
                                                    <motion.div
                                                        key={event.id}
                                                        className={cn(
                                                            "absolute p-2 text-xs rounded-md shadow-md border",
                                                            getEventBackground(event, isActive, isHovered),
                                                            getEventBorderColor(event),
                                                            "cursor-grab active:cursor-grabbing",
                                                        )}
                                                        style={{
                                                            left: `${pos.left || 0}px`,
                                                            width: `${pos.width || 50}px`,
                                                            top: "24px", // Adjusted to make room for client name
                                                            height: `${rowHeight - 32}px`, // Constrain to row height
                                                            zIndex: isActive ? 50 : 10,
                                                            overflow: "hidden",
                                                        }}
                                                        drag="x"
                                                        dragConstraints={timelineRef}
                                                        dragMomentum={false}
                                                        onDragStart={() => handleDragStart(event.id, client.id)}
                                                        onDrag={(e, info) => handleDrag(event.id, info)}
                                                        onDragEnd={(e, info) => handleDragEnd(event.id, info, client.id)}
                                                        onMouseEnter={() => setHoveredEvent(event.id)}
                                                        onMouseLeave={() => setHoveredEvent(null)}
                                                        onClick={() => onSelectEvent(event)}
                                                        whileDrag={{ scale: 1.05 }}
                                                    >
                                                        <div className="flex items-center gap-1 font-medium truncate">
                                                            {getEventIcon(event.type)}
                                                            <span>{event.title}</span>
                                                        </div>
                                                        <div className="text-[10px] mt-1 text-muted-foreground">
                                                            {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {dragTooltip && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-md text-xs shadow-sm ${tooltipClass}`}
                >
                    {dragTooltip.time}
                </div>
            )}

            {/* Resize Button */}
            <button onClick={toggleFullscreen} className={resizeButtonClass}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Resize Handle */}
            <div ref={resizeHandleRef} className="resize-handle bottom-0 right-0 w-4 h-4" style={{ position: "absolute" }} />
        </div>
    )
}

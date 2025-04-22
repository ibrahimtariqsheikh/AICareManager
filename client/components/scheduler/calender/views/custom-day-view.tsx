"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import moment from "moment"
import { toast } from "sonner"
import { Home, Video, Building2, Phone, User, Calendar, MoreVertical, ChevronDown, Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/state/redux"
import BankNotes from "@/components/icons/bank-notes"
import EventIcon from "@/components/icons/eventicon"
import HomeModern from "@/components/icons/home-modern"
import { AppointmentEvent } from "../types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export interface Client {
    id: string
    fullName: string
    profile?: {
        avatarUrl?: string
    }
}

interface CustomDayViewProps {
    date: Date

    onSelectEvent: (event: AppointmentEvent) => void
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
    min?: Date
    max?: Date
    clients?: Client[]
    spaceTheme?: boolean
    showSidebar?: boolean
    slotHeight?: number
    minutesPerSlot?: number
    initialHeight?: number | string
    initialWidth?: number | string
    staffMembers?: any[]
    getEventDurationInMinutes?: (event: any) => number
    currentView: string
    currentDate?: Date
    onDateChange?: (date: Date) => void
    onViewChange?: (view: "day" | "week" | "month") => void
}

export function CustomDayView({
    date,

    onSelectEvent,
    onEventUpdate,
    min = new Date(new Date().setHours(7, 0, 0)),
    max = new Date(new Date().setHours(19, 0, 0)),
    clients: propClients,
    spaceTheme = false,
    showSidebar = true,
    minutesPerSlot = 30,
    initialHeight = "600px",
    initialWidth = "100%",

}: CustomDayViewProps) {

    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType)
    const reduxClients = useAppSelector((state) => state.user.clients || [])
    const clients = propClients || reduxClients
    const careworkers = useAppSelector((state) => state.user.careWorkers || [])
    const officeStaff = useAppSelector((state) => state.user.officeStaff || [])
    const events = useAppSelector((state) => state.schedule.events || [])

    // Get the appropriate users based on activeScheduleUserType
    const displayUsers = (() => {
        if (activeScheduleUserType === "clients") return clients
        if (activeScheduleUserType === "careWorker") return careworkers
        if (activeScheduleUserType === "officeStaff") return officeStaff
        return []
    })()

    // Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const calendarContainerRef = useRef<HTMLDivElement>(null)

    // State
    const [eventPositions, setEventPositions] = useState<Record<string, any>>({})
    const [displayEvents, setDisplayEvents] = useState<Record<string, AppointmentEvent>>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [, setHoveredEvent] = useState<string | null>(null)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; time: string } | null>(null)
    const [calendarHeight, setCalendarHeight] = useState<string | number>(initialHeight)
    const [calendarWidth, setCalendarWidth] = useState<string | number>(initialWidth)
    const [] = useState<boolean>(false)
    const [] = useState<{ height: string | number; width: string | number }>({
        height: initialHeight,
        width: initialWidth,
    })

    // Constants
    const startHour = min.getHours()
    const endHour = max.getHours()
    const slotsPerHour = 60 / minutesPerSlot
    const slotWidth = 100 // Width of each time slot in pixels

    // Calculate dynamic row height based on calendar height and number of users
    const getRowHeight = () => {
        if (typeof calendarHeight === "number") {
            // Subtract header height (33px) and any other fixed heights
            const availableHeight = calendarHeight - 33
            return Math.max(60, Math.floor(availableHeight / (displayUsers.length + 2 || 1))) // +2 for Labor Costs and Daily Notes
        }
        return 80 // Default height if calendarHeight is not a number
    }

    const rowHeight = getRowHeight()

    // Calculate total height needed based on number of users
    const MIN_HEIGHT = 200 // Minimum height to maintain usability
    const EXTRA_PADDING = 30 // Extra space after last user
    const totalHeight =
        displayUsers.length > 0
            ? (displayUsers.length + 2) * rowHeight + 120 + EXTRA_PADDING // +2 for Labor Costs and Daily Notes, 120px for header and controls + extra padding
            : MIN_HEIGHT // Use minimum height when no users

    // Update calendar height if it's not explicitly set
    useEffect(() => {
        if (typeof initialHeight === "string" && initialHeight === "100%") {
            setCalendarHeight(totalHeight)
        }
    }, [displayUsers.length, rowHeight, initialHeight])

    // Generate time slots
    const timeSlots = Array.from({ length: (endHour - startHour) * slotsPerHour + 1 }, (_, i) => {
        const hour = Math.floor(i / slotsPerHour) + startHour
        const minutes = (i % slotsPerHour) * minutesPerSlot
        return new Date(new Date(date).setHours(hour, minutes, 0, 0))
    })

    const totalWidth = timeSlots.length * slotWidth

    // Group events by user
    const eventsByUser = (() => {
        const userEvents: Record<string, AppointmentEvent[]> = {
            unallocated: [],
        }

        // Initialize with empty arrays for all users
        displayUsers.forEach((user) => {
            userEvents[user.id] = []
        })

        // Filter events for the current day and group by user
        events
            .filter((event) => moment(event.start).isSame(date, "day"))
            .forEach((event) => {
                if (event.clientId && userEvents[event.clientId]) {
                    userEvents[event.clientId]?.push(event)
                } else {
                    userEvents["unallocated"]?.push(event)
                }
            })

        return userEvents
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
        console.log('Display Events:', eventMap)
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

        return () => { } // Ensure a return function exists on all paths
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

    // Smart scroll based on events
    useEffect(() => {
        if (!containerRef.current || !events.length) return

        // Get all events for the current day
        const dayEvents = events.filter(event => moment(event.start).isSame(date, 'day'))

        if (dayEvents.length === 0) return

        // If there are 3 or fewer events, scroll to the first event
        if (dayEvents.length <= 3) {
            const firstEvent = dayEvents.reduce((earliest, current) =>
                moment(current.start).isBefore(moment(earliest.start)) ? current : earliest
            )
            const eventStart = moment(firstEvent.start)
            const minutesSinceStart = (eventStart.hours() - startHour) * 60 + eventStart.minutes()
            const scrollPos = (minutesSinceStart / minutesPerSlot) * slotWidth - 200
            containerRef.current.scrollLeft = Math.max(0, scrollPos)
        } else {
            // For more events, scroll to 7:00 AM
            const scrollPos = (0 / minutesPerSlot) * slotWidth
            containerRef.current.scrollLeft = Math.max(0, scrollPos)
        }
    }, [date, events, startHour, slotWidth, minutesPerSlot])

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

    const router = useRouter()

    // Drag event handlers
    const handleDragStart = (eventId: string, _clientId: string) => {
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

    const handleDragEnd = (eventId: string, info: any, _clientId: string) => {
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
                // Maintain the track and other positioning properties
                track: prev[eventId].track,
                height: prev[eventId].height,
                top: prev[eventId].top,
                totalTracks: prev[eventId].totalTracks,
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



    // Theme-based style classes
    const timelineClass = spaceTheme ? "bg-slate-900" : "bg-gray-50"
    const timeLabelsClass = spaceTheme ? "text-slate-400" : "text-gray-500"
    const currentTimeClass = spaceTheme ? "bg-green-500" : "bg-red-500"
    const gridLineClass = spaceTheme ? "border-slate-800" : "border-gray-200"
    const hourLineClass = spaceTheme ? "border-slate-700" : "border-gray-200"
    const halfHourLineClass = spaceTheme ? "border-slate-800" : "border-gray-100"
    const tooltipClass = spaceTheme
        ? "bg-slate-800 text-white border border-slate-700"
        : "bg-white text-black border border-gray-200"
    const clientSidebarClass = spaceTheme ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-200"

    // Time formatting helpers
    const formatTimeFromMinutes = (minutesFromStart: number) => {
        const hours = Math.floor(minutesFromStart / 60) + startHour
        const minutes = minutesFromStart % 60
        const displayHours = hours % 12 === 0 ? 12 : hours % 12
        const amPm = hours >= 12 ? "PM" : "AM"
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${amPm}`
    }


    return (
        <div
            ref={calendarContainerRef}
            className="relative p-4"
            style={{
                width: calendarWidth,
                height: totalHeight + 50,
                maxWidth: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div className="flex flex-col flex-1" style={{ height: `calc(${totalHeight}px - 60px)` }}>
                {/* Main timeline container */}
                <div className={`flex flex-1 border rounded-xl shadow- ${timelineClass} h-full overflow-hidden`}>
                    {/* User sidebar */}
                    {showSidebar && (
                        <div className={`w-48 shrink-0 border-r ${clientSidebarClass} overflow-y-auto`} style={{ height: "100%" }}>
                            {/* Users */}
                            <div className="h-8 font-medium flex items-center justify-center text-xs gap-2 border-b text-neutral-900">
                                <p>{activeScheduleUserType === "clients" ? "CLIENTS" : activeScheduleUserType === "careWorker" ? "CARE WORKERS" : "OFFICE STAFF"}</p>
                            </div>

                            <div
                                className=" px-6 font-medium flex items-center text-xs gap-2 border-b text-neutral-600"
                                style={{ height: `${rowHeight}px` }}
                            >
                                <div className="flex items-start gap-2 text-neutral-800">
                                    <BankNotes className="h-3.5 w-3.5" />
                                    <span>Labor Costs</span>
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </div>
                            </div>


                            {/* User list */}
                            {displayUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`border-b ${clientSidebarClass} hover:bg-opacity-80`}
                                    style={{
                                        height: `${rowHeight}px`,
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0 12px",
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6 bg-neutral-100">
                                                <AvatarImage
                                                    src={user.profile?.avatarUrl || "/placeholder.svg"}
                                                    alt={`${user.fullName}`}



                                                />
                                                <AvatarFallback className="text-xs font-medium bg-neutral-100">
                                                    {user.fullName?.[0]}

                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex mb-[2px] flex-col justify-start items-start  font-medium">
                                                <span className="text-sm font-medium truncate text-neutral-800">
                                                    {user.fullName}
                                                </span>
                                                <div
                                                    className="text-[13px] text-neutral-500 flex items-center gap-1"
                                                >
                                                    {eventsByUser[user.id]?.length || 0} <EventIcon className="h-4 w-4 block" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button className="text-neutral-500 hover:text-neutral-700">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-fit">
                                                    <div className="border-b border-border" />
                                                    <Button variant="ghost" className="flex justify-start items-center gap-2 text-xs w-32 "
                                                        onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit User
                                                    </Button>
                                                    <div className="border-b border-border" />

                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Timeline section */}
                    <div className="flex-1 relative overflow-hidden flex flex-col" style={{ height: "100%" }}>
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
                                    {timeSlots.map((time, i) => {
                                        const isHourMark = i % slotsPerHour === 0
                                        const isHalfHourMark = i % (slotsPerHour / 2) === 0 && !isHourMark

                                        if (isHourMark || isHalfHourMark) {
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-shrink-0 ${timeLabelsClass} ${isHourMark ? 'text-xs font-medium' : 'text-[10px]'} px-2 py-2 text-center border-r ${gridLineClass}`}
                                                    style={{ width: `${slotWidth * (slotsPerHour / 2)}px` }}
                                                >
                                                    {moment(time).format("h:mm A")}
                                                </div>
                                            )
                                        }
                                        return null
                                    })}
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
                                {timeSlots.map((_time, i) => {
                                    const isHourMark = i % slotsPerHour === 0
                                    const isHalfHourMark = i % (slotsPerHour / 2) === 0 && !isHourMark

                                    return (
                                        <div
                                            key={i}
                                            className={`absolute top-0 bottom-0 border-r ${isHourMark ? hourLineClass : isHalfHourMark ? halfHourLineClass : gridLineClass}`}
                                            style={{
                                                left: `${i * slotWidth}px`,
                                                borderRightWidth: "1.5px",
                                                height: "100%",
                                                zIndex: 1,
                                            }}
                                        />
                                    )
                                })}

                                {/* Labor Costs row grid line */}
                                <div
                                    className={`absolute w-full border-b ${gridLineClass}`}
                                    style={{
                                        top: `${rowHeight}px`,
                                        height: "1.5px",
                                        zIndex: 2,
                                    }}
                                />


                                {/* Daily Notes row grid line */}
                                <div
                                    className={`absolute w-full border-b ${gridLineClass}`}
                                    style={{
                                        top: `${2 * rowHeight}px`,
                                        height: "1.5px",
                                        zIndex: 2,
                                    }}
                                />

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
                                <div className="absolute w-full border-b" style={{ top: `${rowHeight}px`, height: "1px", zIndex: 2 }} />

                                {/* Client rows with clear boundaries */}
                                <div className="relative" style={{ height: `${(displayUsers.length + 2) * rowHeight}px` }}>
                                    {/* Client rows */}
                                    {displayUsers.map((user, _) => (
                                        <div
                                            key={user.id}
                                            className="client-row absolute w-full border-b-2"
                                            style={{
                                                top: `${(0 + 1) * rowHeight}px`,
                                                height: `${rowHeight}px`,
                                                borderColor: spaceTheme ? "#1e293b" : "#e2e8f0",

                                            }}
                                        >


                                            {eventsByUser[user.id]?.map((event) => {
                                                const pos = eventPositions[event.id]
                                                if (!pos) return null

                                                const isActive = activeEvent === event.id

                                                return (
                                                    <motion.div
                                                        key={event.id}
                                                        className={cn(
                                                            "absolute p-2 text-xs rounded-md  border ",
                                                            "bg-blue-50", // Light blue background
                                                            "border-gray-200 border-l-4 border-l-blue-600",
                                                            "cursor-grab active:cursor-grabbing",

                                                        )}
                                                        style={{
                                                            left: `${pos.left || 0}px`,
                                                            width: `${pos.width || 50}px`,
                                                            top: 0,
                                                            height: `${rowHeight - 0}px`,
                                                            zIndex: isActive ? 50 : 10,
                                                            overflow: "hidden",
                                                        }}
                                                        drag="x"
                                                        dragConstraints={timelineRef}
                                                        dragMomentum={false}
                                                        onDragStart={() => handleDragStart(event.id, user.id)}
                                                        onDrag={(_e, info) => handleDrag(event.id, info)}
                                                        onDragEnd={(_e, info) => handleDragEnd(event.id, info, user.id)}
                                                        onMouseEnter={() => setHoveredEvent(event.id)}
                                                        onMouseLeave={() => setHoveredEvent(null)}
                                                        onClick={() => onSelectEvent(event)}
                                                        whileDrag={{ scale: 1.05 }}
                                                    >
                                                        <div className={cn("flex items-center gap-1 font-medium truncate")}>
                                                            <span className="text-blue-800">{getEventIcon(event.type) || <HomeModern className="h-4 w-4" />}</span>
                                                            <span className="text-blue-800">{event.title}</span>
                                                        </div>
                                                        <div className={cn("text-[10px] mt-1 text-blue-800")}>
                                                            {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
                                                        </div>
                                                        <div className="text-xs font-semibold text-blue-800 flex flex-row items-center gap-1 justify-start mt-1"><User className="h-3.5 w-3.5" /><div className="text-blue-800">{event.careWorker?.fullName}</div>  </div>
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
            {
                dragTooltip && (
                    <div
                        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-md text-xs shadow-sm ${tooltipClass}`}
                    >
                        {dragTooltip.time}
                    </div>
                )
            }
        </div >
    )
}

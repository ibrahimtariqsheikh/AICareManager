"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"
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
    ArrowUpDown,
} from "lucide-react"
import { Button } from "../../../ui/button"
import { cn } from "../../../../lib/utils"
import { toast } from "sonner"
import type { AppointmentEvent } from "../types"
import { getStaffColor } from "../calender-utils"

// ==============================
// TYPES & INTERFACES
// ==============================

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
    sidebarMode?: any
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
    showSidebar = true,
}: CustomDayViewProps) {
    // ==============================
    // STATE & REFS
    // ==============================
    const containerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [eventPositions, setEventPositions] = useState<{ [key: string]: any }>({})
    const [displayEvents, setDisplayEvents] = useState<{ [key: string]: AppointmentEvent }>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; time: string } | null>(null)
    const eventRefs = useRef<{ [key: string]: HTMLElement }>({})

    // ==============================
    // CONSTANTS & GRID CALCULATIONS
    // ==============================
    const startHour = min.getHours()
    const endHour = max.getHours()
    const slotHeight = 12 // Height in pixels for each 10-minute slot
    const minutesPerSlot = 10

    // Generate time slots for the day
    const timeSlots = useMemo(() => {
        const slotCount = (endHour - startHour) * 6 + 1 // 6 slots per hour (10 min per slot)
        return Array.from({ length: slotCount }, (_, i) => {
            const hour = Math.floor(i / 6) + startHour
            const minutes = (i % 6) * minutesPerSlot
            return new Date(new Date(date).setHours(hour, minutes, 0, 0))
        })
    }, [date, startHour, endHour])

    const totalHeight = timeSlots.length * slotHeight

    // Filter events for the current day
    const dayEvents = useMemo(() => {
        console.log('Filtering events for date:', date.toISOString());
        console.log('Total events:', events.length);

        const filteredEvents = events.filter((event) => {
            const eventDate = moment(event.start);
            const isSameDay = eventDate.isSame(date, "day");
            console.log('Event:', event.id, 'Date:', eventDate.format(), 'Is same day:', isSameDay);
            return isSameDay;
        });

        console.log('Filtered events for day:', filteredEvents.length);
        return filteredEvents;
    }, [events, date]);

    // ==============================
    // EFFECTS & DATA INITIALIZATION
    // ==============================

    // Initialize display events
    useEffect(() => {
        console.log('Initializing display events for day view');
        const eventMap: { [key: string]: AppointmentEvent } = {}
        dayEvents.forEach((event) => {
            // Ensure dates are properly parsed
            const processedEvent = {
                ...event,
                start: moment(event.start).toDate(),
                end: moment(event.end).toDate(),
                date: moment(event.date).toDate(),
            };
            console.log('Processing event:', event.id, 'Start:', processedEvent.start.toISOString());
            eventMap[event.id] = processedEvent;
        });
        setDisplayEvents(eventMap);
    }, [dayEvents]);

    // Calculate positions for events
    useEffect(() => {
        if (!timelineRef.current) return;

        try {
            console.log('Calculating positions for events');
            const positions: { [key: string]: any } = {};
            const containerWidth = timelineRef.current.clientWidth - 60; // Subtract time label width

            // Sort events by start time to handle overlaps properly
            const sortedEvents = [...dayEvents].sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf());
            console.log('Sorted events:', sortedEvents.length);

            sortedEvents.forEach((event) => {
                const eventStart = moment(event.start);
                const eventEnd = moment(event.end);

                // Calculate position based on time
                const startMinutes = (eventStart.hours() - startHour) * 60 + eventStart.minutes();
                const endMinutes = (eventEnd.hours() - startHour) * 60 + eventEnd.minutes();

                // Snap to grid
                const roundedStartMinutes = Math.round(startMinutes / minutesPerSlot) * minutesPerSlot;
                const roundedEndMinutes = Math.round(endMinutes / minutesPerSlot) * minutesPerSlot;
                const roundedDuration = roundedEndMinutes - roundedStartMinutes;

                const top = (roundedStartMinutes / minutesPerSlot) * slotHeight;
                const height = Math.max((roundedDuration / minutesPerSlot) * slotHeight, 20);

                // Find overlapping events
                const overlappingEvents = dayEvents.filter((otherEvent) => {
                    if (otherEvent.id === event.id) return false;
                    const otherStart = moment(otherEvent.start);
                    const otherEnd = moment(otherEvent.end);
                    return (
                        (eventStart.isBefore(otherEnd) && eventEnd.isAfter(otherStart)) ||
                        (otherStart.isBefore(eventEnd) && otherEnd.isAfter(eventStart))
                    );
                });

                // Find an available column
                let column = 0;
                const usedColumns = new Set<number>();

                // Get columns used by overlapping events
                overlappingEvents.forEach((otherEvent) => {
                    if (positions[otherEvent.id]) {
                        usedColumns.add(positions[otherEvent.id].column);
                    }
                });

                // Find the first available column
                while (usedColumns.has(column)) {
                    column++;
                }

                // Calculate total columns needed
                const totalColumns = Math.max(
                    1,
                    ...overlappingEvents.filter((e) => positions[e.id]).map((e) => positions[e.id].column + 1),
                    column + 1,
                );

                // Calculate width and position
                const columnWidth = containerWidth / totalColumns;
                const left = 60 + column * columnWidth;
                const width = columnWidth - 4; // Small gap between cards

                // Store position information
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
                };
            });

            console.log('Calculated positions:', Object.keys(positions).length);
            setEventPositions(positions);
        } catch (error) {
            console.error('Error calculating event positions:', error);
        }
    }, [dayEvents, timelineRef.current, startHour, minutesPerSlot, slotHeight]);

    // Handle window resize to recalculate event positions
    useEffect(() => {
        const handleResize = () => {
            // Force recalculation of event positions when window is resized
            if (timelineRef.current) {
                const containerWidth = timelineRef.current.clientWidth - 60

                // Update positions with new container width
                setEventPositions((prev) => {
                    const updated = { ...prev }

                    // Recalculate widths for all events
                    Object.keys(updated).forEach((eventId) => {
                        const pos = updated[eventId]
                        const columnWidth = containerWidth / pos.totalColumns
                        updated[eventId] = {
                            ...pos,
                            width: columnWidth - 4,
                        }
                    })

                    return updated
                })
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [timelineRef, dayEvents])

    // Scroll to current time on initial load
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
    }, [date, startHour, slotHeight])

    // Add custom scrollbar styles to the container
    useEffect(() => {
        if (containerRef.current) {
            const style = document.createElement("style")
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

            return () => {
                document.head.removeChild(style)
            }
        }
    }, [spaceTheme])

    // ==============================
    // SCROLL HANDLERS
    // ==============================

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollTop = containerRef.current.scrollTop
            const maxScroll = totalHeight - containerRef.current.clientHeight

            // Prevent overscrolling
            if (scrollTop < 0) {
                containerRef.current.scrollTop = 0
                setScrollPosition(0)
            } else if (scrollTop > maxScroll) {
                containerRef.current.scrollTop = maxScroll
                setScrollPosition(maxScroll)
            } else {
                setScrollPosition(scrollTop)
            }
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

    // ==============================
    // TIME & POSITION UTILITIES
    // ==============================

    // Format time from minutes since start of day
    const formatTimeFromMinutes = (minutesFromStart: number) => {
        const hours = Math.floor(minutesFromStart / 60) + startHour
        const minutes = minutesFromStart % 60

        // Format as 12-hour time with AM/PM
        const displayHours = hours % 12 === 0 ? 12 : hours % 12
        const amPm = hours >= 12 ? "PM" : "AM"

        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${amPm}`
    }

    // Get exact grid time from a Y position
    const getTimeFromGridPosition = (gridY: number) => {
        // Convert pixels to grid units
        const gridUnits = Math.round(gridY / slotHeight)
        // Convert grid units to minutes
        const minutesFromStart = gridUnits * minutesPerSlot
        return minutesFromStart
    }

    // Get the nearest grid line position from a Y coordinate
    const getSnapPosition = (y: number) => {
        return Math.round(y / slotHeight) * slotHeight
    }

    // ==============================
    // DRAG & DROP HANDLERS
    // ==============================

    // Handle drag start
    const handleDragStart = (eventId: string) => {
        setActiveEvent(eventId)
        setIsDragging(true)
        document.body.style.cursor = "grabbing"

        // Get initial time for tooltip
        const position = eventPositions[eventId]
        if (position) {
            const time = formatTimeFromMinutes(position.startMinutes)
            setDragTooltip({ eventId, time })
        }
    }

    // Handle drag
    const handleDrag = (eventId: string, info: any) => {
        const position = eventPositions[eventId]
        if (!position || !timelineRef.current) return

        // Calculate new position with snapping to grid
        const rawNewTop = position.top + info.offset.y
        const snappedTop = getSnapPosition(rawNewTop)

        // Get time from grid position
        const minutesFromStart = getTimeFromGridPosition(snappedTop)
        const timeText = formatTimeFromMinutes(minutesFromStart)

        // Update tooltip
        setDragTooltip({ eventId, time: timeText })
    }

    // Handle drag end
    const handleDragEnd = (eventId: string, info: any) => {
        const position = eventPositions[eventId]
        if (!position || !timelineRef.current) return

        document.body.style.cursor = ""

        // Calculate new position with snapping
        const rawNewTop = position.top + info.offset.y
        const snappedTop = getSnapPosition(rawNewTop)

        // Prevent dragging above the timeline
        const clampedTop = Math.max(0, snappedTop)

        // Prevent dragging below the timeline
        const maxTop = totalHeight - position.height
        const boundedTop = Math.min(clampedTop, maxTop)

        // Calculate new time
        const minutesFromStart = getTimeFromGridPosition(boundedTop)
        const hours = Math.floor(minutesFromStart / 60) + startHour
        const minutes = minutesFromStart % 60

        // Clamp to valid range
        const clampedHours = Math.max(min.getHours(), Math.min(hours, max.getHours() - 1))

        // Create new dates
        const newStartDate = moment(date).hour(clampedHours).minute(minutes).second(0).millisecond(0)

        const durationInMinutes = position.durationMinutes
        const newEndDate = moment(newStartDate).add(durationInMinutes, "minutes")

        // Ensure end time doesn't exceed max time
        if (newEndDate.hour() > max.getHours() || (newEndDate.hour() === max.getHours() && newEndDate.minute() > 0)) {
            // Adjust end time to max
            newEndDate.hour(max.getHours()).minute(0)

            // If this makes the event too short, adjust start time instead
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

        // Calculate updated minutes from start for position
        const updatedMinutesFromStart = (newStartDate.hour() - startHour) * 60 + newStartDate.minute()

        // Update event positions
        setEventPositions((prev) => ({
            ...prev,
            [eventId]: {
                ...prev[eventId],
                top: Math.max(0, (updatedMinutesFromStart / minutesPerSlot) * slotHeight),
                startMinutes: updatedMinutesFromStart,
                originalEvent: updatedEvent,
            },
        }))

        // Call update callback
        if (onEventUpdate) {
            onEventUpdate(updatedEvent)
            toast.success(`${updatedEvent.title} updated to ${newStartDate.format("h:mm A")}`)
        }

        // Reset drag state
        setDragTooltip(null)
        setActiveEvent(null)
        setIsDragging(false)
    }

    // ==============================
    // EVENT STYLING & DISPLAY HELPERS
    // ==============================

    // Get background color based on event type
    const getEventBackground = (event: AppointmentEvent, isActive = false) => {
        if (spaceTheme) {
            switch (event.type) {
                case "HOME_VISIT":
                    return isActive ? "bg-green-900/50" : "bg-green-900/30"
                case "VIDEO_CALL":
                    return isActive ? "bg-blue-900/50" : "bg-blue-900/30"
                case "HOSPITAL":
                    return isActive ? "bg-green-900/50" : "bg-green-900/30"
                case "IN_PERSON":
                    return isActive ? "bg-amber-900/50" : "bg-amber-900/30"
                case "AUDIO_CALL":
                    return isActive ? "bg-red-900/50" : "bg-red-900/30"
                default:
                    return isActive ? "bg-slate-800/50" : "bg-slate-800/30"
            }
        } else {
            switch (event.type) {
                case "HOME_VISIT":
                    return isActive ? "bg-green-100" : "bg-green-50"
                case "VIDEO_CALL":
                    return isActive ? "bg-blue-100" : "bg-blue-50"
                case "HOSPITAL":
                    return isActive ? "bg-green-100" : "bg-green-50"
                case "IN_PERSON":
                    return isActive ? "bg-amber-100" : "bg-amber-50"
                case "AUDIO_CALL":
                    return isActive ? "bg-red-100" : "bg-red-50"
                default:
                    return isActive ? "bg-gray-100" : "bg-gray-50"
            }
        }
    }

    // Get accent color for event border
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

    // Get icon for event type
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

    // Get label for event type
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

    // Get duration in a readable format
    const getEventDuration = (event: AppointmentEvent) => {
        const duration = getEventDurationInMinutes(event)
        if (duration < 60) {
            return `${duration} min`
        }
        const hours = Math.floor(duration / 60)
        const minutes = duration % 60
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }

    // ==============================
    // THEME & STYLE CLASSES
    // ==============================

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

    // ==============================
    // RENDER COMPONENT
    // ==============================

    return (
        <div className="h-full flex flex-col">
            {/* Header with date and navigation */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1"></div>
                <div className="flex-1 flex justify-center">
                    <h3 className={`text-lg font-semibold text-center ${headerTextClass}`}>
                        {moment(date).format("dddd, MMMM D, YYYY")}
                    </h3>
                </div>
                <div className="flex-1 flex justify-end">
                    <div className={`text-xs ${spaceTheme ? "text-slate-400" : "text-gray-500"} flex items-center gap-1`}>
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{dayEvents.length} events</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Scroll controls with improved styling */}
                <div className="flex justify-between items-center mb-3">
                    <Button
                        variant={spaceTheme ? "outline" : "secondary"}
                        size="sm"
                        onClick={scrollUp}
                        disabled={scrollPosition <= 0}
                        className={`flex items-center gap-1 ${spaceTheme ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800" : ""}`}
                    >
                        <ChevronLeft className="h-3.5 w-3.5 rotate-90" />
                        <span>Earlier</span>
                    </Button>

                    <div className={`text-xs ${spaceTheme ? "text-slate-400" : "text-gray-500"} flex items-center gap-1`}>
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        <span>Drag events to reschedule</span>
                    </div>

                    <Button
                        variant={spaceTheme ? "outline" : "secondary"}
                        size="sm"
                        onClick={scrollDown}
                        disabled={scrollPosition >= totalHeight - (containerRef.current?.clientHeight || 0)}
                        className={`flex items-center gap-1 ${spaceTheme ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800" : ""}`}
                    >
                        <span>Later</span>
                        <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                    </Button>
                </div>

                {/* Timeline container with improved styling */}
                <div
                    ref={containerRef}
                    className={`flex-1 overflow-y-auto overflow-x-hidden relative border rounded-xl shadow-sm ${timelineClass} h-full calendar-scrollbar`}
                    onScroll={handleScroll}
                    style={{
                        minHeight: "300px",
                        maxHeight: "calc(100vh - 200px)",
                    }}
                >
                    <div className="relative min-h-full" style={{ height: `${totalHeight}px` }} ref={timelineRef}>
                        {/* Time labels on the left with improved styling */}
                        <div
                            className={`absolute top-0 left-0 w-[60px] h-full border-r ${spaceTheme ? "border-slate-800 bg-slate-900/80" : "border-gray-200 bg-gray-50/80"} z-10`}
                        >
                            {timeSlots
                                .filter((_, i) => i % 6 === 0) // Every hour
                                .map((time, i) => (
                                    <div
                                        key={i}
                                        className={`absolute ${timeLabelsClass} text-xs font-medium px-2 flex items-center justify-end w-full`}
                                        style={{ top: `${i * slotHeight * 6}px`, height: `${slotHeight}px` }}
                                    >
                                        {moment(time).format("h A")}
                                    </div>
                                ))}
                        </div>

                        {/* Time grid with improved styling */}
                        <div className="absolute left-[60px] right-0 top-0 bottom-0">
                            {timeSlots.map((time, i) => {
                                const hasEvents = hasEventsInTimeSlot(time)
                                const isHourMark = i % 6 === 0
                                const isHalfHourMark = i % 3 === 0

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "absolute left-0 right-0 border-b transition-colors time-slot",
                                            isHourMark ? hourLineClass : isHalfHourMark ? halfHourLineClass : gridLineClass,
                                            hasEvents ? "" : spaceTheme ? "bg-slate-800/10" : "bg-gray-50/30",
                                        )}
                                        style={{
                                            top: `${i * slotHeight}px`,
                                            height: `${slotHeight}px`,
                                            borderBottomWidth: isHourMark ? "2px" : "1px",
                                        }}
                                    >
                                        {/* Add time label on the right for hour marks */}
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

                            {/* Current time indicator with improved styling */}
                            {moment(new Date()).isSame(date, "day") && (
                                <div
                                    className={`absolute left-0 right-0 h-0.5 z-20 ${currentTimeClass}`}
                                    style={{
                                        top: `${(((new Date().getHours() - startHour) * 60 + new Date().getMinutes()) / minutesPerSlot) * slotHeight}px`,
                                    }}
                                >
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full ${currentTimeClass} -mt-1 -ml-1 shadow-md flex items-center justify-center`}
                                    >
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                    </div>
                                    <div
                                        className={`absolute -right-14 -top-3 text-xs font-medium ${spaceTheme ? "text-white" : "text-gray-700"} bg-opacity-75 px-1 rounded`}
                                    >
                                        {moment(new Date()).format("h:mm A")}
                                    </div>
                                </div>
                            )}

                            {/* Empty state when no events */}
                            {dayEvents.length === 0 && (
                                <div
                                    className={`absolute inset-0 flex items-center justify-center ${spaceTheme ? "text-slate-400" : "text-gray-400"} text-sm`}
                                >
                                    <div className="text-center p-6">
                                        <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                        <p>No events scheduled for this day</p>
                                        <p className="text-xs mt-1 opacity-70">Events will appear here when scheduled</p>
                                    </div>
                                </div>
                            )}

                            {/* Event cards */}
                            {dayEvents.map((event) => {
                                const position = eventPositions[event.id]
                                if (!position) return null

                                const displayEvent = displayEvents[event.id] || event
                                const isActive = activeEvent === event.id
                                const isHovered = hoveredEvent === event.id && !isDragging
                                const bgClass = getEventBackground(displayEvent, isActive)
                                const accentColor = getEventAccentColor(displayEvent)
                                const typeLabel = getEventTypeLabel(displayEvent.type)
                                const icon = getEventIcon(displayEvent.type)
                                const { staffColor, staffName } = getStaffColor(event, staffMembers)
                                const duration = getEventDuration(displayEvent)

                                // Determine content to show based on card size
                                const showType = position.height >= 50
                                const showStaff = position.height >= 60
                                const showDescription = position.height >= 80 && displayEvent.notes
                                const isTinyCard = position.height < 40

                                return (
                                    <div
                                        key={event.id}
                                        ref={(el) => {
                                            if (el) eventRefs.current[event.id] = el
                                        }}
                                        className={cn(
                                            "absolute p-1.5 rounded-lg shadow-sm cursor-grab active:cursor-grabbing event-card transition-all overflow-hidden",
                                            bgClass,
                                            isActive ? "ring-2 ring-primary shadow-lg z-30" : "",
                                            isHovered ? "brightness-95" : "",
                                            isTinyCard ? "py-0.5 px-1" : "",
                                        )}
                                        style={{
                                            top: `${position.top}px`,
                                            left: `${position.left}px`,
                                            width: `${position.width}px`,
                                            height: `${position.height}px`,
                                            zIndex: isActive ? 30 : isHovered ? 20 : 10,
                                            borderLeft: `4px solid ${accentColor}`,
                                            boxShadow: isActive
                                                ? spaceTheme
                                                    ? "0 8px 16px rgba(0,0,0,0.4)"
                                                    : "0 8px 16px rgba(0,0,0,0.2)"
                                                : spaceTheme
                                                    ? "0 2px 6px rgba(0,0,0,0.2)"
                                                    : "0 1px 3px rgba(0,0,0,0.05)",
                                            transform: isActive ? "scale(1.02)" : "scale(1)",
                                        }}
                                        onMouseEnter={() => setHoveredEvent(event.id)}
                                        onMouseLeave={() => setHoveredEvent(null)}
                                    >
                                        {/* Draggable wrapper */}
                                        <motion.div
                                            className="absolute inset-0 z-10"
                                            drag="y"
                                            dragConstraints={timelineRef}
                                            dragElastic={0}
                                            dragMomentum={false}
                                            onDragStart={() => handleDragStart(event.id)}
                                            onDrag={(_, info) => handleDrag(event.id, info)}
                                            onDragEnd={(_, info) => handleDragEnd(event.id, info)}
                                            onClick={(e) => {
                                                if (!isDragging) {
                                                    onSelectEvent(event)
                                                }
                                            }}
                                            whileDrag={{
                                                scale: 1.05,
                                                zIndex: 100,
                                                boxShadow: spaceTheme ? "0 10px 20px rgba(0,0,0,0.5)" : "0 10px 20px rgba(0,0,0,0.3)",
                                            }}
                                        />

                                        {/* Event content with improved layout for overflow handling */}
                                        <div className="flex flex-col h-full relative z-0 overflow-hidden">
                                            {/* Event header with title - improved overflow handling */}
                                            <div className="flex items-start justify-between mb-0.5">
                                                <div
                                                    className={`text-xs font-semibold truncate max-w-[calc(100%-40px)] ${spaceTheme ? "text-white" : ""}`}
                                                >
                                                    {displayEvent.title}
                                                </div>

                                                {/* Duration badge */}
                                                {!isTinyCard && (
                                                    <div
                                                        className={`text-[9px] px-1 py-0.5 rounded-full flex-shrink-0 ${spaceTheme ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}
                                                    >
                                                        {duration}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Time range with icon */}
                                            <div
                                                className={`text-[10px] ${spaceTheme ? "text-slate-300" : "text-gray-600"} flex items-center gap-0.5 truncate`}
                                            >
                                                <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                                                <span className="truncate whitespace-nowrap">
                                                    {moment(displayEvent.start).format("h:mm A")} - {moment(displayEvent.end).format("h:mm A")}
                                                </span>
                                            </div>

                                            {/* Event type with icon - show if there's enough space */}
                                            {showType && (
                                                <div
                                                    className={`text-[10px] ${spaceTheme ? "text-slate-300" : "text-gray-600"} flex items-center gap-0.5 mt-0.5 truncate`}
                                                >
                                                    <span className="flex-shrink-0">{icon}</span>
                                                    <span className="truncate">{typeLabel}</span>
                                                </div>
                                            )}

                                            {/* Description - show if there's enough space */}
                                            {showDescription && (
                                                <div
                                                    className={`text-[10px] ${spaceTheme ? "text-slate-400" : "text-gray-500"} mt-0.5 line-clamp-2`}
                                                >
                                                    {displayEvent.notes}
                                                </div>
                                            )}

                                            {/* Staff info - show if there's enough space */}
                                            {showStaff && (
                                                <div className="mt-auto flex items-center gap-1 pt-1">
                                                    <div
                                                        className="w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] text-white shadow-sm"
                                                        style={{ backgroundColor: staffColor }}
                                                    >
                                                        {staffName}
                                                    </div>
                                                    <span className={`text-[10px] ${spaceTheme ? "text-slate-300" : "text-gray-600"} truncate`}>
                                                        {staffName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Time tooltip with improved styling */}
                                        {isActive && dragTooltip && dragTooltip.eventId === event.id && (
                                            <div
                                                className={`fixed px-2 py-1 rounded-md ${tooltipClass} text-xs font-semibold shadow-md z-50 pointer-events-none`}
                                                style={{
                                                    top: `${eventRefs.current[event.id]?.getBoundingClientRect().top - 30}px`,
                                                    left: `${eventRefs.current[event.id]?.getBoundingClientRect().left}px`,
                                                    opacity: 1,
                                                }}
                                            >
                                                <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                                                    <Clock className="h-3 w-3" />
                                                    {dragTooltip.time}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


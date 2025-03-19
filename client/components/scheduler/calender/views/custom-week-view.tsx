"use client"

import { useState, useEffect, useRef } from "react"
import moment from "moment"
import { motion, type PanInfo } from "framer-motion"
import { toast } from "sonner"
import type { AppointmentEvent } from "../types"
import { cn } from "../../../../lib/utils"

interface CustomWeekViewProps {
    date: Date
    events: AppointmentEvent[]
    onSelectEvent: (event: AppointmentEvent) => void
    staffMembers: any[]
    getEventDurationInMinutes: (event: any) => number
    onEventUpdate?: (updatedEvent: AppointmentEvent) => void
}

export function CustomWeekView({
    date,
    events,
    onSelectEvent,
    staffMembers,
    getEventDurationInMinutes,
    onEventUpdate,
}: CustomWeekViewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const [weekDays, setWeekDays] = useState<Date[]>([])
    const [timeSlots, setTimeSlots] = useState<string[]>([])
    const [eventPositions, setEventPositions] = useState<{ [key: string]: any }>({})
    const [displayEvents, setDisplayEvents] = useState<{ [key: string]: AppointmentEvent }>({}) // Store display events
    const [gridDimensions, setGridDimensions] = useState({
        slotHeight: 40,
        dayWidth: 0,
        timeGutterWidth: 60,
        totalHeight: 0,
        totalWidth: 0,
    })

    // Hours to display (7am to 7pm)
    const startHour = 7
    const endHour = 19

    // Generate week days and time slots
    useEffect(() => {
        // Generate week days
        const startOfWeek = moment(date).startOf("week")
        const days: Date[] = []

        for (let i = 0; i < 7; i++) {
            days.push(startOfWeek.clone().add(i, "days").toDate())
        }
        setWeekDays(days)

        // Generate time slots
        const slots: string[] = []
        for (let hour = startHour; hour <= endHour; hour++) {
            slots.push(`${hour}:00`)
            slots.push(`${hour}:30`)
        }
        setTimeSlots(slots)
    }, [date])

    // Initialize display events
    useEffect(() => {
        const eventMap: { [key: string]: AppointmentEvent } = {}
        events.forEach((event) => {
            eventMap[event.id] = { ...event }
        })
        setDisplayEvents(eventMap)
    }, [events])

    // Calculate grid dimensions and event positions
    useEffect(() => {
        if (!containerRef.current || !gridRef.current || weekDays.length === 0) return

        const containerWidth = gridRef.current.offsetWidth
        const timeGutterWidth = 60
        const dayWidth = (containerWidth - timeGutterWidth) / 7
        const slotHeight = 40
        const totalHeight = timeSlots.length * slotHeight

        setGridDimensions({
            slotHeight,
            dayWidth,
            timeGutterWidth,
            totalHeight,
            totalWidth: containerWidth,
        })

        const positions: { [key: string]: any } = {}

        events.forEach((event) => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            // Skip events outside the current week
            if (!eventStart.isSame(moment(date), "week")) return

            // Calculate day index (0-6)
            const dayIndex = eventStart.day()

            // Calculate top position based on time
            const startHourDecimal = eventStart.hours() + eventStart.minutes() / 60
            const endHourDecimal = eventEnd.hours() + eventEnd.minutes() / 60

            // Skip events outside the visible time range
            if (endHourDecimal < startHour || startHourDecimal > endHour) return

            // Clamp event times to visible range
            const clampedStartHour = Math.max(startHourDecimal, startHour)
            const clampedEndHour = Math.min(endHourDecimal, endHour)

            // Calculate minutes from start of day
            const startMinutes = (clampedStartHour - startHour) * 60
            const endMinutes = (clampedEndHour - startHour) * 60
            const durationMinutes = endMinutes - startMinutes

            // Calculate exact pixel positions
            const top = Math.round((startMinutes / 30) * slotHeight)
            const height = Math.round((durationMinutes / 30) * slotHeight)

            // Ensure minimum height for visibility
            const minHeight = 20
            const finalHeight = Math.max(height, minHeight)

            // Calculate left position based on day
            const left = timeGutterWidth + dayIndex * dayWidth
            const width = dayWidth - 4 // 4px for gap

            positions[event.id] = {
                top,
                left,
                height: finalHeight,
                width,
                dayIndex,
                startMinutes,
                durationMinutes,
                originalEvent: { ...event },
                // Store original times for reference
                originalStartHour: eventStart.hours(),
                originalStartMinute: eventStart.minutes(),
                originalEndHour: eventEnd.hours(),
                originalEndMinute: eventEnd.minutes(),
            }
        })

        setEventPositions(positions)
    }, [events, weekDays, date, timeSlots.length, startHour, endHour])

    // Scroll to current time on initial render
    useEffect(() => {
        if (!containerRef.current) return

        const now = new Date()
        const currentHour = now.getHours()

        if (currentHour >= startHour && currentHour <= endHour) {
            const minutesSinceStart = (currentHour - startHour) * 60 + now.getMinutes()
            const scrollPosition = (minutesSinceStart / 30) * gridDimensions.slotHeight - 100 // 100px offset to show context

            containerRef.current.scrollTop = Math.max(0, scrollPosition)
        }
    }, [gridDimensions.slotHeight, startHour, endHour])

    // Get event background color based on type
    const getEventBackground = (event: AppointmentEvent) => {
        switch (event.type) {
            case "HOME_VISIT":
                return "bg-green-50"
            case "VIDEO_CALL":
                return "bg-blue-50"
            case "HOSPITAL":
                return "bg-green-50"
            case "IN_PERSON":
                return "bg-amber-50"
            case "AUDIO_CALL":
                return "bg-red-50"
            default:
                return "bg-gray-50"
        }
    }

    // Get staff color
    const getStaffColor = (event: AppointmentEvent) => {
        const staff = staffMembers.find((s) => s.id === event.resourceId)
        return staff?.color || "#888888"
    }

    // Format time slot label
    const formatTimeSlot = (timeSlot: string) => {
        const [hour, minute] = timeSlot.split(":")
        const hourNum = Number.parseInt(hour)
        return `${hourNum % 12 || 12}${minute === "00" ? "" : ":30"} ${hourNum >= 12 ? "PM" : "AM"}`
    }

    // Check if a time slot has events
    const hasEventsInTimeSlot = (day: Date, slotIndex: number) => {
        const slotStart = moment(day)
            .hour(Math.floor(slotIndex / 2) + startHour)
            .minute((slotIndex % 2) * 30)
        const slotEnd = moment(slotStart).add(30, "minutes")

        return events.some((event) => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            // Check if this event is on this day
            if (!eventStart.isSame(day, "day")) return false

            // Check if event overlaps with this time slot
            return (
                (eventStart.isSameOrAfter(slotStart) && eventStart.isBefore(slotEnd)) ||
                (eventEnd.isAfter(slotStart) && eventEnd.isSameOrBefore(slotEnd)) ||
                (eventStart.isSameOrBefore(slotStart) && eventEnd.isSameOrAfter(slotEnd))
            )
        })
    }

    // Snap time to 15-minute intervals
    const snapTimeToGrid = (minutes: number): number => {
        return Math.round(minutes / 15) * 15
    }

    // Handle drag end for events
    const handleDragEnd = (event: AppointmentEvent, info: PanInfo, position: any) => {
        if (!gridRef.current) return

        // Calculate new day and time based on position
        const { dayWidth, slotHeight, timeGutterWidth } = gridDimensions

        // Calculate new day index
        const newLeft = position.left + info.offset.x
        const rawDayIndex = Math.floor((newLeft - timeGutterWidth + 20) / dayWidth) // Add 20 to account for the offset
        const dayIndex = Math.max(0, Math.min(6, rawDayIndex))

        // Calculate new start time
        const newTop = Math.max(0, position.top + info.offset.y)
        const minutesFromStart = Math.round((newTop / slotHeight) * 30)
        const startHourOffset = Math.floor(minutesFromStart / 60)
        const startMinuteOffset = minutesFromStart % 60
        const roundedStartMinute = snapTimeToGrid(startMinuteOffset)

        // Ensure we don't go beyond the visible time range
        const clampedStartHour = Math.min(startHour + startHourOffset, endHour - 0.5)

        // Create new start and end dates
        const newStartDate = moment(weekDays[dayIndex])
            .hour(clampedStartHour)
            .minute(roundedStartMinute)
            .second(0)
            .millisecond(0)

        // Maintain the original duration
        const originalDurationMinutes = position.durationMinutes
        const roundedDurationMinutes = snapTimeToGrid(originalDurationMinutes)
        const newEndDate = moment(newStartDate).add(roundedDurationMinutes, "minutes")

        // Ensure end time doesn't exceed the visible range
        if (newEndDate.hour() > endHour) {
            newEndDate.hour(endHour).minute(0)
        }

        // Create updated event
        const updatedEvent: AppointmentEvent = {
            ...event,
            start: newStartDate.toDate(),
            end: newEndDate.toDate(),
        }

        // Update the display event immediately to reflect the new times in the UI
        setDisplayEvents((prev) => ({
            ...prev,
            [event.id]: updatedEvent,
        }))

        // Recalculate position values
        const updatedStartMinutes = (newStartDate.hour() - startHour) * 60 + newStartDate.minute()
        const updatedEndMinutes = (newEndDate.hour() - startHour) * 60 + newEndDate.minute()
        const updatedDurationMinutes = updatedEndMinutes - updatedStartMinutes

        // Calculate exact pixel positions - ensure they align with grid
        const updatedTop = Math.round((updatedStartMinutes / 30) * slotHeight)
        const updatedHeight = Math.round((updatedDurationMinutes / 30) * slotHeight)

        // Ensure minimum height for visibility
        const minHeight = 20
        const finalHeight = Math.max(updatedHeight, minHeight)

        // Calculate exact column position
        const exactColumnLeft = timeGutterWidth + dayIndex * dayWidth

        // Update event positions
        const updatedPositions = { ...eventPositions }
        updatedPositions[event.id] = {
            ...position,
            top: updatedTop,
            left: exactColumnLeft,
            height: finalHeight,
            width: dayWidth - 4, // Ensure consistent width
            dayIndex,
            startMinutes: updatedStartMinutes,
            durationMinutes: updatedDurationMinutes,
            originalEvent: { ...updatedEvent },
        }

        setEventPositions(updatedPositions)

        // Call onEventUpdate if provided
        if (onEventUpdate) {
            onEventUpdate(updatedEvent)
            toast.success("Event updated successfully")
        }
    }

    // Track if we're dragging to prevent click after drag
    const isDraggingRef = useRef(false)

    // Calculate current time indicator position once
    const currentTimePosition = (() => {
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()

        if (currentHour < startHour || currentHour > endHour) return 0

        const minutesSinceStart = (currentHour - startHour) * 60 + currentMinute
        return Math.round((minutesSinceStart / 30) * gridDimensions.slotHeight)
    })()

    return (
        <div className="h-full flex flex-col">
            {/* Day headers */}
            <div className="flex border-b">
                <div className="w-[60px] flex-shrink-0"></div>
                <div className="flex-1 grid grid-cols-7">
                    {weekDays.map((day, i) => {
                        const isToday = moment(day).isSame(moment(), "day")
                        return (
                            <div key={i} className={cn("p-2 text-center border-r", isToday ? "bg-blue-50" : "")}>
                                <div className="text-xs text-gray-500">{moment(day).format("ddd").toUpperCase()}</div>
                                <div className={cn("text-sm font-medium mt-1", isToday ? "text-blue-500" : "")}>
                                    {moment(day).format("D")}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Time grid */}
            <div className="flex-1 overflow-y-auto" ref={containerRef}>
                <div className="flex relative min-h-full">
                    {/* Time gutter */}
                    <div className="w-[60px] flex-shrink-0 border-r">
                        {timeSlots.map((slot, i) => (
                            <div key={i} className={cn("h-[40px] text-xs text-gray-500 text-right pr-2 pt-1")}>
                                {i % 2 === 0 && formatTimeSlot(slot)}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    <div className="flex-1 grid grid-cols-7 relative" ref={gridRef}>
                        {/* Time slot grid */}
                        {weekDays.map((day, dayIndex) => (
                            <div key={dayIndex} className="border-r">
                                {timeSlots.map((slot, slotIndex) => {
                                    const hasEvents = hasEventsInTimeSlot(day, slotIndex)
                                    return (
                                        <div
                                            key={slotIndex}
                                            className={cn(
                                                "h-[40px] border-b",
                                                slotIndex % 2 === 0 ? "border-gray-200" : "border-gray-100",
                                                hasEvents ? "" : "bg-gray-50/30",
                                            )}
                                        ></div>
                                    )
                                })}
                            </div>
                        ))}

                        {/* Current time indicator */}
                        {weekDays.some((day) => moment(day).isSame(moment(), "day")) && (
                            <div
                                className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                                style={{
                                    top: `${currentTimePosition}px`,
                                }}
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                            </div>
                        )}

                        {/* Events */}
                        {events.map((event) => {
                            const position = eventPositions[event.id]
                            if (!position) return null

                            // Use the display event for rendering (which will have updated times after drag)
                            const displayEvent = displayEvents[event.id] || event

                            return (
                                <motion.div
                                    key={event.id}
                                    className={cn("absolute rounded p-1 text-xs overflow-hidden cursor-move", getEventBackground(event))}
                                    style={{
                                        top: `${position.top}px`,
                                        left: `${position.left - 20}px`, // Apply -20px offset for proper alignment
                                        height: `${position.height}px`,
                                        width: `${position.width}px`,
                                        borderLeft: `3px solid ${getStaffColor(event)}`,
                                        overflow: "hidden",
                                        zIndex: isDraggingRef.current ? 30 : 10,
                                    }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: { type: "spring", stiffness: 300, damping: 30 },
                                    }}
                                    whileHover={{
                                        zIndex: 20,
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                        scale: 1.02,
                                    }}
                                    drag
                                    dragConstraints={gridRef}
                                    dragElastic={0}
                                    dragMomentum={false}
                                    onDragStart={() => {
                                        isDraggingRef.current = true
                                    }}
                                    onDragEnd={(_, dragInfo) => {
                                        handleDragEnd(event, dragInfo, position)
                                        // Reset dragging state after a short delay
                                        setTimeout(() => {
                                            isDraggingRef.current = false
                                        }, 100)
                                    }}
                                    onClick={(e) => {
                                        // Only trigger select if not dragging
                                        if (!isDraggingRef.current) {
                                            e.stopPropagation()
                                            onSelectEvent(event)
                                        }
                                    }}
                                >
                                    <div className="font-medium truncate">{displayEvent.title}</div>
                                    <div className="text-gray-500 text-[10px]">
                                        {moment(displayEvent.start).format("h:mm A")} - {moment(displayEvent.end).format("h:mm A")}
                                    </div>
                                    {position.height > 60 && (
                                        <div className="text-gray-500 mt-1 truncate text-[10px]">{event.staffName}</div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import moment from "moment"
import { toast } from "sonner"
import { Home, Video, Building2, Phone, User, Calendar, MoreVertical, ChevronDown, Edit, Plus, X, Loader2, HeartHandshake, Heart, Flag, DollarSign, Baby, AlertTriangle, Clock, Stethoscope, Timer } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import BankNotes from "@/components/icons/bank-notes"
import EventIcon from "@/components/icons/eventicon"
import HomeModern from "@/components/icons/home-modern"
import type { AppointmentEvent } from "../types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ScheduleTemplate } from "@/types/prismaTypes"
import { useApplyScheduleTemplateMutation, useGetScheduleTemplatesQuery, useGetAgencySchedulesQuery } from "@/state/api"
import { setUserTemplates, setLoadingTemplates, setTemplateError } from "@/state/slices/templateSlice"
import { Separator } from "@/components/ui/separator"

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
    showSidebar = true,
    minutesPerSlot = 30,
}: CustomDayViewProps) {
    const dispatch = useAppDispatch()
    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType)
    const clients = useAppSelector((state) => state.user.clients || [])
    const careworkers = useAppSelector((state) => state.user.careWorkers || [])
    const officeStaff = useAppSelector((state) => state.user.officeStaff || [])
    const events = useAppSelector((state) => state.schedule.events || [])
    const { userTemplates, isLoadingTemplates } = useAppSelector((state) => state.template)
    const agencyId = useAppSelector((state) => state.user.user?.userInfo?.agencyId)
    const router = useRouter()

    // Get the appropriate users based on activeScheduleUserType
    const displayUsers = (() => {
        if (activeScheduleUserType === "clients") return clients
        if (activeScheduleUserType === "careWorker") return careworkers
        if (activeScheduleUserType === "officeStaff") return officeStaff
        return []
    })()

    // State management
    const [activeDialogEventId, setActiveDialogEventId] = useState<string | null>(null)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [isApplyTemplateSelected, setIsApplyTemplateSelected] = useState<boolean>(false)
    const [eventPositions, setEventPositions] = useState<Record<string, any>>({})
    const [displayEvents, setDisplayEvents] = useState<Record<string, AppointmentEvent>>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; time: string } | null>(null)

    // Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    // Constants
    const startHour = min.getHours()
    const endHour = max.getHours()
    const slotsPerHour = 60 / minutesPerSlot
    const slotWidth = 80
    const ROW_HEIGHT = 80
    const HEADER_HEIGHT = 50

    // API hooks
    const {
        data: templatesData,
        isLoading: isTemplatesLoading,
        error: templatesError,
    } = useGetScheduleTemplatesQuery(
        { userId: selectedUserId || "", agencyId: agencyId || "" },
        { skip: !selectedUserId || !agencyId },
    )

    const { refetch: refetchAgencySchedules } = useGetAgencySchedulesQuery(agencyId || "", {
        skip: !agencyId
    })

    const [applyScheduleTemplate] = useApplyScheduleTemplateMutation()

    // Generate time slots
    const timeSlots = Array.from({ length: (endHour - startHour) * slotsPerHour + 1 }, (_, i) => {
        const hour = Math.floor(i / slotsPerHour) + startHour
        const minutes = (i % slotsPerHour) * minutesPerSlot
        return new Date(new Date(date).setHours(hour, minutes, 0, 0))
    })

    const totalTimelineWidth = timeSlots.length * slotWidth
    const totalCalendarHeight = (displayUsers.length + 1) * ROW_HEIGHT + HEADER_HEIGHT

    // Group events by user
    const eventsByUser = (() => {
        const userEvents: Record<string, AppointmentEvent[]> = {}

        displayUsers.forEach((user) => {
            userEvents[user.id] = []
        })

        events
            .filter((event) => moment(event.start).isSame(date, "day"))
            .forEach((event) => {
                if (event.clientId && userEvents[event.clientId]) {
                    userEvents[event.clientId]?.push(event)
                }
            })

        return userEvents
    })()

    // Update Redux state when templates data changes
    useEffect(() => {
        if (templatesData) {
            dispatch(setUserTemplates(templatesData))
        }
        if (templatesError) {
            dispatch(setTemplateError("Failed to load templates"))
        }
        dispatch(setLoadingTemplates(isTemplatesLoading))
    }, [templatesData, templatesError, isTemplatesLoading, dispatch])

    // Process events for display
    useEffect(() => {
        const eventMap: Record<string, AppointmentEvent> = {}
        events
            .filter((event) => moment(event.start).isSame(date, "day"))
            .forEach((event) => {
                eventMap[event.id] = {
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    date: event.date ? new Date(event.date) : new Date(event.start),
                }
            })
        setDisplayEvents(eventMap)
    }, [events, date])

    // Calculate event positions
    useEffect(() => {
        const positions: Record<string, any> = {}

        Object.values(displayEvents).forEach((event) => {
            const eventStart = moment(event.start)
            const eventEnd = moment(event.end)

            const startMinutes = (eventStart.hours() - startHour) * 60 + eventStart.minutes()
            const endMinutes = (eventEnd.hours() - startHour) * 60 + eventEnd.minutes()

            const left = (startMinutes / minutesPerSlot) * slotWidth
            const width = ((endMinutes - startMinutes) / minutesPerSlot) * slotWidth

            positions[event.id] = {
                left,
                width: Math.max(width, 60),
                startMinutes,
                durationMinutes: endMinutes - startMinutes,
                originalEvent: { ...event },
            }
        })

        setEventPositions(positions)
    }, [displayEvents, startHour, minutesPerSlot, slotWidth])

    // Sync header scroll with timeline - force synchronization
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current && headerRef.current) {
                const scrollLeft = containerRef.current.scrollLeft
                headerRef.current.scrollLeft = scrollLeft
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("scroll", handleScroll)
            // Also trigger on any scroll event
            container.addEventListener("wheel", handleScroll)
            return () => {
                container.removeEventListener("scroll", handleScroll)
                container.removeEventListener("wheel", handleScroll)
            }
        }
    }, [])

    // Auto-scroll to current time or first event
    useEffect(() => {
        if (!containerRef.current) return

        const dayEvents = events.filter((event) => moment(event.start).isSame(date, "day"))

        const scrollToPosition = (scrollPos: number) => {
            if (containerRef.current) {
                containerRef.current.scrollLeft = Math.max(0, scrollPos)
            }
        }

        if (moment(new Date()).isSame(date, "day")) {
            const now = new Date()
            const currentMinutes = (now.getHours() - startHour) * 60 + now.getMinutes()
            const scrollPos = (currentMinutes / minutesPerSlot) * slotWidth - 200
            scrollToPosition(scrollPos)
        } else if (dayEvents.length > 0 && dayEvents.length <= 3) {
            const firstEvent = dayEvents.reduce((earliest, current) =>
                moment(current.start).isBefore(moment(earliest.start)) ? current : earliest
            )
            const eventStart = moment(firstEvent.start)
            const minutesSinceStart = (eventStart.hours() - startHour) * 60 + eventStart.minutes()
            const scrollPos = (minutesSinceStart / minutesPerSlot) * slotWidth - 200
            scrollToPosition(scrollPos)
        }
    }, [date, events, startHour, slotWidth, minutesPerSlot])

    // Event handlers
    const handleEventClick = (event: AppointmentEvent) => {
        if (activeDialogEventId !== event.id) {
            setActiveDialogEventId(event.id)
            onSelectEvent(event)
        }
    }

    const handleOpenTemplateMenu = (userId: string) => {
        setSelectedUserId(userId)
        setIsApplyTemplateSelected(true)
    }

    const handleApplyTemplate = async (templateId: string) => {
        try {
            if (!selectedUserId || !templateId) {
                toast.error("Missing template or user information")
                return
            }

            await applyScheduleTemplate(templateId)
            await refetchAgencySchedules()

            toast.success("Template applied successfully")
            setIsApplyTemplateSelected(false)
            setSelectedUserId(null)
        } catch (error) {
            toast.error("Failed to apply template")
            console.error("Error applying template:", error)
        }
    }

    // Drag handlers
    const handleDragStart = (eventId: string) => {
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

        const newLeft = position.left + info.offset.x
        const minutesFromStart = Math.round((newLeft / slotWidth) * minutesPerSlot)
        const timeText = formatTimeFromMinutes(minutesFromStart)

        setDragTooltip({ eventId, time: timeText })
    }

    const handleDragEnd = (eventId: string, info: any) => {
        const position = eventPositions[eventId]
        if (!position) return

        document.body.style.cursor = ""

        const newLeft = position.left + info.offset.x
        const minutesFromStart = Math.round((newLeft / slotWidth) * minutesPerSlot)
        const clampedMinutes = Math.max(
            0,
            Math.min(minutesFromStart, (endHour - startHour) * 60 - position.durationMinutes)
        )

        const hours = Math.floor(clampedMinutes / 60) + startHour
        const minutes = clampedMinutes % 60

        const newStartDate = moment(date).hour(hours).minute(minutes).second(0).millisecond(0)
        const newEndDate = moment(newStartDate).add(position.durationMinutes, "minutes")

        const updatedEvent = {
            ...position.originalEvent,
            start: newStartDate.toDate(),
            end: newEndDate.toDate(),
        }

        setDisplayEvents((prev) => ({
            ...prev,
            [eventId]: updatedEvent,
        }))

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

        if (onEventUpdate) {
            onEventUpdate(updatedEvent)
            toast.success(`${updatedEvent.title} updated to ${newStartDate.format("h:mm A")}`)
        }

        setDragTooltip(null)
        setActiveEvent(null)
    }

    // Helper functions
    const formatTimeFromMinutes = (minutesFromStart: number) => {
        const hours = Math.floor(minutesFromStart / 60) + startHour
        const minutes = minutesFromStart % 60
        const displayHours = hours % 12 === 0 ? 12 : hours % 12
        const amPm = hours >= 12 ? "PM" : "AM"
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${amPm}`
    }

    const getEventBackground = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            const leaveTypeStyles = {
                ANNUAL_LEAVE: { bg: 'bg-green-50', text: 'text-green-700' },
                SICK_LEAVE: { bg: 'bg-red-50', text: 'text-red-700' },
                PUBLIC_HOLIDAY: { bg: 'bg-blue-50', text: 'text-blue-700' },
                UNPAID_LEAVE: { bg: 'bg-gray-50', text: 'text-gray-700' },
                MATERNITY_LEAVE: { bg: 'bg-pink-50', text: 'text-pink-700' },
                PATERNITY_LEAVE: { bg: 'bg-purple-50', text: 'text-purple-700' },
                BEREAVEMENT_LEAVE: { bg: 'bg-gray-50', text: 'text-gray-700' },
                EMERGENCY_LEAVE: { bg: 'bg-orange-50', text: 'text-orange-700' },
                MEDICAL_APPOINTMENT: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
                TOIL: { bg: 'bg-amber-50', text: 'text-amber-700' },
            }
            return leaveTypeStyles[event.leaveType as keyof typeof leaveTypeStyles] || { bg: 'bg-blue-50', text: 'text-blue-700' }
        }

        const eventTypeStyles = {
            HOME_VISIT: { bg: 'bg-blue-50', text: 'text-blue-700' },
            VIDEO_CALL: { bg: 'bg-purple-50', text: 'text-purple-700' },
            HOSPITAL: { bg: 'bg-red-50', text: 'text-red-700' },
            AUDIO_CALL: { bg: 'bg-green-50', text: 'text-green-700' },
            IN_PERSON: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
        }
        return eventTypeStyles[event.type as keyof typeof eventTypeStyles] || { bg: 'bg-gray-50', text: 'text-gray-700' }
    }

    const getEventIcon = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            const leaveIcons = {
                ANNUAL_LEAVE: <Calendar className="h-3 w-3" />,
                SICK_LEAVE: <Heart className="h-3 w-3" />,
                PUBLIC_HOLIDAY: <Flag className="h-3 w-3" />,
                UNPAID_LEAVE: <DollarSign className="h-3 w-3" />,
                MATERNITY_LEAVE: <Baby className="h-3 w-3" />,
                PATERNITY_LEAVE: <User className="h-3 w-3" />,
                BEREAVEMENT_LEAVE: <Heart className="h-3 w-3" />,
                EMERGENCY_LEAVE: <AlertTriangle className="h-3 w-3" />,
                MEDICAL_APPOINTMENT: <Stethoscope className="h-3 w-3" />,
                TOIL: <Clock className="h-3 w-3" />,
            }
            return leaveIcons[event.leaveType as keyof typeof leaveIcons] || <Calendar className="h-3 w-3" />
        }

        const eventIcons = {
            HOME_VISIT: <Home className="h-3 w-3" />,
            VIDEO_CALL: <Video className="h-3 w-3" />,
            HOSPITAL: <Building2 className="h-3 w-3" />,
            AUDIO_CALL: <Phone className="h-3 w-3" />,
            IN_PERSON: <User className="h-3 w-3" />,
        }
        return eventIcons[event.type as keyof typeof eventIcons] || <Calendar className="h-3 w-3" />
    }

    return (
        <div className="w-full h-full px-6 pb-6">
            <div className="flex rounded-lg border shadow-none bg-white border-gray-200">
                {/* Sidebar */}
                {showSidebar && (
                    <div className="w-48 shrink-0 border-r bg-gray-50 border-gray-200">
                        {/* Header */}
                        <div className="h-12 flex items-center justify-center border-b text-xs font-medium text-gray-600 border-gray-200">
                            {activeScheduleUserType === "clients" ? "CLIENTS" :
                                activeScheduleUserType === "careWorker" ? "CARE WORKERS" : "OFFICE STAFF"}
                        </div>

                        {/* Labor Costs Row */}
                        <div className="border-b px-3 flex items-center gap-2 text-gray-600 border-gray-200" style={{ height: ROW_HEIGHT }}>
                            <BankNotes className="h-4 w-4" />
                            <span className="text-sm font-medium">Labor Costs</span>
                            <ChevronDown className="h-3 w-3 ml-auto" />
                        </div>

                        {/* User Rows */}
                        {displayUsers.map((user) => (
                            <div key={user.id} className="border-b px-3 flex items-center justify-between border-gray-200" style={{ height: ROW_HEIGHT }}>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={getRandomPlaceholderImage()} alt={user.fullName} />
                                        <AvatarFallback className="text-xs">{user.fullName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                {eventsByUser[user.id]?.length || 0} <EventIcon className="h-3 w-3" />
                                            </span>
                                            <Separator orientation="vertical" className="h-3" />
                                            <span className="flex items-center gap-1">
                                                0 <HeartHandshake className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56" align="end">
                                        {!isApplyTemplateSelected ? (
                                            <div className="space-y-1">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-2 text-sm"
                                                    onClick={() => handleOpenTemplateMenu(user.id)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Apply Schedule Template
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-2 text-sm"
                                                    onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit Schedule Template
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-2 text-sm"
                                                    onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit User
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium">Select Template</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => setIsApplyTemplateSelected(false)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {isLoadingTemplates ? (
                                                    <div className="flex items-center justify-center py-4">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    </div>
                                                ) : userTemplates.length === 0 ? (
                                                    <div className="py-4 text-center text-sm text-gray-500">
                                                        No templates available
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {userTemplates.map((template: ScheduleTemplate) => (
                                                            <Button
                                                                key={template.id}
                                                                variant="ghost"
                                                                className="w-full justify-between text-sm"
                                                                onClick={() => handleApplyTemplate(template.id)}
                                                            >
                                                                <span>{template.name}</span>
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                                    Apply
                                                                </span>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </PopoverContent>
                                </Popover>
                            </div>
                        ))}
                    </div>
                )}

                {/* Timeline */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {/* Scrollable Container */}
                    <div
                        ref={containerRef}
                        className="flex-1 overflow-auto timeline-container pb-4"
                        style={{
                            scrollbarWidth: 'auto',
                            scrollbarColor: '#cbd5e1 #f1f5f9'
                        }}
                    >
                        <div style={{ width: totalTimelineWidth, minWidth: totalTimelineWidth, position: 'relative' }}>
                            {/* Time Header */}
                            <div
                                className="border-b bg-white border-gray-200"
                                style={{
                                    height: HEADER_HEIGHT,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 20,
                                    backgroundColor: '#ffffff',
                                    width: '100%'
                                }}
                            >
                                <div className="flex">
                                    {timeSlots.map((time, i) => {
                                        const isHourMark = i % slotsPerHour === 0
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center justify-center text-xs border-r flex-shrink-0 border-gray-200 text-gray-600"
                                                style={{ width: slotWidth, height: HEADER_HEIGHT }}
                                            >
                                                {isHourMark && moment(time).format("h:mm A")}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Grid Content */}
                            <div
                                className="relative"
                                style={{
                                    height: (displayUsers.length + 1) * ROW_HEIGHT,
                                    width: '100%'
                                }}
                            >
                                {/* Fixed Grid Background */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                                            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                                        `,
                                        backgroundSize: `${slotWidth}px ${ROW_HEIGHT}px`,
                                        width: '100%',
                                        height: '100%',
                                        backgroundPosition: '0 0',
                                        backgroundRepeat: 'repeat',
                                        zIndex: 1
                                    }}
                                />

                                {/* Current Time Line */}
                                {(() => {
                                    const isToday = moment(new Date()).isSame(date, "day");
                                    if (!isToday) return null;
                                    const now = new Date();
                                    const nowMinutes = now.getHours() * 60 + now.getMinutes();
                                    const minMinutes = min.getHours() * 60 + min.getMinutes();
                                    const maxMinutes = max.getHours() * 60 + max.getMinutes();
                                    if (nowMinutes < minMinutes || nowMinutes > maxMinutes) return null;
                                    const clampedMinutes = Math.max(minMinutes, Math.min(nowMinutes, maxMinutes));
                                    const left = ((clampedMinutes - (min.getHours() * 60 + min.getMinutes())) / minutesPerSlot) * slotWidth;
                                    return (
                                        <div
                                            className="absolute top-0 w-0.5 z-20 bg-red-500"
                                            style={{
                                                left,
                                                height: (displayUsers.length + 1) * ROW_HEIGHT,
                                                pointerEvents: 'none'
                                            }}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-red-500 -ml-1 animate-pulse" />
                                        </div>
                                    );
                                })()}

                                {/* Events Container */}
                                <div className="absolute inset-0 z-10">
                                    {displayUsers.map((user, userIndex) => {
                                        const userEvents = eventsByUser[user.id] || []
                                        return userEvents.map((event) => {
                                            const pos = eventPositions[event.id]
                                            if (!pos) return null

                                            const isActive = activeEvent === event.id
                                            const eventStyle = getEventBackground(event)

                                            return (
                                                <motion.div
                                                    key={event.id}
                                                    className={cn(
                                                        "absolute rounded-lg border-l-4 p-2 cursor-grab select-none shadow-none hover:shadow-none transition-shadow",
                                                        eventStyle.bg,
                                                        eventStyle.text,
                                                        isActive && "ring-2 ring-blue-500 ring-opacity-50"
                                                    )}
                                                    style={{
                                                        left: pos.left,
                                                        width: pos.width,
                                                        top: ROW_HEIGHT * (userIndex + 1) + 4,
                                                        height: ROW_HEIGHT - 8,
                                                        zIndex: isActive ? 30 : 10,
                                                        borderLeftColor: event.isLeaveEvent ? (event.color || "#3b82f6") : "#3b82f6",
                                                    }}
                                                    drag="x"
                                                    dragConstraints={{ left: 0, right: totalTimelineWidth - pos.width }}
                                                    dragMomentum={false}
                                                    onDragStart={() => handleDragStart(event.id)}
                                                    onDrag={(_, info) => handleDrag(event.id, info)}
                                                    onDragEnd={(_, info) => handleDragEnd(event.id, info)}
                                                    onClick={() => handleEventClick(event)}
                                                    whileDrag={{ scale: 1.02, zIndex: 50 }}
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {getEventIcon(event)}
                                                        <span className="font-medium text-sm truncate">{event.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
                                                        <Timer className="h-3 w-3" />
                                                        <span>
                                                            {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
                                                        </span>
                                                    </div>
                                                    {event.careWorker?.fullName && (
                                                        <div className="flex items-center gap-1 text-xs opacity-75">
                                                            <User className="h-3 w-3" />
                                                            <span className="truncate">{event.careWorker.fullName}</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )
                                        })
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drag Tooltip */}
            {dragTooltip && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-none z-50">
                    {dragTooltip.time}
                </div>
            )}

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .timeline-container::-webkit-scrollbar {
                    height: 12px;
                    width: 12px;
                    display: block;
                }
                
                .timeline-container::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 6px;
                }
                
                .timeline-container::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 6px;
                    border: 2px solid #f1f5f9;
                }
                
                .timeline-container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                
                .timeline-container::-webkit-scrollbar-corner {
                    background: #f1f5f9;
                }

                /* Always show scrollbar */
                .timeline-container {
                    scrollbar-gutter: stable;
                }
            `}</style>
        </div>
    )
}
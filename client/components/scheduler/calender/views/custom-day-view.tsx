"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import moment from "moment"
import { toast } from "sonner"
import { Home, Video, Building2, Phone, User, Calendar, MoreVertical, Edit, Plus, X, Loader2, HeartHandshake, Heart, Flag, DollarSign, Baby, AlertTriangle, Clock, Stethoscope, Timer, GripVertical, AlertCircle, Menu, List } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { useApplyScheduleTemplateMutation, useGetScheduleTemplatesQuery, useGetAgencySchedulesQuery } from "@/state/api"
import { setUserTemplates, setLoadingTemplates, setTemplateError } from "@/state/slices/templateSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"
import EventIcon from "@/components/icons/eventicon"
import type { AppointmentEvent, StaffMember, Client } from "../types"
import type { ScheduleTemplate } from "@/types/prismaTypes"
import { setEvents } from "@/state/slices/scheduleSlice"

interface CustomDayViewProps {
    date: Date
    onSelectEvent: (event: AppointmentEvent | null) => void
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
    showUnallocated?: boolean
    onToggleUnallocated?: () => void
    unallocatedVisits?: any[]
    onUnallocatedVisitDrop?: (visit: any, clientId: string, timeSlot: string) => void
}

export function CustomDayView({
    date,
    onSelectEvent,
    onEventUpdate,
    min = new Date(new Date().setHours(7, 0, 0)),
    max = new Date(new Date().setHours(19, 0, 0)),
    showSidebar = true,
    minutesPerSlot = 30,
    showUnallocated = false,
    onToggleUnallocated,
    unallocatedVisits = [],
    onUnallocatedVisitDrop,
}: CustomDayViewProps) {
    const dispatch = useAppDispatch()
    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType)
    const clients = useAppSelector((state) => state.user.clients || [])
    const careworkers = useAppSelector((state) => state.user.careWorkers || [])
    const officeStaff = useAppSelector((state) => state.user.officeStaff || [])
    const events = useAppSelector((state) => state.schedule.events || [])
    const filteredUsers = useAppSelector((state) => state.schedule.filteredUsers)
    const { userTemplates, isLoadingTemplates } = useAppSelector((state) => state.template)
    const agencyId = useAppSelector((state) => state.user.user?.userInfo?.agencyId)
    const router = useRouter()

    // State management
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [isMobileUnallocatedOpen, setIsMobileUnallocatedOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [, setActiveDialogEventId] = useState<string | null>(null)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [isApplyTemplateSelected, setIsApplyTemplateSelected] = useState<boolean>(false)
    const [eventPositions, setEventPositions] = useState<Record<string, any>>({})
    const [displayEvents, setDisplayEvents] = useState<Record<string, AppointmentEvent>>({})
    const [activeEvent, setActiveEvent] = useState<string | null>(null)
    const [dragTooltip, setDragTooltip] = useState<{ eventId: string; time: string } | null>(null)
    const [draggedEvent, setDraggedEvent] = useState<AppointmentEvent | null>(null)
    const [draggedVisit, setDraggedVisit] = useState<any>(null)
    const [hoverTimeSlot, setHoverTimeSlot] = useState<{ time: string, clientId: string } | null>(null)

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        // Initial check
        handleResize()

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Close mobile sidebars when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobile) {
                const target = event.target as HTMLElement
                if (!target.closest('.mobile-sidebar') && !target.closest('.mobile-header')) {
                    setIsMobileSidebarOpen(false)
                    setIsMobileUnallocatedOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isMobile])

    // Constants
    const startHour = min.getHours()
    const endHour = max.getHours()
    const slotsPerHour = 60 / minutesPerSlot
    const MOBILE_SLOT_WIDTH = 70
    const DESKTOP_SLOT_WIDTH = 80
    const slotWidth = isMobile ? MOBILE_SLOT_WIDTH : DESKTOP_SLOT_WIDTH
    const MOBILE_ROW_HEIGHT = 80
    const DESKTOP_ROW_HEIGHT = 60
    const ROW_HEIGHT = isMobile ? MOBILE_ROW_HEIGHT : DESKTOP_ROW_HEIGHT
    const MOBILE_HEADER_HEIGHT = 40
    const DESKTOP_HEADER_HEIGHT = 30
    const HEADER_HEIGHT = isMobile ? MOBILE_HEADER_HEIGHT : DESKTOP_HEADER_HEIGHT

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

    const totalTimelineWidth = timeSlots.length * 80

    // Group events by user
    const eventsByUser = (() => {
        const userEvents: Record<string, AppointmentEvent[]> = {}

        finalDisplayUsers.forEach((user) => {
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

            const left = (startMinutes / minutesPerSlot) * 80
            const width = ((endMinutes - startMinutes) / minutesPerSlot) * 80

            positions[event.id] = {
                left,
                width: Math.max(width, 60),
                startMinutes,
                durationMinutes: endMinutes - startMinutes,
                originalEvent: { ...event },
            }
        })

        setEventPositions(positions)
    }, [displayEvents, startHour, minutesPerSlot, 80])

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
            const scrollPos = (currentMinutes / minutesPerSlot) * 80 - 200
            scrollToPosition(scrollPos)
        } else if (dayEvents.length > 0 && dayEvents.length <= 3) {
            const firstEvent = dayEvents.reduce((earliest, current) =>
                moment(current.start).isBefore(moment(earliest.start)) ? current : earliest
            )
            const eventStart = moment(firstEvent.start)
            const minutesSinceStart = (eventStart.hours() - startHour) * 60 + eventStart.minutes()
            const scrollPos = (minutesSinceStart / minutesPerSlot) * 80 - 200
            scrollToPosition(scrollPos)
        }
    }, [date, events, startHour, 80, minutesPerSlot])

    // Event handlers
    const handleEventClick = (event: AppointmentEvent) => {
        // Always set the active dialog and trigger the event selection
        setActiveDialogEventId(event.id)
        onSelectEvent(event)
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
            setActiveDialogEventId(null)
        } catch (error) {
            toast.error("Failed to apply template")
            console.error("Error applying template:", error)
        }
    }

    // Effect to handle event selection state
    useEffect(() => {
        // Reset active dialog when event is null
        if (!onSelectEvent) {
            setActiveDialogEventId(null)
        }
        return () => {
            // Cleanup function
            setActiveDialogEventId(null)
        }
    }, [onSelectEvent])

    // Drag handlers
    const handleDragStart = (e: React.DragEvent, visit: any) => {
        if (containerRef.current) {
            scrollPositionRef.current = {
                left: containerRef.current.scrollLeft,
                top: containerRef.current.scrollTop
            }
        }
        setDraggedVisit(visit)
        e.dataTransfer.effectAllowed = 'move'
    }

    // Remove the validDropZone state since we're not using it anymore
    const [validDropZone, setValidDropZone] = useState<{ time: string, clientId: string } | null>(null)

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, time: string, clientId: string) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setHoverTimeSlot({ time, clientId })
    }

    const handleDragLeave = () => {
        setHoverTimeSlot(null)
    }

    const handleDrop = (e: React.DragEvent, clientId: string, timeSlot: string) => {
        e.preventDefault()
        setHoverTimeSlot(null)

        if (draggedVisit && onUnallocatedVisitDrop) {
            onUnallocatedVisitDrop(draggedVisit, clientId, timeSlot)
            setDraggedVisit(null)

            // Restore scroll position after a short delay to ensure the DOM has updated
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.scrollLeft = scrollPositionRef.current.left
                    containerRef.current.scrollTop = scrollPositionRef.current.top
                }
            }, 0)
        }
    }

    // Helper functions
    const formatTimeFromMinutes = (minutesFromStart: number) => {
        const hours = Math.floor(minutesFromStart / 60) + startHour
        const minutes = minutesFromStart % 60
        const displayHours = hours % 12 === 0 ? 12 : hours % 12
        const amPm = hours >= 12 ? "PM" : "AM"
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${amPm}`
    }

    const getEventBackground = (status: string) => {
        const colors = {
            PENDING: "bg-blue-50",
            CONFIRMED: "bg-green-50",
            COMPLETED: "bg-green-50",
            CANCELED: "bg-red-50",
        }
        return colors[status as keyof typeof colors] || "bg-blue-50"
    }

    const getEventTextColor = (status: string) => {
        const colors = {
            PENDING: "text-blue-700",
            CONFIRMED: "text-green-700",
            COMPLETED: "text-green-700",
            CANCELED: "text-red-700",
        }
        return colors[status as keyof typeof colors] || "text-blue-700"
    }

    const getEventBorderColor = (status: string) => {
        const colors = {
            PENDING: "border-blue-500",
            CONFIRMED: "border-green-500",
            COMPLETED: "border-green-500",
            CANCELED: "border-red-500",
        }
        return colors[status as keyof typeof colors] || "border-blue-500"
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 border-red-300 text-red-800'
            case 'high': return 'bg-orange-100 border-orange-300 text-orange-800'
            case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
            default: return 'bg-gray-100 border-gray-300 text-gray-800'
        }
    }

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours === 0) {
            return `${mins} min${mins !== 1 ? 's' : ''}`
        }
        if (mins === 0) {
            return `${hours} hour${hours !== 1 ? 's' : ''}`
        }
        return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`
    }

    const UnallocatedVisitCard = ({ visit }: { visit: any }) => (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, visit)}
            className={`p-2 rounded-lg border border-dashed cursor-move hover:shadow-md transition-all ${getPriorityColor(visit.priority)} group`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-[13px] truncate">{visit.clientName}</h4>

                    </div>
                    <div className="text-[10px] text-gray-600 mb-2 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn('p-1 rounded-full  text-[10px] font-medium', visit.priority === 'urgent' ? 'bg-red-500/80 text-red-50' :
                                visit.priority === 'high' ? 'bg-orange-500/30 text-orange-800' :
                                    'bg-yellow-500/30 text-yellow-500')}>{visit.visitType}</span>
                            <span className={cn('p-1 rounded-full  text-[10px] font-medium', visit.priority === 'urgent' ? 'bg-red-500/80 text-red-50' :
                                visit.priority === 'high' ? 'bg-orange-500/30 text-orange-800' :
                                    'bg-yellow-500/80 text-yellow-50')}>{formatDuration(visit.duration)}</span>
                            <span className={cn('p-1 rounded-full  text-[10px] font-medium', visit.priority === 'urgent' ? 'bg-red-500/80 text-red-50' :
                                visit.priority === 'high' ? 'bg-orange-500/30 text-orange-800' :
                                    'bg-yellow-500/80 text-yellow-50')}>£{visit.cost}</span>
                        </div>
                    </div>
                    {visit.notes && (
                        <div className="text-xs text-gray-500 italic">"{visit.notes}"</div>
                    )}
                </div>
            </div>
        </div>
    )

    const handleCreateVisit = (time: string, clientId: string) => {
        console.log("CLIENT ID", clientId)
        const tempEvent: AppointmentEvent = {
            id: `temp-${Date.now()}`,
            title: 'New Visit',
            start: new Date(`${date.toISOString().split('T')[0]}T${time}`),
            end: new Date(`${date.toISOString().split('T')[0]}T${time}`),
            date: date,
            startTime: time,
            endTime: time,
            resourceId: '',
            clientId: clientId,
            type: 'HOME_VISIT',
            status: 'PENDING',
            notes: '',
            color: '#4CAF50',
            careWorker: {
                fullName: 'Unassigned'
            },
            client: {
                fullName: finalDisplayUsers.find(user => user.id === clientId)?.fullName || ''
            }
        }

        // Open the event dialog with the temporary event
        setActiveDialogEventId(tempEvent.id)
        onSelectEvent(tempEvent)
    }

    // Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const scrollPositionRef = useRef<{ left: number, top: number }>({ left: 0, top: 0 })

    return (
        <div className="w-full h-full px-1 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row rounded-lg border shadow-none bg-white border-gray-200 overflow-hidden">
                {/* Mobile Header */}
                {isMobile && (
                    <div className="flex items-center justify-between p-3 border-b mobile-header bg-gray-50">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="flex items-center gap-2 px-3"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="text-sm font-medium">Menu</span>
                        </Button>
                        {showUnallocated && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileUnallocatedOpen(!isMobileUnallocatedOpen)}
                                className="flex items-center gap-2 px-3"
                            >
                                <List className="h-5 w-5" />
                                <span className="text-sm font-medium">Unallocated</span>
                            </Button>
                        )}
                    </div>
                )}

                {/* Unallocated Visits Sidebar */}
                {showUnallocated && (
                    <div className={cn(
                        "w-full sm:w-64 bg-white border-r shadow-sm overflow-y-auto max-h-screen mobile-sidebar",
                        isMobile && !isMobileUnallocatedOpen && "hidden",
                        isMobile && "absolute top-[45px] left-0 z-50 h-[calc(100vh-45px)]"
                    )}>
                        <div className="px-4 h-[31px] flex items-center justify-center border-b bg-gray-50">
                            <div className="flex items-center justify-between">
                                <h2 className="font-medium text-neutral-900 flex items-center gap-2 text-xs">
                                    Unallocated Visits
                                </h2>
                            </div>
                        </div>

                        <div className="p-4 space-y-3">
                            {unallocatedVisits.map((visit) => (
                                <UnallocatedVisitCard key={visit.id} visit={visit} />
                            ))}

                            {unallocatedVisits.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">All visits allocated!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Sidebar */}
                {showSidebar && (
                    <div className={cn(
                        "w-full sm:w-48 shrink-0 bg-gray-50 border-gray-200 mobile-sidebar",
                        isMobile && !isMobileSidebarOpen && "hidden",
                        isMobile && "absolute top-[45px] left-0 z-50 h-[calc(100vh-45px)]"
                    )}>
                        {/* Header */}
                        <div className="h-[31px] flex items-center justify-center border-b  text-xs font-medium text-gray-600 border-gray-200">
                            {activeScheduleUserType === "clients" ? "CLIENTS" :
                                activeScheduleUserType === "careWorker" ? "CARE WORKERS" : "OFFICE STAFF"}
                        </div>

                        {/* Labor Costs Row */}
                        {/* <div className="border-b px-3 flex items-center gap-2 text-gray-600 border-gray-200" style={{ height: ROW_HEIGHT }}>
                            <BankNotes className="h-4 w-4" />
                            <span className="text-sm font-medium">Labor Costs</span>
                            <ChevronDown className="h-3 w-3 ml-auto" />
                        </div> */}

                        {/* User Rows */}
                        {finalDisplayUsers.map((user) => (
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
                        className="flex-1 overflow-auto timeline-container"
                        style={{
                            scrollbarWidth: 'auto',
                            scrollbarColor: '#cbd5e1 #f1f5f9'
                        }}
                    >
                        <div style={{ width: totalTimelineWidth, minWidth: totalTimelineWidth, position: 'relative' }}>
                            {/* Time Header */}
                            <div
                                className="bg-gray-50"
                                style={{
                                    height: HEADER_HEIGHT,
                                    top: 0,
                                    zIndex: 20,
                                    width: '100%',
                                    position: 'relative',
                                    borderTop: 'none'
                                }}
                            >
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                                            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)                                        `,
                                        backgroundSize: `${slotWidth * slotsPerHour}px ${HEADER_HEIGHT}px`,
                                        width: '100%',
                                        height: '100%',
                                        backgroundPosition: '0 0',
                                        backgroundRepeat: 'repeat',
                                        zIndex: 1
                                    }}
                                />
                                <div className="flex relative z-10">
                                    {timeSlots.map((time, i) => {
                                        const isHourMark = i % slotsPerHour === 0
                                        return (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex items-end",
                                                    isHourMark ? "text-xs font-medium text-neutral-700" : "text-xs text-neutral-800"
                                                )}
                                                style={{
                                                    width: slotWidth,
                                                    height: HEADER_HEIGHT,
                                                    minWidth: slotWidth,
                                                    maxWidth: slotWidth,
                                                    paddingLeft: isMobile ? '8px' : '4px',
                                                    paddingBottom: isMobile ? '8px' : '4px'
                                                }}
                                            >
                                                {isHourMark && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-200" />
                                                )}
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
                                    height: (finalDisplayUsers.length + 1) * ROW_HEIGHT,
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
                                        zIndex: 1,
                                        boxSizing: 'border-box'
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
                                                height: (finalDisplayUsers.length + 1) * ROW_HEIGHT,
                                                pointerEvents: 'none'
                                            }}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-red-500 -ml-1 animate-pulse" />
                                        </div>
                                    );
                                })()}

                                {/* Events Container */}
                                <div className="absolute inset-0 z-10">
                                    {finalDisplayUsers.map((user, userIndex: number) => {
                                        const userEvents = eventsByUser[user.id] || []
                                        return userEvents.map((event: AppointmentEvent) => {
                                            const pos = eventPositions[event.id]
                                            if (!pos) return null

                                            const isActive = activeEvent === event.id

                                            return (
                                                <motion.div
                                                    key={event.id}
                                                    className={cn(
                                                        "absolute rounded-lg border-l-4 p-2 cursor-pointer select-none transition-shadow event-card",
                                                        getEventBackground(event.status),
                                                        getEventBorderColor(event.status),
                                                        isActive && "ring-2 ring-blue-500 ring-opacity-50"
                                                    )}
                                                    style={{
                                                        left: pos.left,
                                                        width: pos.width,
                                                        top: ROW_HEIGHT * (userIndex) + (isMobile ? 8 : 4),
                                                        height: ROW_HEIGHT - (isMobile ? 16 : 8),
                                                        zIndex: isActive ? 30 : 10,
                                                    }}
                                                    onClick={() => handleEventClick(event)}
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <div className={cn("flex items-center gap-2 mb-1 event-title", getEventTextColor(event.status))}>
                                                        {getEventIcon(event)}
                                                        <span className="font-medium text-sm truncate">{event.title}</span>
                                                    </div>
                                                    <div className={cn("flex items-center gap-1 text-xs opacity-75 mb-1 event-time", getEventTextColor(event.status))}>
                                                        <Timer className="h-3 w-3" />
                                                        <span>
                                                            {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            )
                                        })
                                    })}

                                    {/* Add drop zones for each time slot */}
                                    {finalDisplayUsers.map((user, userIndex: number) => (
                                        timeSlots.map((time, timeIndex) => {
                                            const timeStr = moment(time).format('HH:mm')
                                            const isHovered = hoverTimeSlot?.time === timeStr && hoverTimeSlot?.clientId === user.id

                                            return (
                                                <div
                                                    key={`${user.id}-${timeIndex}`}
                                                    className="absolute group"
                                                    style={{
                                                        left: timeIndex * slotWidth,
                                                        top: ROW_HEIGHT * userIndex,
                                                        width: slotWidth,
                                                        height: ROW_HEIGHT,
                                                    }}
                                                    onDragOver={showUnallocated ? (e) => handleDragOver(e, timeStr, user.id) : undefined}
                                                    onDragLeave={showUnallocated ? handleDragLeave : undefined}
                                                    onDrop={showUnallocated ? (e) => handleDrop(e, user.id, timeStr) : undefined}
                                                >
                                                    <div
                                                        className={`absolute inset-1 border-2 border-dashed rounded-lg transition-all ${showUnallocated && draggedVisit
                                                            ? isHovered
                                                                ? 'border-blue-400 bg-blue-50/50 opacity-100'
                                                                : 'border-blue-300 opacity-0'
                                                            : 'border-blue-300 opacity-0 group-hover:opacity-100 bg-blue-50/20'
                                                            } flex items-center justify-center cursor-pointer`}
                                                        onClick={() => {
                                                            if (!draggedVisit) {
                                                                handleCreateVisit(timeStr, user.id)
                                                            }
                                                        }}
                                                    >
                                                        {showUnallocated && draggedVisit && isHovered ? (
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className="text-xs text-blue-600 font-medium">
                                                                    Drop here
                                                                </span>
                                                                <span className="text-[10px] text-gray-500">
                                                                    {moment(time).format('h:mm A')}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1 w-full h-full justify-center">
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[11px] font-medium text-blue-600">
                                                                        {moment(time).format('h:mm A')}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[10px] text-gray-500 text-center">
                                                                    {user.fullName}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ))}
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

            {/* Mobile Event Card Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .event-card {
                        padding: 8px !important;
                        min-width: 90px !important;
                    }
                    .event-card .event-title {
                        font-size: 12px !important;
                        margin-bottom: 4px !important;
                    }
                    .event-card .event-time {
                        font-size: 10px !important;
                        margin-bottom: 0 !important;
                    }
                    .event-card .event-title svg {
                        width: 12px !important;
                        height: 12px !important;
                    }
                    .event-card .event-time svg {
                        width: 10px !important;
                        height: 10px !important;
                    }
                }

                /* Improve touch scrolling on mobile */
                @media (max-width: 768px) {
                    .timeline-container {
                        -webkit-overflow-scrolling: touch;
                        scroll-snap-type: x mandatory;
                    }
                    .timeline-container > div {
                        scroll-snap-align: start;
                    }
                }
            `}</style>
        </div>
    )
}
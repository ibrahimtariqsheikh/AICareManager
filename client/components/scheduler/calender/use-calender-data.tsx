"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { AppointmentEvent, StaffMember, Client, EventType } from "./types"
import { useAppSelector } from "../../../state/redux"
import { useGetSchedulesByDateRangeQuery, useGetSchedulesQuery } from "../../../state/api"


interface DateRange {
    from?: Date
    to?: Date
}

export function useCalendarData(dateRange: DateRange) {
    const [events, setEvents] = useState<AppointmentEvent[]>([])
    const [filteredEvents, setFilteredEvents] = useState<AppointmentEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [clients, setClients] = useState<Client[]>([])
    const [eventTypes, setEventTypes] = useState<EventType[]>([])
    const [sidebarMode, setSidebarMode] = useState<"staff" | "clients">("staff")

    // Get agency ID from auth state
    const { userInfo } = useAppSelector((state) => state.auth)
    const agencyId = userInfo?.agencyId || ""

    // Prepare query parameters for API calls
    const queryParams = {
        agencyId,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
        status: undefined,
        type: undefined,
        limit: 100,
        offset: 0,
    }

    // Use the appropriate query based on whether date range is provided
    const hasDateRange = Boolean(dateRange.from && dateRange.to)

    const schedulesQuery = useGetSchedulesQuery(
        {
            agencyId,
            status: undefined,
            type: undefined,
            limit: 100,
            offset: 0,
        },
        { skip: hasDateRange || !agencyId },
    )

    const dateRangeQuery = useGetSchedulesByDateRangeQuery(queryParams, { skip: !hasDateRange || !agencyId })

    // Determine which query to use
    const query = hasDateRange ? dateRangeQuery : schedulesQuery

    // Function to fetch staff and clients data
    const fetchStaffAndClients = useCallback(async () => {
        try {
            setIsLoading(true)

            // Fetch staff members (healthcare workers)
            const staffResponse = await fetch(`/api/users?role=HEALTH_WORKER&agencyId=${agencyId}`)
            if (!staffResponse.ok) throw new Error("Failed to fetch staff")
            const staffData = await staffResponse.json()

            const mappedStaff = (staffData.data || []).map((staff: any) => ({
                id: staff.id,
                name: `${staff.firstName} ${staff.lastName}`,
                role: staff.role || "Care Worker",
                color: staff.color || getRandomColor(staff.id),
                avatar: staff.profile?.avatarUrl || "",
                selected: true,
            }))

            setStaffMembers(mappedStaff)

            // Fetch clients
            const clientsResponse = await fetch(`/api/clients?agencyId=${agencyId}`)
            if (!clientsResponse.ok) throw new Error("Failed to fetch clients")
            const clientsData = await clientsResponse.json()

            const mappedClients = (clientsData.data || []).map((client: any) => ({
                id: client.id,
                name: `${client.firstName} ${client.lastName}`,
                color: client.color || getRandomColor(client.id),
                avatar: client.profile?.avatarUrl || "",
                selected: true,
            }))

            setClients(mappedClients)

            // Set up event types
            const eventTypesList: EventType[] = [
                { id: "HOME_VISIT", name: "Home Visit", color: "#4f46e5", selected: true },
                { id: "VIDEO_CALL", name: "Video Call", color: "#10b981", selected: true },
                { id: "HOSPITAL", name: "Hospital", color: "#f59e0b", selected: true },
                { id: "IN_PERSON", name: "In-Person", color: "#ef4444", selected: true },
                { id: "AUDIO_CALL", name: "Audio Call", color: "#8b5cf6", selected: true },
            ]

            setEventTypes(eventTypesList)
        } catch (error) {
            console.error("Error fetching staff and clients:", error)
            toast.error("Failed to load staff and clients data")
        }
    }, [agencyId])

    // Function to map API schedule data to calendar events
    const mapSchedulesToEvents = useCallback((schedules: any[]) => {
        return schedules.map((schedule) => ({
            id: schedule.id,
            title: schedule.title || `Appointment with ${schedule.clientName || "Client"}`,
            start: new Date(schedule.shiftStart),
            end: new Date(schedule.shiftEnd),
            resourceId: schedule.userId,
            clientId: schedule.clientId,
            type: schedule.type || "APPOINTMENT",
            status: schedule.status || "PENDING",
            notes: schedule.notes || "",
            chargeRate: schedule.chargeRate || 25,
            color: getEventColor(schedule.type),
        }))
    }, [])

    // Helper function to get a random color based on ID
    const getRandomColor = (id: string) => {
        const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]
        const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return colors[hash % colors.length]
    }

    // Helper function to get event color based on type
    const getEventColor = (type: string) => {
        switch (type) {
            case "HOME_VISIT":
                return "#4f46e5"
            case "VIDEO_CALL":
                return "#10b981"
            case "HOSPITAL":
                return "#f59e0b"
            case "IN_PERSON":
                return "#ef4444"
            case "AUDIO_CALL":
                return "#8b5cf6"
            default:
                return "#6b7280"
        }
    }

    // Fetch staff and clients on initial load
    useEffect(() => {
        if (agencyId) {
            fetchStaffAndClients()
        }
    }, [fetchStaffAndClients, agencyId])

    // Process schedules data when query results change
    useEffect(() => {
        if (query.data) {
            const schedules = query.data.data || []
            const mappedEvents = mapSchedulesToEvents(schedules)
            setEvents(mappedEvents)
            setFilteredEvents(mappedEvents)
            setIsLoading(false)
        } else if (query.error) {
            console.error("Error fetching schedules:", query.error)
            toast.error("Failed to load schedule data")
            setIsLoading(false)
        }
    }, [query.data, query.error, mapSchedulesToEvents])

    // Update loading state based on query status
    useEffect(() => {
        setIsLoading(query.isLoading)
    }, [query.isLoading])

    // Filter events when staff, clients, or event types change
    useEffect(() => {
        const selectedStaffIds = staffMembers.filter((staff) => staff.selected).map((staff) => staff.id)

        const selectedClientIds = clients.filter((client) => client.selected).map((client) => client.id)

        const selectedEventTypeIds = eventTypes.filter((type) => type.selected).map((type) => type.id)

        const filtered = events.filter((event) => {
            const staffMatch = selectedStaffIds.length === 0 || selectedStaffIds.includes(event.resourceId)
            const clientMatch = selectedClientIds.length === 0 || selectedClientIds.includes(event.clientId)
            const typeMatch = selectedEventTypeIds.length === 0 || selectedEventTypeIds.includes(event.type)

            return staffMatch && clientMatch && typeMatch
        })

        setFilteredEvents(filtered)
    }, [events, staffMembers, clients, eventTypes])

    // Function to refresh data
    const refreshData = useCallback(() => {
        query.refetch()
        fetchStaffAndClients()
    }, [query, fetchStaffAndClients])

    return {
        events,
        setEvents,
        filteredEvents,
        isLoading,
        staffMembers,
        setStaffMembers,
        clients,
        setClients,
        eventTypes,
        setEventTypes,
        sidebarMode,
        setSidebarMode,
        refreshData,
    }
}


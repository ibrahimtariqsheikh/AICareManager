"use client"

import { useState, useEffect } from "react"
import moment from "moment"
import { toast } from "sonner"
import { type StaffMember, type Client, type EventType, type AppointmentEvent } from "./types"

export function useCalendarData(dateRange: { from: Date | undefined; to: Date | undefined }) {
    const [events, setEvents] = useState<AppointmentEvent[]>([])
    const [filteredEvents, setFilteredEvents] = useState<AppointmentEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [sidebarMode, setSidebarMode] = useState<"staff" | "clients">("staff")

    // Staff members data
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
        {
            id: "staff-1",
            name: "Dr. Sarah Johnson",
            role: "Primary Care",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#4f46e5",
            selected: true,
        },
        {
            id: "staff-2",
            name: "Dr. Michael Chen",
            role: "Cardiologist",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#0891b2",
            selected: true,
        },
        {
            id: "staff-3",
            name: "Nurse Emma Rodriguez",
            role: "Registered Nurse",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#16a34a",
            selected: true,
        },
        {
            id: "staff-4",
            name: "Dr. James Wilson",
            role: "Neurologist",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#9333ea",
            selected: true,
        },
        {
            id: "staff-5",
            name: "Therapist Olivia Brown",
            role: "Physical Therapist",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#ea580c",
            selected: true,
        },
    ])

    // Clients data
    const [clients, setClients] = useState<Client[]>([
        {
            id: "client-1",
            name: "Miracle Workman",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#4f46e5",
            selected: true,
        },
        {
            id: "client-2",
            name: "Jayden Lubin",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#0891b2",
            selected: true,
        },
        {
            id: "client-3",
            name: "Jayden Culhane",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#16a34a",
            selected: true,
        },
        {
            id: "client-4",
            name: "Chance Bostrom",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#9333ea",
            selected: true,
        },
        {
            id: "client-5",
            name: "Zane Lubin",
            avatar: "/placeholder.svg?height=40&width=40",
            color: "#ea580c",
            selected: true,
        },
    ])

    // Event types data
    const [eventTypes, setEventTypes] = useState<EventType[]>([
        { id: "HOME_VISIT", name: "Home Visit", color: "#22c55e", selected: true },
        { id: "VIDEO_CALL", name: "Video Call", color: "#2563eb", selected: true },
        { id: "HOSPITAL", name: "Hospital", color: "#22c55e", selected: true },
        { id: "IN_PERSON", name: "In-Person", color: "#f59e0b", selected: true },
        { id: "AUDIO_CALL", name: "Audio Call", color: "#ef4444", selected: true },
    ])

    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true)
            try {
                // In a real app, this would be an API call to fetch appointments
                // For now, we'll use mock data
                await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay
                const mockAppointments = [
                    {
                        id: "1",
                        title: "Miracle Workman",
                        start: moment().hour(8).minute(0).toDate(),
                        end: moment().hour(10).minute(30).toDate(), // 2.5 hour appointment
                        resourceId: "staff-1",
                        clientId: "client-1",
                        status: "CONFIRMED",
                        type: "HOME_VISIT",
                    },
                    {
                        id: "2",
                        title: "Jayden Lubin",
                        start: moment().hour(9).minute(0).toDate(),
                        end: moment().hour(9).minute(30).toDate(),
                        resourceId: "staff-2",
                        clientId: "client-2",
                        status: "HOME_VISIT",
                        type: "HOME_VISIT",
                    },
                    {
                        id: "3",
                        title: "Jayden Culhane",
                        start: moment().hour(9).minute(0).toDate(),
                        end: moment().hour(9).minute(30).toDate(),
                        resourceId: "staff-1",
                        clientId: "client-3",
                        status: "VIDEO_CALL",
                        type: "VIDEO_CALL",
                    },
                    {
                        id: "4",
                        title: "Meeting",
                        start: moment().hour(8).minute(30).toDate(),
                        end: moment().hour(9).minute(0).toDate(),
                        resourceId: "staff-3",
                        clientId: "client-4",
                        status: "HOSPITAL",
                        type: "HOSPITAL",
                    },
                    {
                        id: "5",
                        title: "Chance Bostrom",
                        start: moment().hour(9).minute(30).toDate(),
                        end: moment().hour(10).minute(0).toDate(),
                        resourceId: "staff-2",
                        clientId: "client-4",
                        status: "VIDEO_CALL",
                        type: "VIDEO_CALL",
                    },
                    {
                        id: "6",
                        title: "Zane Lubin",
                        start: moment().hour(9).minute(30).toDate(),
                        end: moment().hour(10).minute(0).toDate(),
                        resourceId: "staff-3",
                        clientId: "client-5",
                        status: "HOME_VISIT",
                        type: "HOME_VISIT",
                    },
                    {
                        id: "7",
                        title: "Rayna Carder",
                        start: moment().hour(10).minute(0).toDate(),
                        end: moment().hour(10).minute(30).toDate(),
                        resourceId: "staff-1",
                        clientId: "client-1",
                        status: "VIDEO_CALL",
                        type: "VIDEO_CALL",
                    },
                    {
                        id: "8",
                        title: "Patlyn Torff",
                        start: moment().hour(10).minute(30).toDate(),
                        end: moment().hour(11).minute(0).toDate(),
                        resourceId: "staff-2",
                        clientId: "client-2",
                        status: "AUDIO_CALL",
                        type: "AUDIO_CALL",
                    },
                    {
                        id: "9",
                        title: "Eliza Morgan",
                        start: moment().add(1, "days").hour(8).minute(0).toDate(),
                        end: moment().add(1, "days").hour(8).minute(30).toDate(),
                        resourceId: "staff-1",
                        clientId: "client-3",
                        status: "CONFIRMED",
                        type: "HOME_VISIT",
                    },
                    {
                        id: "10",
                        title: "Mason Reynolds",
                        start: moment().add(1, "days").hour(9).minute(0).toDate(),
                        end: moment().add(1, "days").hour(9).minute(30).toDate(),
                        resourceId: "staff-3",
                        clientId: "client-4",
                        status: "HOSPITAL",
                        type: "HOSPITAL",
                    },
                    {
                        id: "11",
                        title: "Sophia Chen",
                        start: moment().add(1, "days").hour(10).minute(30).toDate(),
                        end: moment().add(1, "days").hour(11).minute(0).toDate(),
                        resourceId: "staff-2",
                        clientId: "client-5",
                        status: "VIDEO_CALL",
                        type: "VIDEO_CALL",
                    },
                    {
                        id: "12",
                        title: "Noah Williams",
                        start: moment().add(2, "days").hour(8).minute(30).toDate(),
                        end: moment().add(2, "days").hour(9).minute(0).toDate(),
                        resourceId: "staff-4",
                        clientId: "client-1",
                        status: "AUDIO_CALL",
                        type: "AUDIO_CALL",
                    },
                    {
                        id: "13",
                        title: "Emma Johnson",
                        start: moment().add(2, "days").hour(11).minute(0).toDate(),
                        end: moment().add(2, "days").hour(11).minute(30).toDate(),
                        resourceId: "staff-5",
                        clientId: "client-2",
                        status: "HOME_VISIT",
                        type: "HOME_VISIT",
                    },
                    {
                        id: "14",
                        title: "Liam Davis",
                        start: moment().add(3, "days").hour(9).minute(0).toDate(),
                        end: moment().add(3, "days").hour(9).minute(30).toDate(),
                        resourceId: "staff-4",
                        clientId: "client-3",
                        status: "VIDEO_CALL",
                        type: "VIDEO_CALL",
                    },
                    {
                        id: "15",
                        title: "Olivia Martinez",
                        start: moment().add(3, "days").hour(13).minute(0).toDate(),
                        end: moment().add(3, "days").hour(13).minute(30).toDate(),
                        resourceId: "staff-5",
                        clientId: "client-4",
                        status: "HOSPITAL",
                        type: "HOSPITAL",
                    },
                ]

                setEvents(mockAppointments)
                applyFilters(mockAppointments, staffMembers, clients, eventTypes, sidebarMode)
            } catch (error) {
                console.error("Failed to fetch appointments:", error)
                toast.error("Failed to load appointments. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchAppointments()
    }, [dateRange])

    // Apply filters based on selected staff members/clients and event types
    const applyFilters = (
        allEvents: AppointmentEvent[],
        staff: StaffMember[],
        clientList: Client[],
        types: EventType[],
        mode: string
    ) => {
        const selectedStaffIds = staff.filter((s) => s.selected).map((s) => s.id)
        const selectedClientIds = clientList.filter((c) => c.selected).map((c) => c.id)
        const selectedTypeIds = types.filter((t) => t.selected).map((t) => t.id)

        const filtered = allEvents.filter((event) => {
            const staffMatch = selectedStaffIds.includes(event.resourceId)
            const clientMatch = selectedClientIds.includes(event.clientId)
            const typeMatch = selectedTypeIds.includes(event.type)

            if (mode === "staff") {
                return staffMatch && typeMatch
            } else {
                return clientMatch && typeMatch
            }
        })

        setFilteredEvents(filtered)
    }

    // Update filtered events whenever filters change
    useEffect(() => {
        applyFilters(events, staffMembers, clients, eventTypes, sidebarMode)
    }, [events, staffMembers, clients, eventTypes, sidebarMode])

    return {
        events,
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
        applyFilters
    }
}

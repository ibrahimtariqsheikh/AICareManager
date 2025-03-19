"use client"

import moment from "moment"
import type { StaffMember, Client, EventType } from "./types"

export function useCalendarStyles(
    filteredEvents: any[],
    staffMembers: StaffMember[],
    clients: Client[],
    eventTypes: EventType[],
    sidebarMode: "staff" | "clients",
) {
    // Calculate event duration in minutes
    const getEventDurationInMinutes = (event: any) => {
        const start = moment(event.start)
        const end = moment(event.end)
        return end.diff(start, "minutes")
    }

    // Get event background class based on type
    const getEventBackgroundClass = (eventType: string) => {
        switch (eventType) {
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

    // Get event border color based on staff or client
    const getEventBorderColor = (event: any) => {
        if (sidebarMode === "staff") {
            const staffMember = staffMembers.find((staff) => staff.id === event.resourceId)
            return staffMember?.color || "#888888"
        } else {
            const client = clients.find((c) => c.id === event.clientId)
            return client?.color || "#888888"
        }
    }

    // Get event type label
    const getEventTypeLabel = (eventType: string) => {
        const type = eventTypes.find((t) => t.id === eventType)
        return type?.name || "Appointment"
    }

    return {
        getEventDurationInMinutes,
        getEventBackgroundClass,
        getEventBorderColor,
        getEventTypeLabel,
    }
}


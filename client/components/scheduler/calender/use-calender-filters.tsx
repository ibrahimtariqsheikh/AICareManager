"use client"

import { type CalendarFilterState } from "./types"

export function useCalendarFilters({
    events,
    staffMembers,
    clients,
    eventTypes,
    sidebarMode,
    setSidebarMode
}: CalendarFilterState) {
    // Toggle staff member selection
    const toggleStaffSelection = (staffId: string) => {
        const updatedStaff = staffMembers.map((staff) =>
            staff.id === staffId ? { ...staff, selected: !staff.selected } : staff,
        )
        return updatedStaff;
    }

    // Toggle client selection
    const toggleClientSelection = (clientId: string) => {
        const updatedClients = clients.map((client) =>
            client.id === clientId ? { ...client, selected: !client.selected } : client,
        )
        return updatedClients;
    }

    // Toggle event type selection
    const toggleEventTypeSelection = (typeId: string) => {
        const updatedTypes = eventTypes.map((type) => (type.id === typeId ? { ...type, selected: !type.selected } : type))
        return updatedTypes;
    }

    // Select all staff members
    const selectAllStaff = () => {
        return staffMembers.map((staff) => ({ ...staff, selected: true }));
    }

    // Deselect all staff members
    const deselectAllStaff = () => {
        return staffMembers.map((staff) => ({ ...staff, selected: false }));
    }

    // Select all clients
    const selectAllClients = () => {
        return clients.map((client) => ({ ...client, selected: true }));
    }

    // Deselect all clients
    const deselectAllClients = () => {
        return clients.map((client) => ({ ...client, selected: false }));
    }

    // Toggle sidebar mode between staff and clients
    const toggleSidebarMode = () => {
        const newMode = sidebarMode === "staff" ? "clients" : "staff"
        setSidebarMode(newMode)
        return newMode;
    }

    // Apply filters based on selected staff members/clients and event types
    const applyFilters = (
        allEvents: any[],
        staff: any[],
        clientList: any[],
        types: any[],
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

        return filtered
    }

    return {
        toggleStaffSelection,
        toggleClientSelection,
        toggleEventTypeSelection,
        selectAllStaff,
        deselectAllStaff,
        selectAllClients,
        deselectAllClients,
        toggleSidebarMode,
        applyFilters
    }
}

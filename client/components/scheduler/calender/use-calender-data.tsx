"use client"

import { useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAppSelector, useAppDispatch } from "../../../state/redux"
import { useGetSchedulesByDateRangeQuery, useGetSchedulesQuery, useGetFilteredUsersQuery } from "../../../state/api"
import { setFilteredEvents, toggleEventTypeSelection, setSidebarMode } from "../../../state/slices/scheduleSlice"
import { filterEvents } from "./calender-utils"
import type { SidebarMode } from "./types"

interface DateRange {
    from?: Date
    to?: Date
}

export function useCalendarData(dateRange: DateRange) {
    const dispatch = useAppDispatch()

    // Get user info from auth state
    const { userInfo } = useAppSelector((state) => state.auth)
    const userId = userInfo?.cognitoId || ""

    // Get data from Redux store
    const { officeStaff, careWorkers, clients, loading: usersLoading } = useAppSelector((state) => state.user)
    const {
        events,
        filteredEvents,
        eventTypes,
        sidebarMode,
        loading: schedulesLoading,
        error,
    } = useAppSelector((state) => state.schedule)

    // Prepare query parameters for API calls
    const queryParams = {
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
        status: undefined,
        type: undefined,
        limit: 100,
        offset: 0,
    }

    // Use the appropriate query based on whether date range is provided
    const hasDateRange = Boolean(dateRange.from && dateRange.to)

    // Fetch schedules
    const schedulesQuery = useGetSchedulesQuery(
        {
            status: undefined,
            type: undefined,
            limit: 100,
            offset: 0,
        },
        { skip: hasDateRange || !userId },
    )

    const dateRangeQuery = useGetSchedulesByDateRangeQuery(queryParams, { skip: !hasDateRange || !userId })

    // Fetch users (staff and clients)
    const { refetch: refetchUsers } = useGetFilteredUsersQuery(userId, {
        skip: !userId,
    })

    // Determine which query to use
    const query = hasDateRange ? dateRangeQuery : schedulesQuery

    // Update filtered events when staff, clients, or event types change
    useEffect(() => {
        const careWorkerMembers = careWorkers.map((staff) => ({
            id: staff.id,
            name: `${staff.firstName} ${staff.lastName}`,
            role: staff.role || "CARE_WORKER",
            color: staff.color || "#000000",
            avatar: staff.profile?.avatarUrl || "",
            selected: true,
        }))

        const officeStaffMembers = officeStaff.map((staff) => ({
            id: staff.id,
            name: `${staff.firstName} ${staff.lastName}`,
            role: staff.role || "OFFICE_STAFF",
            color: staff.color || "#000000",
            avatar: staff.profile?.avatarUrl || "",
            selected: true,
        }))

        const formattedClients = clients.map((client) => ({
            id: client.id,
            name: `${client.firstName} ${client.lastName}`,
            color: client.color || "#000000",
            avatar: client.profile?.avatarUrl || "",
            selected: true,
        }))

        const filtered = filterEvents(
            events,
            careWorkerMembers,
            officeStaffMembers,
            formattedClients,
            eventTypes,
            sidebarMode,
        )
        dispatch(setFilteredEvents(filtered))
    }, [events, officeStaff, careWorkers, clients, sidebarMode, dispatch])

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    // Function to refresh data
    const refreshData = useCallback(() => {
        query.refetch()
        refetchUsers()
    }, [query, refetchUsers])

    // Toggle event type selection
    const handleToggleEventType = useCallback(
        (typeId: string) => {
            dispatch(toggleEventTypeSelection(typeId))
        },
        [dispatch],
    )

    // Set sidebar mode
    const handleSetSidebarMode = useCallback(
        (mode: SidebarMode) => {
            dispatch(setSidebarMode(mode))
        },
        [dispatch],
    )

    return {
        events,
        filteredEvents,
        isLoading: schedulesLoading || usersLoading,
        eventTypes,
        sidebarMode,
        setSidebarMode: handleSetSidebarMode,
        toggleEventTypeSelection: handleToggleEventType,
        refreshData,
    }
}


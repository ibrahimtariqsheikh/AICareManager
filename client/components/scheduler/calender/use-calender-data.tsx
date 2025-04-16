"use client"

import { useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useAppSelector, useAppDispatch } from "../../../state/redux"
import { useGetSchedulesQuery, useGetUsersQuery } from "../../../state/api"
import { setFilteredEvents, setSidebarMode } from "../../../state/slices/scheduleSlice"

import type { SidebarMode, StaffMember, Client } from "./types"
import { filterEvents } from "./calender-utils"

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
        sidebarMode,
        loading: schedulesLoading,
        error,
    } = useAppSelector((state) => state.schedule)

    // Prepare query parameters for API calls
    const queryParams = {
        limit: 100,
        offset: 0,
        ...(userId ? { userId } : {}),
        ...(dateRange.from ? { startDate: dateRange.from.toISOString() } : {}),
        ...(dateRange.to ? { endDate: dateRange.to.toISOString() } : {}),
    }

    // Use the appropriate query based on whether date range is provided
    const hasDateRange = Boolean(dateRange.from && dateRange.to)

    // Fetch schedules
    const schedulesQuery = useGetSchedulesQuery(queryParams, { skip: hasDateRange || !userId })

    // Fetch users (staff and clients)
    const { refetch: refetchUsers } = useGetUsersQuery(
        {
            role: "CARE_WORKER",
            agencyId: userInfo?.agencyId || "",
        },
        { skip: !userInfo?.agencyId },
    )

    // Update filtered events when staff, clients, or event types change
    useEffect(() => {
        const careWorkerMembers: StaffMember[] = careWorkers.map((staff) => ({
            id: staff.id,
            firstName: staff.firstName || "",
            lastName: staff.lastName || "",
            name: `${staff.firstName} ${staff.lastName}`,
            role: staff.role || "CARE_WORKER",
            color: staff.color || "#000000",
            avatar: staff.profile?.avatarUrl || "",
            selected: true,
        }))

        const officeStaffMembers: StaffMember[] = officeStaff.map((staff) => ({
            id: staff.id,
            firstName: staff.firstName || "",
            lastName: staff.lastName || "",
            name: `${staff.firstName} ${staff.lastName}`,
            role: staff.role || "OFFICE_STAFF",
            color: staff.color || "#000000",
            avatar: staff.profile?.avatarUrl || "",
            selected: true,
        }))

        const formattedClients: Client[] = clients.map((client) => ({
            id: client.id,
            firstName: client.firstName || "",
            lastName: client.lastName || "",
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
        schedulesQuery.refetch()
        refetchUsers()
    }, [schedulesQuery, refetchUsers])

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
        sidebarMode,
        setSidebarMode: handleSetSidebarMode,
        refreshData,
    }
}


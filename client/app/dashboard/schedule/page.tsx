"use client"

import { useEffect, useState } from "react"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { User } from "../../../types/prismaTypes"
import { useGetUsersQuery, useGetUserQuery } from "../../../state/api"
import { useDispatch } from "react-redux"
import { setOfficeStaff } from "../../../state/slices/userSlice"
import { setClients } from "../../../state/slices/userSlice"
import { useAppSelector } from "../../../state/redux"
import { setCareWorkers } from "../../../state/slices/userSlice"
import { PlusCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"

export default function SchedulerPage() {
    const [isCreating, setIsCreating] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [view, setView] = useState<"day" | "week" | "month">("week")
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: new Date(),
        to: undefined,
    })

    const dispatch = useDispatch()
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { careWorkers, clients, officeStaff } = useAppSelector((state: any) => state.user)
    const { data: authUser, isLoading: isLoadingUser } = useGetUserQuery()
    const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery({
        agencyId: authUser?.userInfo?.agencyId || "",
        role: "CARE_WORKER,CLIENT,OFFICE_STAFF"
    })

    const isLoading = isLoadingUser || isLoadingUsers

    useEffect(() => {
        if (usersResponse?.data) {
            const users = usersResponse.data
            dispatch(setCareWorkers(users.filter(user => user.role === "CARE_WORKER")))
            dispatch(setClients(users.filter(user => user.role === "CLIENT")))
            dispatch(setOfficeStaff(users.filter(user => user.role === "OFFICE_STAFF")))
        }
    }, [usersResponse])

    const handleEventSelect = (event: any) => {
        setSelectedEvent(event)
        setIsCreating(false)
    }

    const handleCreateNew = () => {
        setSelectedEvent(null)
        setIsCreating(true)
    }

    const handleCloseForm = () => {
        setIsCreating(false)
        setSelectedEvent(null)
    }

    if (isLoading) {
        return (
            <div className="p-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Calendar View Toggle Skeleton */}
                <div className="flex items-center gap-2 mb-6">
                    {["Day", "Week", "Month"].map((view) => (
                        <div key={view} className="h-9 w-20 bg-muted rounded animate-pulse" />
                    ))}
                </div>

                {/* Calendar Grid Skeleton */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="h-8 bg-muted rounded animate-pulse" />
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
                    ))}
                </div>

                {/* Sidebar Skeleton */}
                <div className="fixed right-0 top-0 h-full w-80 border-l bg-card p-6 hidden lg:block">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-10 w-full bg-muted rounded animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-10 w-full bg-muted rounded animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-32 w-full bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4 min-h-screen min-w-full">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">Schedule</h1>
                        <p className="text-sm text-muted-foreground">
                            Your schedule for the week. Add, edit, or delete appointments as needed. Create new appointments for clients.
                            And manage your schedule. And Track your time. and more. We have you covered.
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateNew}
                        size="sm"
                        className={`hidden sm:flex`}
                    >
                        <PlusCircle className="h-4 w-4 mr-1.5" />
                        New Appointment
                    </Button>
                </div>

                <Calendar view={view} onEventSelect={handleEventSelect} dateRange={dateRange} />
            </div>
        </div>
    )
}

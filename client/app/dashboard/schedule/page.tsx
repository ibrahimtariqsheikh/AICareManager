"use client"

import { useEffect, useState } from "react"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { User } from "../../../types/prismaTypes"
import { useGetFilteredUsersQuery, useGetUserQuery } from "../../../state/api"
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
    const { data: authUser } = useGetUserQuery()

    const { data: filteredUsers } = useGetFilteredUsersQuery(authUser?.userInfo?.id || "")

    useEffect(() => {
        if (filteredUsers) {
            dispatch(setCareWorkers(filteredUsers.careWorkers))
            dispatch(setClients(filteredUsers.clients))
            dispatch(setOfficeStaff(filteredUsers.officeStaff))
        }
    }, [filteredUsers])



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

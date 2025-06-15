"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from "@/types/prismaTypes"
import moment from "moment"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"


// Define interfaces for the schedule data
interface ClientSchedule {
    id: string
    agencyId: string
    clientId: string
    userId: string
    date: string
    startTime: string
    endTime: string
    status: string
    type: string
    notes: string
    chargeRate: number
    createdAt: string
    updatedAt: string
    visitTypeId: string | null
}

interface ProcessedSchedule {
    id: string
    title: string
    start: Date
    end: Date
    status: string
    notes: string
    careWorkerId: string
    clientId: string
    type: string
}

const AppointmentHistory = ({ user }: { user: User }) => {
    const schedules = user.clientSchedules || [] as ClientSchedule[]
    const [searchQuery] = useState("")

    // Convert schedules to a consistent format
    const processedSchedules = schedules.map((schedule: ClientSchedule): ProcessedSchedule => ({
        id: schedule.id,
        title: schedule.type,
        start: new Date(`${schedule.date.split('T')[0]}T${schedule.startTime}`),
        end: new Date(`${schedule.date.split('T')[0]}T${schedule.endTime}`),
        status: schedule.status,
        notes: schedule.notes,
        careWorkerId: schedule.userId,
        clientId: schedule.clientId,
        type: schedule.type
    }))

    // Sort and split schedules into upcoming and past
    const currentDate = new Date()
    const upcomingSchedules = processedSchedules
        .filter((schedule: ProcessedSchedule) => new Date(schedule.start) > currentDate)
        .sort((a: ProcessedSchedule, b: ProcessedSchedule) => new Date(a.start).getTime() - new Date(b.start).getTime())

    const pastSchedules = processedSchedules
        .filter((schedule: ProcessedSchedule) => new Date(schedule.start) <= currentDate)
        .sort((a: ProcessedSchedule, b: ProcessedSchedule) => new Date(b.start).getTime() - new Date(a.start).getTime())

    // Filter schedules based on search query
    const filterSchedules = (schedules: ProcessedSchedule[]): ProcessedSchedule[] => {
        if (!searchQuery) return schedules

        return schedules.filter(
            (schedule) =>
                schedule.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                schedule.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                schedule.type?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }

    const filteredUpcomingSchedules = filterSchedules(upcomingSchedules)
    const filteredPastSchedules = filterSchedules(pastSchedules)

    // Group upcoming schedules by date
    const groupSchedulesByDate = (schedules: ProcessedSchedule[]): Record<string, ProcessedSchedule[]> => {
        const grouped: Record<string, ProcessedSchedule[]> = {}

        schedules.forEach((schedule) => {
            const dateKey = moment(schedule.start).format("YYYY-MM-DD")
            if (!grouped[dateKey]) {
                grouped[dateKey] = []
            }
            grouped[dateKey].push(schedule)
        })

        return grouped
    }

    const upcomingSchedulesByDate = groupSchedulesByDate(filteredUpcomingSchedules)
    const pastSchedulesByDate = groupSchedulesByDate(filteredPastSchedules)

    // Render a single appointment in timeline style
    const renderAppointment = (schedule: ProcessedSchedule) => {
        const startTime = moment(schedule.start).format("h:mm A")
        const endTime = moment(schedule.end).format("h:mm A")
        const duration = moment
            .duration(moment(schedule.end).diff(moment(schedule.start)))
            .asHours()
            .toFixed(1)

        return (
            <div key={schedule.id} className="flex group">
                <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-0.5 h-full bg-gray-200 group-last:hidden"></div>
                </div>
                <div className="flex-1 pb-6">
                    <div
                        className={cn(
                            "border-l-4 rounded-r-md p-3 transition-all",
                            schedule.status === "CONFIRMED" && "border-l-green-500 bg-green-50",
                            schedule.status === "PENDING" && "border-l-blue-500 bg-blue-50",
                            schedule.status === "CANCELED" && "border-l-red-500 bg-red-50",
                            schedule.status === "COMPLETED" && "border-l-blue-500 bg-blue-50",
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-medium text-base">{schedule.title}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {startTime} - {endTime} ({duration} hrs)
                                </div>
                            </div>
                            <Badge
                                className={cn(
                                    "uppercase text-xs font-semibold",
                                    schedule.status === "CONFIRMED" && "bg-green-100 text-green-800 border-green-200",
                                    schedule.status === "PENDING" && "bg-blue-100 text-blue-800 border-blue-200",
                                    schedule.status === "CANCELED" && "bg-red-100 text-red-800 border-red-200",
                                    schedule.status === "COMPLETED" && "bg-blue-100 text-blue-800 border-blue-200",
                                )}
                            >
                                {schedule.status.toLowerCase()}
                            </Badge>
                        </div>

                        <div className="mt-2 text-sm">
                            <div className="font-medium">{schedule.type}</div>
                        </div>

                        {schedule.notes && <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border">{schedule.notes}</div>}
                    </div>
                </div>
            </div>
        )
    }

    // Render a date group
    const renderDateGroup = (dateKey: string, schedules: ProcessedSchedule[]) => {
        if (!schedules) return null
        const date = moment(dateKey)
        const isToday = date.isSame(moment(), "day")
        const isTomorrow = date.isSame(moment().add(1, "day"), "day")

        let dateDisplay = date.format("dddd, MMMM D")
        if (isToday) dateDisplay = "Today"
        else if (isTomorrow) dateDisplay = "Tomorrow"

        return (
            <div key={dateKey} className="mb-6">
                <div className="flex items-center mb-2">
                    <div
                        className={cn(
                            "text-sm font-medium px-3 py-1 rounded-full",
                            isToday ? "bg-primary text-white" : "bg-gray-100",
                        )}
                    >
                        {dateDisplay}
                    </div>
                    <div className="ml-2 text-xs text-gray-500">
                        {schedules.length} appointment{schedules.length !== 1 ? "s" : ""}
                    </div>
                </div>
                <div className="ml-2">{schedules.map(renderAppointment)}</div>
            </div>
        )
    }

    // Empty state components with minimal design
    const EmptyState = ({ message }: { message: string }) => (
        <div className="text-center py-10 border border-dashed rounded">
            <p className="text-gray-500">{message}</p>
        </div>
    )

    return (
        <Card className="p-4 shadow-none">

            <CardContent className="px-0 pb-0">
                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-6">
                        <TabsTrigger value="upcoming">Upcoming ({filteredUpcomingSchedules.length})</TabsTrigger>
                        <TabsTrigger value="past">Past ({filteredPastSchedules.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                        {filteredUpcomingSchedules.length === 0 ? (
                            <EmptyState message="No upcoming appointments found" />
                        ) : (
                            <div className="space-y-2 pl-2">
                                {Object.keys(upcomingSchedulesByDate).map((dateKey) =>
                                    renderDateGroup(dateKey, upcomingSchedulesByDate[dateKey] || []),
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past">
                        {filteredPastSchedules.length === 0 ? (
                            <EmptyState message="No past appointments found" />
                        ) : (
                            <div className="space-y-2 pl-2">
                                {Object.keys(pastSchedulesByDate).map((dateKey) =>
                                    renderDateGroup(dateKey, pastSchedulesByDate[dateKey] || []),
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default AppointmentHistory

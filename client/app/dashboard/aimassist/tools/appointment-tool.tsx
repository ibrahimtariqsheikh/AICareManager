"use client"

import type { ToolInvocation } from "ai"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/state/redux"
import { useGetAgencySchedulesQuery } from "@/state/api"

interface AppointmentToolProps {
    toolInvocation: ToolInvocation
}

export function AppointmentTool({ toolInvocation }: AppointmentToolProps) {
    const agencyId = useAppSelector((state) => state.user.user.userInfo?.agencyId)
    const { data: events = [], isLoading } = useGetAgencySchedulesQuery(agencyId || '', {
        skip: !agencyId
    })

    console.log(events)
    const [_, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => {
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    // Find all appointments for the client (case insensitive)
    const clientAppointments = events.filter(event =>
        event.client?.fullName?.toLowerCase() === toolInvocation.args.client_name?.toLowerCase()
    )

    // Sort appointments by date (most recent first)
    const sortedAppointments = clientAppointments.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatTime = (timeString: string | undefined) => {
        if (!timeString) return 'N/A'
        const [hours, minutes] = timeString.split(':')
        const date = new Date()
        date.setHours(parseInt(hours || '0'), parseInt(minutes || '0'))
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded-md border border-muted-foreground/10 w-fit">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading Schedule</span>
            </div>
        )
    }

    if (sortedAppointments.length === 0) {
        return (
            <div className="flex group my-4">
                <div className="flex-1 pb-4">
                    <div className="border-l-4 border-l-yellow-500 rounded-r-md p-2 bg-yellow-50">
                        <div className="text-sm text-gray-500">
                            <div className="font-medium">No appointments found for {toolInvocation.args.client_name}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 my-4 w-full max-w-full xl:w-[800px]">
            {sortedAppointments.map((appointment, index) => (
                <div key={index} className="flex-1 pb-4 w-full">
                    <div className={`border-l-4 rounded-r-md p-4 w-full ${appointment.status.toLowerCase() === 'confirmed'
                        ? 'border-l-blue-500 bg-blue-50'
                        : 'border-l-yellow-500 bg-yellow-50'
                        }`}>
                        <div className="text-sm text-gray-500">
                            <div className="flex justify-between items-start">
                                <div className="font-medium text-black">Appointment {index + 1}</div>
                                <Badge className={`uppercase text-xs font-semibold shadow-none ${appointment.status.toLowerCase() === 'confirmed'
                                    ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-800'
                                    }`}>
                                    {appointment.status}
                                </Badge>
                            </div>
                            <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Client:</span>
                                    <span className="font-medium text-neutral-700">{appointment.client?.fullName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="font-medium text-neutral-700">{formatDate(appointment.date)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Time:</span>
                                    <span className="font-medium text-neutral-700">{`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Care Worker:</span>
                                    <span className="font-medium text-neutral-700">{appointment.careWorker?.fullName || "Not assigned"}</span>
                                </div>
                                {appointment.notes && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Notes:</span>
                                        <span className="font-medium text-neutral-700">{appointment.notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
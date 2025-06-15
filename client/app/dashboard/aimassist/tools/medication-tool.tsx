"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { addMedicationLog, setMedications, setMedicationLogs } from "@/state/slices/medicationSlice"
import { toast } from "sonner"
import { Calendar, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ToolInvocation } from "ai"
import { useGetUserByIdQuery } from "@/state/api"
import { Skeleton } from "@/components/ui/skeleton"
import type { User, Medication } from "@/types/prismaTypes"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit"

interface MedicationToolResult {
    client_name: string
    status: string
}

type ExtendedToolInvocation = ToolInvocation & {
    result?: MedicationToolResult
}

interface ExtendedUser extends User {
    medications?: Medication[]
}

export function MedicationTool(toolInvocation: ExtendedToolInvocation) {
    const dispatch = useAppDispatch()
    const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth().toString())
    const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString())
    const [error, setError] = React.useState<string | null>(null)

    // Get client ID from the tool invocation result
    const clientId = toolInvocation.result?.client_name

    // Fetch user data
    const {
        data: userData,
        isLoading: isUserLoading,
        error: userError,
    } = useGetUserByIdQuery(clientId || "", {
        skip: !clientId,
        refetchOnMountOrArgChange: true,
    })

    const user = userData?.data as ExtendedUser

    // Set medications and logs in Redux when user data is loaded
    React.useEffect(() => {
        if (user) {
            const medicationsFromUser = user.medications || []
            const logsFromUser = medicationsFromUser.map((medication: Medication) => medication.logs || []).flat()
            dispatch(setMedications(medicationsFromUser))
            dispatch(setMedicationLogs(logsFromUser))
        }
    }, [dispatch, user])

    // Get medications and logs from Redux
    const { medications = [], medicationLogs = [] } = useAppSelector((state) => state.medication) || {}

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const handlePreviousMonth = () => {
        let newMonth = Number.parseInt(selectedMonth) - 1
        let newYear = Number.parseInt(selectedYear)

        if (newMonth < 0) {
            newMonth = 11
            newYear -= 1
        }

        setSelectedMonth(newMonth.toString())
        setSelectedYear(newYear.toString())
    }

    const handleNextMonth = () => {
        let newMonth = Number.parseInt(selectedMonth) + 1
        let newYear = Number.parseInt(selectedYear)

        if (newMonth > 11) {
            newMonth = 0
            newYear += 1
        }

        setSelectedMonth(newMonth.toString())
        setSelectedYear(newYear.toString())
    }

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getStartDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    const daysInMonth = getDaysInMonth(Number.parseInt(selectedYear), Number.parseInt(selectedMonth))
    const startDay = getStartDayOfMonth(Number.parseInt(selectedYear), Number.parseInt(selectedMonth))

    const calendarDays = Array.from({ length: 42 }, (_, i) => {
        const day = i - startDay + 1
        return day > 0 && day <= daysInMonth ? day : null
    })

    const weeks: number[][] = []
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7) as number[])
    }

    const getStatusForDay = (medicationId: string, day: number | undefined, timeOfDay?: string): string => {
        if (!day) return "empty"

        const matchingLog = medicationLogs.find((log) => {
            const logDate = new Date(log.date)
            const localLogDate = new Date(logDate.getTime() + logDate.getTimezoneOffset() * 60000)

            return (
                log.medicationId === medicationId &&
                localLogDate.getDate() === day &&
                localLogDate.getMonth() === Number.parseInt(selectedMonth) &&
                (!timeOfDay || log.time === timeOfDay.toUpperCase())
            )
        })

        if (matchingLog) {
            return matchingLog.status.toUpperCase()
        }

        const medication = medications.find((med) => med.id === medicationId)
        const isTimeScheduled = timeOfDay && medication && medication[timeOfDay.toLowerCase() as keyof typeof medication]
        return isTimeScheduled ? "NOT_REPORTED" : "NOT_SCHEDULED"
    }

    const getStatusClass = (status: string) => {
        switch (status.toUpperCase()) {
            case "TAKEN":
                return "bg-emerald-400"
            case "NOT_TAKEN":
                return "bg-red-500"
            case "NOT_REPORTED":
                return "bg-gray-100 border border-gray-200"
            case "NOT_SCHEDULED":
                return "bg-gray-50"
            case "EMPTY":
                return "bg-transparent"
            default:
                return "bg-gray-100"
        }
    }

    const getDayStatus = (status: string) => {
        switch (status.toUpperCase()) {
            case "TAKEN":
                return "text-white"
            case "NOT_TAKEN":
                return "text-white"
            case "NOT_REPORTED":
                return "text-neutral-500"
            case "NOT_SCHEDULED":
                return "text-neutral-500"
            case "EMPTY":
                return "text-neutral-500"
            default:
                return "text-neutral-500"
        }
    }

    const getStatusTitle = (status: string) => {
        switch (status.toUpperCase()) {
            case "TAKEN":
                return "Taken"
            case "NOT_TAKEN":
                return "Not taken"
            case "NOT_REPORTED":
                return "Not reported"
            case "NOT_SCHEDULED":
                return "Not scheduled"
            case "EMPTY":
                return ""
            default:
                return ""
        }
    }

    const getTimeLabel = (timeOfDay: string) => {
        const timeLabels = {
            morning: { label: "Morning" },
            afternoon: { label: "Lunchtime" },
            evening: { label: "Evening" },
            bedtime: { label: "Bed time" },
            asNeeded: { label: "As needed" },
        }

        return timeLabels[timeOfDay as keyof typeof timeLabels] || { label: timeOfDay }
    }

    // Show loading state while fetching user data
    if (isUserLoading) {
        return (
            <div className="flex flex-col gap-4 p-4 sm:p-6 mx-4 sm:mx-10">
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-neutral-600">Loading medication data...</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-2 items-start sm:items-center justify-between mx-0 sm:mx-4">
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div>
                                <Skeleton className="h-8 w-48" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-24 rounded-md" />
                        </div>
                    </div>
                </div>

                <div className="px-2 sm:px-6 py-4">
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-9 w-24 sm:w-36 rounded-md" />
                        ))}
                    </div>
                    <div className="border-b border-border w-full h-1 my-4 sm:my-8" />

                    <div className="min-h-[400px] space-y-4">
                        <Skeleton className="h-10 w-1/2 sm:w-1/4" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state if there's an error
    if (error || userError) {
        return (
            <div className="w-[320px]">
                <Card className="bg-background p-4 rounded-lg shadow-sm border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="font-medium">Error</div>
                            <div className="text-sm text-red-500">
                                {error || (userError && 'Failed to load user data')}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    if (toolInvocation.state === "result" && toolInvocation.result) {
        return (
            <div className="p-2">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                    <h2 className="text-lg font-semibold text-neutral-800 flex items-center">
                        <Calendar className="mr-3 w-4 h-4" />
                        Medication Log for {toolInvocation.result.client_name}
                    </h2>
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePreviousMonth}
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 rounded-full"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="text-lg font-semibold text-neutral-800">
                            {monthNames[Number.parseInt(selectedMonth)]} {selectedYear}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextMonth}
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 rounded-full"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {medications.length > 0 ? (
                    <>
                        <div className="mb-6 flex justify-between items-center">
                            <div className="flex items-center space-x-3 text-sm justify-center">
                                <span className="legend-item flex items-center">
                                    <span className="inline-block w-4 h-4 bg-emerald-500 rounded-sm mr-1" />
                                    <span className="text-xs">Administered</span>
                                </span>
                                <span className="legend-item flex items-center">
                                    <span className="inline-block w-4 h-4 bg-red-500 rounded-sm mr-1" />
                                    <span className="text-xs">Not administered</span>
                                </span>
                                <span className="legend-item flex items-center">
                                    <span className="inline-block w-4 h-4 bg-gray-200 border border-gray-200 rounded-sm mr-1" />
                                    <span className="text-xs">Not reported</span>
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-max space-y-4">
                                {medications.map((medication) => {
                                    const timeSlots = {
                                        morning: medication.morning,
                                        afternoon: medication.afternoon,
                                        evening: medication.evening,
                                        bedtime: medication.bedtime,
                                        asNeeded: medication.asNeeded,
                                    }

                                    return (
                                        <div key={medication.id} className="bg-white p-4 rounded-lg border border-neutral-100">
                                            <div className="flex items-center mb-3 border-b pb-2">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-neutral-800">{medication.name}</h3>
                                                    <div className="text-sm text-neutral-600 mt-1">
                                                        <span className="font-medium">{medication.dosage}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{medication.frequency}</span>
                                                        {medication.instructions && (
                                                            <>
                                                                <span className="mx-1">•</span>
                                                                <span>{medication.instructions}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex">
                                                {Object.entries(timeSlots).map(([timeOfDay, isScheduled], index, array) => {
                                                    if (!isScheduled) return null

                                                    const { label } = getTimeLabel(timeOfDay)

                                                    return (
                                                        <React.Fragment key={`${medication.id}-${timeOfDay}`}>
                                                            <div className="w-[200px]">
                                                                <div className="mb-3">
                                                                    <h3 className="text-sm font-semibold flex items-center text-neutral-800">{label}</h3>
                                                                </div>

                                                                <div className="flex flex-col">
                                                                    <div className="flex justify-between mb-3">
                                                                        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                                                                            <div
                                                                                key={day}
                                                                                className="w-5 text-center text-xs font-medium text-neutral-500 uppercase"
                                                                            >
                                                                                {day}
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                                                                            <div key={dayIndex} className="flex flex-col gap-1.5">
                                                                                {weeks.map((week, weekIndex) => {
                                                                                    const day = week[dayIndex]
                                                                                    const status = getStatusForDay(medication.id, day, timeOfDay)
                                                                                    const statusClass = getStatusClass(status)
                                                                                    const statusTitle = getStatusTitle(status)
                                                                                    const dayStatus = getDayStatus(status)

                                                                                    return (
                                                                                        <div
                                                                                            key={`${weekIndex}-${dayIndex}`}
                                                                                            className={`w-5 h-5 ${statusClass} rounded-sm flex items-center justify-center cursor-pointer hover:opacity-80`}
                                                                                            title={`${day ? day : ""} - ${statusTitle}`}
                                                                                        >
                                                                                            {day && day <= daysInMonth && (
                                                                                                <span className={`text-[10px] font-medium ${dayStatus}`}>{day}</span>
                                                                                            )}
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {index < array.length - 1 && <div className="w-px h-full bg-neutral-200 mx-3" />}
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="text-center space-y-4">
                            <div className="bg-neutral-100 p-6 rounded-full inline-block">
                                <Calendar className="w-8 h-8 text-neutral-600" />
                            </div>
                            <h3 className="text-md font-semibold text-neutral-800">No Medications Found</h3>
                            <p className="text-neutral-600 max-w-md text-sm">
                                No medications have been prescribed for {toolInvocation.result.client_name}.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return null
} 

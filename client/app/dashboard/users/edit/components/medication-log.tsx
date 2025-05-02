"use client"

import { useAppDispatch, useAppSelector } from "@/state/redux"
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    setSelectedMonth,
    setSelectedYear,
    openCheckInModal,
    openAddMedicationModal,
} from "@/state/slices/medicationSlice"
import type { Medication, MedicationLog as MedicationLogType } from "@/types/prismaTypes"
import React from "react"
interface MedicationLogProps {
    medications: Medication[]
    logs: MedicationLogType[][]
}

export const MedicationLog = ({ medications, logs }: MedicationLogProps) => {
    const dispatch = useAppDispatch()
    const { selectedMonth, selectedYear } = useAppSelector((state) => state.medication)

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const handlePreviousMonth = () => {
        let newMonth = Number.parseInt(selectedMonth) - 1
        let newYear = Number.parseInt(selectedYear)

        if (newMonth < 0) {
            newMonth = 11
            newYear -= 1
        }

        dispatch(setSelectedMonth(newMonth.toString()))
        dispatch(setSelectedYear(newYear.toString()))
    }

    const handleNextMonth = () => {
        let newMonth = Number.parseInt(selectedMonth) + 1
        let newYear = Number.parseInt(selectedYear)

        if (newMonth > 11) {
            newMonth = 0
            newYear += 1
        }

        dispatch(setSelectedMonth(newMonth.toString()))
        dispatch(setSelectedYear(newYear.toString()))
    }

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getStartDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    const daysInMonth = getDaysInMonth(Number.parseInt(selectedYear), Number.parseInt(selectedMonth))
    const startDay = getStartDayOfMonth(Number.parseInt(selectedYear), Number.parseInt(selectedMonth))

    // Create array to represent calendar grid (up to 42 cells for 6 weeks)
    const calendarDays = Array.from({ length: 42 }, (_, i) => {
        const day = i - startDay + 1
        return day > 0 && day <= daysInMonth ? day : null
    })

    // Split into weeks
    const weeks: number[][] = []
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7) as number[])
    }

    // Debug function to log data
    const debugData = () => {
        console.log("Current month/year:", selectedMonth, selectedYear)
        console.log("Medications:", medications)
        console.log("Logs:", logs)

        // Check for May 2, 2025 specifically
        const flatLogs = logs.flat()
        flatLogs.forEach((log) => {
            const logDate = new Date(log.date)
            console.log("Log date:", logDate, "Day:", logDate.getDate(), "Month:", logDate.getMonth(), "Status:", log.status)
        })
    }

    // Call debug function
    React.useEffect(() => {
        debugData()
    }, [selectedMonth, selectedYear, medications, logs])

    const getStatusForDay = (medicationId: string, day: number | undefined, timeOfDay?: string): string => {
        if (!day) return "empty"

        const flatLogs = logs.flat()

        if (day === 2 && Number.parseInt(selectedMonth) === 4 && Number.parseInt(selectedYear) === 2025) {
            console.log(`Checking day 2 for medication ${medicationId} and time ${timeOfDay}`)
            const relevantLogs = flatLogs.filter((log) => log.medicationId === medicationId)
            console.log("Relevant logs:", relevantLogs)
        }

        // Find a log for this medication, day and time
        const matchingLog = flatLogs.find((log) => {
            const logDate = new Date(log.date)
            // Convert to local date for comparison
            const localLogDate = new Date(logDate.getTime() + logDate.getTimezoneOffset() * 60000)

            // Debug specific dates
            if (day === 2 && localLogDate.getDate() === 2) {
                console.log("Found log for day 2:", log)
                console.log("Log date parts:", localLogDate.getDate(), localLogDate.getMonth(), localLogDate.getFullYear())
                console.log("Comparing with:", day, Number.parseInt(selectedMonth), Number.parseInt(selectedYear))
            }

            return (
                log.medicationId === medicationId &&
                localLogDate.getDate() === day &&
                localLogDate.getMonth() === Number.parseInt(selectedMonth) &&
                (!timeOfDay || log.time === timeOfDay.toUpperCase())
            )
        })

        if (matchingLog) {
            return matchingLog.status.toLowerCase()
        }

        // Check if this time is scheduled for the medication
        const medication = medications.find((med) => med.id === medicationId)
        const isTimeScheduled = timeOfDay && medication && medication[timeOfDay.toLowerCase() as keyof typeof medication]
        return isTimeScheduled ? "not-reported" : "not-scheduled"
    }

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "taken":
                return "bg-emerald-400"
            case "not-taken":
                return "bg-red-500"
            case "not-reported":
                return "bg-white border border-gray-200"
            case "not-scheduled":
                return "bg-gray-100"
            case "empty":
                return "bg-transparent"
            default:
                return "bg-gray-100"
        }
    }

    const getDayStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case "taken":
                return "text-white"
            case "not-taken":
                return "text-white"
            case "not-reported":
                return "text-neutral-500"
            case "empty":
                return "text-neutral-500"
            default:
                return "text-neutral-500"
        }
    }

    const getStatusTitle = (status: string) => {
        switch (status.toLowerCase()) {
            case "taken":
                return "Taken"
            case "not-taken":
                return "Not taken"
            case "not-reported":
                return "Not reported"
            case "not-scheduled":
                return "Not scheduled"
            case "empty":
                return ""
            default:
                return ""
        }
    }

    // Convert timeOfDay to readable format with icons
    const getTimeLabel = (timeOfDay: string) => {
        const timeLabels = {
            morning: { label: "Morning" },
            afternoon: { label: "Lunchtime" },
            evening: { label: "Evening" },
            bedtime: { label: "Bed time" },
            asNeeded: { label: "As needed" },
        }

        return timeLabels[timeOfDay as keyof typeof timeLabels] || { label: timeOfDay, icon: "💊" }
    }

    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Calendar className="mr-2 w-4 h-4" />
                    EMAR
                </h2>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 -sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousMonth}
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 rounded-full"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-semibold text-gray-800">
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

            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center space-x-3 text-sm justify-center">
                    <span className="legend-item flex items-center">
                        <span className="inline-block w-4 h-4 bg-emerald-500 rounded-sm mr-1" />
                        <span className="text-xs">Taken</span>
                    </span>
                    <span className="legend-item flex items-center">
                        <span className="inline-block w-4 h-4 bg-red-500 rounded-sm mr-1" />
                        <span className="text-xs">Not taken</span>
                    </span>
                    <span className="legend-item flex items-center">
                        <span className="inline-block w-4 h-4 bg-gray-200 border border-gray-200 rounded-sm mr-1" />
                        <span className="text-xs">Not reported</span>
                    </span>
                </div>
                <div className="flex justify-end">
                    <Button
                        onClick={() => dispatch(openAddMedicationModal())}
                        className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medication
                    </Button>
                </div>
            </div>

            {/* Medication Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-max space-y-4">
                    {medications.map((medication: Medication) => {
                        // Extract time slots from medication object
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
                                    <div className="bg-blue-100/60 text-blue-600 rounded-sm px-2 py-1 text-xs font-medium">Active</div>
                                </div>

                                {/* Time slots in a row */}
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

                                                    {/* Calendar grid */}
                                                    <div className="flex flex-col">
                                                        {/* Weekday headers */}
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

                                                        {/* Calendar days - display as columns */}
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
                                                                                className={`w-5 h-5 ${statusClass} rounded-sm flex items-center justify-center`}
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

                                                    {/* Check in button for this time of day */}
                                                    <div className="mt-4 flex justify-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-neutral-100 h-8"
                                                            onClick={() =>
                                                                dispatch(openCheckInModal({ medicationId: medication.id, timeOfDay, day: 1 }))
                                                            }
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
                                                                <span className="text-sm font-medium">Check in</span>
                                                            </div>
                                                        </Button>
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
        </div>
    )
}

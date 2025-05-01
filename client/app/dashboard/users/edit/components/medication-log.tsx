"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Pill, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    fetchMedicationLogs,
    type MedicationLog as MedicationLogType,
    setSelectedMonth,
    setSelectedYear,
    type Medication,
    openCheckInModal,
    openAddMedicationModal,
} from "@/state/slices/medicationSlice"

interface MedicationLogProps {
    userId: string
}

export const MedicationLog = ({ userId }: MedicationLogProps) => {
    const dispatch = useAppDispatch()
    const { medications, medicationLogs, selectedMonth, selectedYear } = useAppSelector((state) => state.medication)

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

    useEffect(() => {
        dispatch(
            fetchMedicationLogs({
                userId,
                month: selectedMonth,
                year: selectedYear,
            }),
        )
    }, [dispatch, userId, selectedMonth, selectedYear])

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

    const getStatusForDay = (medicationId: string, day: number, timeOfDay?: string): string => {
        if (!day) return "empty"

        const formattedDay = day < 10 ? `0${day}` : day.toString()
        const dateString = `${selectedYear}-${Number.parseInt(selectedMonth) + 1}-${formattedDay}`

        const log = medicationLogs.find(
            (log: MedicationLogType) =>
                log.medicationId === medicationId &&
                log.date.includes(`${Number.parseInt(selectedMonth) + 1}-${day}`) &&
                (!timeOfDay || log.time === timeOfDay),
        )

        return log ? log.status : "not-scheduled"
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case "taken":
                return "bg-emerald-400 -inner"
            case "not-taken":
                return "bg-red-500 -inner"
            case "not-reported":
                return "bg-white border border-gray-200 -sm"
            case "not-scheduled":
                return "bg-gray-100"
            case "empty":
                return "bg-transparent"
            default:
                return "bg-gray-100"
        }
    }

    const getDayStatus = (status: string) => {
        switch (status) {
            case "taken":
                return "text-white"
            case "not-taken":
                return "text-white"
            case "not-reported":
                return "text-neutral-400"
            case "empty":
                return "text-neutral-400"
            default:
                return "text-neutral-400"
        }
    }


    const getStatusTitle = (status: string) => {
        switch (status) {
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
            morning: { label: "Morning", icon: "☀️" },
            afternoon: { label: "Lunchtime", icon: "🌤️" },
            evening: { label: "Evening", icon: "🌙" },
            bedtime: { label: "Bed time", icon: "💤" },
            asNeeded: { label: "As needed", icon: "⏱️" },
        }

        return timeLabels[timeOfDay as keyof typeof timeLabels] || { label: timeOfDay, icon: "💊" }
    }

    return (
        <div className="p-4">
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
                        <span className="inline-block w-4 h-4 bg-green-400 rounded-sm mr-1" />
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
                    <Button onClick={() => dispatch(openAddMedicationModal())} className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medication
                    </Button>
                </div>
            </div>

            {/* Medication Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-max space-y-4">
                    {medications.map((medication: Medication) => (
                        <div key={medication.id} className="bg-white p-4 rounded-lg border border-neutral-100">
                            <div className="flex items-center mb-3 border-b pb-2">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-neutral-800">{medication.name}</h3>
                                    <div className="text-sm text-neutral-600 mt-1">
                                        <span className="font-medium">{medication.dosage}</span>
                                        <span className="mx-1">•</span>
                                        <span>{medication.frequency}</span>
                                    </div>
                                </div>
                                <div className="bg-blue-100/60 text-blue-600 rounded-sm px-2 py-1 text-xs font-medium">
                                    Active
                                </div>
                            </div>

                            {/* Time slots in a row */}
                            <div className="flex">
                                {Object.entries(medication.times).map(([timeOfDay, isScheduled], index, array) => {
                                    if (!isScheduled) return null

                                    const { label, icon } = getTimeLabel(timeOfDay)

                                    return (
                                        <>
                                            <div key={`${medication.id}-${timeOfDay}`} className="w-[200px]">
                                                <div className="mb-3">
                                                    <h3 className="text-sm font-semibold flex items-center text-neutral-800">

                                                        {label}
                                                    </h3>
                                                </div>

                                                {/* Calendar grid */}
                                                <div className="flex flex-col">
                                                    {/* Weekday headers */}
                                                    <div className="flex justify-between mb-3">
                                                        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                                                            <div key={day} className="w-5 text-center text-xs font-medium text-neutral-500 uppercase">
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
                                                                    const status = day ? getStatusForDay(medication.id, day, timeOfDay) : "empty"
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
                                                                                <span className={`text-[10px] font-medium ${dayStatus}`}>
                                                                                    {day}
                                                                                </span>
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
                                                        onClick={() => dispatch(openCheckInModal({ medicationId: medication.id, timeOfDay, day: 1 }))}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
                                                            <span className="text-sm font-medium">Check in</span>
                                                        </div>
                                                    </Button>
                                                </div>
                                            </div>
                                            {index < array.length - 1 && (
                                                <div className="w-px h-full bg-neutral-200 mx-3" />
                                            )}
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}
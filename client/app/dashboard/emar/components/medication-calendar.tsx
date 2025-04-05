"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { Button } from "@/components/ui/button"

interface MedicationCalendarProps {
    currentDate: Date
    currentView: "scheduled" | "prn"
    onAdminister: (medication: any) => void
}

export function MedicationCalendar({ currentDate, currentView, onAdminister }: MedicationCalendarProps) {
    const [medications, setMedications] = useState<any[]>([])
    const [days, setDays] = useState<Date[]>([])

    // Generate days for the current month
    useEffect(() => {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        const daysInMonth = eachDayOfInterval({ start, end })
        setDays(daysInMonth)
    }, [currentDate])

    // Mock data for medications
    useEffect(() => {
        // This would normally come from an API
        const mockMedications = [
            {
                id: "1",
                name: "Hydrocortisone",
                dosage: "5mg",
                times: ["08:00", "13:00", "19:00"],
                status: generateRandomStatus(31),
            },
            {
                id: "2",
                name: "Lisinopril",
                dosage: "10mg",
                times: ["08:00"],
                status: generateRandomStatus(31),
            },
            {
                id: "3",
                name: "Metformin",
                dosage: "500mg",
                times: ["08:00", "19:00"],
                status: generateRandomStatus(31),
            },
        ]

        setMedications(mockMedications)
    }, [currentView])

    // Generate random status for each day of the month
    function generateRandomStatus(days: number) {
        const statuses = ["taken", "not_taken", "not_reported", "not_scheduled"]
        const result: Record<string, string> = {}

        for (let i = 1; i <= days; i++) {
            // More likely to be "taken" than other statuses
            const randomIndex = Math.floor(Math.random() * 10)
            if (randomIndex < 7) {
                result[i] = "taken"
            } else if (randomIndex < 8) {
                result[i] = "not_taken"
            } else if (randomIndex < 9) {
                result[i] = "not_reported"
            } else {
                result[i] = "not_scheduled"
            }
        }

        return result
    }

    // Get status icon based on status
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "taken":
                return <div className="w-4 h-4 rounded-full bg-green-500"></div>
            case "not_taken":
                return <div className="w-4 h-4 rounded-full bg-red-500"></div>
            case "not_reported":
                return <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            case "not_scheduled":
            default:
                return <div className="w-4 h-4 rounded-full border border-gray-300"></div>
        }
    }

    return (
        <div className="space-y-8">
            {medications.map((medication) => (
                <div key={medication.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">{medication.name}</h3>
                            <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                        </div>
                        <Button size="sm" onClick={() => onAdminister(medication)} className="bg-emerald-600 hover:bg-emerald-700">
                            Administer
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-2 border-b text-left">Time</th>
                                    {days.map((day) => (
                                        <th key={day.toString()} className="p-2 border-b text-center min-w-[40px]">
                                            <div className="text-sm">{format(day, "d")}</div>
                                            <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {medication.times.map((time: string, timeIndex: number) => (
                                    <tr key={`${medication.id}-${time}`} className={timeIndex % 2 === 0 ? "bg-muted/30" : ""}>
                                        <td className="p-2 border-b font-medium">{format(new Date(`2000-01-01T${time}`), "h:mm a")}</td>
                                        {days.map((day) => {
                                            const dayOfMonth = day.getDate()
                                            const status = medication.status[dayOfMonth] || "not_scheduled"

                                            return (
                                                <td key={`${medication.id}-${time}-${day.toString()}`} className="p-2 border-b text-center">
                                                    <div className="flex justify-center">{getStatusIcon(status)}</div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    )
}


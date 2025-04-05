"use client"

import { useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setSelectedMedication, setAdministrationDialogOpen } from "@/state/slices/medicationSlice"

interface MedicationCalendarProps {
    currentDate: Date
}

export function MedicationCalendar({ currentDate }: MedicationCalendarProps) {
    const dispatch = useAppDispatch()
    const medications = useAppSelector(state => state.medication.medications)
    const calendarEntries = useAppSelector(state => state.medication.calendarEntries)
    const currentView = useAppSelector(state => state.medication.currentView)

    // Generate days for the current month
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })

    // Get status icon based on status
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "taken":
                return <div className="w-4 h-4 rounded-full bg-slate-500"></div>
            case "not_taken":
                return <div className="w-4 h-4 rounded-full bg-red-500"></div>
            case "not_reported":
                return <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            case "not_scheduled":
            default:
                return <div className="w-4 h-4 rounded-full border border-gray-300"></div>
        }
    }

    const handleAdminister = (medicationId: string) => {
        const medication = medications.find(med => med.id === medicationId)
        if (medication) {
            dispatch(setSelectedMedication(medication))
            dispatch(setAdministrationDialogOpen(true))
        }
    }

    return (
        <div className="space-y-8">
            {calendarEntries.map((entry) => {
                const medication = medications.find(med => med.id === entry.medicationId)
                if (!medication) return null

                return (
                    <div key={entry.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{medication.name}</h3>
                                <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAdminister(medication.id)}
                            >
                                Administer
                            </Button>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day) => {
                                const date = day.getDate()
                                const status = entry.status[date] || "not_scheduled"
                                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

                                return (
                                    <div
                                        key={date}
                                        className={`flex flex-col items-center p-2 rounded-md ${isToday ? 'bg-slate-100' : ''
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{date}</span>
                                        <div className="mt-1">{getStatusIcon(status)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
} 
"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Time slots for the schedule
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Days of the week
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]

// Sample appointments
const appointments = [
    { id: 1, day: "Mon", startTime: "08:00", endTime: "09:00", title: "Monitoring", type: "monitoring" },
    { id: 2, day: "Mon", startTime: "10:00", endTime: "11:00", title: "Appointment", type: "appointment" },
    { id: 3, day: "Tue", startTime: "09:00", endTime: "10:00", title: "Meeting", type: "meeting" },
    { id: 4, day: "Tue", startTime: "14:00", endTime: "15:00", title: "Appointment", type: "appointment" },
    { id: 5, day: "Tue", startTime: "16:00", endTime: "17:00", title: "Meeting", type: "meeting" },
    { id: 6, day: "Wed", startTime: "10:00", endTime: "11:00", title: "Discussion", type: "discussion" },
    { id: 7, day: "Wed", startTime: "13:00", endTime: "14:00", title: "Appointment", type: "appointment" },
    { id: 8, day: "Thu", startTime: "11:00", endTime: "12:00", title: "Prize", type: "prize" },
    { id: 9, day: "Thu", startTime: "15:00", endTime: "16:00", title: "Offline session", type: "offline" },
    { id: 10, day: "Fri", startTime: "09:00", endTime: "10:00", title: "Appointment", type: "appointment" },
]

export function DailySchedule() {
    const [currentWeek, setCurrentWeek] = useState(0)

    // Function to get appointments for a specific day and time
    const getAppointment = (day: string, time: string) => {
        return appointments.find((appointment) => appointment.day === day && appointment.startTime === time)
    }

    // Function to get the background color based on appointment type
    const getAppointmentColor = (type: string) => {
        switch (type) {
            case "monitoring":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "appointment":
                return "bg-pink-100 text-pink-800 border-pink-200"
            case "meeting":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "discussion":
                return "bg-amber-100 text-amber-800 border-amber-200"
            case "prize":
                return "bg-green-100 text-green-800 border-green-200"
            case "offline":
                return "bg-gray-100 text-gray-800 border-gray-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Week {currentWeek + 1}</h3>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                        disabled={currentWeek === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header row with days */}
                    <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 mb-2">
                        <div className="text-sm font-medium text-muted-foreground">Time</div>
                        {days.map((day) => (
                            <div key={day} className="text-sm font-medium text-center">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Time slots and appointments */}
                    <div className="space-y-2">
                        {timeSlots.map((time) => (
                            <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
                                <div className="text-sm text-muted-foreground py-2">{time}</div>
                                {days.map((day) => {
                                    const appointment = getAppointment(day, time)
                                    return (
                                        <div key={`${day}-${time}`} className="h-12 relative">
                                            {appointment ? (
                                                <div
                                                    className={`absolute inset-0 rounded-md border px-2 py-1 flex items-center justify-center text-sm font-medium ${getAppointmentColor(appointment.type)}`}
                                                >
                                                    {appointment.title}
                                                </div>
                                            ) : (
                                                <div className="h-full border border-dashed rounded-md border-gray-200"></div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


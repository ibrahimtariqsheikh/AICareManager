"use client"

import { useState, useEffect } from "react"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card } from "../ui/card"
import { toast } from "sonner"

// Setup the localizer for BigCalendar
const localizer = momentLocalizer(moment)

interface CalendarProps {
    view: "day" | "week" | "month"
    onEventSelect: (event: any) => void
    dateRange: {
        from: Date | undefined
        to: Date | undefined
    }
}

export function Calendar({ view, onEventSelect, dateRange }: CalendarProps) {
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true)
            try {
                // In a real app, this would be an API call to fetch appointments
                // For now, we'll use mock data
                await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay

                const mockAppointments = [
                    {
                        id: "1",
                        title: "John Doe - Home Visit",
                        start: moment().add(1, "hour").toDate(),
                        end: moment().add(2, "hours").toDate(),
                        resourceId: "staff-1",
                        clientId: "client-1",
                        status: "CONFIRMED",
                        type: "HOME_VISIT",
                    },
                    {
                        id: "2",
                        title: "Jane Smith - Weekly Checkup",
                        start: moment().add(1, "day").hour(10).minute(0).toDate(),
                        end: moment().add(1, "day").hour(11).minute(0).toDate(),
                        resourceId: "staff-2",
                        clientId: "client-2",
                        status: "PENDING",
                        type: "WEEKLY_CHECKUP",
                    },
                    {
                        id: "3",
                        title: "Robert Johnson - Appointment",
                        start: moment().add(2, "days").hour(14).minute(0).toDate(),
                        end: moment().add(2, "days").hour(15).minute(30).toDate(),
                        resourceId: "staff-1",
                        clientId: "client-3",
                        status: "CONFIRMED",
                        type: "APPOINTMENT",
                    },
                ]

                setEvents(mockAppointments)
            } catch (error) {
                console.error("Failed to fetch appointments:", error)
                toast.error("Failed to load appointments. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchAppointments()
    }, [dateRange, toast])

    // Custom event styling based on status
    const eventStyleGetter = (event: any) => {
        let backgroundColor = "#3182ce" // default blue
        let borderColor = "#2c5282"

        switch (event.status) {
            case "CONFIRMED":
                backgroundColor = "#38a169" // green
                borderColor = "#2f855a"
                break
            case "PENDING":
                backgroundColor = "#d69e2e" // yellow
                borderColor = "#b7791f"
                break
            case "CANCELED":
                backgroundColor = "#e53e3e" // red
                borderColor = "#c53030"
                break
            case "COMPLETED":
                backgroundColor = "#718096" // gray
                borderColor = "#4a5568"
                break
        }

        return {
            style: {
                backgroundColor,
                borderColor,
                borderRadius: "4px",
                opacity: 0.8,
                color: "white",
                border: "none",
                display: "block",
            },
        }
    }

    return (
        <Card className="p-4 h-[700px]">
            {isLoading ? (
                <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    views={{
                        day: true,
                        week: true,
                        month: true,
                    }}
                    view={view}
                    date={dateRange.from}
                    onNavigate={(date: Date) => {
                        // Update the date range when navigating
                    }}
                    onSelectEvent={onEventSelect}
                    eventPropGetter={eventStyleGetter}
                    dayPropGetter={(date: Date) => {
                        const today = new Date()
                        return {
                            className:
                                date.getDate() === today.getDate() &&
                                    date.getMonth() === today.getMonth() &&
                                    date.getFullYear() === today.getFullYear()
                                    ? "rbc-today"
                                    : "",
                        }
                    }}
                    tooltipAccessor={(event: any) => `${event.title} (${event.status})`}
                />
            )}
        </Card>
    )
}


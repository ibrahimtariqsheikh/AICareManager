"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Plus, Filter } from "lucide-react"
import { Card } from "../../../components/ui/card"
import { AppointmentForm } from "../../../components/scheduler/appointment-form"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet"
import { StaffFilter } from "../../../components/scheduler/staff-filter"
import { ClientFilter } from "../../../components/scheduler/client-filter"
import { useMediaQuery } from "../../../hooks/use-mobile"

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

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [isFilterOpen, setIsFilterOpen] = useState(false)

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

                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-screen min-w-full ">
                    {isDesktop && isFilterOpen ? (
                        <Card className="p-4 space-y-4">
                            <h3 className="font-medium">Filters</h3>
                            <StaffFilter />
                            <ClientFilter />
                            {/* <DatePickerWithRange date={dateRange} setDate={setDateRange} /> */}
                        </Card>
                    ) : null}

                    <div className={`${isDesktop && isFilterOpen ? "md:col-span-3" : "md:col-span-4"}`}>
                        <Calendar view={view} onEventSelect={handleEventSelect} dateRange={dateRange} />
                    </div>
                </div>


            </div>
        </div>
    )
}

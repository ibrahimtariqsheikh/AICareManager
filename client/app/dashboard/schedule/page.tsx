"use client"

import { useState } from "react"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { useDispatch } from "react-redux"
import { PlusCircle, X } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { AppointmentForm } from "@/components/scheduler/appointment-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { toggleRightSidebar } from "@/state/slices/scheduleSlice"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function SchedulerPage() {
    const [view, setView] = useState<"day" | "week" | "month">("week")
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: new Date(),
        to: undefined,
    })
    const dispatch = useAppDispatch()

    const user = useAppSelector((state) => state.user.user)
    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<any>(null)

    const handleEventSelect = (event: any) => {
        setEditingEvent(event)
        setIsAppointmentFormOpen(true)
    }

    const handleFormClose = () => {
        setIsAppointmentFormOpen(false)
        setEditingEvent(null)
    }

    return (
        <div className="relative container mx-auto py-4 min-h-screen min-w-full">
            <div className="absolute top-0 right-0">
                <Button variant="ghost" size="icon" onClick={() => dispatch(toggleRightSidebar())}><SidebarTrigger className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">Schedule</h1>
                        <p className="text-sm text-muted-foreground">
                            Your schedule for the week. Add, edit, or delete appointments as needed. Create new appointments for clients.
                            And manage your schedule. And Track your time. and more. We have you covered.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAppointmentFormOpen(true)}
                        size="sm"
                        className="hidden sm:flex"
                    >
                        <PlusCircle className="h-4 w-4 mr-1.5" />
                        New Appointment
                    </Button>
                </div>

                <Calendar view={view} onEventSelect={handleEventSelect} dateRange={dateRange} />

                <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
                    <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-auto">
                        <VisuallyHidden>
                            <DialogTitle>{editingEvent?.id ? "Edit Appointment" : "New Appointment"}</DialogTitle>
                        </VisuallyHidden>
                        <AppointmentForm
                            isOpen={true}
                            onClose={handleFormClose}
                            event={editingEvent}
                            isNew={!editingEvent?.id}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { Button } from "../../../components/ui/button"
import { useAppDispatch } from "@/state/redux"
import { AppointmentForm } from "@/components/scheduler/appointment-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { toggleRightSidebar } from "@/state/slices/scheduleSlice"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

export default function SchedulerPage() {
    const [view] = useState<"day" | "week" | "month">("week")
    const [dateRange] = useState<{ from?: Date; to?: Date }>({
        from: new Date(),
    })
    const dispatch = useAppDispatch()

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

            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-neutral-900">Schedule</h1>
                        <p className="text-sm text-neutral-600">
                            Manage your appointments efficiently. View, create, edit, or cancel client appointments.
                            Track your availability and organize your professional schedule all in one place.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAppointmentFormOpen(true)}
                        size="sm"
                        className="hidden sm:flex"
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        New Appointment
                    </Button>
                </div>

                <div className="mb-4" />

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

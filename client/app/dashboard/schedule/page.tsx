"use client"

import { useState } from "react"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { Button } from "../../../components/ui/button"
import { AppointmentForm } from "@/components/scheduler/appointment-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Clipboard, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EventIcon from "@/components/icons/eventicon"



export default function SchedulerPage() {
    const [view] = useState<"day" | "week" | "month">("week")
    const [dateRange] = useState<{ from?: Date; to?: Date }>({
        from: new Date(),
    })


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
        <div className="relative">


            <div
                className={cn(
                    "relative container mx-auto px-6 py-2 min-h-screen min-w-full transition-opacity duration-500",

                )}
            >
                <div className="flex flex-col space-y-4">
                    <Calendar view={view} onEventSelect={handleEventSelect} dateRange={dateRange} />

                    <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
                        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-auto">
                            <VisuallyHidden>
                                <DialogTitle>{editingEvent?.id ? "Edit Appointment" : "New Appointment"}</DialogTitle>
                            </VisuallyHidden>
                            <AppointmentForm isOpen={true} onClose={handleFormClose} event={editingEvent} isNew={!editingEvent?.id} />
                        </DialogContent>
                    </Dialog>

                    <div className="fixed bottom-6 right-6 z-50">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                                    <Plus className="h-7 w-7" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="end">
                                <div className="flex flex-col gap-2 text-xs">
                                    <Button onClick={() => setIsAppointmentFormOpen(true)} className="w-full text-xs" variant="ghost">
                                        <EventIcon className="h-3 w-3" />
                                        New Appointment
                                    </Button>
                                    <Button onClick={() => { }} className="w-full text-xs" variant="ghost">
                                        <Clipboard className="h-3 w-3" />
                                        New Event
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    )
}

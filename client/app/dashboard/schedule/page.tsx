"use client"

import { useState } from "react"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { Button } from "../../../components/ui/button"
import { AppointmentForm } from "@/components/scheduler/appointment-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Heart, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EventIcon from "@/components/icons/eventicon"
import { EventForm } from "@/components/scheduler/event-form"
import { Separator } from "@/components/ui/separator"
import { useAppSelector } from "@/state/redux"

export default function SchedulerPage() {
    const [view] = useState<"day" | "week" | "month">("week")
    const [dateRange] = useState<{ from?: Date; to?: Date }>({
        from: new Date(),
    })

    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false)
    const [isEventFormOpen, setIsEventFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<any>(null)


    const { loading } = useAppSelector((state) => state.schedule)
    const { user } = useAppSelector((state) => state.user)

    const handleEventSelect = (event: any) => {
        setEditingEvent(event)
        setIsAppointmentFormOpen(true)
    }

    const handleFormClose = () => {
        setIsAppointmentFormOpen(false)
        setEditingEvent(null)
    }

    const handleEventFormClose = () => {
        setIsEventFormOpen(false)
        setEditingEvent(null)
    }

    if (loading) {
        return (
            <div className="relative container mx-auto px-6 py-2 min-h-screen min-w-full">
                <div className="flex flex-col space-y-4">
                    {/* Calendar Header Skeleton */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="flex space-x-2">
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Calendar Grid Skeleton */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Time slots column */}
                        <div className="space-y-2">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            ))}
                        </div>

                        {/* Calendar days columns */}
                        {[...Array(6)].map((_, dayIndex) => (
                            <div key={dayIndex} className="space-y-2">
                                {/* Day header */}
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                {/* Time slots */}
                                {[...Array(12)].map((_, timeIndex) => (
                                    <div key={timeIndex} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            <div
                className={cn(
                    "relative container mx-auto px-6 py-2 min-h-screen w-full overflow-x-auto transition-opacity duration-500",
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

                    <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
                        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-auto">
                            <VisuallyHidden>
                                <DialogTitle>New Event</DialogTitle>
                            </VisuallyHidden>
                            <EventForm
                                isOpen={true}
                                onClose={handleEventFormClose}
                                event={editingEvent}
                                isNew={!editingEvent?.id}
                                userId={user?.userInfo?.id || ""}
                                agencyId={user?.userInfo?.agencyId || ""}
                            />
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
                                <div className="flex flex-col text-xs">
                                    <Button onClick={() => setIsAppointmentFormOpen(true)} className="w-full text-xs" variant="ghost">
                                        <EventIcon className="h-3 w-3" />
                                        New Appointment
                                    </Button>
                                    <Separator className="my-1" />
                                    <Button onClick={() => setIsEventFormOpen(true)} className="w-full text-xs" variant="ghost">
                                        <Heart className="h-3 w-3" />
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

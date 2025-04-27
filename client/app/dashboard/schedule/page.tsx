"use client"

import { useState, useEffect } from "react"
import { Calendar } from "../../../components/scheduler/calender/calender"
import { Button } from "../../../components/ui/button"
import { useAppDispatch } from "@/state/redux"
import { AppointmentForm } from "@/components/scheduler/appointment-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Calendar1Icon, Clipboard, Plus, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EventIcon from "@/components/icons/eventicon"

// Import the Loading component
function Loading() {
    return (
        <div className="p-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* Calendar View Toggle Skeleton */}
            <div className="flex items-center gap-2 mb-6">
                {["Day", "Week", "Month"].map((view) => (
                    <div key={view} className="h-9 w-20 bg-muted rounded animate-pulse" />
                ))}
            </div>

            {/* Calendar Grid Skeleton */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="h-8 bg-muted rounded animate-pulse" />
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
                ))}
            </div>


        </div>
    )
}

export default function SchedulerPage() {
    const [view] = useState<"day" | "week" | "month">("week")
    const [dateRange] = useState<{ from?: Date; to?: Date }>({
        from: new Date(),
    })
    const dispatch = useAppDispatch()

    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        // Simulate loading data
        const loadData = async () => {
            try {
                // You can replace this with actual data fetching
                await new Promise((resolve) => setTimeout(resolve, 100))

                // First set showContent to true to start the fade-in animation
                setShowContent(true)

                // Then after a short delay, set isLoading to false to remove the skeleton
                setTimeout(() => {
                    setIsLoading(false)
                }, 300)
            } catch (error) {
                console.error("Error loading scheduler data:", error)
                setShowContent(true)
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

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
            {isLoading && (
                <div
                    className={cn(
                        "absolute inset-0 z-10 transition-opacity duration-300",
                        showContent ? "opacity-0" : "opacity-100",
                    )}
                >
                    <Loading />
                </div>
            )}

            <div
                className={cn(
                    "relative container mx-auto p-6 min-h-screen min-w-full transition-opacity duration-500",
                    showContent ? "opacity-100" : "opacity-0",
                )}
            >
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold">Schedule</h1>
                            <p className="text-sm text-neutral-600">
                                Manage your appointments efficiently. View, create, edit, or cancel client appointments. Track your
                                availability and organize your professional schedule all in one place.
                            </p>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="sm" className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 shadow-none">
                                    <PlusCircle className="h-3 w-3" />
                                    New
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="end">
                                <div className="flex flex-col gap-2 text-xs">
                                    <Button onClick={() => setIsAppointmentFormOpen(true)} className="w-full text-xs" variant="ghost">
                                        <EventIcon className="h-3 w-3" />
                                        New Appointment
                                    </Button>
                                    <Button onClick={() => { }} className="w-full text-xs " variant="ghost">
                                        <Clipboard className="h-3 w-3" />
                                        New Event
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="mb-4" />

                    <Calendar view={view} onEventSelect={handleEventSelect} dateRange={dateRange} />

                    <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
                        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-auto">
                            <VisuallyHidden>
                                <DialogTitle>{editingEvent?.id ? "Edit Appointment" : "New Appointment"}</DialogTitle>
                            </VisuallyHidden>
                            <AppointmentForm isOpen={true} onClose={handleFormClose} event={editingEvent} isNew={!editingEvent?.id} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

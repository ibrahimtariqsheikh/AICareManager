"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Plus, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card } from "../../../components/ui/card"
import { AppointmentForm } from "../../../components/scheduler/appointment-form"
import { Calendar } from "../../../components/scheduler/calender"
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
        <div className="container mx-auto py-6 min-h-screen min-w-full">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">Appointment Scheduler</h1>
                        <p className="text-sm text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleCreateNew} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Appointment
                        </Button>

                        {isDesktop ? (
                            <Button
                                variant="outline"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        ) : (
                            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <div className="py-4 space-y-4">
                                        <h3 className="text-lg font-medium">Filters</h3>
                                        <StaffFilter />
                                        <ClientFilter />
                                        {/* <DatePickerWithRange date={dateRange} setDate={setDateRange} /> */}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}
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
                        <Tabs defaultValue="week" className="w-full" onValueChange={(value) => setView(value as any)}>
                            <div className="flex justify-between items-center mb-4">
                                <TabsList>
                                    <TabsTrigger value="day">Day</TabsTrigger>
                                    <TabsTrigger value="week">Week</TabsTrigger>
                                    <TabsTrigger value="month">Month</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="day" className="mt-0">
                                <Calendar view="day" onEventSelect={handleEventSelect} dateRange={dateRange} />
                            </TabsContent>

                            <TabsContent value="week" className="mt-0">
                                <Calendar view="week" onEventSelect={handleEventSelect} dateRange={dateRange} />
                            </TabsContent>

                            <TabsContent value="month" className="mt-0">
                                <Calendar view="month" onEventSelect={handleEventSelect} dateRange={dateRange} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {(isCreating || selectedEvent) && (
                    <AppointmentForm
                        isOpen={isCreating || !!selectedEvent}
                        onClose={handleCloseForm}
                        event={selectedEvent}
                        isNew={isCreating}
                    />
                )}
            </div>
        </div>
    )
}


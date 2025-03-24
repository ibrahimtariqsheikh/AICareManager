"use client"

import { useState, useMemo, useRef, RefObject } from "react"
import moment from "moment"
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { useTheme } from "next-themes"
import { CalendarIcon, Moon, PlusCircle, Sun } from "lucide-react"
import { useCalendarData } from "./use-calender-data"
import { Button } from "../../ui/button"

import { CalendarHeader } from "./calender-header"
import { CalendarSidebar } from "./calender-sidebar"
import { AppointmentForm } from "../appointment-form"

import { CustomCalendar } from "./custom-calender"
import type { CalendarProps } from "./types"
import { useCalendarSearch } from "./use-calender-search"
import { useCalendarStyles } from "./use-calender-styles"
import { useCalendarFilters } from "./use-calender-filters"
import { Card } from "../../ui/card"

export function Calendar({ view, onEventSelect, dateRange }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(dateRange.from || new Date())
    const [activeView, setActiveView] = useState<"day" | "week" | "month">(view)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const calendarRef = useRef<HTMLDivElement>(null)
    const { theme, setTheme } = useTheme()
    const searchInputRef = useRef<HTMLInputElement>(null)

    const {
        events,
        filteredEvents,
        isLoading,
        staffMembers,
        setStaffMembers,
        clients,
        setClients,
        eventTypes,
        setEventTypes,
        sidebarMode,
        setSidebarMode,
        refreshData,
    } = useCalendarData(dateRange)

    const {
        toggleStaffSelection,
        toggleClientSelection,
        toggleEventTypeSelection,
        selectAllStaff,
        deselectAllStaff,
        selectAllClients,
        deselectAllClients,
        toggleSidebarMode,
    } = useCalendarFilters({
        events,
        staffMembers,
        clients,
        eventTypes,
        sidebarMode,
        setSidebarMode,
    })

    // Add these handler functions to properly update state
    const handleToggleStaffSelection = (staffId: string) => {
        const updatedStaff = toggleStaffSelection(staffId)
        setStaffMembers(updatedStaff)
    }

    const handleToggleClientSelection = (clientId: string) => {
        const updatedClients = toggleClientSelection(clientId)
        setClients(updatedClients)
    }

    const handleToggleEventTypeSelection = (typeId: string) => {
        const updatedTypes = toggleEventTypeSelection(typeId)
        setEventTypes(updatedTypes)
    }

    const handleSelectAllStaff = () => {
        const updatedStaff = selectAllStaff()
        setStaffMembers(updatedStaff)
    }

    const handleDeselectAllStaff = () => {
        const updatedStaff = deselectAllStaff()
        setStaffMembers(updatedStaff)
    }

    const handleSelectAllClients = () => {
        const updatedClients = selectAllClients()
        setClients(updatedClients)
    }

    const handleDeselectAllClients = () => {
        const updatedClients = deselectAllClients()
        setClients(updatedClients)
    }

    const handleToggleSidebarMode = () => {
        const newMode = toggleSidebarMode()
        setSidebarMode(newMode)
    }

    const { isSearchOpen, searchQuery, toggleSearch, setSearchQuery } = useCalendarSearch(
        events,
        staffMembers,
        clients,
        eventTypes,
        sidebarMode,
    )

    const { getEventDurationInMinutes } = useCalendarStyles(
        filteredEvents,
        staffMembers,
        clients,
        eventTypes,
        sidebarMode,
    )

    // Media queries for responsive design
    const isMobile = useMediaQuery("(max-width: 640px)")

    // Generate dynamic sidebar data based on current date and view
    const sidebarData = useMemo(() => {
        const today = moment().startOf("day")
        const currentMoment = moment(currentDate)
        const weekStart = moment(currentDate).startOf("week")

        // Calculate week number
        const weekNumber = currentMoment.isoWeek()

        // Generate days for the sidebar
        const days = []

        if (activeView === "week") {
            // For week view, show 7 days starting from the week start
            for (let i = 0; i < 7; i++) {
                const day = moment(weekStart).add(i, "days")
                days.push({
                    dayName: day.format("ddd").toUpperCase(),
                    date: day.date(),
                    isCurrent: day.isSame(today, "day"),
                    momentObj: day,
                })
            }
        } else if (activeView === "month") {
            // For month view, show the first day of each week in the month
            const monthStart = moment(currentDate).startOf("month")
            const monthEnd = moment(currentDate).endOf("month")

            const day = moment(monthStart).startOf("week")
            while (day.isBefore(monthEnd)) {
                days.push({
                    dayName: day.format("ddd").toUpperCase(),
                    date: day.date(),
                    isCurrent: day.isSame(today, "day"),
                    momentObj: day,
                })
                day.add(1, "week")
            }
        } else {
            // For day view, just show the current day
            days.push({
                dayName: currentMoment.format("ddd").toUpperCase(),
                date: currentMoment.date(),
                isCurrent: currentMoment.isSame(today, "day"),
                momentObj: currentMoment,
            })
        }

        return {
            weekNumber,
            days,
        }
    }, [currentDate, activeView])

    // Format the date range for display
    const formatDateRange = () => {
        if (activeView === "day") {
            return moment(currentDate).format("MMM D, YYYY")
        } else if (activeView === "week") {
            const startDate = moment(currentDate).startOf("week").format("MMM D")
            const endDate = moment(currentDate).endOf("week").format("MMM D")
            return `${startDate} - ${endDate}`
        } else {
            return moment(currentDate).format("MMMM YYYY")
        }
    }

    // Handle navigation
    const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
        let newDate

        if (action === "PREV") {
            if (activeView === "day") {
                newDate = moment(currentDate).subtract(1, "day").toDate()
            } else if (activeView === "week") {
                newDate = moment(currentDate).subtract(1, "week").toDate()
            } else {
                newDate = moment(currentDate).subtract(1, "month").toDate()
            }
        } else if (action === "NEXT") {
            if (activeView === "day") {
                newDate = moment(currentDate).add(1, "day").toDate()
            } else if (activeView === "week") {
                newDate = moment(currentDate).add(1, "week").toDate()
            } else {
                newDate = moment(currentDate).add(1, "month").toDate()
            }
        } else {
            newDate = new Date()
        }

        setCurrentDate(newDate)
    }

    // Handle view change
    const handleViewChange = (newView: "day" | "week" | "month") => {
        setActiveView(newView)
    }

    const handleEventSelect = (event: any) => {
        setEditingEvent(event)
        setIsFormOpen(true)
        onEventSelect(event)
    }

    // Handle event updates from drag operations
    const handleEventUpdate = (updatedEvent: any) => {
        // In a real app, you would update the event in your database
        // For now, we'll just update it in our local state
        const updatedEvents = events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))

        // Update filtered events as well
        const updatedFilteredEvents = filteredEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))

        // This would typically be handled by your data service
        // For demo purposes, we're just logging the update
        console.log("Event updated:", updatedEvent)
    }

    // Handle direct date navigation
    const handleDateSelect = (date: Date) => {
        setCurrentDate(date)
        setActiveView("day")
    }

    // Handle form close with refresh
    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingEvent(null)
        refreshData() // This will now trigger a refetch from the API
    }

    // Create a new appointment
    const handleCreateAppointment = () => {
        // Create a default event with the current date
        const defaultEvent = {
            start: new Date(currentDate),
            end: new Date(new Date(currentDate).setHours(currentDate.getHours() + 1)),
            date: currentDate,
        }
        setEditingEvent(defaultEvent as any)
        setIsFormOpen(true)
    }

    // Check if we have any data
    const hasNoData = !isLoading && filteredEvents.length === 0 && events.length === 0

    return (
        <div className={`flex flex-col h-full w-full relative ${theme === "dark" ? "dark-theme" : ""}`}>
            {/* Dark mode background */}
            {theme === "dark" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
                </div>
            )}

            <div className="flex items-center justify-between gap-2 mb-4 z-10">
                <div className="flex items-center gap-2">
                    <CalendarIcon className={`h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-blue-500"}`} />
                    <h1 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : ""}`}>Calendar</h1>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`h-8 w-8 rounded-full ${theme === "dark" ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-slate-600" : ""}`}
                >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>

            <CalendarHeader
                activeView={activeView}
                handleViewChange={handleViewChange}
                handleNavigate={handleNavigate}
                formatDateRange={formatDateRange}
                sidebarMode={sidebarMode}
                setSidebarMode={setSidebarMode}
                isSearchOpen={isSearchOpen}
                toggleSearch={toggleSearch}
                setEditingEvent={setEditingEvent}
                setIsFormOpen={setIsFormOpen}
                events={events}
                staffMembers={staffMembers}
                clients={clients}
                eventTypes={eventTypes}
                searchQuery={searchQuery}
                searchInputRef={searchInputRef as RefObject<HTMLInputElement>}
                setSearchQuery={setSearchQuery}
                spaceTheme={theme === "dark"}
            />

            <div className="flex flex-1 h-full relative z-10">
                {/* Staff sidebar - always visible */}
                <CalendarSidebar
                    showSidebar={true} // Always show sidebar
                    sidebarMode={sidebarMode}
                    staffMembers={staffMembers}
                    clients={clients}
                    eventTypes={eventTypes}
                    toggleStaffSelection={handleToggleStaffSelection}
                    toggleClientSelection={handleToggleClientSelection}
                    toggleEventTypeSelection={handleToggleEventTypeSelection}
                    selectAllStaff={handleSelectAllStaff}
                    deselectAllStaff={handleDeselectAllStaff}
                    selectAllClients={handleSelectAllClients}
                    deselectAllClients={handleDeselectAllClients}
                    toggleSidebarMode={handleToggleSidebarMode}
                    spaceTheme={theme === "dark"}
                />

                {/* Main calendar area */}
                <div className="flex-1 h-full" ref={calendarRef}>
                    {hasNoData ? (
                        <Card
                            className={`flex-1 h-full flex flex-col items-center justify-center p-8 ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : ""}`}
                        >
                            <div className="text-center max-w-md">
                                <CalendarIcon
                                    className={`h-12 w-12 mx-auto mb-4 ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`}
                                />
                                <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : ""}`}>
                                    No appointments found
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    You don't have any appointments scheduled. Create your first appointment to get started.
                                </p>
                                <Button onClick={handleCreateAppointment} className="mx-auto">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Create Appointment
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <CustomCalendar
                            events={filteredEvents}
                            currentDate={currentDate}
                            activeView={activeView}
                            onSelectEvent={handleEventSelect}
                            onEventUpdate={handleEventUpdate}
                            onNavigate={handleDateSelect}
                            isLoading={isLoading}
                            staffMembers={staffMembers}
                            getEventDurationInMinutes={getEventDurationInMinutes}
                            isMobile={isMobile}
                            sidebarMode={sidebarMode}
                            toggleStaffSelection={handleToggleStaffSelection}
                            toggleClientSelection={handleToggleClientSelection}
                            toggleEventTypeSelection={handleToggleEventTypeSelection}
                            selectAllStaff={handleSelectAllStaff}
                            deselectAllStaff={handleDeselectAllStaff}
                            selectAllClients={handleSelectAllClients}
                            deselectAllClients={handleDeselectAllClients}
                            toggleSidebarMode={handleToggleSidebarMode}
                            clients={clients}
                            eventTypes={eventTypes}
                            spaceTheme={theme === "dark"}
                        />
                    )}
                </div>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className={theme === "dark" ? "dark-dialog" : ""}>
                    <VisuallyHidden>
                        <DialogTitle>New Appointment</DialogTitle>
                    </VisuallyHidden>
                    <AppointmentForm
                        isOpen={true}
                        onClose={handleFormClose}
                        event={editingEvent}
                        isNew={!editingEvent}
                        spaceTheme={theme === "dark"}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}


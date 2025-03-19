"use client"

import { useState, useMemo, useRef } from "react"
import moment from "moment"
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { CustomCalendar } from "./custom-calender"
import type { CalendarProps } from "./types"
import { useCalendarData } from "./use-calender-data"
import { useCalendarFilters } from "./use-calender-filters"
import { useCalendarStyles } from "./use-calender-styles"
import { useCalendarSearch } from "./use-calender-search"
import { AppointmentForm } from "../appointment-form"
import { CalendarHeader } from "./calender-header"
import { CalendarSidebar } from "./calender-sidebar"

export function Calendar({ view, onEventSelect, dateRange }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(dateRange.from || new Date())
    const [activeView, setActiveView] = useState<"day" | "week" | "month">(view)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [showSidebar, setShowSidebar] = useState(true)
    const calendarRef = useRef<HTMLDivElement>(null)

    // Custom hooks for calendar functionality
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

    const { isSearchOpen, searchQuery, searchInputRef, toggleSearch, setSearchQuery } = useCalendarSearch(
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

    return (
        <div className="flex flex-col h-full w-full">
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
                searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
                setSearchQuery={setSearchQuery}
            />

            <div className="flex flex-1 h-full">
                {/* Staff sidebar - only show in week/month views */}
                {
                    <CalendarSidebar
                        showSidebar={showSidebar}
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
                    />
                }

                {/* Main calendar area */}
                <div className="flex-1 h-full" ref={calendarRef}>
                    {/* Left sidebar with day indicators - only shown in week/month views */}
                    {!isMobile && activeView !== "day" && (
                        <div className="w-16 flex flex-col items-center pt-8 border-r border-gray-100">
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-500 uppercase">MON</span>
                                <span className="text-lg font-medium">{moment(currentDate).date()}</span>
                            </div>
                        </div>
                    )}

                    {/* Custom Calendar */}
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
                    />
                </div>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <VisuallyHidden>
                        <DialogTitle>New Appointment</DialogTitle>
                    </VisuallyHidden>
                    <AppointmentForm
                        isOpen={true}
                        onClose={() => {
                            setIsFormOpen(false)
                            setEditingEvent(null)
                        }}
                        event={editingEvent}
                        isNew={!editingEvent}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}


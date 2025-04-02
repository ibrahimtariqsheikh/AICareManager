"use client"

import { useState, useMemo, useRef } from "react"
import moment from "moment"
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useMediaQuery } from "../../../hooks/use-mobile"
import { useTheme } from "next-themes"
import { CalendarIcon, Moon, PlusCircle, Sun } from "lucide-react"
import { Button } from "../../ui/button"
import type { AppointmentEvent } from "./types"

import { CalendarHeader } from "./calender-header"
import { AppointmentForm } from "../appointment-form"

import { CustomCalendar } from "./custom-calender"
import type { CalendarProps, StaffMember, Client, SidebarMode } from "./types"
import { Card } from "../../ui/card"
import { setClients, setCareWorkers, setOfficeStaff, setSidebarMode } from "../../../state/slices/userSlice"
import { useAppSelector, useAppDispatch } from "../../../state/redux"

import { CalendarSidebar } from "./calender-sidebar"
import { getRandomColor } from "./calender-utils"

export function Calendar({ view, onEventSelect, dateRange }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(dateRange.from || new Date())
    const [activeView, setActiveView] = useState<"day" | "week" | "month">(view)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<AppointmentEvent | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const calendarRef = useRef<HTMLDivElement>(null)
    const { theme, setTheme } = useTheme()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const dispatch = useAppDispatch()

    // Get data from Redux store
    const {
        officeStaff,
        careWorkers,
        clients,
        events,
        filteredEvents,
        sidebarMode,
        loading: isLoading,
    } = useAppSelector((state) => state.user)

    // Format staff members for the calendar
    const careWorkerMembers: StaffMember[] = useMemo(() => {
        return careWorkers.map((staff) => ({
            id: staff.id,
            name: `${staff.firstName} ${staff.lastName}`,
            role: staff.role || "CARE_WORKER",
            color: staff.color || getRandomColor(staff.id),
            avatar: staff.profile?.avatarUrl || "",
            selected: staff.selected || true,
        }))
    }, [careWorkers])

    const officeStaffMembers: StaffMember[] = useMemo(() => {
        return officeStaff.map((staff) => ({
            id: staff.id,
            name: `${staff.firstName} ${staff.lastName}`,
            role: staff.role || "OFFICE_STAFF",
            color: staff.color || getRandomColor(staff.id),
            avatar: staff.profile?.avatarUrl || "",
            selected: staff.selected || true,
        }))
    }, [officeStaff])

    // Format clients for the calendar
    const formattedClients: Client[] = useMemo(() => {
        return clients.map((client) => ({
            id: client.id,
            name: `${client.firstName} ${client.lastName}`,
            color: client.color || getRandomColor(client.id),
            avatar: client.profile?.avatarUrl || "",
            selected: client.selected || true,
        }))
    }, [clients])

    // Handle toggle functions directly in the Calendar component
    const handleToggleCareWorkerSelection = (staffId: string) => {
        const updatedCareWorkers = careWorkers.map((worker) => ({
            ...worker,
            selected: worker.id === staffId ? !worker.selected : worker.selected,
        }))
        dispatch(setCareWorkers(updatedCareWorkers))
    }

    const handleToggleOfficeStaffSelection = (staffId: string) => {
        const updatedOfficeStaff = officeStaff.map((staff) => ({
            ...staff,
            selected: staff.id === staffId ? !staff.selected : staff.selected,
        }))
        dispatch(setOfficeStaff(updatedOfficeStaff))
    }

    const handleToggleClientSelection = (clientId: string) => {
        const updatedClients = clients.map((client) => ({
            ...client,
            selected: client.id === clientId ? !client.selected : client.selected,
        }))
        dispatch(setClients(updatedClients))
    }

    const handleSelectAllCareWorkers = () => {
        const updatedCareWorkers = careWorkers.map((worker) => ({
            ...worker,
            selected: true,
        }))
        dispatch(setCareWorkers(updatedCareWorkers))
    }

    const handleDeselectAllCareWorkers = () => {
        const updatedCareWorkers = careWorkers.map((worker) => ({
            ...worker,
            selected: false,
        }))
        dispatch(setCareWorkers(updatedCareWorkers))
    }

    const handleSelectAllOfficeStaff = () => {
        const updatedOfficeStaff = officeStaff.map((staff) => ({
            ...staff,
            selected: true,
        }))
        dispatch(setOfficeStaff(updatedOfficeStaff))
    }

    const handleDeselectAllOfficeStaff = () => {
        const updatedOfficeStaff = officeStaff.map((staff) => ({
            ...staff,
            selected: false,
        }))
        dispatch(setOfficeStaff(updatedOfficeStaff))
    }

    const handleSelectAllClients = () => {
        const updatedClients = clients.map((client) => ({
            ...client,
            selected: true,
        }))
        dispatch(setClients(updatedClients))
    }

    const handleDeselectAllClients = () => {
        const updatedClients = clients.map((client) => ({
            ...client,
            selected: false,
        }))
        dispatch(setClients(updatedClients))
    }

    const handleSetSidebarMode = (mode: SidebarMode) => {
        dispatch(setSidebarMode(mode))
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
        if (isSearchOpen) {
            setSearchQuery("")
        }
    }

    // Media queries for responsive design
    const isMobile = useMediaQuery("(max-width: 640px)")

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
        // If this is a slot selection (new event), create a default event
        if (!event.id) {
            const defaultEvent = {
                start: new Date(event.start),
                end: new Date(event.end),
                date: new Date(event.start),
            }
            setEditingEvent(defaultEvent as any)
        } else {
            setEditingEvent(event)
        }
        setIsFormOpen(true)
        if (onEventSelect && event.id) {
            onEventSelect(event)
        }
    }

    // Handle event updates from drag operations
    const handleEventUpdate = (updatedEvent: any) => {
        // In a real app, you would update the event in your database
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
        // Refresh data would be handled by Redux
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

    // Add performance optimization to prevent unnecessary re-renders
    const memoizedCalendar = useMemo(
        () => (
            <CustomCalendar
                events={filteredEvents}
                currentDate={currentDate}
                activeView={activeView}
                onSelectEvent={handleEventSelect}
                onEventUpdate={handleEventUpdate}
                onNavigate={handleDateSelect}
                isLoading={isLoading}
                staffMembers={[...careWorkerMembers, ...officeStaffMembers]}
                isMobile={isMobile}
                sidebarMode={sidebarMode}
                clients={formattedClients}
                spaceTheme={theme === "dark"}
            />
        ),
        [
            filteredEvents,
            currentDate,
            activeView,
            isLoading,
            careWorkerMembers,
            officeStaffMembers,
            isMobile,
            sidebarMode,
            formattedClients,
            theme,
        ],
    )

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
                setSidebarMode={handleSetSidebarMode}
                isSearchOpen={isSearchOpen}
                toggleSearch={toggleSearch}
                setEditingEvent={setEditingEvent}
                setIsFormOpen={setIsFormOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                spaceTheme={theme === "dark"}
            />

            <div className="flex flex-1 h-full relative z-10">
                {/* Sidebar - always visible */}
                <CalendarSidebar
                    showSidebar={true}
                    sidebarMode={sidebarMode}
                    staffMembers={[]}
                    careWorkers={careWorkerMembers}
                    officeStaff={officeStaffMembers}
                    clients={formattedClients}
                    eventTypes={[]}
                    toggleStaffSelection={() => { }}
                    toggleCareWorkerSelection={handleToggleCareWorkerSelection}
                    toggleOfficeStaffSelection={handleToggleOfficeStaffSelection}
                    toggleClientSelection={handleToggleClientSelection}
                    toggleEventTypeSelection={() => { }}
                    selectAllStaff={() => { }}
                    deselectAllStaff={() => { }}
                    selectAllCareWorkers={handleSelectAllCareWorkers}
                    deselectAllCareWorkers={handleDeselectAllCareWorkers}
                    selectAllOfficeStaff={handleSelectAllOfficeStaff}
                    deselectAllOfficeStaff={handleDeselectAllOfficeStaff}
                    selectAllClients={handleSelectAllClients}
                    deselectAllClients={handleDeselectAllClients}
                    setSidebarMode={handleSetSidebarMode}
                    spaceTheme={theme === "dark"}
                />

                {/* Main calendar area */}
                <div className="flex-1 h-full overflow-hidden" ref={calendarRef}>
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
                        memoizedCalendar
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
                        isNew={!editingEvent?.id}
                        spaceTheme={theme === "dark"}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}


"use client"
import { useEffect, useState } from "react"
import { CustomDayView } from "./views/custom-day-view"
import { CustomWeekView } from "./views/custom-week-view"
import { CustomMonthView } from "./views/custom-month-view"
import type { AppointmentEvent, StaffMember, Client, SidebarMode, ProcessedCalendarEvent } from "./types"
import { Skeleton } from "../../ui/skeleton"

import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setActiveView } from "@/state/slices/calendarSlice"
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, DollarSign, Search, Timer, User2, Users } from "lucide-react"
import { CalendarRange } from "lucide-react"
import { CalendarDays } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import moment from "moment"
import { Calendar as CalendarDropdown } from "@/components/ui/calender"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { setActiveScheduleUserType, setFilteredClients, setFilteredCareWorkers, setFilteredOfficeStaff } from "@/state/slices/scheduleSlice"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { setSelectedCareWorkers, setSelectedOfficeStaff } from "@/state/slices/userSlice"
import { setSelectedClients } from "@/state/slices/userSlice"

import { ScrollArea } from "@/components/ui/scroll-area"
import { CustomInput } from "@/components/ui/custom-input"

// Add month picker styles
const monthPickerStyles = `
.month-picker .rdp {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.month-picker .rdp-months {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.month-picker .rdp-month {
    margin: 0;
}

.month-picker .rdp-caption {
    display: none;
}

.month-picker .rdp-table {
    display: none;
}

.month-picker .rdp-nav {
    display: none;
}
`

interface CustomCalendarProps {
    currentDate: Date
    activeView: "day" | "week" | "month"
    onSelectEvent: (event: any) => void
    onEventUpdate: (event: any) => void
    onNavigate: (date: Date) => void
    isLoading: boolean
    staffMembers: StaffMember[]
    isMobile: boolean
    sidebarMode: SidebarMode
    clients: Client[]
    spaceTheme?: boolean
    events?: ProcessedCalendarEvent[]
    getEventTypeLabel: (type: string) => string
}

export function CustomCalendar({
    currentDate,
    activeView,
    onSelectEvent,
    onEventUpdate,
    onNavigate,
    isLoading,
    staffMembers,
    sidebarMode,
    getEventTypeLabel,
}: CustomCalendarProps) {

    useEffect(() => {
        const style = document.createElement('style')
        style.textContent = monthPickerStyles
        document.head.appendChild(style)
        return () => {
            document.head.removeChild(style)
        }
    }, [])



    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType)

    const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date } | undefined>(() => {
        if (activeView === "week") {
            return {
                from: moment(currentDate).startOf('week').toDate(),
                to: moment(currentDate).endOf('week').toDate()
            }
        } else if (activeView === "month") {
            return {
                from: moment(currentDate).startOf('month').toDate(),
                to: moment(currentDate).endOf('month').toDate()
            }
        }
        return undefined
    })

    const clients = useAppSelector((state) => state.user.clients)
    const careWorkers = useAppSelector((state) => state.user.careWorkers)
    const officeStaff = useAppSelector((state) => state.user.officeStaff)


    const [searchQuery, setSearchQuery] = useState("")
    const [searchQueryCareWorker, setSearchQueryCareWorker] = useState("")
    const [searchQueryOfficeStaff, setSearchQueryOfficeStaff] = useState("")

    const filteredClients = clients.filter(client =>
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredCareWorkers = careWorkers.filter(careWorker =>
        careWorker.fullName.toLowerCase().includes(searchQueryCareWorker.toLowerCase())
    )

    const filteredOfficeStaff = officeStaff.filter(staff =>
        staff.fullName.toLowerCase().includes(searchQueryOfficeStaff.toLowerCase())
    )

    const filteredUsers = useAppSelector((state) => state.schedule.filteredUsers)

    const handleClientSelection = (client: Client) => {
        if (filteredUsers.clients.includes(client.id)) {
            dispatch(setFilteredClients(filteredUsers.clients.filter(id => id !== client.id)))
        } else {
            dispatch(setFilteredClients([...filteredUsers.clients, client.id]))
        }
    }

    const handleCareWorkerSelection = (careWorker: StaffMember) => {
        if (filteredUsers.careWorkers.includes(careWorker.id)) {
            dispatch(setFilteredCareWorkers(filteredUsers.careWorkers.filter(id => id !== careWorker.id)))
        } else {
            dispatch(setFilteredCareWorkers([...filteredUsers.careWorkers, careWorker.id]))
        }
    }

    const handleOfficeStaffSelection = (staff: StaffMember) => {
        if (filteredUsers.officeStaff.includes(staff.id)) {
            dispatch(setFilteredOfficeStaff(filteredUsers.officeStaff.filter(id => id !== staff.id)))
        } else {
            dispatch(setFilteredOfficeStaff([...filteredUsers.officeStaff, staff.id]))
        }
    }

    const dispatch = useAppDispatch()

    useEffect(() => {
        // Select all users by default
        const allClientIds = clients.map(client => client.id)
        const allCareWorkerIds = careWorkers.map(worker => worker.id)
        const allOfficeStaffIds = officeStaff.map(staff => staff.id)

        dispatch(setFilteredClients(allClientIds))
        dispatch(setFilteredCareWorkers(allCareWorkerIds))
        dispatch(setFilteredOfficeStaff(allOfficeStaffIds))

        // Also update the selected users in user slice
        dispatch(setSelectedClients(clients))
        dispatch(setSelectedCareWorkers(careWorkers))
        dispatch(setSelectedOfficeStaff(officeStaff))
    }, [clients, careWorkers, officeStaff, dispatch])




    useEffect(() => {
        if (activeView === "week") {
            setSelectedRange({
                from: moment(currentDate).startOf('week').toDate(),
                to: moment(currentDate).endOf('week').toDate()
            })
        } else if (activeView === "month") {
            setSelectedRange({
                from: moment(currentDate).startOf('month').toDate(),
                to: moment(currentDate).endOf('month').toDate()
            })
        } else {
            setSelectedRange(undefined)
        }
    }, [activeView, currentDate])

    const handleDateSelect = (date: Date | { from: Date; to: Date } | undefined) => {
        if (!date) return

        if ((activeView === "week" || activeView === "month") && 'from' in date) {
            setSelectedRange(date)
            onNavigate(date.from)
        } else if (date instanceof Date) {
            setSelectedRange(undefined)
            onNavigate(date)
        }
    }


    const getEventDurationInMinutes = (event: AppointmentEvent) => {
        const start = new Date(event.start)
        const end = new Date(event.end)
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    }




    if (isLoading) {
        return (
            <div className="w-full h-full p-4">
                <Skeleton className="w-full h-full" />
            </div>
        )
    }

    // Render the appropriate view based on activeView
    return (
        <div className="h-full w-full ">
            <div className="flex items-center justify-between h-20 px-4">
                <div className="flex justify-start items-center">

                    {/* Controls and info row */}
                    <div className="flex justify-end items-center gap-2 px-4">

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div
                                    className="h-8 flex items-center gap-2 bg-gray-100 text-gray-600 rounded-md px-2 py-1 text-xs  cursor-pointer"
                                    whileHover={{ scale: 1.04, borderColor: "rgb(156 163 175)" }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    {activeScheduleUserType === "clients" ? (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Clients</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    ) : activeScheduleUserType === "officeStaff" ? (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Office Staff</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    ) : activeScheduleUserType === "careWorker" ? (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Care Worker</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Staff</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    )}
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel className="text-neutral-900 text-xs font-semibold">User Type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <motion.div >
                                    <DropdownMenuItem onClick={() => dispatch(setActiveScheduleUserType("clients"))}
                                        className="cursor-pointer text-xs font-medium text-neutral-900"
                                    >Clients</DropdownMenuItem>
                                </motion.div>
                                <motion.div >
                                    <DropdownMenuItem onClick={() => dispatch(setActiveScheduleUserType("officeStaff"))}
                                        className="cursor-pointer text-xs font-medium text-neutral-900"
                                    >Office Staff</DropdownMenuItem>
                                </motion.div>
                                <motion.div >
                                    <DropdownMenuItem onClick={() => dispatch(setActiveScheduleUserType("careWorker"))}
                                        className="cursor-pointer text-xs font-medium text-neutral-900"
                                    >Care Worker</DropdownMenuItem>
                                </motion.div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div
                                    className="h-8 flex items-center gap-2 bg-gray-100 text-gray-600 rounded-md px-2 py-1 text-xs  cursor-pointer"
                                    whileHover={{ scale: 1.04, borderColor: "rgb(156 163 175)" }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    {activeScheduleUserType === "clients" ? (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Select Client(s)</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    ) : activeScheduleUserType === "officeStaff" ? (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Select Office Staff(s)</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    ) : activeScheduleUserType === "careWorker" ? (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Select Care Worker(s)</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-neutral-900">
                                            <p>Select Staff(s)</p>
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    )}
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[300px]">
                                <DropdownMenuLabel className="text-neutral-900 text-xs font-semibold">{activeScheduleUserType === "clients" ? "Select Client(s)" : activeScheduleUserType === "officeStaff" ? "Select Office Staff(s)" : activeScheduleUserType === "careWorker" ? "Select Care Worker(s)" : "Select Staff(s)"}</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {activeScheduleUserType === "clients" && (
                                    <div className="flex flex-col gap-2 p-2">
                                        <CustomInput
                                            placeholder="Search clients..."
                                            value={searchQuery}
                                            onChange={setSearchQuery}
                                            className="h-8 text-xs"
                                            icon={<Search className="h-3 w-3" />}
                                        />
                                        <ScrollArea className="h-[200px]">
                                            <div className="flex flex-col gap-2">
                                                {filteredClients.map((client) => (
                                                    <div key={client.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer p-1 hover:bg-gray-100 rounded-md">
                                                        <Checkbox
                                                            checked={filteredUsers.clients.includes(client.id)}
                                                            onCheckedChange={() => handleClientSelection(client)}
                                                        />
                                                        {client.fullName}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}

                                {activeScheduleUserType === "careWorker" && (
                                    <div className="flex flex-col gap-2 p-2">
                                        <CustomInput
                                            placeholder="Search care workers..."
                                            value={searchQueryCareWorker}
                                            onChange={setSearchQueryCareWorker}
                                            className="h-8 text-xs"
                                            icon={<Search className="h-3 w-3" />}
                                        />
                                        <ScrollArea className="h-[200px]">
                                            <div className="flex flex-col gap-2">
                                                {filteredCareWorkers.map((careWorker) => (
                                                    <div key={careWorker.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer p-1 hover:bg-gray-100 rounded-md">
                                                        <Checkbox
                                                            checked={filteredUsers.careWorkers.includes(careWorker.id)}
                                                            onCheckedChange={() => handleCareWorkerSelection(careWorker)}
                                                        />
                                                        {careWorker.fullName}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}

                                {activeScheduleUserType === "officeStaff" && (
                                    <div className="flex flex-col gap-2 p-2">
                                        <CustomInput
                                            placeholder="Search office staff..."
                                            value={searchQueryOfficeStaff}
                                            onChange={setSearchQueryOfficeStaff}
                                            className="h-8 text-xs"
                                            icon={<Search className="h-3 w-3" />}
                                        />
                                        <ScrollArea className="h-[200px]">
                                            <div className="flex flex-col gap-2">
                                                {filteredOfficeStaff.map((staff) => (
                                                    <div key={staff.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer p-1 hover:bg-gray-100 rounded-md">
                                                        <Checkbox
                                                            checked={filteredUsers.officeStaff.includes(staff.id)}
                                                            onCheckedChange={() => handleOfficeStaffSelection(staff)}
                                                        />
                                                        {staff.fullName}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Date header - centered in the middle column */}
                <div className="flex justify-center items-center">
                    {activeView === "day" ? (
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onNavigate(moment(currentDate).subtract(1, 'day').toDate())}
                                className="cursor-pointer p-2 rounded-md hover:bg-gray-100"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </motion.div>
                            <motion.div
                                className={`relative inline-block text-lg font-semibold text-center px-3 py-1.5 rounded-md cursor-pointer hover:bg-opacity-10 hover:bg-gray-500`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                layout
                                layoutId="date-header"
                            >
                                <Dialog>
                                    <DialogTrigger className="flex items-center gap-2">
                                        {moment(currentDate).format("dddd, MMMM D, YYYY")}

                                    </DialogTrigger>
                                    <DialogContent className="w-fit">
                                        <DialogHeader>
                                            <div className="flex items-center gap-4 flex-col">
                                                <DialogTitle>Calendar</DialogTitle>
                                                <CalendarDropdown
                                                    mode="single"
                                                    selected={currentDate ?? new Date()}
                                                    onSelect={handleDateSelect}
                                                    className={cn(
                                                        "rounded-md border w-fit",
                                                        "[&_.rdp-day_selected]:bg-blue-100 [&_.rdp-day_selected]:text-blue-900"
                                                    )}
                                                />
                                            </div>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onNavigate(moment(currentDate).add(1, 'day').toDate())}
                                className="cursor-pointer p-2 rounded-md hover:bg-gray-100"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            className={`relative inline-block text-lg font-semibold text-center px-3 py-1.5 rounded-md cursor-pointer hover:bg-opacity-10 hover:bg-gray-500`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            layout
                            layoutId="date-header"
                        >
                            <div className="flex items-center gap-2">
                                {activeView === "week" && `${moment(currentDate).startOf('week').format("MMM D")} - ${moment(currentDate).endOf('week').format("MMM D, YYYY")}`}
                                {activeView === "month" && moment(currentDate).format("MMMM YYYY")}
                                <Popover>
                                    <PopoverTrigger className="flex items-center gap-2">
                                        <ChevronDown className="h-4 w-4" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-fit">

                                        <div className="flex items-center gap-4 flex-col">

                                            <CalendarDropdown
                                                mode={activeView === "week" || activeView === "month" ? "range" : "single"}
                                                selected={activeView === "week" || activeView === "month" ? (selectedRange ?? { from: new Date(), to: new Date() }) : (currentDate ?? new Date())}
                                                onSelect={handleDateSelect}
                                                className={cn(
                                                    "rounded-md border w-fit",
                                                    activeView === "month" && "month-picker",
                                                    "[&_.rdp-day_selected]:bg-blue-100 [&_.rdp-day_selected]:text-blue-900",
                                                    "[&_.rdp-day_range_middle]:bg-blue-50 [&_.rdp-day_range_middle]:text-blue-900",
                                                    "[&_.rdp-day_range_start]:bg-blue-100 [&_.rdp-day_range_start]:text-blue-900",
                                                    "[&_.rdp-day_range_end]:bg-blue-100 [&_.rdp-day_range_end]:text-blue-900"
                                                )}
                                                numberOfMonths={activeView === "week" ? 2 : 1}
                                            />
                                        </div>

                                    </PopoverContent>
                                </Popover>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Empty div for the third column to maintain balance */}
                <div className="flex justify-end items-center">
                    <Tabs
                        value={activeView}
                        onValueChange={(value) => dispatch(setActiveView(value as "day" | "week" | "month"))}
                    >
                        <TabsList className="bg-neutral-100">
                            <TabsTrigger value="day" className="text-xs text-neutral-900">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                Day
                            </TabsTrigger>
                            <TabsTrigger value="week" className="text-xs text-neutral-900">
                                <CalendarRange className="h-3 w-3 mr-1" />
                                Week
                            </TabsTrigger>
                            <TabsTrigger value="month" className="text-xs text-neutral-900">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                Month
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

            </div>
            <div className=" w-full bg-neutral-100/50 h-10 px-8 py-2 flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-blue-500/20 rounded-full p-2 text-blue-500">
                        <Users className="h-3 w-3" />
                    </div>
                    <p className="text-[11px] font-medium text-neutral-600">2 Clients Scheduled</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-green-500/20 rounded-full p-2 text-green-500">
                        <Timer className="h-3 w-3" />
                    </div>
                    <p className="text-[11px] font-medium text-neutral-600">10.5 total hours</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-yellow-500/20 rounded-full p-2 text-yellow-500">
                        <DollarSign className="h-3 w-3" />
                    </div>
                    <p className="text-[11px] font-medium text-neutral-600">$100 total cost</p>
                </div>
            </div>

            {/* <div className="flex justify-end items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="sm" >
                            <PlusCircle className="h-3 w-3" />
                            Create Appointment
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
            </div> */}
            {activeView === "day" && (
                <CustomDayView
                    currentView={activeView}
                    currentDate={currentDate}
                    onDateChange={onNavigate}
                    date={currentDate}

                    onSelectEvent={onSelectEvent}
                    onEventUpdate={onEventUpdate}


                />
            )}

            {activeView === "week" && (
                <CustomWeekView
                    date={currentDate}

                    onSelectEvent={onSelectEvent}
                    onEventUpdate={onEventUpdate}
                    staffMembers={staffMembers}
                    getEventDurationInMinutes={getEventDurationInMinutes}

                />
            )}

            {activeView === "month" && (
                <CustomMonthView
                    date={currentDate}

                    onSelectEvent={onSelectEvent}
                    onDateSelect={onNavigate}
                    staffMembers={staffMembers}
                    getEventDurationInMinutes={getEventDurationInMinutes}
                    getEventTypeLabel={getEventTypeLabel}


                    sidebarMode={sidebarMode}
                />
            )}
        </div>
    )
}

export default CustomCalendar


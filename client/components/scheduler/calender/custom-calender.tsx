"use client"
import { useEffect, useState } from "react"
import { CustomDayView } from "./views/custom-day-view"
import { CustomWeekView } from "./views/custom-week-view"
import { CustomMonthView } from "./views/custom-month-view"
import type { AppointmentEvent, StaffMember, Client, SidebarMode, ProcessedCalendarEvent } from "./types"
import { Skeleton } from "../../ui/skeleton"

import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setActiveView } from "@/state/slices/calendarSlice"
import { CalendarIcon, ChevronDown, GripVertical, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
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
import { setActiveScheduleUserType } from "@/state/slices/scheduleSlice"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
    spaceTheme,
    events = [],
    getEventTypeLabel,
}: CustomCalendarProps) {
    // Add styles to document
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

    const getVisibleEventsCount = () => {
        if (activeView === "day") {
            return events.filter(event =>
                moment(event.start).isSame(currentDate, 'day')
            ).length
        } else if (activeView === "week") {
            const weekStart = moment(currentDate).startOf('week')
            const weekEnd = moment(currentDate).endOf('week')
            return events.filter(event =>
                moment(event.start).isBetween(weekStart, weekEnd, 'day', '[]')
            ).length
        } else if (activeView === "month") {
            const monthStart = moment(currentDate).startOf('month')
            const monthEnd = moment(currentDate).endOf('month')
            return events.filter(event =>
                moment(event.start).isBetween(monthStart, monthEnd, 'day', '[]')
            ).length
        }
        return events.length
    }

    const dispatch = useAppDispatch()




    if (isLoading) {
        return (
            <div className="w-full h-full p-4">
                <Skeleton className="w-full h-full" />
            </div>
        )
    }

    // Render the appropriate view based on activeView
    return (
        <div className="h-full w-full calendar-scrollbar">
            <div className="grid grid-cols-3 p-2 gap-2 items-center justify-between h-20 ">
                <div className="flex justify-start items-center">

                    {/* Controls and info row */}
                    <div className="flex justify-end items-center gap-2 px-4">
                        {/* <div
                            className={cn(
                                "text-xs flex items-center gap-1 h-8 p-3 rounded-md",
                                spaceTheme ? "text-neutral-100 bg-neutral-900/50" : "text-neutral-900 bg-neutral-100"
                            )}
                        >
                            <GripVertical className="h-3 w-3" />
                            <span>Draggable</span>
                        </div>
                        <div
                            className={cn(
                                "text-xs flex items-center gap-1 h-8 p-3 rounded-md",
                                spaceTheme ? "bg-neutral-900 text-neutral-100" : "bg-neutral-100 text-neutral-900"
                            )}
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {getVisibleEventsCount()} {getVisibleEventsCount() === 1 ? "event" : "events"}
                            </span>
                        </div> */}
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

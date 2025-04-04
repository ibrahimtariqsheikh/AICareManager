"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp, Filter, Calendar as CalendarIcon, CalendarDays, CalendarRange } from "lucide-react"
import { Button } from "../ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Calendar } from "../ui/calender"
import type { StaffMember, Client, SidebarMode } from "../scheduler/calender/types"
import { useAppDispatch, useAppSelector } from "../../state/redux"
import { setActiveView } from "../../state/slices/calendarSlice"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Dialog } from "../ui/dialog"
import { PopoverContent, PopoverTrigger } from "../ui/popover"
import { Popover } from "../ui/popover"

interface SidebarRightProps {
    sidebarMode: SidebarMode
    careWorkers: StaffMember[]
    officeStaff: StaffMember[]
    clients: Client[]
    toggleCareWorkerSelection: (id: string) => void
    toggleOfficeStaffSelection: (id: string) => void
    toggleClientSelection: (id: string) => void
    selectAllCareWorkers: () => void
    deselectAllCareWorkers: () => void
    selectAllOfficeStaff: () => void
    deselectAllOfficeStaff: () => void
    selectAllClients: () => void
    deselectAllClients: () => void
    setSidebarMode: (mode: SidebarMode) => void
    currentDate: Date
    onDateChange: (date: Date) => void
    onViewChange?: (view: "day" | "week" | "month") => void
    viewMode?: "day" | "week" | "month"
}

export function SidebarRight({
    sidebarMode,
    careWorkers,
    officeStaff,
    clients,
    toggleCareWorkerSelection,
    toggleOfficeStaffSelection,
    toggleClientSelection,
    selectAllCareWorkers,
    deselectAllCareWorkers,
    selectAllOfficeStaff,
    deselectAllOfficeStaff,
    selectAllClients,
    deselectAllClients,
    setSidebarMode,
    currentDate,
    onDateChange,
    onViewChange,
    viewMode,
}: SidebarRightProps) {
    const [isClientsOpen, setIsClientsOpen] = useState(true)
    const [isOfficeStaffOpen, setIsOfficeStaffOpen] = useState(true)
    const [isCareWorkersOpen, setIsCareWorkersOpen] = useState(true)
    const dispatch = useAppDispatch()
    const activeView = useAppSelector((state) => state.calendar.activeView)

    const selectedCareWorkers = careWorkers.filter((staff) => staff.selected).length
    const selectedOfficeStaff = officeStaff.filter((staff) => staff.selected).length
    const selectedClients = clients.filter((client) => client.selected).length

    const handleViewChange = (view: "day" | "week" | "month") => {
        dispatch(setActiveView(view))
        if (onViewChange) {
            onViewChange(view)
        }
    }

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)




    // Use the viewMode prop if provided, otherwise use the Redux state
    const currentView = viewMode || activeView

    return (
        <div className="w-80 border-l border-gray-200 h-full overflow-hidden flex flex-col">

            {/* Calendar Section */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">Calendar</h4>
                </div>

                {/* View Selection Tabs */}
                <Tabs
                    value={currentView}
                    onValueChange={(value) => handleViewChange(value as "day" | "week" | "month")}
                    className="mb-3"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="day" className="text-xs">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Day
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-xs">
                            <CalendarRange className="h-3 w-3 mr-1" />
                            Week
                        </TabsTrigger>
                        <TabsTrigger value="month" className="text-xs">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Month
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <Calendar
                    mode={currentView === "day" ? "single" : "range"}
                    selected={currentView === "day" ? currentDate : { from: currentDate, to: new Date(currentDate.getTime() + (currentView === "week" ? 6 : 30) * 24 * 60 * 60 * 1000) }}
                    onSelect={(date) => {
                        if (date) {
                            onDateChange(date)
                        }
                    }}
                    className="rounded-md border"
                />
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Clients Section */}
                    <div className="space-y-2">
                        <Collapsible open={isClientsOpen} onOpenChange={setIsClientsOpen}>
                            <div className="flex items-center justify-between">
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-between p-2"
                                    >
                                        <div className="flex items-center">
                                            <span>Clients</span>
                                            <Badge variant="secondary" className="ml-2">
                                                {selectedClients}/{clients.length}
                                            </Badge>
                                        </div>
                                        {isClientsOpen ? (
                                            <ChevronUp className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="space-y-2 mt-2">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={selectAllClients}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={deselectAllClients}
                                    >
                                        Deselect All
                                    </Button>
                                </div>
                                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                                    {clients.map((client) => (
                                        <div
                                            key={client.id}
                                            className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleClientSelection(client.id)}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${client.selected ? "bg-primary" : "bg-gray-200"}`}
                                            >
                                                {client.selected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={client.avatar} alt={client.firstName} />
                                                <AvatarFallback className="text-xs text-white" style={{ backgroundColor: client.color }}>
                                                    {client.firstName.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm truncate font-medium">{client.firstName}</span>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Office Staff Section */}
                    <div className="space-y-2">
                        <Collapsible open={isOfficeStaffOpen} onOpenChange={setIsOfficeStaffOpen}>
                            <div className="flex items-center justify-between">
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-between p-2"
                                    >
                                        <div className="flex items-center">
                                            <span>Office Staff</span>
                                            <Badge variant="secondary" className="ml-2">
                                                {selectedOfficeStaff}/{officeStaff.length}
                                            </Badge>
                                        </div>
                                        {isOfficeStaffOpen ? (
                                            <ChevronUp className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="space-y-2 mt-2">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={selectAllOfficeStaff}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={deselectAllOfficeStaff}
                                    >
                                        Deselect All
                                    </Button>
                                </div>
                                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                                    {officeStaff.map((staff) => (
                                        <div
                                            key={staff.id}
                                            className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleOfficeStaffSelection(staff.id)}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${staff.selected ? "bg-primary" : "bg-gray-200"}`}
                                            >
                                                {staff.selected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={staff.avatar} alt={staff.firstName} />
                                                <AvatarFallback className="text-xs text-white" style={{ backgroundColor: staff.color }}>
                                                    {staff.firstName.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm truncate font-medium">{staff.firstName}</span>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Care Workers Section */}
                    <div className="space-y-2">
                        <Collapsible open={isCareWorkersOpen} onOpenChange={setIsCareWorkersOpen}>
                            <div className="flex items-center justify-between">
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-between p-2"
                                    >
                                        <div className="flex items-center">
                                            <span>Care Workers</span>
                                            <Badge variant="secondary" className="ml-2">
                                                {selectedCareWorkers}/{careWorkers.length}
                                            </Badge>
                                        </div>
                                        {isCareWorkersOpen ? (
                                            <ChevronUp className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="space-y-2 mt-2">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={selectAllCareWorkers}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={deselectAllCareWorkers}
                                    >
                                        Deselect All
                                    </Button>
                                </div>
                                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                                    {careWorkers.map((staff) => (
                                        <div
                                            key={staff.id}
                                            className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleCareWorkerSelection(staff.id)}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${staff.selected ? "bg-primary" : "bg-gray-200"}`}
                                            >
                                                {staff.selected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={staff.avatar} alt={staff.firstName} />
                                                <AvatarFallback className="text-xs text-white" style={{ backgroundColor: staff.color }}>
                                                    {staff.firstName.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm truncate font-medium">{staff.firstName}</span>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </ScrollArea>
        </div >
    )
}

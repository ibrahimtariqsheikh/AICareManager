"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp, Users, UserRound, Briefcase, Filter } from "lucide-react"
import { Button } from "../../ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible"
import { ScrollArea } from "../../ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Badge } from "../../ui/badge"
import type { StaffMember, Client, SidebarMode } from "./types"

interface CalendarSidebarProps {
    showSidebar: boolean
    sidebarMode: SidebarMode
    staffMembers: StaffMember[]
    careWorkers: StaffMember[]
    officeStaff: StaffMember[]
    clients: Client[]
    eventTypes: any[]
    toggleStaffSelection: (id: string) => void
    toggleCareWorkerSelection: (id: string) => void
    toggleOfficeStaffSelection: (id: string) => void
    toggleClientSelection: (id: string) => void
    toggleEventTypeSelection: (id: string) => void
    selectAllStaff: () => void
    deselectAllStaff: () => void
    selectAllCareWorkers: () => void
    deselectAllCareWorkers: () => void
    selectAllOfficeStaff: () => void
    deselectAllOfficeStaff: () => void
    selectAllClients: () => void
    deselectAllClients: () => void
    setSidebarMode: (mode: SidebarMode) => void
    spaceTheme?: boolean
}

export function CalendarSidebar({
    showSidebar,
    sidebarMode,
    staffMembers,
    careWorkers,
    officeStaff,
    clients,
    eventTypes,
    toggleStaffSelection,
    toggleCareWorkerSelection,
    toggleOfficeStaffSelection,
    toggleClientSelection,
    toggleEventTypeSelection,
    selectAllStaff,
    deselectAllStaff,
    selectAllCareWorkers,
    deselectAllCareWorkers,
    selectAllOfficeStaff,
    deselectAllOfficeStaff,
    selectAllClients,
    deselectAllClients,
    setSidebarMode,
    spaceTheme = false,
}: CalendarSidebarProps) {
    const [isStaffOpen, setIsStaffOpen] = useState(true)
    const [isClientsOpen, setIsClientsOpen] = useState(true)
    const [isEventTypesOpen, setIsEventTypesOpen] = useState(true)

    if (!showSidebar) return null

    const selectedCareWorkers = careWorkers.filter((staff) => staff.selected).length
    const selectedOfficeStaff = officeStaff.filter((staff) => staff.selected).length
    const selectedClients = clients.filter((client) => client.selected).length
    const selectedEventTypes = eventTypes.filter((type) => type.selected).length

    return (
        <div
            className={`w-64 border-r ${spaceTheme ? "border-slate-800 bg-slate-900/60" : "border-gray-200"
                } h-full overflow-hidden flex flex-col`}
        >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className={`font-medium ${spaceTheme ? "text-white" : ""}`}>Filters</h3>
                <Filter className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
            </div>

            <Tabs
                defaultValue={sidebarMode}
                value={sidebarMode}
                onValueChange={(value) => setSidebarMode(value as SidebarMode)}
                className="flex-1 flex flex-col"
            >
                <TabsList className="grid grid-cols-3 p-1 m-2">
                    <TabsTrigger value="clients" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Clients
                    </TabsTrigger>
                    <TabsTrigger value="careworkers" className="text-xs">
                        <UserRound className="h-3 w-3 mr-1" />
                        Careworkers
                    </TabsTrigger>
                    <TabsTrigger value="officestaff" className="text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        Office Staff
                    </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {/* Event Types Section - Always visible */}
                        <Collapsible open={isEventTypesOpen} onOpenChange={setIsEventTypesOpen}>
                            <div className="flex items-center justify-between">
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`w-full justify-between p-2 ${spaceTheme ? "hover:bg-slate-800 text-white" : ""}`}
                                    >
                                        <div className="flex items-center">
                                            <span>Event Types</span>
                                            <Badge variant="secondary" className={`ml-2 ${spaceTheme ? "bg-slate-800 text-slate-200" : ""}`}>
                                                {selectedEventTypes}/{eventTypes.length}
                                            </Badge>
                                        </div>
                                        {isEventTypesOpen ? (
                                            <ChevronUp className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                        ) : (
                                            <ChevronDown className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="space-y-2 mt-2">
                                {eventTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className={`flex items-center p-2 rounded-md cursor-pointer ${spaceTheme ? "hover:bg-slate-800" : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => toggleEventTypeSelection(type.id)}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${type.selected ? "bg-primary" : spaceTheme ? "bg-slate-700" : "bg-gray-200"
                                                }`}
                                        >
                                            {type.selected && <Check className="h-3 w-3 text-white" />}
                                        </div>
                                        <div className="flex items-center flex-1">
                                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }}></div>
                                            <span className={`text-sm ${spaceTheme ? "text-white" : ""}`}>{type.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Tab Content */}
                        <TabsContent value="clients" className="mt-0 space-y-4">
                            <Collapsible open={isClientsOpen} onOpenChange={setIsClientsOpen}>
                                <div className="flex items-center justify-between">
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-between p-2 ${spaceTheme ? "hover:bg-slate-800 text-white" : ""}`}
                                        >
                                            <div className="flex items-center">
                                                <span>Clients</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`ml-2 ${spaceTheme ? "bg-slate-800 text-slate-200" : ""}`}
                                                >
                                                    {selectedClients}/{clients.length}
                                                </Badge>
                                            </div>
                                            {isClientsOpen ? (
                                                <ChevronUp className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                            ) : (
                                                <ChevronDown className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2 mt-2">
                                    <div className="flex justify-between mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs ${spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}`}
                                            onClick={selectAllClients}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs ${spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}`}
                                            onClick={deselectAllClients}
                                        >
                                            Deselect All
                                        </Button>
                                    </div>
                                    {clients.map((client) => (
                                        <div
                                            key={client.id}
                                            className={`flex items-center p-2 rounded-md cursor-pointer ${spaceTheme ? "hover:bg-slate-800" : "hover:bg-gray-100"
                                                }`}
                                            onClick={() => toggleClientSelection(client.id)}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${client.selected ? "bg-primary" : spaceTheme ? "bg-slate-700" : "bg-gray-200"
                                                    }`}
                                            >
                                                {client.selected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={client.avatar} alt={client.name} />
                                                <AvatarFallback className="text-xs" style={{ backgroundColor: client.color }}>
                                                    {client.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className={`text-sm truncate ${spaceTheme ? "text-white" : ""}`}>{client.name}</span>
                                        </div>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        </TabsContent>

                        <TabsContent value="careworkers" className="mt-0 space-y-4">
                            <Collapsible open={isStaffOpen} onOpenChange={setIsStaffOpen}>
                                <div className="flex items-center justify-between">
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-between p-2 ${spaceTheme ? "hover:bg-slate-800 text-white" : ""}`}
                                        >
                                            <div className="flex items-center">
                                                <span>Care Workers</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`ml-2 ${spaceTheme ? "bg-slate-800 text-slate-200" : ""}`}
                                                >
                                                    {selectedCareWorkers}/{careWorkers.length}
                                                </Badge>
                                            </div>
                                            {isStaffOpen ? (
                                                <ChevronUp className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                            ) : (
                                                <ChevronDown className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2 mt-2">
                                    <div className="flex justify-between mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs ${spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}`}
                                            onClick={selectAllCareWorkers}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs ${spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}`}
                                            onClick={deselectAllCareWorkers}
                                        >
                                            Deselect All
                                        </Button>
                                    </div>
                                    {careWorkers.map((staff) => (
                                        <div
                                            key={staff.id}
                                            className={`flex items-center p-2 rounded-md cursor-pointer ${spaceTheme ? "hover:bg-slate-800" : "hover:bg-gray-100"
                                                }`}
                                            onClick={() => toggleCareWorkerSelection(staff.id)}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${staff.selected ? "bg-primary" : spaceTheme ? "bg-slate-700" : "bg-gray-200"
                                                    }`}
                                            >
                                                {staff.selected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={staff.avatar} alt={staff.name} />
                                                <AvatarFallback className="text-xs" style={{ backgroundColor: staff.color }}>
                                                    {staff.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className={`text-sm truncate ${spaceTheme ? "text-white" : ""}`}>{staff.name}</span>
                                        </div>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        </TabsContent>

                        <TabsContent value="officestaff" className="mt-0 space-y-4">
                            <Collapsible open={isStaffOpen} onOpenChange={setIsStaffOpen}>
                                <div className="flex items-center justify-between">
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-between p-2 ${spaceTheme ? "hover:bg-slate-800 text-white" : ""}`}
                                        >
                                            <div className="flex items-center">
                                                <span>Office Staff</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`ml-2 ${spaceTheme ? "bg-slate-800 text-slate-200" : ""}`}
                                                >
                                                    {selectedOfficeStaff}/{officeStaff.length}
                                                </Badge>
                                            </div>
                                            {isStaffOpen ? (
                                                <ChevronUp className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                            ) : (
                                                <ChevronDown className={`h-4 w-4 ${spaceTheme ? "text-slate-400" : "text-gray-500"}`} />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2 mt-2">
                                    <div className="flex justify-between mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs ${spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}`}
                                            onClick={selectAllOfficeStaff}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs ${spaceTheme ? "border-slate-700 hover:bg-slate-800" : ""}`}
                                            onClick={deselectAllOfficeStaff}
                                        >
                                            Deselect All
                                        </Button>
                                    </div>
                                    {officeStaff.map((staff) => (
                                        <div
                                            key={staff.id}
                                            className={`flex items-center p-2 rounded-md cursor-pointer ${spaceTheme ? "hover:bg-slate-800" : "hover:bg-gray-100"
                                                }`}
                                            onClick={() => toggleOfficeStaffSelection(staff.id)}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${staff.selected ? "bg-primary" : spaceTheme ? "bg-slate-700" : "bg-gray-200"
                                                    }`}
                                            >
                                                {staff.selected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={staff.avatar} alt={staff.name} />
                                                <AvatarFallback className="text-xs" style={{ backgroundColor: staff.color }}>
                                                    {staff.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className={`text-sm truncate ${spaceTheme ? "text-white" : ""}`}>{staff.name}</span>
                                        </div>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    )
}


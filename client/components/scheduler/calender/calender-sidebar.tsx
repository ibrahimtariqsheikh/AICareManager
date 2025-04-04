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
import { getStaffColor } from "./calender-utils"

interface CalendarSidebarProps {
    showSidebar: boolean
    sidebarMode: SidebarMode
    staffMembers: StaffMember[]
    careWorkers: StaffMember[]
    officeStaff: StaffMember[]
    clients: Client[]
    toggleStaffSelection: (id: string) => void
    toggleCareWorkerSelection: (id: string) => void
    toggleOfficeStaffSelection: (id: string) => void
    toggleClientSelection: (id: string) => void
    selectAllStaff: () => void
    deselectAllStaff: () => void
    selectAllCareWorkers: () => void
    deselectAllCareWorkers: () => void
    selectAllOfficeStaff: () => void
    deselectAllOfficeStaff: () => void
    selectAllClients: () => void
    deselectAllClients: () => void
    setSidebarMode: (mode: SidebarMode) => void
}

export function CalendarSidebar({
    showSidebar,
    sidebarMode,
    staffMembers,
    careWorkers,
    officeStaff,
    clients,
    toggleStaffSelection,
    toggleCareWorkerSelection,
    toggleOfficeStaffSelection,
    toggleClientSelection,
    selectAllStaff,
    deselectAllStaff,
    selectAllCareWorkers,
    deselectAllCareWorkers,
    selectAllOfficeStaff,
    deselectAllOfficeStaff,
    selectAllClients,
    deselectAllClients,
    setSidebarMode,
}: CalendarSidebarProps) {
    const [isStaffOpen, setIsStaffOpen] = useState(true)
    const [isClientsOpen, setIsClientsOpen] = useState(true)

    if (!showSidebar) return null

    const selectedCareWorkers = careWorkers.filter((staff) => staff.selected).length
    const selectedOfficeStaff = officeStaff.filter((staff) => staff.selected).length
    const selectedClients = clients.filter((client) => client.selected).length

    return (
        <div
            className={`w-64 border-gray-200 h-full overflow-hidden flex flex-col`}
        >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className={`font-semibold`}>Filters</h3>
                <Filter className={`h-4 w-4 text-gray-500`} />
            </div>

            <Tabs
                defaultValue={sidebarMode}
                value={sidebarMode}
                onValueChange={(value) => setSidebarMode(value as SidebarMode)}
                className="flex-1 flex flex-col"
            >
                <TabsList className="grid grid-cols-3 m-1 mt-3 ">
                    <TabsTrigger value="clients" className="text-xs">
                        Clients
                    </TabsTrigger>
                    <TabsTrigger value="careworkers" className="text-xs">
                        Careworkers
                    </TabsTrigger>
                    <TabsTrigger value="officestaff" className="text-xs">
                        Office Staff
                    </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {/* Tab Content */}
                        <TabsContent value="clients" className="mt-0 space-y-4">
                            <Collapsible open={isClientsOpen} onOpenChange={setIsClientsOpen}>
                                <div className="flex items-center justify-between">
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-between p-2`}
                                        >
                                            <div className="flex items-center">
                                                <span>Clients</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`ml-2`}
                                                >
                                                    {selectedClients}/{clients.length}
                                                </Badge>
                                            </div>
                                            {isClientsOpen ? (
                                                <ChevronUp className={`h-4 w-4 text-gray-500`} />
                                            ) : (
                                                <ChevronDown className={`h-4 w-4 text-gray-500`} />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2 mt-2">
                                    <div className="flex justify-between mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs`}
                                            onClick={selectAllClients}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs`}
                                            onClick={deselectAllClients}
                                        >
                                            Deselect All
                                        </Button>
                                    </div>
                                    {clients.map((client) => {
                                        const { staffColor, staffName } = getStaffColor(client)
                                        return (
                                            <div
                                                key={client.id}
                                                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100`}
                                                onClick={() => toggleClientSelection(client.id)}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${client.selected ? "bg-primary" : "bg-gray-200"}`}
                                                >
                                                    {client.selected && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                                <Avatar className="h-6 w-6 mr-2">
                                                    <AvatarImage src={client.avatar} alt={`${client.firstName} ${client.lastName}`} />
                                                    <AvatarFallback className="text-xs text-white" style={{ backgroundColor: staffColor }}>
                                                        {staffName.split(" ").map((n) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className={`text-sm truncate font-medium`}>{`${client.firstName} ${client.lastName}`}</span>
                                            </div>
                                        )
                                    })}
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
                                            className={`w-full justify-between p-2`}
                                        >
                                            <div className="flex items-center">
                                                <span>Care Workers</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`ml-2`}
                                                >
                                                    {selectedCareWorkers}/{careWorkers.length}
                                                </Badge>
                                            </div>
                                            {isStaffOpen ? (
                                                <ChevronUp className={`h-4 w-4 text-gray-500`} />
                                            ) : (
                                                <ChevronDown className={`h-4 w-4 text-gray-500`} />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2 mt-2">
                                    <div className="flex justify-between mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs`}
                                            onClick={selectAllCareWorkers}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs`}
                                            onClick={deselectAllCareWorkers}
                                        >
                                            Deselect All
                                        </Button>
                                    </div>
                                    {careWorkers.map((staff) => {
                                        const { staffColor, staffName } = getStaffColor(staff)
                                        return (
                                            <div
                                                key={staff.id}
                                                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100`}
                                                onClick={() => toggleCareWorkerSelection(staff.id)}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${staff.selected ? "bg-primary" : "bg-gray-200"}`}
                                                >
                                                    {staff.selected && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                                <Avatar className="h-6 w-6 mr-2">
                                                    <AvatarImage src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
                                                    <AvatarFallback className="text-xs text-white" style={{ backgroundColor: staffColor }}>
                                                        {staffName.split(" ").map((n) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className={`text-sm truncate font-medium`}>{`${staff.firstName} ${staff.lastName}`}</span>
                                            </div>
                                        )
                                    })}
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
                                            className={`w-full justify-between p-2`}
                                        >
                                            <div className="flex items-center">
                                                <span>Office Staff</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`ml-2`}
                                                >
                                                    {selectedOfficeStaff}/{officeStaff.length}
                                                </Badge>
                                            </div>
                                            {isStaffOpen ? (
                                                <ChevronUp className={`h-4 w-4 text-gray-500`} />
                                            ) : (
                                                <ChevronDown className={`h-4 w-4 text-gray-500`} />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2 mt-2">
                                    <div className="flex justify-between mb-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs`}
                                            onClick={selectAllOfficeStaff}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`text-xs`}
                                            onClick={deselectAllOfficeStaff}
                                        >
                                            Deselect All
                                        </Button>
                                    </div>
                                    {officeStaff.map((staff) => {
                                        const { staffColor, staffName } = getStaffColor(staff)
                                        return (
                                            <div
                                                key={staff.id}
                                                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100`}
                                                onClick={() => toggleOfficeStaffSelection(staff.id)}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${staff.selected ? "bg-primary" : "bg-gray-200"}`}
                                                >
                                                    {staff.selected && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                                <Avatar className="h-6 w-6 mr-2">
                                                    <AvatarImage src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
                                                    <AvatarFallback className="text-xs text-white" style={{ backgroundColor: staffColor }}>
                                                        {staffName.split(" ").map((n) => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className={`text-sm truncate font-medium`}>{`${staff.firstName} ${staff.lastName}`}</span>
                                            </div>
                                        )
                                    })}
                                </CollapsibleContent>
                            </Collapsible>
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    )
}

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "../../ui/card"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { Separator } from "../../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Home, Video, Building2, Phone, User, Users } from 'lucide-react'
import { type StaffMember, type Client, type EventType } from "./types"


interface CalendarSidebarProps {
    showSidebar: boolean
    sidebarMode: "staff" | "clients"
    staffMembers: StaffMember[]
    clients: Client[]
    eventTypes: EventType[]
    toggleStaffSelection: (staffId: string) => void
    toggleClientSelection: (clientId: string) => void
    toggleEventTypeSelection: (typeId: string) => void
    selectAllStaff: () => void
    deselectAllStaff: () => void
    selectAllClients: () => void
    deselectAllClients: () => void
    toggleSidebarMode: () => void
    spaceTheme?: boolean
}

export function CalendarSidebar({
    showSidebar,
    sidebarMode,
    staffMembers,
    clients,
    eventTypes,
    toggleStaffSelection,
    toggleClientSelection,
    toggleEventTypeSelection,
    selectAllStaff,
    deselectAllStaff,
    selectAllClients,
    deselectAllClients,
    toggleSidebarMode,
    spaceTheme = false,
}: CalendarSidebarProps) {
    // Get event icon based on type
    const getEventTypeIcon = (type: string) => {
        switch (type) {
            case "HOME_VISIT":
                return <Home className="h-3 w-3" />
            case "VIDEO_CALL":
                return <Video className="h-3 w-3" />
            case "HOSPITAL":
                return <Building2 className="h-3 w-3" />
            case "AUDIO_CALL":
                return <Phone className="h-3 w-3" />
            case "IN_PERSON":
                return <User className="h-3 w-3" />
            default:
                return null
        }
    }

    const cardClasses = spaceTheme
        ? "h-full p-4 overflow-y-auto bg-zinc-900/80 backdrop-blur-sm border-zinc-800 text-white"
        : "h-full p-4 overflow-y-auto"

    const buttonClasses = spaceTheme ? "text-white/80 hover:text-white hover:bg-zinc-800" : ""

    const separatorClasses = spaceTheme ? "bg-zinc-800" : ""

    return (
        <AnimatePresence initial={false}>
            {showSidebar && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full mr-4 overflow-hidden"
                >
                    <Card className={cardClasses}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                {sidebarMode === "staff" ? (
                                    <Users className={`h-4 w-4 mr-2 ${spaceTheme ? "text-green-400" : "text-gray-500"}`} />
                                ) : (
                                    <User className={`h-4 w-4 mr-2 ${spaceTheme ? "text-green-400" : "text-gray-500"}`} />
                                )}
                                <h3 className="text-sm font-medium">{sidebarMode === "staff" ? "Healthcare Staff" : "Clients"}</h3>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 text-xs ${buttonClasses}`}
                                    onClick={sidebarMode === "staff" ? selectAllStaff : selectAllClients}
                                >
                                    All
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 text-xs ${buttonClasses}`}
                                    onClick={sidebarMode === "staff" ? deselectAllStaff : deselectAllClients}
                                >
                                    None
                                </Button>
                                <Button
                                    variant={spaceTheme ? "ghost" : "outline"}
                                    size="sm"
                                    className={`h-7 text-xs ml-1 ${buttonClasses}`}
                                    onClick={toggleSidebarMode}
                                >
                                    {sidebarMode === "staff" ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                                </Button>
                            </div>
                        </div>

                        {sidebarMode === "staff" ? (
                            <div className="space-y-3">
                                {staffMembers.map((staff) => (
                                    <div key={staff.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`staff-${staff.id}`}
                                            checked={staff.selected}
                                            onCheckedChange={() => toggleStaffSelection(staff.id)}
                                            className={
                                                spaceTheme
                                                    ? "border-zinc-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                    : ""
                                            }
                                        />
                                        <div className="flex items-center flex-1 ">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={staff.avatar} alt={staff.name.split(" ")[0]} />
                                                <AvatarFallback className="text-white text-xs" style={{ backgroundColor: staff.color }}>
                                                    {staff.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <label
                                                    htmlFor={`staff-${staff.id}`}
                                                    className={`text-sm font-medium leading-none cursor-pointer ${spaceTheme ? "text-white" : ""}`}
                                                >
                                                    {staff.name}
                                                </label>
                                                <p className={`text-xs ${spaceTheme ? "text-zinc-400" : "text-gray-500"}`}>{staff.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {clients.map((client) => (
                                    <div key={client.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`client-${client.id}`}
                                            checked={client.selected}
                                            onCheckedChange={() => toggleClientSelection(client.id)}
                                            className={
                                                spaceTheme
                                                    ? "border-zinc-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                    : ""
                                            }
                                        />
                                        <div className="flex items-center flex-1 ">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={client.avatar} alt={client.name.split(" ")[0]} />
                                                <AvatarFallback className="text-white text-xs" style={{ backgroundColor: client.color }}>
                                                    {client.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <label
                                                    htmlFor={`client-${client.id}`}
                                                    className={`text-sm font-medium leading-none cursor-pointer ${spaceTheme ? "text-white" : ""}`}
                                                >
                                                    {client.name}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Separator className={`my-4 ${separatorClasses}`} />

                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-medium ${spaceTheme ? "text-white" : ""}`}>Appointment Types</h3>
                        </div>

                        <div className="space-y-3">
                            {eventTypes.map((type) => (
                                <div key={type.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`type-${type.id}`}
                                        checked={type.selected}
                                        onCheckedChange={() => toggleEventTypeSelection(type.id)}
                                        className={
                                            spaceTheme
                                                ? "border-zinc-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                : ""
                                        }
                                    />
                                    <div className="flex items-center">
                                        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: type.color }} />
                                        <label
                                            htmlFor={`type-${type.id}`}
                                            className={`text-sm font-medium leading-none cursor-pointer flex items-center ${spaceTheme ? "text-white" : ""}`}
                                        >
                                            <span className="mr-1">{getEventTypeIcon(type.id)}</span>
                                            {type.name}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

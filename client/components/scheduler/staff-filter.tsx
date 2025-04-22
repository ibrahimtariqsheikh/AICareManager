"use client"

import { useState, useEffect } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Badge } from "../ui/badge"

export function StaffFilter() {
    const [open, setOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<string[]>([])
    const [staffMembers, setStaffMembers] = useState<any[]>([])

    useEffect(() => {
        // In a real app, this would be an API call
        const mockStaff = [
            { id: "staff-1", fullName: "Dr. Sarah Wilson" },
            { id: "staff-2", fullName: "Nurse David Thompson" },
            { id: "staff-3", fullName: "Dr. Lisa Martinez" },
            { id: "staff-4", fullName: "Therapist James Taylor" },
        ]

        setStaffMembers(mockStaff)
    }, [])

    const toggleStaffSelection = (staffId: string) => {
        setSelectedStaff((current) =>
            current.includes(staffId) ? current.filter((id) => id !== staffId) : [...current, staffId],
        )
    }

    const clearSelections = () => {
        setSelectedStaff([])
    }

    return (
        <div className="space-y-2">
            <div className="font-medium text-sm">Staff Members</div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between" role="combobox" aria-expanded={open}>
                        {selectedStaff.length > 0 ? `${selectedStaff.length} selected` : "Select staff members..."}
                        <div className="ml-2 flex gap-1">
                            {selectedStaff.length > 0 && (
                                <Badge variant="secondary" className="rounded-sm">
                                    {selectedStaff.length}
                                </Badge>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search staff..." />
                        <CommandList>
                            <CommandEmpty>No staff found.</CommandEmpty>
                            <CommandGroup>
                                {staffMembers.map((staff) => (
                                    <CommandItem key={staff.id} value={staff.id} onSelect={() => toggleStaffSelection(staff.id)}>
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedStaff.includes(staff.id)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <CheckIcon className="h-3 w-3" />
                                        </div>
                                        <span>{`${staff.fullName}`}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {selectedStaff.length > 0 && (
                                <div className="border-t p-2">
                                    <Button variant="ghost" size="sm" className="w-full justify-center text-xs" onClick={clearSelections}>
                                        Clear selections
                                    </Button>
                                </div>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}


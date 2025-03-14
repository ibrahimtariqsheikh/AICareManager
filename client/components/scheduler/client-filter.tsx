"use client"

import { useState, useEffect } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Badge } from "../ui/badge"

export function ClientFilter() {
    const [open, setOpen] = useState(false)
    const [selectedClients, setSelectedClients] = useState<string[]>([])
    const [clients, setClients] = useState<any[]>([])

    useEffect(() => {
        // In a real app, this would be an API call
        const mockClients = [
            { id: "client-1", name: "John Doe" },
            { id: "client-2", name: "Jane Smith" },
            { id: "client-3", name: "Robert Johnson" },
            { id: "client-4", name: "Emily Davis" },
            { id: "client-5", name: "Michael Brown" },
        ]

        setClients(mockClients)
    }, [])

    const toggleClientSelection = (clientId: string) => {
        setSelectedClients((current) =>
            current.includes(clientId) ? current.filter((id) => id !== clientId) : [...current, clientId],
        )
    }

    const clearSelections = () => {
        setSelectedClients([])
    }

    return (
        <div className="space-y-2">
            <div className="font-medium text-sm">Clients</div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between" role="combobox" aria-expanded={open}>
                        {selectedClients.length > 0 ? `${selectedClients.length} selected` : "Select clients..."}
                        <div className="ml-2 flex gap-1">
                            {selectedClients.length > 0 && (
                                <Badge variant="secondary" className="rounded-sm">
                                    {selectedClients.length}
                                </Badge>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search clients..." />
                        <CommandList>
                            <CommandEmpty>No clients found.</CommandEmpty>
                            <CommandGroup>
                                {clients.map((client) => (
                                    <CommandItem key={client.id} value={client.id} onSelect={() => toggleClientSelection(client.id)}>
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedClients.includes(client.id)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <CheckIcon className="h-3 w-3" />
                                        </div>
                                        <span>{client.name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {selectedClients.length > 0 && (
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


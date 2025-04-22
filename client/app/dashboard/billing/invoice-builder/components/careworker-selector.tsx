"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { useAppDispatch, useAppSelector } from "@/state/redux"
import { setSelectedCareWorker } from "@/state/slices/invoiceSlice"
import { cn } from "@/lib/utils"
import { User } from "@/types/prismaTypes"



export function CareWorkerSelector() {
    const [open, setOpen] = useState(false)
    const selectedCareWorker = useAppSelector((state) => state.invoice.selectedCareWorker)
    const careWorkers = useAppSelector((state) => state.user.careWorkers)
    const dispatch = useAppDispatch()

    console.log("careWorkers", careWorkers)
    console.log("selectedCareWorker", selectedCareWorker)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedCareWorker ? selectedCareWorker.fullName : "Select care worker..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search clients..." />
                    <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                            {careWorkers.map((careWorker: User) => (
                                <CommandItem
                                    key={careWorker.id}
                                    value={careWorker.fullName}
                                    onSelect={() => {
                                        dispatch(setSelectedCareWorker(careWorker.id === selectedCareWorker?.id ? null : careWorker))
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn("mr-2 h-4 w-4", selectedCareWorker?.id === careWorker.id ? "opacity-100" : "opacity-0")}
                                    />
                                    <div className="flex flex-col">
                                        <span>
                                            {careWorker.fullName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{careWorker.email}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

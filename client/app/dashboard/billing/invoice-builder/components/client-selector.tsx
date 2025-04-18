"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { useAppDispatch, useAppSelector } from "@/state/redux"
import { setSelectedClient } from "@/state/slices/invoiceSlice"
import { cn } from "@/lib/utils"
import { User } from "@/types/prismaTypes"



export function ClientSelector() {
  const [open, setOpen] = useState(false)
  const selectedClient = useAppSelector((state) => state.invoice.selectedClient)
  const clients = useAppSelector((state) => state.user.clients)
  const dispatch = useAppDispatch()

  console.log("clients", clients)
  console.log("selectedClient", selectedClient)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedClient ? selectedClient.firstName + " " + selectedClient.lastName : "Select client..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search clients..." />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {clients.map((client: User) => (
                <CommandItem
                  key={client.id}
                  value={client.firstName + " " + client.lastName}
                  onSelect={() => {
                    dispatch(setSelectedClient(client.id === selectedClient?.id ? null : client))
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedClient?.id === client.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span>
                      {client.firstName} {client.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">{client.email}</span>
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

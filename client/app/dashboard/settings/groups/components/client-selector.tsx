"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { useAppSelector } from "@/hooks/useAppSelector"
import type { Client } from "../types"

interface ClientSelectorProps {
  onClientSelect: (client: Client) => void
  selectedClientIds: string[]
}

export function ClientSelector({ onClientSelect, selectedClientIds }: ClientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const clients = useAppSelector((state) => state.user.clients)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients.map((client: Client) => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        status: "ACTIVE"
      })))
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredClients(
        clients
          .filter(
            (client) =>
              client.firstName.toLowerCase().includes(query) ||
              client.lastName.toLowerCase().includes(query)
          )
          .map(client => ({
            id: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            status: client.status || "ACTIVE"
          }))
      )
    }
  }, [searchQuery, clients])

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search clients..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[200px] border rounded-md">
        {filteredClients.length > 0 ? (
          <div className="p-2">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => onClientSelect(client)}
              >
                <Checkbox
                  id={`client-${client.id}`}
                  checked={selectedClientIds.includes(client.id)}
                  onCheckedChange={() => onClientSelect(client)}
                />
                <label htmlFor={`client-${client.id}`} className="flex-1 text-sm cursor-pointer flex justify-between">
                  <span>
                    {client.firstName} {client.lastName}
                  </span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">No clients found</div>
        )}
      </ScrollArea>
    </div>
  )
}

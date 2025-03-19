"use client"

import { useState, useRef, useEffect } from "react"
import type { StaffMember, Client, EventType, AppointmentEvent } from "./types"

export function useCalendarSearch(
    events: AppointmentEvent[],
    staffMembers: StaffMember[],
    clients: Client[],
    eventTypes: EventType[],
    sidebarMode: "staff" | "clients",
) {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Toggle search
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
        if (isSearchOpen) {
            setSearchQuery("")
        }
    }

    // Focus search input when search is opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 100)
        }
    }, [isSearchOpen])

    return {
        isSearchOpen,
        searchQuery,
        searchInputRef,
        toggleSearch,
        setSearchQuery,
    }
}


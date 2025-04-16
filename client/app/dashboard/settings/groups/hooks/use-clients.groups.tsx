"use client"

import { useState, useEffect } from "react"
import type { ClientGroup } from "../types"

// This is a mock implementation. In a real app, you would connect to your API
export function useClientGroups() {
    const [clientGroups, setClientGroups] = useState<ClientGroup[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Load client groups from localStorage on component mount
    useEffect(() => {
        const storedGroups = localStorage.getItem("clientGroups")
        if (storedGroups) {
            setClientGroups(JSON.parse(storedGroups))
        }
    }, [])

    // Save client groups to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("clientGroups", JSON.stringify(clientGroups))
    }, [clientGroups])

    const addClientGroup = (group: ClientGroup) => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setClientGroups([...clientGroups, group])
            setIsLoading(false)
        }, 500)
    }

    const updateClientGroup = (updatedGroup: ClientGroup) => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setClientGroups(clientGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)))
            setIsLoading(false)
        }, 500)
    }

    const deleteClientGroup = (id: string) => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setClientGroups(clientGroups.filter((group) => group.id !== id))
            setIsLoading(false)
        }, 500)
    }

    return {
        clientGroups,
        addClientGroup,
        updateClientGroup,
        deleteClientGroup,
        isLoading,
    }
}

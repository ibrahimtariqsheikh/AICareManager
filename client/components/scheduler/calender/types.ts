// Define calendar props interface
export interface CalendarProps {
    view: "day" | "week" | "month"
    onEventSelect: (event: any) => void
    dateRange: {
        from: Date | undefined
        to: Date | undefined
    }
}

// Define staff member interface
export interface StaffMember {
    id: string
    name: string
    role: string
    avatar?: string
    color: string
    selected: boolean
}

// Define event type interface
export interface EventType {
    id: string
    name: string
    color: string
    selected: boolean
}

// Define client interface
export interface Client {
    id: string
    name: string
    avatar?: string
    color: string
    selected: boolean
}

// Define appointment/event interface
export interface AppointmentEvent {
    id: string
    title: string
    start: Date
    end: Date
    resourceId: string
    clientId: string
    status: string
    type: string
    typeLabel?: string
    typeColor?: string
    bgClass?: string
    staffColor?: string
    staffName?: string
    clientColor?: string
    clientName?: string
    durationMinutes?: number
}

// Define calendar filter state
export interface CalendarFilterState {
    events: AppointmentEvent[]
    staffMembers: StaffMember[]
    clients: Client[]
    eventTypes: EventType[]
    sidebarMode: "staff" | "clients"
    setSidebarMode: (mode: "staff" | "clients") => void
}

// Define calendar search state
export interface CalendarSearchState {
    isSearchOpen: boolean
    searchQuery: string
    searchInputRef: React.RefObject<HTMLInputElement>
    toggleSearch: () => void
    setSearchQuery: (query: string) => void
}

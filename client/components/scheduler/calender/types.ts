export interface StaffMember {
  id: string
  fullName: string
  role: string
  color: string
  avatar?: string
  selected: boolean
}

export interface Client {
  id: string
  fullName: string
  color: string
  avatar?: string
  selected: boolean
}

export interface EventType {
  id: string
  name: string
  color: string
  selected: boolean
}

export interface AppointmentEvent {
  id: string
  title: string
  start: Date
  end: Date
  date: Date
  startTime: string
  endTime: string
  resourceId: string
  clientId: string
  type: string
  status: string
  notes: string
  color: string
  careWorker: {
    fullName: string
  }
  client: {
    fullName: string
  }
  isLeaveEvent?: boolean
  leaveType?: string
}

export interface CalendarProps {
  view: "day" | "week" | "month"
  onEventSelect: (event: any) => void
  dateRange: {
    from?: Date
    to?: Date
  }
}

export type SidebarMode = "clients" | "careworkers" | "officestaff"

export interface ProcessedCalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    date: Date
    startTime: string
    endTime: string
    resourceId: string
    clientId: string
    type: string
    status: string
    notes: string
    color: string
    careWorker: {
        fullName: string
    }
    client: {
        fullName: string
    }
    isLeaveEvent?: boolean
    leaveType?: string
}

export interface CustomCalendarProps {
    currentDate: Date
    activeView: "day" | "week" | "month"
    onSelectEvent: (event: any) => void
    onEventUpdate: (event: any) => void
    onNavigate: (date: Date) => void
    isLoading: boolean
    staffMembers: StaffMember[]
    isMobile: boolean
    sidebarMode: SidebarMode
    clients: Client[]
    spaceTheme?: boolean
    events: ProcessedCalendarEvent[]
}


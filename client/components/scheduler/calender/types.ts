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
  start: Date | string
  end: Date | string
  date: Date | string
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
  isUnallocated?: boolean
  duration?: number
  visitType?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  cost?: number
}

export interface CalendarProps {
  view: "day" | "week" | "month"
  onEventSelect: (event: any) => void
  dateRange: {
    from?: Date
    to?: Date
  }
  activeScheduleUserType?: "careWorker" | "client" | "officeStaff"
  userId?: string
}

export type SidebarMode = "clients" | "careworkers" | "officestaff"

export interface ProcessedCalendarEvent {
    id: string
    title: string
    start: Date | string
    end: Date | string
    date: Date | string
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
    isUnallocated?: boolean
    duration?: number
    visitType?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    cost?: number
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

export interface CustomDayViewProps {
    date: Date
    onSelectEvent: (event: any) => void
    onEventUpdate: (event: any) => void
    currentView: "day" | "week" | "month"
    currentDate: Date
    onDateChange: (date: Date) => void
    onViewChange: (view: "day" | "week" | "month") => void
    events: ProcessedCalendarEvent[]
}

export interface CustomWeekViewProps {
    date: Date
    onSelectEvent: (event: any) => void
    onEventUpdate: (event: any) => void
    staffMembers: StaffMember[]
    getEventDurationInMinutes: (event: AppointmentEvent) => number
    events: ProcessedCalendarEvent[]
}

export interface CustomMonthViewProps {
    date: Date
    onSelectEvent: (event: any) => void
    onDateSelect: (date: Date) => void
    staffMembers: StaffMember[]
    getEventDurationInMinutes: (event: AppointmentEvent) => number
    getEventTypeLabel: (type: string) => string
    sidebarMode: SidebarMode
    events: ProcessedCalendarEvent[]
}


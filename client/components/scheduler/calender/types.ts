export interface CalendarProps {
  view: "day" | "week" | "month"
  onEventSelect: (event: any) => void
  dateRange: {
    from?: Date
    to?: Date
  }
}

export interface AppointmentEvent {
  id: string
  title: string
  start: Date
  end: Date
  resourceId: string // staff member ID
  clientId: string
  type: string
  status: string
  notes?: string
  chargeRate?: number
  color?: string
  date?: Date // Added for form compatibility
  shiftStart?: string // Added for API compatibility
  shiftEnd?: string // Added for API compatibility
}

export interface StaffMember {
  id: string
  name: string
  role: string
  color: string
  avatar: string
  selected: boolean
}

export interface Client {
  id: string
  name: string
  color: string
  avatar: string
  selected: boolean
}

export interface EventType {
  id: string
  name: string
  color: string
  selected: boolean
}


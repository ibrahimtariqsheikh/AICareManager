import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { api } from "../api"
import type { ScheduleResponse } from "../api"
import type { AppointmentEvent, SidebarMode } from "../../components/scheduler/calender/types"
import { filterEvents } from "../../components/scheduler/calender/calender-utils"
import { applyTemplateToSchedule } from "./templateSlice"
import moment from "moment"

// This will help serialize and deserialize dates
function serializeEvent(event: AppointmentEvent): any {
  // Create a copy of the event to avoid mutating the original
  const serializedEvent = { ...event }

  // Helper function to safely convert date to ISO string
  const toISOString = (date: Date | string | undefined): string => {
    if (!date) return new Date().toISOString()
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) return new Date().toISOString()
      return dateObj.toISOString()
    } catch (error) {
      console.error("Error serializing date:", error)
      return new Date().toISOString()
    }
  }

  // Safely serialize dates
  serializedEvent.start = new Date(toISOString(event.start))
  serializedEvent.end = new Date(toISOString(event.end))
  serializedEvent.date = new Date(toISOString(event.date))

  return serializedEvent
}

function deserializeEvent(event: any): AppointmentEvent {
  // Create a copy of the event to avoid mutating the original
  const deserializedEvent = { ...event }

  // Helper function to safely convert to Date
  const toDate = (dateStr: string | Date | undefined): Date => {
    if (!dateStr) return new Date()
    try {
      const date = dateStr instanceof Date ? dateStr : new Date(dateStr)
      if (isNaN(date.getTime())) return new Date()
      return date
    } catch (error) {
      console.error("Error deserializing date:", error)
      return new Date()
    }
  }

  // Safely deserialize dates
  deserializedEvent.start = toDate(event.start)
  deserializedEvent.end = toDate(event.end)
  deserializedEvent.date = toDate(event.date)

  return deserializedEvent
}

interface ScheduleState {
  agencySchedules: ScheduleResponse[]
  events: AppointmentEvent[]
  filteredEvents: AppointmentEvent[]
  sidebarMode: SidebarMode
  loading: boolean
  error: string | null
  isHidden: boolean
  activeScheduleUserType: "clients" | "officeStaff" | "careWorker"
  lastAppliedTemplate: {
    templateId: string | null
    date: string | null
  }
  // Add filtered users state
  filteredUsers: {
    clients: string[]
    careWorkers: string[]
    officeStaff: string[]
  }
  // Add dialog state management
  dialog: {
    isOpen: boolean
    mode: "create" | "edit" | null
    selectedEventId: string | null
    selectedEvent: AppointmentEvent | null
  }
}

const initialState: ScheduleState = {
  agencySchedules: [],
  events: [],
  filteredEvents: [],
  sidebarMode: "clients",
  loading: false,
  error: null,
  isHidden: true,
  activeScheduleUserType: "clients",
  lastAppliedTemplate: {
    templateId: null,
    date: null,
  },
  // Initialize filtered users with all users selected
  filteredUsers: {
    clients: [], // Will be populated with all client IDs
    careWorkers: [], // Will be populated with all care worker IDs
    officeStaff: [] // Will be populated with all office staff IDs
  },
  // Initialize dialog state
  dialog: {
    isOpen: false,
    mode: null,
    selectedEventId: null,
    selectedEvent: null
  }
}

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<AppointmentEvent[]>) => {
      state.events = action.payload.map(serializeEvent)
      updateFilteredEvents(state)
    },
    setFilteredEvents: (state, action: PayloadAction<AppointmentEvent[]>) => {
      state.filteredEvents = action.payload.map(serializeEvent)
    },
    setSidebarMode: (state, action: PayloadAction<SidebarMode>) => {
      state.sidebarMode = action.payload
      updateFilteredEvents(state)
    },
    addEvent: (state, action: PayloadAction<AppointmentEvent>) => {
      const serializedEvent = serializeEvent(action.payload)
      state.events.push(serializedEvent)
      console.log("Added event to Redux store:", serializedEvent)
      updateFilteredEvents(state)
    },
    updateEvent: (state, action: PayloadAction<AppointmentEvent>) => {
      const serializedEvent = serializeEvent(action.payload)
      const index = state.events.findIndex((event) => event.id === serializedEvent.id)
      if (index !== -1) {
        state.events[index] = serializedEvent
      }
      updateFilteredEvents(state)
    },
    setActiveScheduleUserType: (state, action: PayloadAction<"clients" | "officeStaff" | "careWorker">) => {
      state.activeScheduleUserType = action.payload
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((event) => event.id !== action.payload)
      updateFilteredEvents(state)
    },
    toggleRightSidebar: (state) => {
      state.isHidden = !state.isHidden
    },
    clearScheduleError: (state) => {
      state.error = null
    },
    setIsHidden: (state, action: PayloadAction<boolean>) => {
      state.isHidden = action.payload
    },
    // New action to clear events for a specific date
    clearEventsForDate: (state, action: PayloadAction<string>) => {
      const targetDate = action.payload
      state.events = state.events.filter((event) => {
        const eventDate = moment(event.start).format("YYYY-MM-DD")
        return eventDate !== targetDate
      })
      updateFilteredEvents(state)
    },
    // Dialog management actions
    openCreateDialog: (state) => {
      state.dialog = {
        isOpen: true,
        mode: "create",
        selectedEventId: null,
        selectedEvent: null
      }
    },
    openEditDialog: (state, action: PayloadAction<AppointmentEvent>) => {
      const event = action.payload
      state.dialog = {
        isOpen: true,
        mode: "edit",
        selectedEventId: event.id,
        selectedEvent: serializeEvent(event)
      }
    },
    closeDialog: (state) => {
      state.dialog = {
        isOpen: false,
        mode: null,
        selectedEventId: null,
        selectedEvent: null
      }
    },
    // Add new reducers for filtered users
    setFilteredClients: (state, action: PayloadAction<string[]>) => {
      state.filteredUsers.clients = action.payload
      updateFilteredEvents(state)
    },
    setFilteredCareWorkers: (state, action: PayloadAction<string[]>) => {
      state.filteredUsers.careWorkers = action.payload
      updateFilteredEvents(state)
    },
    setFilteredOfficeStaff: (state, action: PayloadAction<string[]>) => {
      state.filteredUsers.officeStaff = action.payload
      updateFilteredEvents(state)
    },
    clearFilteredUsers: (state) => {
      state.filteredUsers = {
        clients: [],
        careWorkers: [],
        officeStaff: []
      }
      updateFilteredEvents(state)
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(applyTemplateToSchedule, (state: ScheduleState, action: PayloadAction<{ templateId: string; date: string }>) => {
        // Store the last applied template info
        state.lastAppliedTemplate = {
          templateId: action.payload.templateId,
          date: action.payload.date,
        }

        // The actual implementation will be handled by a thunk action
        // This is just to track the state change
      })
      .addMatcher(api.endpoints.getAgencySchedules.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.getAgencySchedules.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.agencySchedules = payload
        state.error = null
      })
      .addMatcher(api.endpoints.getAgencySchedules.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || "Failed to fetch schedules"
      })
      .addMatcher(api.endpoints.getSchedules.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.getSchedules.matchFulfilled, (state, { payload }) => {
        state.loading = false
        const events = payload.data.map((schedule: ScheduleResponse) => ({
          id: schedule.id,
          title: schedule.title,
          start: schedule.start,
          end: schedule.end,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          resourceId: schedule.id,
          clientId: schedule.clientId,
          type: schedule.type,
          status: schedule.status,
          notes: schedule.notes || "",
          color: schedule.color || getEventColor(schedule.type),
          careWorker: schedule.user,
          client: schedule.client,
        }))
        console.log("Events:", events)
        state.events = events as unknown as AppointmentEvent[]
        updateFilteredEvents(state)
      })
      .addMatcher(api.endpoints.getSchedules.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || "Failed to fetch schedules"
      })
  },
})

// Helper function to update filtered events based on current state
function updateFilteredEvents(state: ScheduleState) {
  // If there are no events, set filtered events to empty array
  if (!state.events || state.events.length === 0) {
    state.filteredEvents = []
    return
  }

  // Deserialize events for processing
  const deserializedEvents = state.events.map(deserializeEvent)

  // Filter events based on current selections and filtered users
  const filtered = filterEvents(
    deserializedEvents,
    state.filteredUsers.clients,
    state.filteredUsers.careWorkers,
    state.filteredUsers.officeStaff,
    [], // event types
    state.sidebarMode,
  )

  // Serialize filtered events before storing in state
  state.filteredEvents = filtered.map(serializeEvent)

  // Log for debugging
  console.log("Updated filtered events:", state.filteredEvents.length)
  console.log("Sample filtered event:", state.filteredEvents[0])
}

// Helper function to get event color based on type
function getEventColor(type: string): string {
  switch (type) {
    case "APPOINTMENT":
      return "#4f46e5" // indigo
    case "CHECKUP":
    case "WEEKLY_CHECKUP":
      return "#10b981" // emerald
    case "EMERGENCY":
      return "#ef4444" // red
    case "ROUTINE":
      return "#8b5cf6" // purple
    case "HOME_VISIT":
      return "#059669" // green
    default:
      return "#6b7280" // gray
  }
}

export const {
  setEvents,
  setFilteredEvents,
  setSidebarMode,
  addEvent,
  updateEvent,
  deleteEvent,
  clearScheduleError,
  setIsHidden,
  toggleRightSidebar,
  setActiveScheduleUserType,
  clearEventsForDate,
  // Export new filtered users actions
  setFilteredClients,
  setFilteredCareWorkers,
  setFilteredOfficeStaff,
  clearFilteredUsers,
  // Export dialog actions
  openCreateDialog,
  openEditDialog,
  closeDialog
} = scheduleSlice.actions

export default scheduleSlice.reducer

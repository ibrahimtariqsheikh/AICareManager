import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Schedule } from "../../types/prismaTypes"
import type { AppointmentEvent } from "../../components/scheduler/calender/types"
import { api } from "../api"

interface ScheduleState {
  events: AppointmentEvent[]
  filteredEvents: AppointmentEvent[]
  eventTypes: any[]
  sidebarMode: "clients" | "careworkers" | "officestaff"
  loading: boolean
  error: string | null
}

// Initial state
const initialState: ScheduleState = {
  events: [],
  filteredEvents: [],
  eventTypes: [
    { id: "HOME_VISIT", name: "Home Visit", color: "#4f46e5", selected: true },
    { id: "VIDEO_CALL", name: "Video Call", color: "#10b981", selected: true },
    { id: "HOSPITAL", name: "Hospital", color: "#f59e0b", selected: true },
    { id: "IN_PERSON", name: "In-Person", color: "#ef4444", selected: true },
    { id: "AUDIO_CALL", name: "Audio Call", color: "#8b5cf6", selected: true },
  ],
  sidebarMode: "clients",
  loading: false,
  error: null,
}

// Helper function to map API schedule data to calendar events
const mapSchedulesToEvents = (schedules: Schedule[]): AppointmentEvent[] => {
  return schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.title || `Appointment with ${schedule.client?.firstName || "Client"}`,
    start: new Date(schedule.shiftStart),
    end: new Date(schedule.shiftEnd),
    resourceId: schedule.userId,
    clientId: schedule.clientId,
    type: schedule.type || "APPOINTMENT",
    status: schedule.status || "PENDING",
    notes: schedule.notes || "",
    chargeRate: schedule.chargeRate || 25,
    color: getEventColor(schedule.type),
  }))
}

// Helper function to get event color based on type
const getEventColor = (type: string): string => {
  switch (type) {
    case "HOME_VISIT":
      return "#4f46e5"
    case "VIDEO_CALL":
      return "#10b981"
    case "HOSPITAL":
      return "#f59e0b"
    case "IN_PERSON":
      return "#ef4444"
    case "AUDIO_CALL":
      return "#8b5cf6"
    default:
      return "#6b7280"
  }
}

// Schedule Slice
const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<AppointmentEvent[]>) => {
      state.events = action.payload
      state.filteredEvents = action.payload
    },
    setFilteredEvents: (state, action: PayloadAction<AppointmentEvent[]>) => {
      state.filteredEvents = action.payload
    },
    setEventTypes: (state, action: PayloadAction<   any []>) => {
      state.eventTypes = action.payload
    },
    setSidebarMode: (state, action: PayloadAction<"clients" | "careworkers" | "officestaff">) => {
      state.sidebarMode = action.payload
    },
    toggleEventTypeSelection: (state, action: PayloadAction<string>) => {
      state.eventTypes = state.eventTypes.map((type) =>
        type.id === action.payload ? { ...type, selected: !type.selected } : type,
      )
    },
    clearScheduleError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getSchedules
      .addMatcher(api.endpoints.getSchedules.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.getSchedules.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.events = mapSchedulesToEvents(payload.data)
        state.filteredEvents = mapSchedulesToEvents(payload.data)
      })
      .addMatcher(api.endpoints.getSchedules.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || "Failed to fetch schedules"
      })
      // Handle getSchedulesByDateRange
      .addMatcher(api.endpoints.getSchedulesByDateRange.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.getSchedulesByDateRange.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.events = mapSchedulesToEvents(payload.data)
        state.filteredEvents = mapSchedulesToEvents(payload.data)
      })
      .addMatcher(api.endpoints.getSchedulesByDateRange.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || "Failed to fetch schedules by date range"
      })
  },
})

export const {
  setEvents,
  setFilteredEvents,
  setEventTypes,
  setSidebarMode,
  toggleEventTypeSelection,
  clearScheduleError,
} = scheduleSlice.actions
export default scheduleSlice.reducer


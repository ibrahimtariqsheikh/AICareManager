import { createSlice } from "@reduxjs/toolkit"
import { api } from "../api"
import type { ScheduleResponse } from "../api"

interface ScheduleState {
  loading: boolean
  error: string | null
  events: ScheduleResponse[]
  filteredEvents: ScheduleResponse[]
}

const initialState: ScheduleState = {
  loading: false,
  error: null,
  events: [],
  filteredEvents: [],
}

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getSchedules.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.getSchedules.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.events = payload.data
        state.filteredEvents = payload.data
        state.error = null
      })
      .addMatcher(api.endpoints.getSchedules.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || "Failed to fetch schedules"
      })
  },
})

export default scheduleSlice.reducer


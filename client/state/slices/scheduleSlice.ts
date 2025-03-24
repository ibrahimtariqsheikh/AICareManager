import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Schedule } from "../api"

// Create a traditional Redux slice for additional schedule state
interface ScheduleState {
  currentSchedule: Schedule | null
  selectedDate: string | null
  selectedView: "day" | "week" | "month"
  loading: boolean
  error: string | null
}

const initialState: ScheduleState = {
  currentSchedule: null,
  selectedDate: new Date().toISOString(),
  selectedView: "week",
  loading: false,
  error: null,
}

// Create async thunks if needed for complex operations
export const fetchScheduleDetails = createAsyncThunk(
  "schedule/fetchDetails",
  async (scheduleId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schedules/${scheduleId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch schedule details")
      }
      return await response.json()
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Create the slice
const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setCurrentSchedule: (state, action: PayloadAction<Schedule | null>) => {
      state.currentSchedule = action.payload
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setSelectedView: (state, action: PayloadAction<"day" | "week" | "month">) => {
      state.selectedView = action.payload
    },
    clearScheduleError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduleDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchScheduleDetails.fulfilled, (state, action) => {
        state.loading = false
        state.currentSchedule = action.payload
      })
      .addCase(fetchScheduleDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentSchedule, setSelectedDate, setSelectedView, clearScheduleError } = scheduleSlice.actions
export default scheduleSlice.reducer


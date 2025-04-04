import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface CalendarState {
    currentDate: string // Store as ISO string
    activeView: "day" | "week" | "month"
}

const initialState: CalendarState = {
    currentDate: new Date().toISOString(),
    activeView: "week",
}

export const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setCurrentDate: (state, action: PayloadAction<string>) => {
            // Validate the date string
            const date = new Date(action.payload)
            if (!isNaN(date.getTime())) {
                state.currentDate = action.payload
            } else {
                // If invalid date, set to current date
                state.currentDate = new Date().toISOString()
            }
        },
        setActiveView: (state, action: PayloadAction<"day" | "week" | "month">) => {
            state.activeView = action.payload
        },
    },
})

export const { setCurrentDate, setActiveView } = calendarSlice.actions

export default calendarSlice.reducer 
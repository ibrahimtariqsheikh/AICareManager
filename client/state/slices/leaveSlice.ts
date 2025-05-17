import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface LeaveEvent {
    id: string
    title: string
    start: Date | string
    end: Date | string
    date: Date | string
    leaveType: "ANNUAL_LEAVE" | "SICK_LEAVE" | "PUBLIC_HOLIDAY" | "UNPAID_LEAVE" | "MATERNITY_LEAVE" | "PATERNITY_LEAVE" | "BEREAVEMENT_LEAVE" | "EMERGENCY_LEAVE" | "MEDICAL_APPOINTMENT" | "TOIL" | "OTHER"
    notes: string
    payRate: number | undefined
    color: string
}

interface LeaveState {
    events: LeaveEvent[]
    loading: boolean
    error: string | null
}

const initialState: LeaveState = {
    events: [],
    loading: false,
    error: null,
}

const leaveSlice = createSlice({
    name: "leave",
    initialState,
    reducers: {
        addLeaveEvent: (state, action: PayloadAction<LeaveEvent>) => {
            state.events.push(action.payload)
        },
        updateLeaveEvent: (state, action: PayloadAction<LeaveEvent>) => {
            const index = state.events.findIndex((event) => event.id === action.payload.id)
            if (index !== -1) {
                state.events[index] = action.payload
            }
        },
        deleteLeaveEvent: (state, action: PayloadAction<string>) => {
            state.events = state.events.filter((event) => event.id !== action.payload)
        },
        setLeaveEvents: (state, action: PayloadAction<LeaveEvent[]>) => {
            state.events = action.payload
        },
        clearLeaveError: (state) => {
            state.error = null
        },
    },
})

export const { addLeaveEvent, updateLeaveEvent, deleteLeaveEvent, setLeaveEvents, clearLeaveError } = leaveSlice.actions

export default leaveSlice.reducer 
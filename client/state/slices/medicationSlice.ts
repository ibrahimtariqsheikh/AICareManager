import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  instructions?: string
  times: {
    morning?: boolean
    afternoon?: boolean
    evening?: boolean
    bedtime?: boolean
    asNeeded?: boolean
  }
}

export interface MedicationLog {
  id: string
  medicationId: string
  date: string
  status: "taken" | "not-taken" | "not-reported" | "not-scheduled"
  time: "morning" | "afternoon" | "evening" | "bedtime" | "asNeeded"
  administeredBy?: string
  notes?: string
}

interface MedicationState {
  medications: Medication[]
  medicationLogs: MedicationLog[]
  selectedMonth: string
  selectedYear: string
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  isAddMedicationModalOpen: boolean
  isCheckInModalOpen: boolean
  selectedMedicationId: string | null
  selectedTimeOfDay: string | null
  selectedDay: number | null
}

const initialState: MedicationState = {
  medications: [],
  medicationLogs: [],
  selectedMonth: new Date().getMonth().toString(),
  selectedYear: new Date().getFullYear().toString(),
  status: "idle",
  error: null,
  isAddMedicationModalOpen: false,
  isCheckInModalOpen: false,
  selectedMedicationId: null,
  selectedTimeOfDay: null,
  selectedDay: null,
}

export const fetchMedications = createAsyncThunk("medications/fetchMedications", async (userId: string) => {
  // In a real app, this would be an API call
  // For now, we'll return mock data
  return [
    {
      id: "1",
      name: "Hydrocortisone",
      dosage: "5mg",
      frequency: "Daily",
      instructions: "Take with food",
      times: {
        morning: true,
        afternoon: false,
        evening: false,
        bedtime: false,
        asNeeded: false,
      },
    },
    {
      id: "2",
      name: "Test",
      dosage: "1000mg",
      frequency: "Every day",
      instructions: "Take as directed",
      times: {
        morning: true,
        afternoon: true,
        evening: true,
        bedtime: true,
        asNeeded: false,
      },
    },
  ] as Medication[]
})

export const fetchMedicationLogs = createAsyncThunk(
  "medications/fetchMedicationLogs",
  async ({ userId, month, year }: { userId: string; month: string; year: string }) => {
    // In a real app, this would be an API call
    // For now, we'll generate mock data
    const logs: MedicationLog[] = []
    const daysInMonth = new Date(Number.parseInt(year), Number.parseInt(month) + 1, 0).getDate()

    // Generate logs for the first medication (Hydrocortisone)
    for (let day = 1; day <= daysInMonth; day++) {
      if (day === 7) {
        logs.push({
          id: `log-1-${day}`,
          medicationId: "1",
          date: `${year}-${Number.parseInt(month) + 1}-${day}`,
          status: "not-taken",
          time: "morning",
        })
      } else if (day === 12 || day === 13) {
        logs.push({
          id: `log-1-${day}`,
          medicationId: "1",
          date: `${year}-${Number.parseInt(month) + 1}-${day}`,
          status: "not-reported",
          time: "morning",
        })
      } else if (day === 15 || day === 16 || day === 17) {
        logs.push({
          id: `log-1-${day}`,
          medicationId: "1",
          date: `${year}-${Number.parseInt(month) + 1}-${day}`,
          status: "not-scheduled",
          time: "morning",
        })
      } else if (day <= 28) {
        logs.push({
          id: `log-1-${day}`,
          medicationId: "1",
          date: `${year}-${Number.parseInt(month) + 1}-${day}`,
          status: "taken",
          time: "morning",
        })
      }
    }

    return logs
  },
)

export const updateMedicationLog = createAsyncThunk(
  "medications/updateMedicationLog",
  async ({
    medicationId,
    day,
    month,
    year,
    timeOfDay,
    status,
    notes,
  }: {
    medicationId: string
    day: number
    month: string
    year: string
    timeOfDay: string
    status: "taken" | "not-taken" | "not-reported"
    notes?: string
  }) => {
    // Format the day to ensure it has two digits
    const formattedDay = day < 10 ? `0${day}` : day.toString()
    const dateString = `${year}-${Number.parseInt(month) + 1}-${formattedDay}`

    // In a real app, this would be an API call
    // For now, we'll just return the updated log
    const log: MedicationLog = {
      id: `log-${medicationId}-${day}-${timeOfDay}`,
      medicationId,
      date: dateString,
      status,
      time: timeOfDay as any,
      notes: notes || "",
      administeredBy: "Current User", // In a real app, this would be the current user
    }

    return log
  },
)

export const addMedication = createAsyncThunk(
  "medications/addMedication",
  async (medication: Omit<Medication, "id">) => {
    // In a real app, this would be an API call
    // For now, we'll just return the new medication with an ID
    const newMedication: Medication = {
      ...medication,
      id: uuidv4(), // Generate a unique ID
    }

    return newMedication
  },
)

export const deleteMedication = createAsyncThunk("medications/deleteMedication", async (medicationId: string) => {
  // In a real app, this would be an API call
  // For now, we'll just return the ID
  return medicationId
})

const medicationSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload
    },
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload
    },
    openAddMedicationModal: (state) => {
      state.isAddMedicationModalOpen = true
    },
    closeAddMedicationModal: (state) => {
      state.isAddMedicationModalOpen = false
    },
    openCheckInModal: (state, action: PayloadAction<{ medicationId: string; timeOfDay: string; day: number }>) => {
      state.isCheckInModalOpen = true
      state.selectedMedicationId = action.payload.medicationId
      state.selectedTimeOfDay = action.payload.timeOfDay
      state.selectedDay = action.payload.day
    },
    closeCheckInModal: (state) => {
      state.isCheckInModalOpen = false
      state.selectedMedicationId = null
      state.selectedTimeOfDay = null
      state.selectedDay = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedications.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.medications = action.payload
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch medications"
      })
      .addCase(fetchMedicationLogs.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMedicationLogs.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.medicationLogs = action.payload
      })
      .addCase(fetchMedicationLogs.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch medication logs"
      })
      .addCase(updateMedicationLog.fulfilled, (state, action) => {
        const index = state.medicationLogs.findIndex((log) => log.id === action.payload.id)
        if (index !== -1) {
          state.medicationLogs[index] = action.payload
        } else {
          state.medicationLogs.push(action.payload)
        }
      })
      .addCase(addMedication.fulfilled, (state, action) => {
        state.medications.push(action.payload)
        state.isAddMedicationModalOpen = false
      })
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.medications = state.medications.filter((medication) => medication.id !== action.payload)
        // Also remove any logs for this medication
        state.medicationLogs = state.medicationLogs.filter((log) => log.medicationId !== action.payload)
      })
  },
})

export const {
  setSelectedMonth,
  setSelectedYear,
  openAddMedicationModal,
  closeAddMedicationModal,
  openCheckInModal,
  closeCheckInModal,
} = medicationSlice.actions
export default medicationSlice.reducer

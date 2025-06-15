import { Medication, MedicationLog } from "@/types/prismaTypes"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

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
  currentStatus: string | null
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
  currentStatus: null,
}

const medicationSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {
    setMedications: (state, action: PayloadAction<Medication[]>) => {
      state.medications = action.payload
    },
    setMedicationLogs: (state, action: PayloadAction<MedicationLog[]>) => {
      state.medicationLogs = action.payload
    },
    addMedication: (state, action: PayloadAction<Medication>) => {
      state.medications.push(action.payload)
    },
    addMedicationLog: (state, action: PayloadAction<{ medicationId: string; userId: string; data: Omit<MedicationLog, 'id' | 'medicationId' | 'userId'> }>) => {
      const newLog: MedicationLog = {
        id: Date.now().toString(), // Temporary ID until server response
        medicationId: action.payload.medicationId,
        userId: action.payload.userId,
        ...action.payload.data
      }
      state.medicationLogs.push(newLog)
    },
    updateMedicationLog: (state, action: PayloadAction<{ id: string; data: Partial<MedicationLog> }>) => {
      const index = state.medicationLogs.findIndex((log: MedicationLog) => log.id === action.payload.id)
      if (index !== -1) {
        state.medicationLogs[index] = { ...state.medicationLogs[index], ...action.payload.data }
      }
    },
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
    openCheckInModal: (state, action: PayloadAction<{ medicationId: string; timeOfDay: string; day: number; currentStatus: string }>) => {
      state.isCheckInModalOpen = true
      state.selectedMedicationId = action.payload.medicationId
      state.selectedTimeOfDay = action.payload.timeOfDay
      state.selectedDay = action.payload.day
      state.currentStatus = action.payload.currentStatus
    },
    closeCheckInModal: (state) => {
      state.isCheckInModalOpen = false
      state.selectedMedicationId = null
      state.selectedTimeOfDay = null
      state.selectedDay = null
      state.currentStatus = null
    },
    setStatus: (state, action: PayloadAction<MedicationState['status']>) => {
      state.status = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    deleteMedicationRedux: (state, action: PayloadAction<string>) => {
      state.medications = state.medications.filter((medication: Medication) => medication.id !== action.payload)
    }
  },
})

export const {
  setSelectedMonth,
  setSelectedYear,
  openAddMedicationModal,
  closeAddMedicationModal,
  openCheckInModal,
  closeCheckInModal,
  setMedications,
  setMedicationLogs,
  addMedication,
  addMedicationLog,
  updateMedicationLog,
  setStatus,
  setError,
  deleteMedicationRedux,
} = medicationSlice.actions

export default medicationSlice.reducer

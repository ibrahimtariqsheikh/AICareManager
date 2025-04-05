import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Medication {
  id: string
  name: string
  dosage: string
  instructions: string
  reason: string
  route: string
  frequency: string
  times: string[]
  days: string[]
  schedule: string
  notes?: string
}

export interface MedicationAdministration {
  id: string
  medicationId: string
  status: "given" | "not_given" | "refused" | "pending"
  administeredBy: string
  administeredTime: string
  notes: string
  scheduledTime: string
}

export interface MedicationCalendarEntry {
  id: string
  medicationId: string
  times: string[]
  status: Record<string, string>
}

export interface MedicationState {
  medications: Medication[]
  administrations: MedicationAdministration[]
  calendarEntries: MedicationCalendarEntry[]
  currentView: "scheduled" | "prn"
  selectedMedication: Medication | null
  isMedicationDialogOpen: boolean
  isAdministrationDialogOpen: boolean
}

const initialState: MedicationState = {
  medications: [
    {
      id: "1",
      name: "Hydrocortisone",
      dosage: "5mg",
      instructions: "Take 1 Tab by Mouth Twice Daily",
      reason: "A chemical found in tobacco for...",
      route: "oral",
      frequency: "twice_daily",
      times: ["08:00", "13:00"],
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      schedule: "8:00am, 1:00pm",
      notes: ""
    },
    {
      id: "2",
      name: "Lisinopril",
      dosage: "10mg",
      instructions: "Take 1 Tab by Mouth Once Daily",
      reason: "Hypertension",
      route: "oral",
      frequency: "daily",
      times: ["08:00"],
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      schedule: "8:00am",
      notes: ""
    },
    {
      id: "3",
      name: "Metformin",
      dosage: "500mg",
      instructions: "Take 1 Tab by Mouth Twice Daily",
      reason: "Diabetes Type 2",
      route: "oral",
      frequency: "twice_daily",
      times: ["08:00", "19:00"],
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      schedule: "8:00am, 7:00pm",
      notes: ""
    },
    {
      id: "4",
      name: "Aspirin",
      dosage: "81mg",
      instructions: "Take 1 Tab by Mouth Once Daily",
      reason: "Blood Thinner",
      route: "oral",
      frequency: "daily",
      times: ["08:00"],
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      schedule: "8:00am",
      notes: ""
    }
  ],
  administrations: [
    {
      id: "a1",
      medicationId: "1",
      status: "pending",
      administeredBy: "",
      administeredTime: "",
      notes: "",
      scheduledTime: new Date().setHours(8, 0, 0).toString()
    },
    {
      id: "a2",
      medicationId: "2",
      status: "pending",
      administeredBy: "",
      administeredTime: "",
      notes: "",
      scheduledTime: new Date().setHours(8, 0, 0).toString()
    }
  ],
  calendarEntries: [
    {
      id: "c1",
      medicationId: "1",
      times: ["08:00", "13:00", "19:00"],
      status: generateRandomStatus(31)
    },
    {
      id: "c2",
      medicationId: "2",
      times: ["08:00"],
      status: generateRandomStatus(31)
    },
    {
      id: "c3",
      medicationId: "3",
      times: ["08:00", "19:00"],
      status: generateRandomStatus(31)
    }
  ],
  currentView: "scheduled",
  selectedMedication: null,
  isMedicationDialogOpen: false,
  isAdministrationDialogOpen: false
}

// Helper function to generate random status for calendar
function generateRandomStatus(days: number) {
  const statuses = ["taken", "not_taken", "not_reported", "not_scheduled"]
  const result: Record<string, string> = {}

  for (let i = 1; i <= days; i++) {
    // More likely to be "taken" than other statuses
    const randomIndex = Math.floor(Math.random() * 10)
    if (randomIndex < 7) {
      result[i] = "taken"
    } else if (randomIndex < 8) {
      result[i] = "not_taken"
    } else if (randomIndex < 9) {
      result[i] = "not_reported"
    } else {
      result[i] = "not_scheduled"
    }
  }

  return result
}

export const medicationSlice = createSlice({
  name: "medication",
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<"scheduled" | "prn">) => {
      state.currentView = action.payload
    },
    setSelectedMedication: (state, action: PayloadAction<Medication | null>) => {
      state.selectedMedication = action.payload
    },
    setMedicationDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isMedicationDialogOpen = action.payload
    },
    setAdministrationDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isAdministrationDialogOpen = action.payload
    },
    addMedication: (state, action: PayloadAction<Omit<Medication, "id">>) => {
      const newId = `med-${Date.now()}`
      state.medications.push({
        id: newId,
        ...action.payload
      })
    },
    updateMedication: (state, action: PayloadAction<Medication>) => {
      const index = state.medications.findIndex(med => med.id === action.payload.id)
      if (index !== -1) {
        state.medications[index] = action.payload
      }
    },
    deleteMedication: (state, action: PayloadAction<string>) => {
      state.medications = state.medications.filter(med => med.id !== action.payload)
    },
    recordAdministration: (state, action: PayloadAction<Omit<MedicationAdministration, "id">>) => {
      const newId = `adm-${Date.now()}`
      state.administrations.push({
        id: newId,
        ...action.payload
      })
      
      // Update calendar entry if it exists
      const medicationId = action.payload.medicationId
      const date = new Date(action.payload.administeredTime).getDate()
      
      const calendarEntry = state.calendarEntries.find(entry => entry.medicationId === medicationId)
      if (calendarEntry) {
        calendarEntry.status[date] = action.payload.status === "given" ? "taken" : 
                                     action.payload.status === "not_given" ? "not_taken" : 
                                     action.payload.status === "refused" ? "not_taken" : "not_reported"
      }
    }
  },
})

export const { 
  setCurrentView, 
  setSelectedMedication, 
  setMedicationDialogOpen, 
  setAdministrationDialogOpen,
  addMedication,
  updateMedication,
  deleteMedication,
  recordAdministration
} = medicationSlice.actions

export default medicationSlice.reducer

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface PatientState {
  id: string
  name: string
  age: number
  room: string
  admissionDate: string
  careLevel: "Low" | "Medium" | "High"
  status: string
  personalInfo: {
    dateOfBirth: string
    gender: string
    phone: string
    email: string
  }
  medicalInfo: {
    primaryDiagnosis: string[]
    allergies: string[]
    primaryPhysician: string
    bloodType: string
  }
}

const initialState: PatientState = {
  id: "p1",
  name: "Ibrahim Sheikh",
  age: 24,
  room: "A1",
  admissionDate: "Jan 1, 2022",
  careLevel: "Low",
  status: "Checked in",
  personalInfo: {
    dateOfBirth: "March 1, 2001",
    gender: "Male",
    phone: "+1-231-2342",
    email: "issafilms420@gmail.com"
  },
  medicalInfo: {
    primaryDiagnosis: ["Hypertension", "Diabetes Type 2"],
    allergies: ["Penicillin", "Shellfish"],
    primaryPhysician: "Dr. Sarah Johnson",
    bloodType: "O+"
  }
}

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    updatePatient: (state, action: PayloadAction<Partial<PatientState>>) => {
      return { ...state, ...action.payload }
    },
    updateCareLevel: (state, action: PayloadAction<"Low" | "Medium" | "High">) => {
      state.careLevel = action.payload
    },
    updateStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<PatientState["personalInfo"]>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload }
    },
    updateMedicalInfo: (state, action: PayloadAction<Partial<PatientState["medicalInfo"]>>) => {
      state.medicalInfo = { ...state.medicalInfo, ...action.payload }
    }
  },
})

export const { updatePatient, updateCareLevel, updateStatus, updatePersonalInfo, updateMedicalInfo } = patientSlice.actions
export default patientSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MedicationRecord, MedicationAdministration } from '../api';

interface MedicationState {
  selectedMedication: MedicationRecord | null;
  administrationHistory: MedicationAdministration[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MedicationState = {
  selectedMedication: null,
  administrationHistory: [],
  isLoading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    setSelectedMedication: (state, action: PayloadAction<MedicationRecord | null>) => {
      state.selectedMedication = action.payload;
    },
    setAdministrationHistory: (state, action: PayloadAction<MedicationAdministration[]>) => {
      state.administrationHistory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearMedicationState: (state) => {
      state.selectedMedication = null;
      state.administrationHistory = [];
      state.error = null;
    },
  },
});

export const {
  setSelectedMedication,
  setAdministrationHistory,
  setLoading,
  setError,
  clearMedicationState,
} = medicationSlice.actions;

export default medicationSlice.reducer; 
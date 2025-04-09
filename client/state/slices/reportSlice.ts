import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Report, ReportTask } from '../api';

interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  isLoading: boolean;
  error: string | null;
}

const dummyReport: Report = {
  id: "1",
  clientId: "1",
  userId: "1",
  condition: "Good",
  summary: "Regular checkup completed successfully",
  checkInTime: "2024-04-09T10:00:00.000Z",
  checkOutTime: "2024-04-09T11:30:00.000Z",
  checkInDistance: 0,
  checkOutDistance: 0,
  tasksCompleted: [
    {
      id: "1",
      reportId: "1",
      taskName: "Medication",
      completed: true
    },
    {
      id: "2",
      reportId: "1",
      taskName: "Personal Care",
      completed: true
    }
  ],
  client: {
    id: "1",
    firstName: "John",
    lastName: "Doe"
  },
  caregiver: {
    id: "1",
    firstName: "Sarah",
    lastName: "Smith"
  },
  hasSignature: true
};

const initialState: ReportState = {
  reports: [dummyReport],
  selectedReport: null,
  isLoading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateReport: (state, action: PayloadAction<Report>) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    addReport: (state, action: PayloadAction<Report>) => {
      state.reports.push(action.payload);
    },
    deleteReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(report => report.id !== action.payload);
    },
  },
});

export const {
  setReports,
  setSelectedReport,
  setLoading,
  setError,
  updateReport,
  addReport,
  deleteReport,
} = reportSlice.actions;

export default reportSlice.reducer; 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Report, ReportTask } from '../api';

interface ReportState {
  selectedReport: Report | null;
  clientReports: Report[];
  caregiverReports: Report[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  selectedReport: null,
  clientReports: [],
  caregiverReports: [],
  isLoading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    setClientReports: (state, action: PayloadAction<Report[]>) => {
      state.clientReports = action.payload;
    },
    setCaregiverReports: (state, action: PayloadAction<Report[]>) => {
      state.caregiverReports = action.payload;
    },
    updateTaskStatus: (state, action: PayloadAction<{ reportId: string; taskId: string; completed: boolean }>) => {
      const { reportId, taskId, completed } = action.payload;
      if (state.selectedReport?.id === reportId) {
        const task = state.selectedReport.tasksCompleted.find(t => t.id === taskId);
        if (task) {
          task.completed = completed;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearReportState: (state) => {
      state.selectedReport = null;
      state.clientReports = [];
      state.caregiverReports = [];
      state.error = null;
    },
  },
});

export const {
  setSelectedReport,
  setClientReports,
  setCaregiverReports,
  updateTaskStatus,
  setLoading,
  setError,
  clearReportState,
} = reportSlice.actions;

export default reportSlice.reducer; 
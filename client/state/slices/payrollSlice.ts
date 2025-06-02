import { Payroll } from "@/types/billing";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";

interface PayrollState {
  payrolls: Payroll[] | null;
  selectedDateRange: DateRange | null;
  selectedPayroll: Payroll | null;
}

const initialState: PayrollState = {
  payrolls: null,
  selectedDateRange: null,
  selectedPayroll: null,
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    setPayrolls: (state, action: PayloadAction<Payroll[]>) => {
      state.payrolls = action.payload;
    },
    addPayroll: (state, action: PayloadAction<Payroll>) => {
      ('Adding payroll to Redux:', action.payload)
      if (state.payrolls === null) {
        state.payrolls = [action.payload];
      } else {
        state.payrolls.push(action.payload);
      }
    },
    updatePayroll: (state, action: PayloadAction<Payroll>) => {
      if (state.payrolls) {
        const index = state.payrolls.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.payrolls[index] = action.payload;
        }
      }
    },
    deletePayroll: (state, action: PayloadAction<string>) => {
      if (state.payrolls) {
        state.payrolls = state.payrolls.filter(p => p.id !== action.payload);
      }
    },
    setSelectedDateRange: (state, action: PayloadAction<DateRange>) => {
      state.selectedDateRange = action.payload;
    },
    setSelectedPayroll: (state, action: PayloadAction<Payroll>) => {
      state.selectedPayroll = action.payload;
    },
  }
});

export const {
  setPayrolls,
  addPayroll,
  updatePayroll,
  deletePayroll,
  setSelectedDateRange,
  setSelectedPayroll,
} = payrollSlice.actions;

export default payrollSlice.reducer; 
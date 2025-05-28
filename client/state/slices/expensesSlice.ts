import { Expense } from "@/types/billing";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";

interface ExpenseState {
  expenses: Expense[] | null;
  selectedDateRange: DateRange | null;
  selectedExpense: Expense | null;
}

const initialState: ExpenseState = {
  expenses: null,
  selectedDateRange: null,
  selectedExpense: null,
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      console.log('Setting expenses in Redux:', action.payload)
      state.expenses = action.payload;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      console.log('Adding expense to Redux:', action.payload)
      if (state.expenses === null) {
        state.expenses = [action.payload];
      } else {
        // Check if expense already exists
        const exists = state.expenses.some(e => e.id === action.payload.id)
        if (!exists) {
          state.expenses.push(action.payload);
        } else {
          // Update existing expense
          state.expenses = state.expenses.map(e => 
            e.id === action.payload.id ? action.payload : e
          )
        }
      }
      console.log('Updated expenses state:', state.expenses)
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      console.log('Updating expense in Redux:', action.payload)
      if (state.expenses) {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      console.log('Deleting expense from Redux:', action.payload)
      if (state.expenses) {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
      }
    },
    setSelectedDateRange: (state, action: PayloadAction<DateRange>) => {
      state.selectedDateRange = action.payload;
    },
    setSelectedExpense: (state, action: PayloadAction<Expense>) => {
      state.selectedExpense = action.payload;
    },
  }
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setSelectedDateRange,
  setSelectedExpense,
} = expensesSlice.actions;

export default expensesSlice.reducer; 
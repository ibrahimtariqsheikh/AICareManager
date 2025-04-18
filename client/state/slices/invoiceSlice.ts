import { createSlice } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";
import { User } from "@/types/prismaTypes";
import { Invoice } from "@/types/prismaTypes";

interface InvoiceState {
selectedClient: User | null;
selectedDateRange: DateRange | null;
  invoices: Invoice[] | null;
}


const initialState: InvoiceState = {
selectedClient: null,
selectedDateRange: null,
invoices: null,
};


const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        setInvoices: (state, action) => {
            state.invoices = action.payload;
        },
        setSelectedClient: (state, action) => {
            state.selectedClient = action.payload;
        },
        setSelectedDateRange: (state, action) => {
            state.selectedDateRange = action.payload;
        },
    }
});

export const { 
    setSelectedClient,
    setSelectedDateRange,
    setInvoices,
} = invoiceSlice.actions;


export default invoiceSlice.reducer;

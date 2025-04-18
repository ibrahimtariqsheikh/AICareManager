import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";
import { User } from "@/types/prismaTypes";
import { Invoice } from "@/types/prismaTypes";

interface InvoiceData {
invoiceNumber: string;
issueDate: Date;
dueDate: Date;
notes: string;
taxRate: number;
taxEnabled: boolean;
}



interface InvoiceState {
selectedClient: User | null;
selectedCareWorker: User | null;
selectedDateRange: DateRange | null;
  invoices: Invoice[] | null;
  invoiceData: InvoiceData | null;
}


const initialState: InvoiceState = {
selectedClient: null,
selectedCareWorker: null,
selectedDateRange: null,
invoices: null,
invoiceData: {
    invoiceNumber: "",
    issueDate: new Date(),
    dueDate: new Date(),
    notes: "",
    taxRate: 0,
    taxEnabled: false,
},
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
        setSelectedCareWorker: (state, action) => {
            state.selectedCareWorker = action.payload;
        },
        setInvoiceData: (state, action) => {
            state.invoiceData = action.payload;
        },
        setInvoiceNumber: (state, action: PayloadAction<string>) => {
            if (state.invoiceData) {
                state.invoiceData.invoiceNumber = action.payload;
            }
        },
    }
});

export const {
    setSelectedClient,
    setSelectedDateRange,
    setInvoices,
    setSelectedCareWorker,
    setInvoiceData,
    setInvoiceNumber,
} = invoiceSlice.actions;


export default invoiceSlice.reducer;

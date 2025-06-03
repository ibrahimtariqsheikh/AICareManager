import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";
import { User } from "@/types/prismaTypes";
import { Invoice } from "@/types/prismaTypes";
import { InvoiceItem } from "@/app/dashboard/billing/invoice-builder/types";

interface InvoiceData {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    notes: string;
    taxRate: number;
    taxEnabled: boolean;
    paymentMethod: string;
    predefinedItems?: InvoiceItem[];
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
    issueDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    notes: "",
    taxRate: 0,
    taxEnabled: false,
    paymentMethod: "",
    predefinedItems: [],
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
            console.log("Setting invoice data in Redux:", {
                ...action.payload,
                predefinedItems: action.payload.predefinedItems?.map(item => ({
                    type: item.serviceType,
                    description: item.description,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount
                }))
            })
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

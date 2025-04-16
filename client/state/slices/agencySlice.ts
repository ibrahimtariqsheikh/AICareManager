import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import { Agency, CustomTask, Group, RateSheet, RateSheetType, User } from "../../types/agencyTypes";


interface AgencyState {
    agency: Agency | null;
    agencyId: string;
    clients: User[];
    officeStaff: User[];
    careWorkers: User[];
    loading: boolean;
    error: string | null;
    customTasks: CustomTask[];
    groups: Group[];
    rateSheets: RateSheet[];
    activeRateSheetStaffType: RateSheetType;
}

// Initial state
const initialState: AgencyState = {
    agency: null,
    agencyId: "",
    clients: [],
    officeStaff: [],
    careWorkers: [],
    loading: false,
    error: null,
    customTasks: [],
    groups: [],
    rateSheets: [],
    activeRateSheetStaffType: "CLIENT",
};

// Agency Slice
const agencySlice = createSlice({
    name: "agency",
    initialState,
    reducers: {
        setAgency: (state, action: PayloadAction<Agency>) => {
            state.agency = action.payload;
        },
        setAgencyId: (state, action: PayloadAction<string>) => {
            state.agencyId = action.payload;
        },
        setClients: (state, action: PayloadAction<User[]>) => {
            state.clients = action.payload;
        },
        setOfficeStaff: (state, action: PayloadAction<User[]>) => {
            state.officeStaff = action.payload;
        },
        setCareWorkers: (state, action: PayloadAction<User[]>) => {
            state.careWorkers = action.payload;
        },
        setActiveRateSheetStaffType: (state, action: PayloadAction<RateSheetType>) => {
            state.activeRateSheetStaffType = action.payload;
        },
        clearAgencyUsers: (state) => {
            state.clients = [];
            state.officeStaff = [];
            state.careWorkers = [];
        },
        setCustomTasks: (state, action: PayloadAction<CustomTask[]>) => {
            state.customTasks = action.payload;
        },
        setGroups: (state, action: PayloadAction<Group[]>) => {
            state.groups = action.payload;
        },
        setRateSheets: (state, action: PayloadAction<RateSheet[]>) => {
            state.rateSheets = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

// Export actions
export const { 
    setAgency, 
    setAgencyId, 
    setClients, 
    setOfficeStaff, 
    setCareWorkers, 
    clearAgencyUsers,
    setCustomTasks,
    setGroups,
    setRateSheets,
    setLoading,
    setError,
    setActiveRateSheetStaffType
} = agencySlice.actions;

// Export reducer
export default agencySlice.reducer;

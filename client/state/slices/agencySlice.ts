import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import { Agency, User } from "../../types/prismaTypes";
import { UsersResponse } from "../api";

interface AgencyState {
    agency: Agency | null;
    agencyId: string;
    clients: User[];
    officeStaff: User[];
    careWorkers: User[];
    loading: boolean;
    error: string | null;
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
};

// Async thunks
const fetchAgencyUsers = createAsyncThunk(
    'agency/fetchAgencyUsers',
    async (agencyId: string, { rejectWithValue }) => {
        try {
            const response = await api.endpoints.getAgencyUsers.initiate(agencyId);
            if ('data' in response) {
                return response.data as UsersResponse;
            }
            throw new Error('Failed to fetch agency users');
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

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
        clearAgencyUsers: (state) => {
            state.clients = [];
            state.officeStaff = [];
            state.careWorkers = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgencyUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAgencyUsers.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data) {
                    state.clients = action.payload.data.filter((user: User) => user.role === "CLIENT");
                    state.officeStaff = action.payload.data.filter((user: User) => user.role === "OFFICE_STAFF");
                    state.careWorkers = action.payload.data.filter((user: User) => user.role === "CARE_WORKER");
                }
            })
            .addCase(fetchAgencyUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setAgency, setAgencyId, setClients, setOfficeStaff, setCareWorkers, clearAgencyUsers } = agencySlice.actions;
export { fetchAgencyUsers };
export default agencySlice.reducer;

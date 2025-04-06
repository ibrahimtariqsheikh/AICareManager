import { CareOutcome, RiskAssessment } from "@/types/prismaTypes";
import { IncidentReport } from "@/types/prismaTypes";
import { KeyContact } from "@/types/prismaTypes";
import { createSlice } from "@reduxjs/toolkit";

interface ManagementState {
    selectedUser: User | null;
    selectedUserDetails: User | null;
    selectedUserDocuments: Document[] | null;
    selectedUserIncidentReports: IncidentReport[] | null;
    selectedUserKeyContacts: KeyContact[] | null;
    selectedUserCareOutcomes: CareOutcome[] | null;
    selectedUserRiskAssessments: RiskAssessment[] | null;
}

const managementSlice = createSlice({
    name: "management",
    initialState: {
        selectedUser: null,
        selectedUserDetails: null,
        selectedUserDocuments: [],
        selectedUserIncidentReports: [],
        selectedUserKeyContacts: [],
        selectedUserCareOutcomes: [],
        selectedUserRiskAssessments: [],
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setSelectedUserDetails: (state, action) => {
            state.selectedUserDetails = action.payload;
        },
        setSelectedUserDocuments: (state, action) => {
            state.selectedUserDocuments = action.payload;
        },
        setSelectedUserIncidentReports: (state, action) => {
            state.selectedUserIncidentReports = action.payload;
        },
        setSelectedUserKeyContacts: (state, action) => {
            state.selectedUserKeyContacts = action.payload;
        },
        setSelectedUserCareOutcomes: (state, action) => {
            state.selectedUserCareOutcomes = action.payload;
        },
        setSelectedUserRiskAssessments: (state, action) => {
            state.selectedUserRiskAssessments = action.payload;
        },  
       

    },
});

export const { setSelectedUser } = managementSlice.actions;

export default managementSlice.reducer;

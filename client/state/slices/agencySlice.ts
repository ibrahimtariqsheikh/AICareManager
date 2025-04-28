import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  CustomTask, Group, RateSheet, RateSheetType, User } from "../../types/agencyTypes";
import { Agency, NotificationFrequency } from "@/types/prismaTypes";
import { PreferredNotificationMethod } from "@/types/prismaTypes";


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
        },
        toggleAllowCareWorkersEditCheckInRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.allowCareWorkersEditCheckIn = action.payload;
        },
        toggleAllowFamilyReviewsRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.allowFamilyReviews = action.payload;
        },
        toggleEnableFamilyScheduleRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.enableFamilySchedule = action.payload;
        },
        toggleEnableWeek1And2SchedulingRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.enableWeek1And2Scheduling = action.payload;
        },
        toggleLateVisitAlertsRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.lateVisitAlerts = action.payload;
        },
        toggleClientBirthdayRemindersRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.clientBirthdayReminders = action.payload;
        },
        toggleCareWorkerVisitAlertsRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.careWorkerVisitAlerts = action.payload;
        },
        toggleMissedMedicationAlertsRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.missedMedicationAlerts = action.payload;
        },
        toggleClientAndCareWorkerRemindersRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.clientAndCareWorkerReminders = action.payload;
        },
        toggleReviewNotificationsRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.reviewNotifications = action.payload;
        },
        toggleDistanceAlertsRedux: (state, action: PayloadAction<boolean>) => {
            state.agency!.distanceAlerts = action.payload;
        },
        setLateVisitThresholdRedux: (state, action: PayloadAction<string>) => {
            state.agency!.lateVisitThreshold = parseInt(action.payload);
        },
        setDistanceThresholdRedux: (state, action: PayloadAction<string>) => {
            state.agency!.distanceThreshold = parseInt(action.payload);
        },
        setNotificationFrequencyRedux: (state, action: PayloadAction<NotificationFrequency>) => {
            state.agency!.notificationFrequency = action.payload;
        },
        setPreferredNotificationMethodRedux: (state, action: PayloadAction<PreferredNotificationMethod>) => {
            state.agency!.preferredNotificationMethod = action.payload;
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
    toggleAllowCareWorkersEditCheckInRedux,
    toggleAllowFamilyReviewsRedux,
    toggleEnableFamilyScheduleRedux,
    toggleEnableWeek1And2SchedulingRedux,
    toggleLateVisitAlertsRedux,
    toggleClientBirthdayRemindersRedux,
    toggleCareWorkerVisitAlertsRedux,
    toggleMissedMedicationAlertsRedux,
    toggleClientAndCareWorkerRemindersRedux,
    toggleReviewNotificationsRedux,
    toggleDistanceAlertsRedux,
    setLateVisitThresholdRedux,
    setDistanceThresholdRedux,
    setNotificationFrequencyRedux,
    setPreferredNotificationMethodRedux,
    setActiveRateSheetStaffType,
} = agencySlice.actions;

// Export reducer
export default agencySlice.reducer;

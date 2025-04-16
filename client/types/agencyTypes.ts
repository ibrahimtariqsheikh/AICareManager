export type RateSheetType = "CLIENT" | "CARE_WORKER" | "OFFICE_STAFF";

export interface User {
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed
}

export interface Agency {
    id: string;
    name: string;
    email: string;
    description?: string;
    address?: string;
    extension?: number;
    mobileNumber?: number;
    landlineNumber?: number;
    website?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    isActive: boolean;
    isSuspended: boolean;
    hasScheduleV2: boolean;
    hasEMAR: boolean;
    hasFinance: boolean;
    isWeek1And2ScheduleEnabled: boolean;
    hasPoliciesAndProcedures: boolean;
    isTestAccount: boolean;
    createdAt: string;
    updatedAt: string;
    licenseNumber?: string;
    timeZone: string;
    currency: string;
    maxUsers?: number;
    maxClients?: number;
    maxCareWorkers?: number;
}

export interface CustomTask {
    id: string;
    name: string;
    // Add other custom task properties as needed
}

export interface Group {
    id: string;
    name: string;
    // Add other group properties as needed
}

export interface RateSheet {
    id: string;
    type: RateSheetType;
    // Add other rate sheet properties as needed
} 
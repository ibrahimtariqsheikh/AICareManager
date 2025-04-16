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
    // Add other agency properties as needed
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
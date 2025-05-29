import {BodyMapObservation, ReportStatus, ReportEdit, User, Alert } from "@/types/prismaTypes";

import { ReportTask } from "@/types/prismaTypes";

export interface DashboardStats {
    totalClients: number;
    totalCareWorkers: number;
    totalOfficeStaff: number;
    totalSchedules: number;
    totalReports: number;
    totalDocuments: number;
    totalMileageRecords: number;
    unreadNotifications: number;
}

export interface Schedule {
    id: string;
    clientName: string;
    careWorkerName: string;
    date: string;
    startTime: string;
    endTime: string;
    type: string;
    status: string;
    notes?: string;
    title?: string;
}


  export interface Report {
    id: string;
    clientId: string;
    agencyId: string;
    userId: string;
    condition: string;
    summary: string;
    checkInTime: Date;
    checkOutTime?: Date;
    createdAt: Date;
    checkInDistance?: number;
    checkOutDistance?: number;
    checkInLocation?: string;
    checkOutLocation?: string;
    hasSignature: boolean;
    signatureImageUrl?: string;
    status: ReportStatus;
    lastEditedAt?: Date;
    lastEditedBy?: string;
    lastEditReason?: string;
    tasksCompleted: ReportTask[];
    alerts: Alert[];
    bodyMapObservations: BodyMapObservation[];
    editHistory: ReportEdit[];
    client: User;
    caregiver: User;
    agency: Agency;
  }

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'SCHEDULE' | 'REPORT' | 'DOCUMENT' | 'SYSTEM' | 'ALERT';
    createdAt: string;
}

export interface Agency {
    id: string;
    name: string;
    isActive: boolean;
    isSuspended: boolean;
    hasScheduleV2: boolean;
    hasEMAR: boolean;
    hasFinance: boolean;
    isWeek1And2ScheduleEnabled: boolean;
    hasPoliciesAndProcedures: boolean;
    isTestAccount: boolean;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
    createdAt?: string;
    hasAdvancedReporting?: boolean;
}

export interface DashboardData {
    user: {
        fullName: string;
        role: string;
        agency: Agency;
    };
    agency: Agency;
    stats: DashboardStats;
    schedules: Schedule[];
    notifications: Notification[];
} 
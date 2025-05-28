export enum ExpenseCategory {
    TRAVEL = "TRAVEL",
    MEALS = "MEALS",
    LODGING = "LODGING",
    OFFICE_SUPPLIES = "OFFICE_SUPPLIES",
    TRAINING = "TRAINING",
    OTHER = "OTHER"
}

export enum ExpenseAssociatedEntity {
    CLIENT = "CLIENT",
    CAREWORKER = "CAREWORKER",
    OFFICE_STAFF = "OFFICE_STAFF",
    COMPANY = "COMPANY"
}

export interface Expense {
    id: string;
    type: string;
    associatedEntity: ExpenseAssociatedEntity;
    category: ExpenseCategory;
    description: string;
    amount: number;
    date: Date;
    agencyId: string;
    userId: string;
}

export interface Payroll {
    id: string;
    userId: string;
    agencyId: string;
    expensesFromDate: Date;
    expensesToDate: Date;
    scheduleFromDate: Date;
    scheduleToDate: Date;
    calculatedScheduleHours: number;
    calculatedExpenses: number;
    totalEarnings: number;
    totalDeductions: number;
    netPay: number;
    taxRate: number;
} 
export type StaffType = "client" | "careWorker" | "officeStaff"

export interface RateSheet {
    id: string
    name: string
    rate: number
    staffType: StaffType
    createdAt?: string
    updatedAt?: string
}

export interface RateSheetInput {
    name: string
    rate: number
    staffType: StaffType
} 
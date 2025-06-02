import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

type ReportStatus = "DRAFT" | "COMPLETED" | "EDITED" | "FLAGGED" | "REVIEWED"

interface Report {
    id: string
    title: string
    clientId: string
    client: {
        id: string
        fullName: string
        email: string
    }
    caregiver: {
        id: string
        fullName: string
        email: string
    }
    checkInTime: string
    checkOutTime: string | null
    status: ReportStatus
    condition: string
    summary: string
    hasSignature: boolean
    signatureImageUrl?: string
    tasksCompleted: {
        id: string
        taskName: string
        completed: boolean
        completedAt?: string
        notes?: string
    }[]
    alerts: any[]
    medicationAdministrations: any[]
    bodyMapObservations: any[]
}

interface ReportsState {
    reports: Report[]
    isLoading: boolean
    error: string | null
    filter: {
        search?: string
        status?: string
        dateRange?: string
        clientId?: string
        userId?: string
    }
    selectedReport: Report | null
    sidebarMode: "reports" | "alerts"
}

const initialState: ReportsState = {
    reports: [],
    isLoading: false,
    error: null,
    filter: {},
    sidebarMode: "reports",
    selectedReport: null,
}

// Mock data
const mockReports: Report[] = [
    {
        id: "1",
        title: "Morning Visit",
        clientId: "client1",
        client: {
            id: "client1",
            fullName: "John Doe",
            email: "john@example.com"
        },
        caregiver: {
            id: "caregiver1",
            fullName: "Jane Smith",
            email: "jane@example.com"
        },
        checkInTime: new Date().toISOString(),
        checkOutTime: new Date(Date.now() + 3600000).toISOString(),
        status: "COMPLETED" as const,
        condition: "Stable",
        summary: "Regular checkup completed",
        hasSignature: true,
        signatureImageUrl: "/placeholder.svg",
        tasksCompleted: [
            {
                id: "task1",
                taskName: "Medication",
                completed: true,
                completedAt: new Date().toISOString(),
                notes: "Administered morning medication"
            }
        ],
        alerts: [],
        medicationAdministrations: [],
        bodyMapObservations: []
    },
    {
        id: "2",
        title: "Evening Visit",
        clientId: "client2",
        client: {
            id: "client2",
            fullName: "Mary Johnson",
            email: "mary@example.com"
        },
        caregiver: {
            id: "caregiver2",
            fullName: "Bob Wilson",
            email: "bob@example.com"
        },
        checkInTime: new Date().toISOString(),
        checkOutTime: null,
        status: "DRAFT" as const,
        condition: "Stable",
        summary: "Evening checkup in progress",
        hasSignature: false,
        tasksCompleted: [
            {
                id: "task2",
                taskName: "Dinner",
                completed: true,
                completedAt: new Date().toISOString(),
                notes: "Prepared and served dinner"
            }
        ],
        alerts: [],
        medicationAdministrations: [],
        bodyMapObservations: []
    }
]


export const updateReportStatus = createAsyncThunk(
    "reports/updateReportStatus",
    async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Find and update the report
            const report = mockReports.find(r => r.id === id);
            if (!report) {
                throw new Error("Report not found");
            }

            return { ...report, status };
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    },
)

const reportsSlice = createSlice({
    name: "reports",
    initialState: {
        ...initialState,
        reports: mockReports
    },
    reducers: {
        setFilter: (state, action: PayloadAction<ReportsState["filter"]>) => {
            state.filter = action.payload
        },
        setSelectedReport: (state, action: PayloadAction<Report | null>) => {
            state.selectedReport = action.payload
        },
        setReports: (state, action: PayloadAction<Report[]>) => {
            state.reports = action.payload
        },
        setSidebarMode: (state, action: PayloadAction<"reports" | "alerts">) => {
            state.sidebarMode = action.payload
        },
        updateReport: (state, action: PayloadAction<Report>) => {
            const index = state.reports.findIndex((r) => r.id === action.payload.id)
            if (index !== -1) {
                state.reports[index] = action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(updateReportStatus.fulfilled, (state, action) => {
                const updatedReport = action.payload
                const index = state.reports.findIndex((r: Report) => r.id === updatedReport.id)
                if (index !== -1) {
                    state.reports[index] = updatedReport as Report
                }
                if (state.selectedReport && state.selectedReport.id === updatedReport.id) {
                    state.selectedReport = updatedReport as Report
                }
            })
    },
})

export const { setFilter, setSelectedReport, setReports, updateReport, setSidebarMode } = reportsSlice.actions
export default reportsSlice.reducer

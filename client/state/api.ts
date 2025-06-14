import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth"
import { createNewUserInDatabase } from "../lib/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Message } from "@/state/slices/chatSlice"

import { Invitation, Schedule, ReportTask, CommunicationLog, Profile, Agency, IncidentReport, KeyContact, CareOutcome, RiskAssessment, FamilyAccess, CustomTask, Group, RateSheet, VisitType, Task, ScheduleTemplate, Medication, MedicationLog, LeaveEvent, Invoice, Expenses, Payroll, InvoicePaymentMethod, MileageRecord } from "../types/prismaTypes"
import { DashboardData } from "@/app/dashboard/types"
import { EmergencyContact } from "@/types/profileTypes"
import { ShiftReview } from "@/app/dashboard/billing/components/shift-review"


export interface CreateUserInput {
  email: string
  fullName: string
  role: string
  subRole?: string
  cognitoId: string
  inviterId: string
  agencyId: string
}




export interface ScheduleInput {
  agencyId: string
  clientId: string
  userId: string
  date: Date
  startTime: string
  endTime: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED"
  type: "WEEKLY_CHECKUP" | "APPOINTMENT" | "HOME_VISIT" | "CHECKUP" | "EMERGENCY" | "ROUTINE" | "OTHER"
  notes?: string
}

export interface ScheduleUpdateInput extends Partial<ScheduleInput> {
  id: string
}

export interface CreateConversationResponse {
  id: string
  message: string
}

export interface ScheduleResponse {
    id: string
    agencyId: string
    clientId: string
    userId: string
    date: string
    startTime: string
    endTime: string
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED"
    type: "WEEKLY_CHECKUP" | "APPOINTMENT" | "HOME_VISIT" | "CHECKUP" | "EMERGENCY" | "ROUTINE" | "OTHER"
    notes?: string
    chargeRate?: number
    createdAt: string
    updatedAt: string
    visitTypeId?: string
    rateSheetId?: string
    title: string
    client: {
        id: string
        fullName: string
        [key: string]: any
    }
    user: {
        id: string
        fullName: string
        [key: string]: any
    }
    start?: Date
    end?: Date
    color: string
}

export interface SchedulesResponse {
  data: ScheduleResponse[]
  meta: {
    total: number
    limit: number
    offset: number
  }
}

export interface CreateInvitationInput {
  inviterUserId: string
  email: string
  role: string
  subRole?: string
  
  expirationDays: number
}

export interface CancelInvitationInput {
  invitationId: string
  userId: string
}

// // Accept invitation input type
export interface AcceptInvitationInput {
  invitationId: string
  userId: string
}



export interface UsersResponse {
  data: User[]
  meta: {
    total: number
  }
}



export interface UserQueryParams {
  role?: string
  agencyId?: string
}


export interface UserResponse {
    data: User & {
        color: string;
        profile?: {
            avatarUrl?: string;
            phone?: string;
        };
        agency?: {
            id: string;
            name: string;
            [key: string]: any;
        };
    };
    meta: {
        total: number;
    };
}

export interface UserAllDetailsResponse {
  data: User & {
    addressLine1?: string;
    addressLine2?: string;
    townOrCity?: string;
    county?: string;
    postalCode?: string;
    country?: string;
    phoneNumber?: string;
    languages?: string;
    interests?: string;
    likesDislikes?: string;
    allergies?: string;
    history?: string;
    profile?: Profile;
    agency?: Agency;
    medications?: Medication[];
    documents?: Document[];
    incidentReports?: IncidentReport[];
    keyContacts?: KeyContact[];
    careOutcomes?: CareOutcome[];
    riskAssessments?: RiskAssessment[];
    familyAccess?: FamilyAccess[];
    communicationLogs?: CommunicationLog[];
    nhsNumber?: string;
    dnraOrder?: boolean;
    chargeRate?: number;
    mobility?: string;
    preferredName?: string;
    propertyAccess?: string;
  };
}

export interface GroupInput {
  name: string
  clientIds: string[]
  agencyId?: string
}

export interface GroupResponse {
  id: string
  name: string
  clients: {
    id: string
    fullName: string
    status: string
  }[]
  agencyId?: string
  createdAt: string
  updatedAt: string
}

export interface GroupsResponse {
  data: GroupResponse[]
  meta: {
    total: number
  }
}

export interface Alert {
  id: string;
  type: string;
  description: string;
  reportId?: string;
  clientId?: string;
  careworkerId?: string;
  agencyId: string;
  resolvedById?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    fullName: string;
    [key: string]: any;
  };
  careworker?: {
    id: string;
    fullName: string;
    [key: string]: any;
  };
  report?: {
    id: string;
    title: string;
    status: string;
    [key: string]: any;
  };
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession()
        const { idToken } = session.tokens ?? {}
       
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken.toString()}`)
        }

        // Add CORS headers
        headers.set('Access-Control-Allow-Origin', '*')
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      } catch (error) {
        ('No auth session found, proceeding without authentication')
      }
      return headers
    },
    // Add timeout and retry logic
    timeout: 30000,
    fetchFn: async (input, init) => {
      try {
        const response = await fetch(input, init);
        if (!response.ok) {
          // Try to parse the error response as JSON
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `HTTP error! status: ${response.status}` };
          }
          
          // Create a more detailed error object
          const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
          (error as any).status = response.status;
          (error as any).data = errorData;
          throw error;
        }
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    }
  }),
  reducerPath: "api",
  tagTypes: [
    "Invitations",
    "Notifications",
    "InvitationsByEmail",
    "Locations",
    "Users",
    "Clients",
    "Schedule",
    "Dashboard",
    "User",
    "Agency",
    "Reports",
    "Chat",
    "RateSheets",
    "Groups",
    "Invoices",
    "ScheduleTemplates",
    "Medications",
    "MedicationLogs",
    "Conversations",
    "Messages",
    "LeaveEvents",
    "Payrolls",
    "Expenses",
    "Alerts"
  ],
  endpoints: (build) => ({
    // Get user
    getUser: build.query<any, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession()
          const { idToken } = session.tokens ?? {}
          const user = await getCurrentUser()
console.log("user", user)

          let userDetailsResponse = await fetchWithBQ(`/users/${user.userId}`)

          // if user doesn't exist, create new user
          if (userDetailsResponse.error) {
            userDetailsResponse = await createNewUserInDatabase(user, idToken, fetchWithBQ)
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as User,
            },
          }
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" }
        }
      },
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getAgencyReports: build.query<Report[], string>({
      query: (agencyId) => `/reports/agency/${agencyId}`,
      providesTags: ["Reports"],
    }),
    getAllAgencyAlerts: build.query<Alert[], string>({
      query: (agencyId) => `/agencies/${agencyId}/alerts/all`,
      providesTags: ["Alerts"],
    }),

    // Get users with filtering
    getUsers: build.query<UsersResponse, UserQueryParams>({
      query: (params) => {

        return `/users?role=${params.role}&agencyId=${params.agencyId}`
      },
      providesTags: ["Users"],
    }),
    //update user
    updateUser: build.mutation<User, User>({
      query: (user) => ({
        url: "/users",
        method: "PUT",
        body: user,
      }),
    }),
    // Get filtered users for scheduling
    getFilteredUsers: build.query<{ careWorkers: User[], clients: User[], officeStaff: User[] }, string>({
      query: (inviterId) => `/users/filtered/${inviterId}`,
      providesTags: ["Users"],
    }),

    getReportById: build.query<Report, string>({
      query: (id) => `/reports/${id}`,
      providesTags: ["Reports"],
    }),

    getCurrentInvoiceNumber: build.query<{invoiceNumber: number}, void>({
      query: () => `/invoices/current-invoice-number`,
      providesTags: ["Invoices"],
    }),
    // Schedule Template endpoints
    createScheduleTemplate: build.mutation<ScheduleTemplate, ScheduleTemplate>({
      query: (template) => ({
        url: "/templates",
        method: "POST",
        body: template,
      }),
      invalidatesTags: ["ScheduleTemplates"],
    }),

    getScheduleTemplates: build.query<ScheduleTemplate[], { userId: string, agencyId: string }>({
      query: ({ userId, agencyId }) => `/templates/${userId}/${agencyId}`,
      providesTags: ["ScheduleTemplates"],
    }),

    updateScheduleTemplate: build.mutation<ScheduleTemplate, ScheduleTemplate>({
      query: (template) => ({
        url: "/templates",
        method: "PUT",
        body: template,
      }),
      invalidatesTags: ["ScheduleTemplates"],
    }),

    activateScheduleTemplate: build.mutation<ScheduleTemplate, { id: string, userId: string }>({
      query: ({ id, userId }) => ({
        url: `/templates/activate/${id}/${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["ScheduleTemplates"],
    }),

    deactivateScheduleTemplate: build.mutation<ScheduleTemplate, { id: string }>({
      query: ({ id }) => ({
        url: `/templates/deactivate/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["ScheduleTemplates"],
    }),

    applyScheduleTemplate: build.mutation<void, string>({
      query: (templateId) => ({
        url: `/templates/apply/${templateId}`,
        method: "POST",
      }),
      invalidatesTags: ["ScheduleTemplates", "Schedule"],
    }),

    deleteScheduleTemplate: build.mutation<void, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ScheduleTemplates"],
    }),

    //create user
    createUser: build.mutation<User, CreateUserInput>({
      query: (user) => {
     
        return {
        url: "/users",
        method: "POST",
        body: user,
      }
    },
    }),

    getUserInvitations: build.query<Invitation[], string>({
      queryFn: async (inviterId, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
    
          const response = await fetchWithBQ(`/invitations/user/${inviterId}`)


          if (response.error) {
            console.error("Error fetching invitations:", response.error)

            const errorData = response.error.data
            if (errorData && typeof errorData === "object" && "message" in errorData && "name" in errorData) {
              if (typeof errorData.message === "string" && errorData.message.includes("prisma.invitation.findMany()")) {
                console.error("Prisma query error detected. This is likely a server-side database issue.")
                return {
                  error: {
                    status: "CUSTOM_ERROR",
                    error: "Database query error. Please check server logs for details about the Prisma query issue.",
                  },
                }
              }
            }

            return { error: response.error }
          }

          // Check if the response data is an array
          if (!Array.isArray(response.data)) {
            console.error("Invitations API returned non-array data:", response.data)
            return { data: [] }
          }

          return { data: response.data }
        } catch (error) {
          console.error("Exception in getUserInvitations:", error)
          return { error: { status: "FETCH_ERROR", error: String(error) } }
        }
      },
      providesTags: ["Invitations"],
    }),

    // Get invitations by email
    getInvitationsByEmail: build.query<Invitation[], string>({
      query: (email) => `/invitations/email/${email}`,
      providesTags: ["InvitationsByEmail"],
    }),

    // Verify invitation token
    verifyInvitation: build.query<Invitation, string>({
      query: (token) => `/invitations/verify/${token}`,
    }),

    // Get agency users
    getAgencyUsers: build.query<UsersResponse, string>({
      query: (agencyId) => ({
        url: `/users/agency/${agencyId}`,
        method: 'GET',
      }),
    }),

    getAgencySchedules: build.query<Schedule[], string>({
      query: (agencyId) => ({
        url: `/schedules/agency/${agencyId}`,
        method: 'GET',
      }),
      providesTags: [{ type: "Schedule", id: "AGENCY" }],
    }),

    // Create a new invitation
    createInvitation: build.mutation<Invitation, CreateInvitationInput>({
      query: (invitationData) => ({
        url: "/invitations",
        method: "POST",
        body: invitationData,
      }),
      invalidatesTags: ["Invitations"],
    }),

    // Cancel an invitation
    cancelInvitation: build.mutation<void, CancelInvitationInput>({
      query: ({ invitationId, userId }) => ({
        url: `/invitations/cancel/${invitationId}`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: ["Invitations"],
    }),

    createLeaveEvent: build.mutation<LeaveEvent, { 
      userId: string; 
      startDate: string; 
      endDate: string; 
      notes: string; 
      payRate: number; 
      eventType: string; 
      color: string; 
      agencyId: string 
    }>({
      query: (data) => ({
        url: "/schedules/leave",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveEvents"],
    }),

    getAgencyLeaveEvents: build.query<LeaveEvent[], string>({
      query: (agencyId) => ({
        url: `/schedules/leave/agency/${agencyId}`,
        method: 'GET',
      }),
    }),

    getUserLeaveEvents: build.query<LeaveEvent[], string>({
      query: (userId) => ({
        url: `/schedules/leave/user/${userId}`,
        method: 'GET',
      }),
    }),

    deleteLeaveEvent: build.mutation<void, string>({
      query: (id) => ({
        url: `/schedules/leave/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get schedules with filtering
    getSchedules: build.query<SchedulesResponse, {
      status?: string
      type?: string
      userId?: string
      startDate?: string
      endDate?: string
      agencyId?: string
      limit?: number
      offset?: number
    }>({
      query: (params) => ({
        url: "/schedules",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Schedule", id: "LIST" }],
    }),

    // Create a new schedule
    createSchedule: build.mutation<ScheduleResponse, ScheduleInput>({
      query: (schedule) => ({
        url: "/schedules",
        method: "POST",
        body: schedule,
      }),
      invalidatesTags: [
        { type: "Schedule", id: "LIST" },
        { type: "Schedule", id: "AGENCY" }
      ],
    }),

    // Update a schedule
    updateSchedule: build.mutation<ScheduleResponse, ScheduleUpdateInput>({
      query: ({ id, ...schedule }) => ({
        url: `/schedules/${id}`,
        method: "PUT",
        body: schedule,
      }),
      invalidatesTags: [
        { type: "Schedule", id: "LIST" },
        { type: "Schedule", id: "AGENCY" }
      ],
    }),

    // Delete a schedule
    deleteSchedule: build.mutation<void, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Schedule", id: "LIST" },
        { type: "Schedule", id: "AGENCY" }
      ],
    }),

    // Get locations
    getLocationsByUserId: build.query<Location[], string>({
      query: (userId) => `/locations/user/${userId}`,
      providesTags: ["Locations"],
    }),

    // Accept invitation
    acceptInvitation: build.mutation<User, AcceptInvitationInput>({
      query: (data) => ({
        url: "/invitations/accept",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invitations"],
    }),

    // Get dashboard data
    getDashboardData: build.query<DashboardData, string>({
      query: (userId) => `/dashboard/${userId}`,
      providesTags: ["Dashboard"],
    }),

        // Medication endpoints
        getMedications: build.query<Medication[], string>({
          query: (userId) => `/medications/${userId}`,
        }),

    createMedication: build.mutation<Medication, { userId: string; data: Partial<Medication> }>({
      query: ({ userId, data }) => ({
        url: `/medications/${userId}`,
        method: 'POST',
        body: data,
      }),
    }),

    updateMedication: build.mutation<Medication, { id: string; data: Partial<Medication> }>({
      query: ({ id, data }) => ({
        url: `/medications/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteMedication: build.mutation<void, string>({
      query: (id) => ({
        url: `/medications/${id}`,
        method: 'DELETE',
      }),
    }),

    createMedicationLog: build.mutation<MedicationLog, { medicationId: string; userId: string; data: Partial<MedicationLog> }>({
      query: ({ medicationId, userId, data }) => ({
        url: `/medications/${medicationId}/logs/${userId}`,
        method: 'POST',
        body: data,
      }),
    }),

    checkInMedication: build.mutation<MedicationLog, { medicationId: string; userId: string; data: { date: string; time: "MORNING" | "AFTERNOON" | "EVENING" | "BEDTIME" | "AS_NEEDED"; status: "TAKEN" | "NOT_TAKEN" | "NOT_REPORTED" | "NOT_SCHEDULED"; notes?: string | null } }>({
      query: ({ medicationId, userId, data }) => ({
        url: `/medications/${userId}/check-in/${medicationId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["MedicationLogs"],
    }),
    

    // Report endpoints
    createReport: build.mutation<Report, Partial<Report>>({
      query: (data) => ({
        url: '/reports',
        method: 'POST',
        body: data,
      }),
    }),

    getClientReports: build.query<Report[], string>({
      query: (clientId) => `/reports/client/${clientId}`,
    }),

    getCaregiverReports: build.query<Report[], string>({
      query: (userId) => `/reports/caregiver/${userId}`,
    }),

    updateReport: build.mutation<Report, { id: string; data: Partial<Report> }>({
      query: ({ id, data }) => ({
        url: `/reports/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["Reports"],
    }),

    updateReportTaskStatus: build.mutation<ReportTask, { taskId: string; completed: boolean }>({
      query: ({ taskId, completed }) => ({
        url: `/reports/task/${taskId}`,
        method: 'PUT',
        body: { completed },
      }),
    }),

    deleteReport: build.mutation<void, string>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: 'DELETE',
      }),
    }),
    // Chat endpoints
    sendMessageInConversation: build.mutation<{ data: Message; info: string }, { content: string; conversationId: string; senderId: string; agencyId: string }>({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
    }),

  
    // Document endpoints
    uploadDocument: build.mutation<Document, Partial<Document>>({
      query: (data) => ({
        url: '/documents',
        method: 'POST',
        body: data,
      }),
    }),

    getUserDocuments: build.query<Document[], string>({
      query: (userId) => `/documents/user/${userId}`,
    }),

    getClientDocuments: build.query<Document[], string>({
      query: (clientId) => `/documents/client/${clientId}`,
    }),

    getAgencyDocuments: build.query<Document[], string>({
      query: (agencyId) => `/documents/agency/${agencyId}`,
    }),

    getAgencyUnresolvedAlerts: build.query<Alert[], string>({
      query: (agencyId) => `/agencies/${agencyId}/unresolved-alerts`,
    }),

    updateDocument: build.mutation<Document, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `/documents/${id}`,
        method: 'PUT',
        body: { title },
      }),
    }),

    deleteDocument: build.mutation<void, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get user by ID
    getUserById: build.query<UserResponse, string>({
      query: (id) => ({
        url: `/users/id/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

//new methods here
addEmergencyContact: build.mutation<EmergencyContact, { userId: string; contact: EmergencyContact }>({
  query: ({ userId, contact }) => ({
    url: `/users/${userId}/emergency-contacts`,
    method: "POST",
    body: contact,
  }),
}),
editEmergencyContact: build.mutation<EmergencyContact, { userId: string; contactId: string; contact: EmergencyContact }>({
  query: ({ userId, contactId, contact }) => ({
    url: `/users/${userId}/emergency-contacts/${contactId}`,
    method: "PUT",
    body: contact,
  }),
}),
deleteEmergencyContact: build.mutation<void, { userId: string; contactId: string }>({
  query: ({ userId, contactId }) => ({
    url: `/users/${userId}/emergency-contacts/${contactId}`,
    method: "DELETE",
  }),
}),
addVisitType: build.mutation<VisitType, { userId: string; visitType: VisitType }>({
  query: ({ userId, visitType }) => ({
    url: `/users/${userId}/visit-types`,
    method: "POST",
    body: visitType,
  }),
}),
addVisitTypeTask: build.mutation<Task, { userId: string; visitTypeId: string; task: Task }>({
  query: ({ userId, visitTypeId, task }) => ({
    url: `/users/${userId}/visit-types/${visitTypeId}/tasks`,
    method: "POST",
    body: task,
  }),
}),

    // Get all user details by ID
    getUserAllDetails: build.query<UserAllDetailsResponse, string>({
      query: (id) => ({
        url: `/users/all/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get agency by ID
    getAgencyById: build.query<Agency, string>({
      query: (agencyId) => `/agencies/${agencyId}`,
      providesTags: ["Agency"],
    }),

    // Agency endpoints
    getAgencyCustomTasks: build.query<CustomTask[], string>({
      query: (agencyId) => `/agencies/${agencyId}/custom-tasks`,
    }),

    getAgencyGroups: build.query<Group[], string>({
      query: (agencyId) => `/agencies/${agencyId}/groups`,
      providesTags: ["Groups"],
    }),
getAgencyInvoices: build.query<Invoice[], string>({
  query: (agencyId) => `/agencies/${agencyId}/invoices`,
}),
getAgencyPayrolls: build.query<Payroll[], string>({
  query: (agencyId) => `/agencies/${agencyId}/payrolls`,
}),
getAgencyExpenses: build.query<Expenses[], string>({
  query: (agencyId) => `/agencies/${agencyId}/expenses`,
  providesTags: (_result, _error, agencyId) => [
    { type: 'Expenses', id: agencyId }
  ],
}),


    // Group endpoints
    getGroups: build.query<GroupResponse[], string>({
      query: (agencyId) => ({
        url: `/agencies/${agencyId}/groups`,
        method: 'GET',
        params: {
          include: 'clients'
        }
      }),
      providesTags: ["Groups"],
    }),

    createGroup: build.mutation<Group, { agencyId: string; name: string; clientIds: string[] }>({
      query: ({ agencyId, name, clientIds }) => ({
        url: `/agencies/${agencyId}/group`,
        method: 'POST',
        body: { 
          name,
          clientIds
        },
      }),
      invalidatesTags: ["Groups"],
    }),

    updateGroup: build.mutation<Group, { agencyId: string; groupId: string; name: string; clientIds: string[] }>({
      query: ({ agencyId, groupId, name, clientIds }) => ({
        url: `/agencies/${agencyId}/group/${groupId}`,
        method: 'PUT',
        body: { 
          name,
          clientIds
        },
      }),
      invalidatesTags: ["Groups"],
    }),

    deleteGroup: build.mutation<void, { agencyId: string; groupId: string }>({
      query: ({ agencyId, groupId }) => ({
        url: `/agencies/${agencyId}/group/${groupId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Groups"],
    }),

    getAgencyRateSheets: build.query<RateSheet[], { agencyId: string; staffType?: "client" | "careWorker" | "officeStaff" }>({
      query: ({ agencyId, staffType }) => {
        const params = new URLSearchParams();
        if (staffType) {
          params.append('staffType', staffType);
        }
        return `/agencies/${agencyId}/rate-sheets?${params.toString()}`;
      },
      providesTags: ["RateSheets"],
    }),

    updateAgencyCustomTasks: build.mutation<CustomTask[], { agencyId: string; tasks: CustomTask[] }>({
      query: ({ agencyId, tasks }) => ({
        url: `/agencies/${agencyId}/custom-tasks`,
        method: 'PUT',
        body: tasks,
      }),
    }),

    updateAgencyGroups: build.mutation<Group[], { agencyId: string; groups: Group[] }>({
      query: ({ agencyId, groups }) => ({
        url: `/agencies/${agencyId}/groups`,
        method: 'PUT',
        body: groups,
      }),
    }),

    createAgencyRateSheet: build.mutation<RateSheet, { agencyId: string; name: string; hourlyRate: number; staffType?: "CLIENT" | "CARE_WORKER" | "OFFICE_STAFF" }>({
      query: ({ agencyId, name, hourlyRate, staffType }) => ({
        url: `/agencies/${agencyId}/rate-sheet`,
        method: 'POST',
        body: { name, hourlyRate, staffType },
      }),
      invalidatesTags: ["RateSheets"],
    }),

    updateAgencyRateSheet: build.mutation<RateSheet, { agencyId: string; rateSheetId: string; name: string; hourlyRate: number; staffType?: "CLIENT" | "CARE_WORKER" | "OFFICE_STAFF" }>({
      query: ({ agencyId, rateSheetId, name, hourlyRate, staffType }) => ({
        url: `/agencies/${agencyId}/rate-sheet`,
        method: 'PUT',
        body: { id: rateSheetId, name, hourlyRate, staffType },
      }),
      invalidatesTags: ["RateSheets"],
    }),

    deleteAgencyRateSheet: build.mutation<void, { agencyId: string; rateSheetId: string }>({
      query: ({ agencyId, rateSheetId }) => ({
        url: `/agencies/${agencyId}/rate-sheet/${rateSheetId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["RateSheets"],
    }),

    //update agency
    updateAgency: build.mutation<Agency, { agencyId: string; agency: Agency }>({
      query: ({ agencyId, agency }) => ({
        url: `/agencies/${agencyId}`,
        method: 'PUT',
        body: agency,
      }),
    }),
//create agency
    createAgency: build.mutation<Agency, { agency: Agency }>({
      query: ({ agency }) => ({
        url: `/agencies`,
        method: 'POST',
        body: agency,
      }),
    }),
//delete agency
    deleteAgency: build.mutation<void, { agencyId: string }>({
      query: ({ agencyId }) => ({
        url: `/agencies/${agencyId}`,
        method: 'DELETE',
      }),
    }),

    updateAgencyRateSheets: build.mutation<RateSheet[], { agencyId: string; rateSheets: RateSheet[]; staffType?: "client" | "careWorker" | "officeStaff" }>({
      query: ({ agencyId, rateSheets, staffType }) => {
        const params = new URLSearchParams();
        if (staffType) {
          params.append('staffType', staffType);
        }
        return {
          url: `/agencies/${agencyId}/rate-sheets?${params.toString()}`,
          method: 'PUT',
          body: rateSheets,
        };
      },
    }),

    // Message endpoints
    addMessage: build.mutation<Message, { senderId: string; receiverId: string; content: string; agencyId: string }>({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
    }),

    getMessages: build.query<Message[], string>({
      query: (userId) => `/messages/user/${userId}`,
    }),

    getMessagesByAgency: build.query<Message[], string>({
      query: (agencyId) => `/messages/agency/${agencyId}`,
    }),

    deleteMessage: build.mutation<void, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
    }),

    // Create or get conversation
    createConversation: build.mutation<{
      id: string
      message: string
    }, { senderId: string; receiverId: string }>({
      query: ({ senderId, receiverId }) => ({
        url: "/messages/conversation",
        method: "POST",
        body: { senderId, receiverId },
      }),
      invalidatesTags: ["Conversations"],
    }),

    getInvoiceDashboardData: build.query<{ 
      numberOfInvoices: number; 
      revenue: number;
      numberOfClients: number;
      numberOfExpenses: number;
    }, string>({
      query: (agencyId) => `/invoices/dashboard-data/${agencyId}`,
    }),
getExpensesByDateRange: build.query<{ totalAmount: number }, { startDate: string; endDate: string }>({
  query: ({ startDate, endDate }) => `/invoices/expenses/date-range?startDate=${startDate}&endDate=${endDate}`,
}),
  getAgencyShiftReviews: build.query<Array<typeof ShiftReview & {
    careWorker: {
      fullName: string;
    };
    supervisor: {
      fullName: string;
    };
    approvedBy: {
      fullName: string;
    };
  }>, string>({
    query: (agencyId) => `/agencies/${agencyId}/shift-reviews`,
  }),
getAgencyMileageRecords: build.query<Array<MileageRecord & {
  client: {
    fullName: string;
  };
  careWorker: {
    fullName: string;
  };
}>, string>({
  query: (agencyId) => `/agencies/${agencyId}/mileage-records`,
}),
getScheduleHoursByDateRange: build.query<{ totalHours: number; payRate: number }, { startDate: string; endDate: string }>({
  query: ({ startDate, endDate }) => `/invoices/schedule-hours/date-range?startDate=${startDate}&endDate=${endDate}`,
}),
  createPayroll: build.mutation<Payroll, Payroll>({
    query: (payroll) => ({
      url: '/invoices/payroll',
      method: 'POST',
      body: payroll,
    }),
    invalidatesTags: ["Payrolls"],
  }),
  createExpense: build.mutation<Expenses, Expenses>({
    query: (expense) => ({
      url: '/invoices/expense',
      method: 'POST',
      body: expense,
    }),
    invalidatesTags: (_result, _error, arg) => [
      { type: 'Expenses', id: arg.agencyId }
    ],
  }),
  createInvoice: build.mutation<Invoice, {
    agencyId: string;
    clientId: string;
    description: string;
    issueDate: string;
    dueDate: string;
    paymentMethod: InvoicePaymentMethod;
    invoiceItems: {
        description: string;
        quantity: number;
        rate: number;
        amount: number;
    }[];
    taxRate: number;
    totalAmount: number;
    notes?: string;
    fromHoursDate?: string;
    toHoursDate?: string;
}>({
    query: (invoice) => ({
        url: '/invoices/invoice',
        method: 'POST',
        body: invoice,
    }),
    invalidatesTags: ["Invoices"],
}),
  resolveReportAlert: build.mutation<Alert, { alertId: string; description: string; resolvedById: string }>({
    query: ({ alertId, description, resolvedById }) => ({
      url: `/reports/resolve/${alertId}`,
      method: 'PUT',
      body: { description, resolvedById },
    }),
    invalidatesTags: ["Alerts"],
  }),
    getAgencyAlerts: build.query<Alert[], string>({
      query: (agencyId) => `/agencies/${agencyId}/alerts`,
      providesTags: ["Alerts"],
    }),

    deleteInvoice: build.mutation<void, string>({
      query: (invoiceId) => ({
        url: `/invoices/invoice/${invoiceId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, invoiceId) => [
        { type: "Invoices", id: "LIST" },
        { type: "Invoices", id: invoiceId }
      ],
    }),

  }),
})

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useGetAgencyUsersQuery,
  useGetAgencyByIdQuery,
  useGetUserInvitationsQuery,
  useCreateInvitationMutation,
  useCancelInvitationMutation,
  useGetInvitationsByEmailQuery,
  useVerifyInvitationQuery,
  useAcceptInvitationMutation,
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useGetLocationsByUserIdQuery,
  useGetDashboardDataQuery,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetUserAllDetailsQuery,
  useGetAgencyReportsQuery,
  useUpdateReportMutation,
  useGetReportByIdQuery,
  useGetAgencySchedulesQuery,
  useGetAgencyLeaveEventsQuery,
  useGetUserLeaveEventsQuery,
  useCreateLeaveEventMutation,
  useDeleteLeaveEventMutation,

  useGetAgencyCustomTasksQuery,
  useGetAgencyGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetAgencyRateSheetsQuery,
  useUpdateAgencyCustomTasksMutation,
  useUpdateAgencyGroupsMutation,
  useUpdateAgencyRateSheetsMutation,
  useCreateAgencyRateSheetMutation,
  useUpdateAgencyRateSheetMutation,
  useDeleteAgencyRateSheetMutation,
  useGetGroupsQuery,
  useUpdateAgencyMutation,
  useCreateAgencyMutation,
  useDeleteAgencyMutation,
  useGetCurrentInvoiceNumberQuery,
  useAddEmergencyContactMutation,
  useEditEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
  useAddVisitTypeMutation,
  useAddVisitTypeTaskMutation,
  useCreateScheduleTemplateMutation,
  useGetScheduleTemplatesQuery,
  useUpdateScheduleTemplateMutation,
  useDeleteScheduleTemplateMutation,
  useActivateScheduleTemplateMutation,
  useDeactivateScheduleTemplateMutation,
  useApplyScheduleTemplateMutation,
  useCreateMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
  useGetMedicationsQuery,
  useCreateMedicationLogMutation,
  useCheckInMedicationMutation,
  useDeleteUserMutation,
  useAddMessageMutation,
  useGetMessagesQuery,
  useGetMessagesByAgencyQuery,
  useDeleteMessageMutation,
  useCreateConversationMutation,
  useSendMessageInConversationMutation,
  useGetAgencyInvoicesQuery,
  useGetAgencyPayrollsQuery,
  useGetAgencyExpensesQuery,
  useGetInvoiceDashboardDataQuery,
  useGetExpensesByDateRangeQuery,
  useGetScheduleHoursByDateRangeQuery,
  useCreatePayrollMutation,
  useCreateExpenseMutation,
  useCreateInvoiceMutation,
  useGetAgencyAlertsQuery,
  useGetAllAgencyAlertsQuery,
  useResolveReportAlertMutation,
  useDeleteInvoiceMutation,
  useGetAgencyMileageRecordsQuery,
  useGetAgencyShiftReviewsQuery,
} = api

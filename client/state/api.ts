import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth"
import { createNewUserInDatabase } from "../lib/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { Invitation, Schedule, Role, SubRole, ReportTask, CommunicationLog, Profile, Agency, MedicationRecord, IncidentReport, KeyContact, CareOutcome, RiskAssessment, FamilyAccess, MedicationAdministration } from "../types/prismaTypes"
import { DashboardData } from "@/app/dashboard/types"



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
    title: string
    client: {
        id: string
        firstName: string
        lastName: string
        [key: string]: any
    }
    user: {
        id: string
        firstName: string
        lastName: string
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

// // Create invitation input type
export interface CreateInvitationInput {
  inviterUserId: string
  email: string
  role: string
  subRole?: string
  expirationDays: number
}

// // Cancel invitation input type
export interface CancelInvitationInput {
  invitationId: string
  userId: string
}

// // Accept invitation input type
export interface AcceptInvitationInput {
  invitationId: string
  userId: string
}

// // Add Location interface that was missing
// export interface Location {
//   id: string
//   name: string
//   address: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   agencyId: string
//   createdAt?: string
//   updatedAt?: string
// }

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

// // Update the ClientQueryParams interface in your API file
// export interface ClientQueryParams {
//   status?: string
//   userId?: string // Use userId to filter clients by user's agency
// }

// export interface DashboardData {
//   user: {
//     firstName: string;
//     role: string;
//     agency: {
//       id: string;
//       name: string;
//       isActive: boolean;
//       isSuspended: boolean;
//       hasScheduleV2: boolean;
//       hasEMAR: boolean;
//       hasFinance: boolean;
//       isWeek1And2ScheduleEnabled: boolean;
//       hasPoliciesAndProcedures: boolean;
//       isTestAccount: boolean;
//       address?: string;
//       city?: string;
//       state?: string;
//       zipCode?: string;
//       phone?: string;
//       email?: string;
//       createdAt: string;
//       hasAdvancedReporting?: boolean;
//     };
//   };
//   agency: {
//     id: string;
//     name: string;
//     isActive: boolean;
//     isSuspended: boolean;
//     hasScheduleV2: boolean;
//     hasEMAR: boolean;
//     hasFinance: boolean;
//     isWeek1And2ScheduleEnabled: boolean;
//     hasPoliciesAndProcedures: boolean;
//     isTestAccount: boolean;
//   };
//   stats: {
//     totalClients: number;
//     totalCareWorkers: number;
//     totalOfficeStaff: number;
//     totalSchedules: number;
//     totalReports: number;
//     totalDocuments: number;
//     totalMileageRecords: number;
//     unreadNotifications: number;
//   };
//   schedules: Array<{
//     id: string;
//     clientName: string;
//     careWorkerName: string;
//     date: string;
//     startTime: string;
//     endTime: string;
//     type: string;
//     status: string;
//     notes?: string;
//     title?: string;
//   }>;
//   notifications: Array<{
//     id: string;
//     title: string;
//     message: string;
//     type: 'SCHEDULE' | 'REPORT' | 'DOCUMENT' | 'SYSTEM' | 'ALERT';
//     createdAt: string;
//   }>;
// }



export interface CreateUserInput {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    subRole?: SubRole;
    cognitoId: string;
    invitedById?: string;
    agencyId?: string;
}

// // Medication interfaces
// export interface MedicationRecord {
//   id: string;
//   medicationId: string;
//   clientId: string;
//   userId: string;
//   dosage: string;
//   frequency: string;
//   startDate: Date;
//   endDate?: Date;
//   notes?: string;
//   morningDose: boolean;
//   lunchDose: boolean;
//   eveningDose: boolean;
//   bedtimeDose: boolean;
//   asNeededDose: boolean;
//   medication: {
//     name: string;
//     isSpecialist: boolean;
//     url: string;
//     source: string;
//   };
// }

// export interface MedicationAdministration {
//   id: string;
//   medicationRecordId: string;
//   administeredById: string;
//   administeredAt: Date;
//   doseType: 'MORNING' | 'LUNCH' | 'EVENING' | 'BEDTIME' | 'AS_NEEDED';
//   doseTaken: boolean;
//   notes?: string;
//   administeredBy: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };
// }

// // Report interfaces
// export interface Report {
//   id: string;
//   clientId: string;
//   userId: string;
//   condition: string;
//   summary: string;
//   checkInTime: string;
//   checkOutTime: string | null;
//   checkInDistance?: number;
//   checkOutDistance?: number;
//   tasksCompleted: ReportTask[];
//   client: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };
//   caregiver: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };
//   hasSignature?: boolean;
// }

// export interface ReportTask {
//   id: string;
//   reportId: string;
//   taskName: string;
//   completed: boolean;
// }

// // Document interfaces
// export interface Document {
//   id: string;
//   title: string;
//   fileUrl: string;
//   uploadedAt: Date;
//   userId?: string;
//   clientId?: string;
//   agencyId?: string;
// }

// // Add new interfaces for user update
export interface UpdateUserInput {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    subRole?: SubRole;
    agencyId?: string;
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
    medicationRecords?: MedicationRecord[];
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

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession()
      const { idToken } = session.tokens ?? {}
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken.toString()}`)
      }
      return headers
    },
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
    "Reports"
  ],
  endpoints: (build) => ({
    // Get user
    getUser: build.query<any, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          console.log("fetching auth user")
          const session = await fetchAuthSession()
          console.log("session", session)
          const { idToken } = session.tokens ?? {}
          console.log("idToken", idToken)
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
    getAgencyReports: build.query<Report[], string>({
      query: (agencyId) => `/reports/agency/${agencyId}`,
      providesTags: ["Reports"],
    }),

    // Get users with filtering
    getUsers: build.query<UsersResponse, UserQueryParams>({
      query: (params) => {
        console.log("params", params)
        return `/users?role=${params.role}&agencyId=${params.agencyId}`
      },
      providesTags: ["Users"],
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



    //create user
    createUser: build.mutation<User, CreateUserInput>({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
    // Update the getUserInvitations endpoint to add more debugging and error handling
    // Get user invitations
    getUserInvitations: build.query<Invitation[], string>({
      queryFn: async (inviterId, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          console.log("Fetching invitations for user ID:", inviterId)

          // Make the API request
          const response = await fetchWithBQ(`/invitations/user/${inviterId}`)

          // Log the response for debugging
          console.log("Invitations API response:", response)

          if (response.error) {
            console.error("Error fetching invitations:", response.error)

            // Check if it's a Prisma error
            const errorData = response.error.data
            if (errorData && typeof errorData === "object" && "message" in errorData && "name" in errorData) {
              if (typeof errorData.message === "string" && errorData.message.includes("prisma.invitation.findMany()")) {
                console.error("Prisma query error detected. This is likely a server-side database issue.")

                // Return a more specific error for Prisma issues
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
      invalidatesTags: [{ type: "Schedule", id: "LIST" }],
    }),

    // Update a schedule
    updateSchedule: build.mutation<ScheduleResponse, ScheduleUpdateInput>({
      query: ({ id, ...schedule }) => ({
        url: `/schedules/${id}`,
        method: "PUT",
        body: schedule,
      }),
      invalidatesTags: [{ type: "Schedule", id: "LIST" }],
    }),

    // Delete a schedule
    deleteSchedule: build.mutation<void, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Schedule", id: "LIST" }],
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
    getMedicationRecords: build.query<MedicationRecord[], string>({
      query: (clientId) => `/medications/client/${clientId}`,
    }),

    createMedicationRecord: build.mutation<MedicationRecord, Partial<MedicationRecord>>({
      query: (data) => ({
        url: '/medications/records',
        method: 'POST',
        body: data,
      }),
    }),

    updateMedicationRecord: build.mutation<MedicationRecord, { id: string; data: Partial<MedicationRecord> }>({
      query: ({ id, data }) => ({
        url: `/medications/records/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteMedicationRecord: build.mutation<void, string>({
      query: (id) => ({
        url: `/medications/records/${id}`,
        method: 'DELETE',
      }),
    }),

    recordMedicationAdministration: build.mutation<MedicationAdministration, Partial<MedicationAdministration>>({
      query: (data) => ({
        url: '/medications/administration',
        method: 'POST',
        body: data,
      }),
    }),

    getMedicationAdministrationHistory: build.query<MedicationAdministration[], string>({
      query: (medicationRecordId) => `/medications/administration/${medicationRecordId}`,
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

    // Update user
    updateUser: build.mutation<UserResponse, UpdateUserInput>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Get all user details by ID
    getUserAllDetails: build.query<UserAllDetailsResponse, string>({
      query: (id) => ({
        url: `/users/all/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
})

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useGetAgencyUsersQuery,
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
} = api

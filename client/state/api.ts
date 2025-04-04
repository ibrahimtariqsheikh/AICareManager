import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth"
import { createNewUserInDatabase } from "../lib/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AppointmentEvent } from "../components/scheduler/calender/types"
import { Invitation, Schedule, Role } from "../types/prismaTypes"


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
  title: string
  start: Date
  end: Date
  date: Date
  startTime: string
  endTime: string
  resourceId: string
  clientId: string
  type: string
  status: string
  notes?: string
  color: string
  careWorker: {
    firstName: string
    lastName: string
  }
  client: {
    firstName: string
    lastName: string
  }
}

export interface SchedulesResponse {
  data: ScheduleResponse[]
  meta: {
    total: number
    limit: number
    offset: number
  }
}

// Create invitation input type
export interface CreateInvitationInput {
  inviterUserId: string
  email: string
  role: string
  expirationDays: number
}

// Cancel invitation input type
export interface CancelInvitationInput {
  invitationId: string
  userId: string
}

// Accept invitation input type
export interface AcceptInvitationInput {
  invitationId: string
  userId: string
}

// Add Location interface that was missing
export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  agencyId: string
  createdAt?: string
  updatedAt?: string
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

// Update the ClientQueryParams interface in your API file
export interface ClientQueryParams {
  status?: string
  userId?: string // Use userId to filter clients by user's agency
}

export interface DashboardData {
  user: {
    firstName: string;
    role: string;
    agency: {
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
      createdAt: string;
      hasAdvancedReporting?: boolean;
    };
  };
  agency: {
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
  };
  stats: {
    totalClients: number;
    totalCareWorkers: number;
    totalOfficeStaff: number;
    totalSchedules: number;
    totalReports: number;
    totalDocuments: number;
    totalMileageRecords: number;
    unreadNotifications: number;
  };
  schedules: Array<{
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
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'SCHEDULE' | 'REPORT' | 'DOCUMENT' | 'SYSTEM' | 'ALERT';
    createdAt: string;
  }>;
}

interface CreateUserInput {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    cognitoId: string;
    invitedById?: string;
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
"Dashboard"
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
      query: (userId) => `/api/dashboard/${userId}`,
      providesTags: ["Dashboard"],
    }),
  }),
})

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useGetFilteredUsersQuery,
  useGetUserInvitationsQuery,
  useVerifyInvitationQuery,
  useCreateInvitationMutation,
  useCancelInvitationMutation,
  useGetInvitationsByEmailQuery,
  useAcceptInvitationMutation,
  useCreateUserMutation,
  useGetLocationsByUserIdQuery,
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useGetDashboardDataQuery,
} = api

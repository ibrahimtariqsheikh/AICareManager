import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth"
import { createNewUserInDatabase } from "../lib/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Types
export interface Invitation {
  id: string
  email: string
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELED"
  createdAt: string
  expiresAt: string
  token: string
  inviter?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface User {
  id: string
  cognitoId: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt?: string
  updatedAt?: string
  agencyId?: string
  invitedById?: string
  profile?: {
    id: string
    phone?: string
    avatarUrl?: string
    address?: string
  }
}

export interface Client {
  id: string
  email: string
  name: string
  status: "Pending" | "Active"
  dateAdded: string
}

export interface Notification {
  id: string
  type: "INVITATION" | "MESSAGE" | "ALERT"
  content: string
  createdAt: string
  read: boolean
  data?: any
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

// Schedule types
export interface Schedule {
  id: string
  agencyId: string
  clientId: string
  userId: string
  date: string
  shiftStart: string
  shiftEnd: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED"
  type: "WEEKLY_CHECKUP" | "APPOINTMENT" | "HOME_VISIT" | "OTHER"
  notes?: string
  chargeRate?: number
  createdAt?: string
  updatedAt?: string
  client?: {
    firstName: string
    lastName: string
  }
  user?: {
    firstName: string
    lastName: string
  }
}

export interface ScheduleInput {
  agencyId: string
  clientId: string
  userId: string
  date: Date
  shiftStart: Date
  shiftEnd: Date
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED"
  type: "WEEKLY_CHECKUP" | "APPOINTMENT" | "HOME_VISIT" | "OTHER"
  notes?: string
  chargeRate?: number
}

export interface ScheduleUpdateInput extends Partial<ScheduleInput> {
  id: string
}

export interface ScheduleQueryParams {
  status?: string
  type?: string
  agencyId?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export interface ScheduleResponse {
  data: Schedule[]
  meta: {
    total: number
    limit: number
    offset: number
  }
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
  tagTypes: ["Invitations", "Notifications", "InvitationsByEmail", "Schedules", "Schedule", "Locations"],
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

    //create user
    createUser: build.mutation<User, User>({
      query: (user: User) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
    // Get user invitations
    getUserInvitations: build.query<Invitation[], string>({
      query: (inviterId) => `/invitations/user/${inviterId}`,
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

    // Get all schedules with filtering
    getSchedules: build.query<ScheduleResponse, ScheduleQueryParams>({
      query: (params) => ({
        url: "/schedules",
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Schedules" as const, id })), { type: "Schedules", id: "LIST" }]
          : [{ type: "Schedules", id: "LIST" }],
    }),

    // Get schedules by date range
    getSchedulesByDateRange: build.query<ScheduleResponse, ScheduleQueryParams>({
      query: (params) => ({
        url: "/schedules/date-range",
        params,
      }),
      providesTags: [{ type: "Schedules", id: "DATE_RANGE" }],
    }),

    // Create a new schedule
    createSchedule: build.mutation<Schedule, ScheduleInput>({
      query: (schedule) => ({
        url: "/schedules",
        method: "POST",
        body: schedule,
      }),
      invalidatesTags: [{ type: "Schedules", id: "LIST" }],
    }),

    // Update a schedule
    updateSchedule: build.mutation<Schedule, ScheduleUpdateInput>({
      query: ({ id, ...schedule }) => ({
        url: `/schedules/${id}`,
        method: "PUT",
        body: schedule,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Schedules", id: "LIST" },
        { type: "Schedule", id },
      ],
    }),

    // Delete a schedule
    deleteSchedule: build.mutation<void, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Schedules", id: "LIST" },
        { type: "Schedule", id },
      ],
    }),
  }),
})

export const {
  useGetUserQuery,
  useGetUserInvitationsQuery,
  useVerifyInvitationQuery,
  useCreateInvitationMutation,
  useCancelInvitationMutation,
  useGetInvitationsByEmailQuery,
  useAcceptInvitationMutation,
  useCreateUserMutation,
  useGetLocationsByUserIdQuery,
  useGetSchedulesQuery,
  useGetSchedulesByDateRangeQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = api

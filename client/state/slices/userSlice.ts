import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { User } from "../../types/prismaTypes"
import { api } from "../api"
import type { AppointmentEvent, SidebarMode } from "../../components/scheduler/calender/types"
import { filterEvents } from "../../components/scheduler/calender/calender-utils"
import type { ScheduleResponse, UserResponse } from "../api"

// This will help serialize and deserialize dates
function serializeEvent(event: AppointmentEvent): any {
    // Create a copy of the event to avoid mutating the original
    const serializedEvent = { ...event };

    // Helper function to safely convert date to ISO string
    const toISOString = (date: Date | string | undefined): string => {
        if (!date) return new Date().toISOString();
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            if (isNaN(dateObj.getTime())) return new Date().toISOString();
            return dateObj.toISOString();
        } catch (error) {
            console.error('Error serializing date:', error);
            return new Date().toISOString();
        }
    };

    // Safely serialize dates
    serializedEvent.start = toISOString(event.start);
    serializedEvent.end = toISOString(event.end);
    serializedEvent.date = toISOString(event.date);

    return serializedEvent;
}

function deserializeEvent(event: any): AppointmentEvent {
    // Create a copy of the event to avoid mutating the original
    const deserializedEvent = { ...event };

    // Helper function to safely convert to Date
    const toDate = (dateStr: string | Date | undefined): Date => {
        if (!dateStr) return new Date();
        try {
            const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
            if (isNaN(date.getTime())) return new Date();
            return date;
        } catch (error) {
            console.error('Error deserializing date:', error);
            return new Date();
        }
    };

    // Safely deserialize dates
    deserializedEvent.start = toDate(event.start);
    deserializedEvent.end = toDate(event.end);
    deserializedEvent.date = toDate(event.date);

    deserializedEvent.start = new Date(event.start);
    deserializedEvent.end = new Date(event.end);
    deserializedEvent.date = new Date(event.date);

    return deserializedEvent;
}

interface AdditionalUserInfo {
  userInfo: User
  authUser: {
    cognitoInfo: {
      signInDetails: {
        authFlowType: string;
        loginId: string;
      };
      userId: string;
      username: string;
    };
  }
}

interface UserState {
  user: {
    userInfo: {
      id: string;
      cognitoId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      agencyId?: string;
      agency?: {
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
        createdAt: Date;
        updatedAt: Date;
      };
    } | null;
    authUser: {
      cognitoInfo: {
        signInDetails: {
          authFlowType: string;
          loginId: string;
        };
        userId: string;
        username: string;
      };
    };
  };
  officeStaff: User[];
  careWorkers: User[];
  clients: User[];
  events: AppointmentEvent[];
  filteredEvents: AppointmentEvent[];
  sidebarMode: SidebarMode;
  loading: boolean;
  error: string | null;
  currentUser: User | null;
}

// Initial state
const initialState: UserState = {
  user: {
    userInfo: null,
    authUser: {
      cognitoInfo: {
        signInDetails: {
          authFlowType: "",
          loginId: "",
        },
        userId: "",
        username: "",
      },
    },
  },
  officeStaff: [],
  careWorkers: [],
  clients: [],
  events: [],
  filteredEvents: [],
  sidebarMode: "clients",
  loading: false,
  error: null,
  currentUser: null,
}

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AdditionalUserInfo>) => {
      state.user = action.payload
    },
    setOfficeStaff: (state, action: PayloadAction<User[]>) => {
      state.officeStaff = action.payload
      // Update filtered events when staff changes
      updateFilteredEvents(state)
    },
    setCareWorkers: (state, action: PayloadAction<User[]>) => {
      state.careWorkers = action.payload
      // Update filtered events when staff changes
      updateFilteredEvents(state)
    },
    setClients: (state, action: PayloadAction<User[]>) => {
      state.clients = action.payload
      // Update filtered events when clients change
      updateFilteredEvents(state)
    },
    setEvents: (state, action: PayloadAction<AppointmentEvent[]>) => {
      state.events = action.payload.map(serializeEvent)
      // Update filtered events when events change
      updateFilteredEvents(state)
    },
    setFilteredEvents: (state, action: PayloadAction<AppointmentEvent[]>) => {
      state.filteredEvents = action.payload.map(serializeEvent)
    },
  
    setSidebarMode: (state, action: PayloadAction<SidebarMode>) => {
      state.sidebarMode = action.payload
      // Update filtered events when sidebar mode changes
      updateFilteredEvents(state)
    },
    toggleEventTypeSelection: (state, action: PayloadAction<string>) => {
      // This is a placeholder since we removed event types
      // We'll keep it for API compatibility
    },
    addEvent: (state, action: PayloadAction<AppointmentEvent>) => {
      const serializedEvent = serializeEvent(action.payload)
      state.events.push(serializedEvent)
      // Log the event for debugging
      console.log("Added event to Redux store:", serializedEvent)

      // Update filtered events when adding an event
      updateFilteredEvents(state)
    },
    updateEvent: (state, action: PayloadAction<AppointmentEvent>) => {
      const serializedEvent = serializeEvent(action.payload)
      const index = state.events.findIndex((event) => event.id === serializedEvent.id)
      if (index !== -1) {
        state.events[index] = serializedEvent
      }
      // Update filtered events when updating an event
      updateFilteredEvents(state)
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((event) => event.id !== action.payload)
      // Update filtered events when deleting an event
      updateFilteredEvents(state)
    },
    clearUserError: (state) => {
      state.error = null
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getFilteredUsers
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.currentUser = action.payload.data;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // Handle getSchedules
      .addMatcher(api.endpoints.getSchedules.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.getSchedules.matchFulfilled, (state, { payload }) => {
        state.loading = false
        // Map API schedules to our event format and serialize dates
        const events = payload.data.map((schedule: ScheduleResponse) => ({
          id: schedule.id,
          title: schedule.title,
          start: schedule.start,
          end: schedule.end,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          resourceId: schedule.resourceId,
          clientId: schedule.clientId,
          type: schedule.type,
          status: schedule.status,
          notes: schedule.notes || "",
          color: schedule.color || getEventColor(schedule.type),
          careWorker: schedule.careWorker,
          client: schedule.client,
        }))
        
        state.events = events
        // Update filtered events when events change
        updateFilteredEvents(state)
      })
      .addMatcher(api.endpoints.getSchedules.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || "Failed to fetch schedules"
      })
      .addMatcher(api.endpoints.updateUser.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.updateUser.matchFulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload.data
      })
      .addMatcher(api.endpoints.updateUser.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update user"
      });
  },
})

// Helper function to update filtered events based on current state
function updateFilteredEvents(state: UserState) {
    // If there are no events, set filtered events to empty array
    if (!state.events || state.events.length === 0) {
        state.filteredEvents = [];
        return;
    }

    // Deserialize events for processing
    const deserializedEvents = state.events.map(deserializeEvent);

    // Format staff members for filtering
    const careWorkerMembers = state.careWorkers.map((staff) => ({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role || "CARE_WORKER",
        color: staff.color || "#000000",
        avatar: staff.profile?.avatarUrl || "",
        selected: true, // Set all staff as selected by default
    }));

    const officeStaffMembers = state.officeStaff.map((staff) => ({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role || "OFFICE_STAFF",
        color: staff.color || "#000000",
        avatar: staff.profile?.avatarUrl || "",
        selected: true, // Set all staff as selected by default
    }));

    // Format clients for filtering
    const formattedClients = state.clients.map((client) => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        color: client.color || "#000000",
        avatar: client.profile?.avatarUrl || "",
        selected: true, // Set all clients as selected by default
    }));

    // No event types anymore, so we'll pass an empty array
    const eventTypes: any[] = [];

    // Filter events based on current selections
    const filtered = filterEvents(
        deserializedEvents,
        careWorkerMembers,
        officeStaffMembers,
        formattedClients,
        eventTypes,
        state.sidebarMode,
    );

    // Serialize filtered events before storing in state
    state.filteredEvents = filtered.map(serializeEvent);

    // Log for debugging
    console.log("Updated filtered events:", state.filteredEvents.length);
    console.log("Sample filtered event:", state.filteredEvents[0]);
}

// Helper function to get event color based on type
function getEventColor(type: string): string {
  switch (type) {
    case "APPOINTMENT":
      return "#4f46e5" // indigo
    case "CHECKUP":
    case "WEEKLY_CHECKUP":
      return "#10b981" // emerald
    case "EMERGENCY":
      return "#ef4444" // red
    case "ROUTINE":
      return "#8b5cf6" // purple
    case "HOME_VISIT":
      return "#059669" // green
    default:
      return "#6b7280" // gray
  }
}

export const {
  setOfficeStaff,
  setCareWorkers,
  setClients,
  setEvents,
  setFilteredEvents,
  setSidebarMode,
  toggleEventTypeSelection,
  addEvent,
  updateEvent,
  deleteEvent,
  clearUserError,
  setUser,
  setCurrentUser,
  setLoading,
  setError,
} = userSlice.actions
export default userSlice.reducer


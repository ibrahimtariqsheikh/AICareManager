import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../../types/prismaTypes"
import { api } from "../api"
import type { UserResponse } from "../api"

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
      fullName: string;
      role: string;
      agencyId?: string;
    agenciesOwned: [
      {
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

      }
    ];
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
  loading: boolean;
  activeUserType: "CLIENT" | "CARE_WORKER" | "OFFICE_STAFF";
  error: string | null;
  currentUser: User | null;
  selectedClients: User[];
  selectedCareWorkers: User[];
  selectedOfficeStaff: User[];
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
  activeUserType: "CLIENT",
  loading: false,
  error: null,
  currentUser: null,
  selectedClients: [],
  selectedCareWorkers: [],
  selectedOfficeStaff: [],
}

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AdditionalUserInfo>) => {
      state.user=action.payload
    },
    setOfficeStaff: (state, action: PayloadAction<User[]>) => {
      state.officeStaff = action.payload
    },
    setCareWorkers: (state, action: PayloadAction<User[]>) => {
      state.careWorkers = action.payload
    },
    setClients: (state, action: PayloadAction<User[]>) => {
      state.clients = action.payload
    },
    setActiveUserType: (state, action: PayloadAction<"CLIENT" | "CARE_WORKER" | "OFFICE_STAFF">) => {
      state.activeUserType = action.payload
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
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    setSelectedClients: (state, action: PayloadAction<User[]>) => {
      state.selectedClients = action.payload
    },
    setSelectedCareWorkers: (state, action: PayloadAction<User[]>) => {
      state.selectedCareWorkers = action.payload
    },
    setSelectedOfficeStaff: (state, action: PayloadAction<User[]>) => {
      state.selectedOfficeStaff = action.payload
    },
    removeUser: (state, action: PayloadAction<{ id: string, selectedUserType: "CLIENT" | "CARE_WORKER" | "OFFICE_STAFF" }>) => {
      const { id, selectedUserType } = action.payload
      state.clients = state.clients.filter((client: User) => client.id !== id)
      state.careWorkers = state.careWorkers.filter((careWorker: User) => careWorker.id !== id)
      state.officeStaff = state.officeStaff.filter((officeStaff: User) => officeStaff.id !== id)
     
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
      .addMatcher(api.endpoints.updateUser.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(api.endpoints.updateUser.matchFulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addMatcher(api.endpoints.updateUser.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update user"
      });
  },
})

export const {
  setOfficeStaff,
  setCareWorkers,
  setClients,
  clearUserError,
  setUser,
  setCurrentUser,
  setLoading,
  setError,
  updateUser,
  setSelectedClients,
  setSelectedCareWorkers,
  setSelectedOfficeStaff,
  removeUser,
  setActiveUserType
} = userSlice.actions
export default userSlice.reducer


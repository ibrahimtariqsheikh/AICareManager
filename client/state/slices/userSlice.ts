import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
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
    },
    setCareWorkers: (state, action: PayloadAction<User[]>) => {
      state.careWorkers = action.payload
    },
    setClients: (state, action: PayloadAction<User[]>) => {
      state.clients = action.payload
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

export const {
  setOfficeStaff,
  setCareWorkers,
  setClients,
  clearUserError,
  setUser,
  setCurrentUser,
  setLoading,
  setError,
} = userSlice.actions
export default userSlice.reducer


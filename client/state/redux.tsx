"use client"

import type React from "react"

import { useRef } from "react"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { setupListeners } from "@reduxjs/toolkit/query"
import globalReducer from "./slices/globalSlice"
import { api } from "./api"
import authReducer from "./slices/authSlice"
import scheduleReducer from "./slices/scheduleSlice"
import invitationReducer from "./slices/invitationSlice"
import userReducer from "./slices/userSlice"
import calendarReducer from "./slices/calendarSlice"
import medicationReducer from "./slices/medicationSlice"
import reportReducer from "./slices/reportSlice"
import documentReducer from "./slices/documentSlice"
import agencyReducer from "./slices/agencySlice"
import patientReducer from "./slices/patientSlice"
import chatReducer from "./slices/chatSlice"

/* REDUX STORE */
const rootReducer = combineReducers({
  global: globalReducer,
  agency: agencyReducer,
  auth: authReducer,
  schedule: scheduleReducer,
  invitations: invitationReducer,
  user: userReducer,
  calendar: calendarReducer,
  medication: medicationReducer,
  report: reportReducer,
  document: documentReducer,
  patient: patientReducer,
  chat: chatReducer,
  [api.reducerPath]: api.reducer,

})

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['api/executeQuery/fulfilled', 'api/executeQuery/rejected'],
          // Ignore these paths in the state
          ignoredPaths: ['api.queries', 'api.mutations', 'api.subscriptions'],
        },
      }).concat(api.middleware),
  })
}

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/* PROVIDER */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    setupListeners(storeRef.current.dispatch)
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}


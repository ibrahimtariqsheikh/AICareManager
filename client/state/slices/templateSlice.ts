import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface VisitSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  careWorker: string
}

export interface Template {
  id: string
  name: string
  description: string
  visits: VisitSlot[]
  isActive: boolean
  lastUpdated: string
}

interface TemplateState {
  templates: Template[]
  currentTemplate: Template | null
  visitSlots: VisitSlot[]
  isEditingTemplate: boolean
}

const initialState: TemplateState = {
  templates: [],
  currentTemplate: null,
  visitSlots: [],
  isEditingTemplate: false,
}

const templateSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    addVisit: (state, action: PayloadAction<VisitSlot[]>) => {
      state.visitSlots = [...state.visitSlots, ...action.payload]
    },
    removeVisit: (state, action: PayloadAction<string>) => {
      state.visitSlots = state.visitSlots.filter((slot) => slot.id !== action.payload)
    },
   setCurrentTemplate: (state, action: PayloadAction<Template | null>) => {
  state.currentTemplate = action.payload
  if (action.payload) {
    state.visitSlots = [...action.payload.visits]
      }
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null
      state.visitSlots = []
    },
    addTemplate: (state, action: PayloadAction<Template>) => {
      state.templates.push(action.payload)
      state.visitSlots = []
      state.currentTemplate = null
    },
    updateTemplate: (state, action: PayloadAction<Template>) => {
      const index = state.templates.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.templates[index] = action.payload
      }
      state.visitSlots = []
      state.currentTemplate = null
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload)
      if (state.currentTemplate?.id === action.payload) {
        state.currentTemplate = null
        state.visitSlots = []
      }
    },
    activateTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.map((t) => ({
        ...t,
        isActive: t.id === action.payload,
      }))
    },
    setIsEditingTemplate: (state, action: PayloadAction<boolean>) => {
      state.isEditingTemplate = action.payload
    },
  },
})

export const {
  addVisit,
  removeVisit,
  setCurrentTemplate,
  clearCurrentTemplate,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  activateTemplate,
  setIsEditingTemplate,
} = templateSlice.actions

export default templateSlice.reducer

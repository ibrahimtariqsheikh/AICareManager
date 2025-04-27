import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Schedule, ScheduleTemplate, TemplateVisit } from "@/types/prismaTypes"

// Define a type for the slice state
interface TemplateState {
  userTemplates: ScheduleTemplate[]
 isLoadingTemplates: boolean
  selectedTemplateId: string | null
  error: string | null
  currentTemplate: ScheduleTemplate | null
  templates: ScheduleTemplate[]
  isEditingTemplate: boolean
}

// Define the initial state using that type
const initialState: TemplateState = {
  userTemplates: [],
  currentTemplate: null,
  templates: [],
  isEditingTemplate: false,
  isLoadingTemplates: false,
  selectedTemplateId: null,
  error: null,
}

export const templateSlice = createSlice({
  name: "template",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
     addVisitInTemplate: (state, action: PayloadAction<TemplateVisit[]>) => {
      if (!state.currentTemplate) {
        return
      }
      if (!state.currentTemplate.visits) {
        state.currentTemplate.visits = []
      }
      // Treat payload as a flat array of TemplateVisit objects
      state.currentTemplate.visits.push(...action.payload)
    },
    removeVisitInTemplate: (state, action: PayloadAction<string>) => {
      if (!state.currentTemplate || !state.currentTemplate.visits) {
        return;
      }
      state.currentTemplate.visits = state.currentTemplate.visits.filter(
        (visit: TemplateVisit) => visit.id !== action.payload
      );
    },
    setCurrentTemplate: (state, action: PayloadAction<ScheduleTemplate>) => {
      state.currentTemplate = action.payload
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null
    },
    addTemplate: (state, action: PayloadAction<ScheduleTemplate>) => {
      state.templates.push(action.payload)
    },
    updateTemplate: (state, action: PayloadAction<ScheduleTemplate>) => {
      state.templates = state.templates.map((template: ScheduleTemplate) =>
        template.id === action.payload.id ? action.payload : template,
      )
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((template: ScheduleTemplate) => template.id !== action.payload)
    },
    activateTemplate: (state, action: PayloadAction<string>) => {
      state.templates.forEach((template: ScheduleTemplate) => {
        template.isActive = template.id === action.payload
      })
    },
    deactivateTemplate: (state, action: PayloadAction<string>) => {
      const targetTemplate = state.templates.find((template: ScheduleTemplate) => template.id === action.payload)
      if (targetTemplate) {
        targetTemplate.isActive = false
      }
    },
    setIsEditingTemplate: (state, action: PayloadAction<boolean>) => {
      state.isEditingTemplate = action.payload
    },
    applyTemplateToSchedule: (state, action: PayloadAction<Schedule>) => {
      // TODO: Implement this
    },
    setTemplatesFromApi: (state, action: PayloadAction<ScheduleTemplate[]>) => {
      state.templates = action.payload
    },
setUserTemplates: (state, action: PayloadAction<ScheduleTemplate[]>) => {
      state.userTemplates = action.payload
      state.isLoadingTemplates = false
      state.error = null
    },
clearTemplates: (state) => {
      state.userTemplates = []
      state.selectedTemplateId = null
    },
   setSelectedTemplateId: (state, action: PayloadAction<string | null>) => {
      state.selectedTemplateId = action.payload
    },
   setLoadingTemplates: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTemplates = action.payload
    },
     setTemplateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoadingTemplates = false
    },
  },

})

export const {
  addVisitInTemplate,
  removeVisitInTemplate,
  setCurrentTemplate,
  clearCurrentTemplate,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  activateTemplate,
  deactivateTemplate,
  setIsEditingTemplate,
  applyTemplateToSchedule,
  setTemplatesFromApi,
  setUserTemplates,
  clearTemplates,
  setSelectedTemplateId,
  setLoadingTemplates,
  setTemplateError,
} = templateSlice.actions

export default templateSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TabsState {
  activeEditUserTab: string
}

const initialState: TabsState = {
  activeEditUserTab: 'patientInformation'
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveEditUserTab: (state, action: PayloadAction<string>) => {
      state.activeEditUserTab = action.payload
    }
  }
})

export const { setActiveEditUserTab } = tabsSlice.actions
export default tabsSlice.reducer 
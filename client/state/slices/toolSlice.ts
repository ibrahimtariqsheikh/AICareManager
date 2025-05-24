import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ToolState {
  step: number
}

const initialState: ToolState = {
  step: 1
}

const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    }
  }
})

export const { setStep } = toolSlice.actions
export default toolSlice.reducer 
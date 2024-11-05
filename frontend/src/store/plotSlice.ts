import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PlotState {
  content: string;
}

const initialState: PlotState = {
  content: ''
}

export const plotSlice = createSlice({
  name: 'plot',
  initialState,
  reducers: {
    updatePlot: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    }
  }
})

export const { updatePlot } = plotSlice.actions
export const selectPlot = (state: { plot: PlotState }) => state.plot.content
export default plotSlice.reducer 
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface InputState {
    plot: string,
    ch1: string,
    ch2: string
}

const initialState: InputState = {
    plot: "",
    ch1: "",
    ch2: ""
}

export const inputSlice = createSlice({
    name: "input",
    initialState,

    reducers: {
        setInput: (state: InputState, action: PayloadAction<InputState>) => {
            state.plot = action.payload.plot
            state.ch1 = action.payload.ch1
            state.ch2 = action.payload.ch2
        },
        updatePlot: (state: InputState, action) => {
            state.plot = action.payload
        },
        updateCh1: (state: InputState, action) => {
            state.ch1 = action.payload
        },
        updateCh2: (state: InputState, action) => {
            state.ch2 = action.payload
        }
    }
})

export const { setInput, updatePlot, updateCh1, updateCh2 } = inputSlice.actions

export const selectInput = (state: any) => state.input
export const selectPlot = (state: any) => state.input.plot
export const selectCh1 = (state: any) => state.input.ch1
export const selectCh2 = (state: any) => state.input.ch2

export default inputSlice.reducer
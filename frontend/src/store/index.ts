import { configureStore } from '@reduxjs/toolkit'
import inputReducer from '@/features/input/inputSlice'
import shotsReducer from '@/features/shots/shotsSlice'
import storyboardReducer from '@/features/storyboard/storyboardSlice'

export const store = configureStore({
  reducer: {
    input: inputReducer,
    shots: shotsReducer,
    storyboard: storyboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
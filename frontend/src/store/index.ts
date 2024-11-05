import { configureStore } from '@reduxjs/toolkit'
import plotReducer from './plotSlice'
import shotsReducer from '@/features/shots/shotsSlice'
import storyboardReducer from '@/features/storyboard/storyboardSlice'

export const store = configureStore({
  reducer: {
    plot: plotReducer,
    shots: shotsReducer,
    storyboard: storyboardReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
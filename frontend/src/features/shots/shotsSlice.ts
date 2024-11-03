import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "@/store"

export interface Shot {
  id: string
  description: string
  frame_url?: string
  sequence: number
  metadata?: Record<string, any>
}

interface ShotsState {
  shots: Shot[]
  isLoading: boolean
  error: string | null
}

const initialState: ShotsState = {
  shots: [],
  isLoading: false,
  error: null
}

export const shotsSlice = createSlice({
  name: "shots",
  initialState,
  reducers: {
    setShots: (state, action: PayloadAction<Shot[]>) => {
      state.shots = action.payload
      state.error = null
    },
    addShot: (state, action: PayloadAction<Shot>) => {
      state.shots.push(action.payload)
    },
    updateShot: (state, action: PayloadAction<Shot>) => {
      const index = state.shots.findIndex(shot => shot.id === action.payload.id)
      if (index !== -1) {
        state.shots[index] = action.payload
      }
    },
    reorderShots: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [shot] = state.shots.splice(fromIndex, 1)
      state.shots.splice(toIndex, 0, shot)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

export const { setShots, addShot, updateShot, reorderShots, setLoading, setError } = shotsSlice.actions

export const selectShots = (state: RootState) => state.shots.shots
export const selectShotsLoading = (state: RootState) => state.shots.isLoading
export const selectShotsError = (state: RootState) => state.shots.error

export default shotsSlice.reducer 
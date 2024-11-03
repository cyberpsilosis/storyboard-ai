import React from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { updateCh1, updateCh2, selectCh1, selectCh2 } from '@/features/input/inputSlice'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PresetSelector } from '@/components/PresetSelector'

export const CharacterInputs: React.FC = () => {
  const dispatch = useAppDispatch()
  const ch1 = useAppSelector(selectCh1)
  const ch2 = useAppSelector(selectCh2)

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="character1">Character 1</Label>
          <PresetSelector characterNumber="ch1" />
        </div>
        <Textarea
          id="character1"
          placeholder="Describe your first character..."
          value={ch1}
          onChange={(e) => dispatch(updateCh1(e.target.value))}
          className="min-h-[100px]"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="character2">Character 2</Label>
          <PresetSelector characterNumber="ch2" />
        </div>
        <Textarea
          id="character2"
          placeholder="Describe your second character..."
          value={ch2}
          onChange={(e) => dispatch(updateCh2(e.target.value))}
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
} 
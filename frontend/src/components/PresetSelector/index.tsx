import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { useAppDispatch } from "@/hooks/redux-hooks"
import { updateCh1, updateCh2 } from "@/features/input/inputSlice"

interface CharacterPreset {
  name: string
  description: string
}

const CHARACTER_PRESETS: { [key: string]: CharacterPreset[] } = {
  ch1: [
    {
      name: "Detective",
      description: "A sharp-witted private investigator with a troubled past and a keen eye for detail.",
    },
    {
      name: "Scientist",
      description: "A brilliant but eccentric researcher pushing the boundaries of conventional science.",
    },
    {
      name: "Artist",
      description: "A passionate creative soul struggling to find recognition in a commercial world.",
    },
  ],
  ch2: [
    {
      name: "Journalist",
      description: "An ambitious reporter willing to risk everything for the truth.",
    },
    {
      name: "Engineer",
      description: "A practical problem-solver with an innovative approach to challenges.",
    },
    {
      name: "Teacher",
      description: "A dedicated educator fighting to make a difference in their students' lives.",
    },
  ],
}

interface PresetSelectorProps {
  characterNumber: 'ch1' | 'ch2'
}

export function PresetSelector({ characterNumber }: PresetSelectorProps) {
  const dispatch = useAppDispatch()
  const updateFunction = characterNumber === 'ch1' ? updateCh1 : updateCh2
  const presets = CHARACTER_PRESETS[characterNumber]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Icons.add className="mr-2 h-4 w-4" />
          Load Preset
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {presets.map((preset) => (
          <DropdownMenuItem
            key={preset.name}
            onClick={() => dispatch(updateFunction(preset.description))}
          >
            <div className="flex flex-col">
              <span className="font-medium">{preset.name}</span>
              <span className="text-xs text-muted-foreground">
                {preset.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
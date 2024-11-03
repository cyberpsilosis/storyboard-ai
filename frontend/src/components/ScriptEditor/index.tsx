import React from 'react'
import Editor from '@monaco-editor/react'
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { updatePlot, selectPlot, selectCh1, selectCh2 } from '@/features/input/inputSlice'
import { setLoading, setError } from '@/features/shots/shotsSlice'
import { initialize, StoryboardStateInferface } from '@/features/storyboard/storyboardSlice'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import { api } from '@/lib/api'

interface ScriptEditorProps {
  initialContent?: string
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  initialContent = '',
}) => {
  const dispatch = useAppDispatch()
  const plotContent = useAppSelector(selectPlot)
  const ch1 = useAppSelector(selectCh1)
  const ch2 = useAppSelector(selectCh2)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(updatePlot(value))
    }
  }

  const handleReset = () => {
    dispatch(updatePlot(''))
    toast({
      title: "Script Reset",
      description: "Your script has been cleared.",
    })
  }

  const handleGenerateStoryboard = async () => {
    if (!plotContent) return
    
    setIsGenerating(true)
    dispatch(setLoading(true))
    
    try {
      const data: StoryboardStateInferface = await api.generateStoryboard({
        plot: plotContent,
        ch1,
        ch2
      })

      dispatch(initialize(data))
      toast({
        title: "Storyboard Generated",
        description: "Successfully generated your storyboard.",
      })
    } catch (error) {
      console.error('Error generating storyboard:', error)
      dispatch(setError(error instanceof Error ? error.message : 'Failed to generate storyboard'))
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate storyboard',
      })
    } finally {
      setIsGenerating(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={plotContent || initialContent}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={isGenerating || !plotContent}
        >
          Reset
        </Button>
        <Button
          onClick={handleGenerateStoryboard}
          disabled={isGenerating || !plotContent}
        >
          {isGenerating ? (
            <>
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Icons.submit className="mr-2 h-4 w-4" />
              Generate Storyboard
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 
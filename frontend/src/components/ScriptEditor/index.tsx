import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { updatePlot, selectPlot, selectCh1, selectCh2 } from '@/features/input/inputSlice'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import { generateScript } from '@/lib/perplexity'

export const ScriptEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const plotContent = useAppSelector(selectPlot)
  const ch1 = useAppSelector(selectCh1)
  const ch2 = useAppSelector(selectCh2)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(updatePlot(value))
    }
  }

  const handleGenerateScript = async () => {
    if (!ch1 || !ch2) {
      toast({
        title: "Missing Characters",
        description: "Please define both characters before generating a script.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const prompt = `Create a script for a story with two main characters:
        Character 1: ${ch1}
        Character 2: ${ch2}
        
        The script should include:
        - A compelling narrative arc
        - Natural dialogue between the characters
        - Clear scene descriptions
        - Emotional depth and character development
        
        Format the output as a proper screenplay.`;

      const script = await generateScript(prompt)
      dispatch(updatePlot(script))
      
      toast({
        title: "Script Generated",
        description: "Your script has been generated successfully."
      })
    } catch (error) {
      console.error('Script generation error:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate script. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={plotContent || ''}
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
          onClick={() => dispatch(updatePlot(''))}
          disabled={isGenerating || !plotContent}
        >
          Reset
        </Button>
        <Button
          onClick={handleGenerateScript}
          disabled={isGenerating || !ch1 || !ch2}
        >
          {isGenerating ? (
            <>
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
              Generating Script...
            </>
          ) : (
            <>
              <Icons.submit className="mr-2 h-4 w-4" />
              Generate Script
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 
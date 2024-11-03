import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { updatePlot, selectPlot, selectCh1, selectCh2 } from '@/features/input/inputSlice'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import { generateScript } from '@/lib/perplexity'
import { Input } from "@/components/ui/input"

export const ScriptEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const plotContent = useAppSelector(selectPlot)
  const ch1 = useAppSelector(selectCh1)
  const ch2 = useAppSelector(selectCh2)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const { toast } = useToast()

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(updatePlot(value))
    }
  }

  const handleGenerateScript = () => {
    console.log('Generate button clicked', { prompt, ch1, ch2 });
    if (!ch1 || !ch2) {
      toast({
        title: "Missing Characters",
        description: "Please define both characters before generating a script.",
        variant: "destructive"
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a story prompt before generating.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    // For now, just log that we would generate a script
    console.log('Would generate script with:', {
      prompt,
      ch1,
      ch2
    });
    
    // Mock successful generation
    setTimeout(() => {
      dispatch(updatePlot('Generated script would appear here...'))
      setIsGenerating(false)
      toast({
        title: "Script Generated",
        description: "Your script has been generated successfully."
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Enter your story prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow font-mono"
          disabled={isGenerating}
        />
        <Button
          type="button"
          onClick={handleGenerateScript}
          disabled={isGenerating || !ch1 || !ch2 || !prompt.trim()}
          className="whitespace-nowrap"
        >
          {isGenerating ? (
            <>
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Icons.submit className="mr-2 h-4 w-4" />
              Generate Script
            </>
          )}
        </Button>
      </div>
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
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => dispatch(updatePlot(''))}
          disabled={isGenerating || !plotContent}
        >
          Reset
        </Button>
      </div>
    </div>
  )
} 
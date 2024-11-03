import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { updatePlot, updateCh1, updateCh2, selectPlot } from '@/features/input/inputSlice'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import { generateScript } from '@/lib/perplexity'
import { Input } from "@/components/ui/input"

export const ScriptEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const plotContent = useAppSelector(selectPlot)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const { toast } = useToast()

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(updatePlot(value))
    }
  }

  const generateCharacters = async (prompt: string) => {
    const characterPrompt = `Based on this story prompt: "${prompt}"
    Create two main characters that would make this story interesting.
    For each character, provide:
    - A brief but vivid description
    - Their role in the story
    - Key personality traits
    
    Format as JSON with character1 and character2 fields.
    Example format:
    {
      "character1": "A retired detective with a photographic memory...",
      "character2": "A tech-savvy street artist with a mysterious past..."
    }`;

    const charactersResponse = await generateScript(characterPrompt);
    try {
      const characters = JSON.parse(charactersResponse);
      dispatch(updateCh1(characters.character1));
      dispatch(updateCh2(characters.character2));
      return characters;
    } catch (error) {
      console.error('Failed to parse characters:', error);
      throw new Error('Failed to generate characters');
    }
  }

  const handleGenerateScript = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a story prompt before generating.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    try {
      // First generate characters
      toast({
        title: "Generating Characters",
        description: "Creating characters for your story..."
      })

      const characters = await generateCharacters(prompt);

      // Then generate the script
      toast({
        title: "Generating Script",
        description: "Creating your script with the generated characters..."
      })

      const scriptPrompt = `Create a script for a story with the following elements:
        
        Story Prompt: ${prompt}

        Characters:
        Character 1: ${characters.character1}
        Character 2: ${characters.character2}
        
        The script should include:
        - A compelling narrative arc based on the prompt
        - Natural dialogue between the characters
        - Clear scene descriptions
        - Emotional depth and character development
        
        Format the output as a proper screenplay.`;

      const script = await generateScript(scriptPrompt)
      dispatch(updatePlot(script))
      
      toast({
        title: "Generation Complete",
        description: "Your script and characters have been generated successfully."
      })
    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
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
          disabled={isGenerating || !prompt.trim()}
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
              Generate Story
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
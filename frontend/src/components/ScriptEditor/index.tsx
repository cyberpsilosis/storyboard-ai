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

  const generateCharacters = async (prompt: string) => {
    const characterPrompt = `Generate two characters for this story prompt: "${prompt}"
    Return ONLY a JSON object with this exact format, no additional text:
    {
      "character1": "description here...",
      "character2": "description here..."
    }`;

    try {
      const charactersResponse = await generateScript(characterPrompt);
      
      // Try to extract JSON if it's wrapped in text
      const jsonMatch = charactersResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : charactersResponse;
      
      try {
        const characters = JSON.parse(jsonStr);
        if (!characters.character1 || !characters.character2) {
          throw new Error('Invalid character format');
        }
        dispatch(updateCh1(characters.character1));
        dispatch(updateCh2(characters.character2));
        return characters;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse character data');
      }
    } catch (error) {
      console.error('Character generation error:', error);
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

      const scriptPrompt = `Create a script for this story:
        
        Story Prompt: ${prompt}

        Characters:
        Character 1: ${characters.character1}
        Character 2: ${characters.character2}
        
        Format as a proper screenplay with scene descriptions and dialogue.
        Include character development and emotional depth.`;

      const script = await generateScript(scriptPrompt)
      dispatch(updatePlot(script))
      
      toast({
        title: "Generation Complete",
        description: "Your script and characters have been generated successfully."
      })
    } catch (error) {
      console.error('Generation error:', error);
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
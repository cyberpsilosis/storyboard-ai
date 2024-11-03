import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { updatePlot, updateCh1, updateCh2, selectPlot, selectCh1, selectCh2 } from '@/features/input/inputSlice'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import { generateScript, generateStoryboardScenes, generateTitle } from '@/lib/perplexity'
import { Input } from "@/components/ui/input"
import { SpeechInput } from '@/components/SpeechInput'
import { Textarea } from "@/components/ui/textarea"
import { generateImage } from '@/lib/fal'
import { Storyboard } from '@/components/Storyboard'
import { storyboardService } from '@/lib/storyboard-service'

export const ScriptEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const plotContent = useAppSelector(selectPlot)
  const ch1Content = useAppSelector(selectCh1)
  const ch2Content = useAppSelector(selectCh2)
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const { toast } = useToast()
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [title, setTitle] = useState('Untitled Storyboard')
  const [saving, setSaving] = useState(false)

  const handleSpeechInput = (transcript: string) => {
    setPrompt(transcript);
    toast({
      title: "Voice Input Received",
      description: transcript,
    });
  };

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
        
        // Update character states with the string descriptions
        dispatch(updateCh1(characters.character1.toString()));
        dispatch(updateCh2(characters.character2.toString()));
        
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
      // First generate title
      toast({
        title: "Generating Title",
        description: "Creating title from prompt..."
      })

      const generatedTitle = await generateTitle(prompt);
      setTitle(generatedTitle);

      // Then generate characters
      toast({
        title: "Generating Characters",
        description: "Creating characters for your story..."
      })

      const characters = await generateCharacters(prompt);

      // Then generate script
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

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      dispatch(updatePlot(value))
    }
  }

  const handleGenerateStoryboard = async () => {
    if (!plotContent) {
      toast({
        title: "Missing Script",
        description: "Please generate a script first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      toast({
        title: "Generating Storyboard",
        description: "Creating scene descriptions..."
      });

      const scenes = await generateStoryboardScenes(plotContent);
      const images: string[] = [];

      for (let i = 0; i < scenes.length; i++) {
        toast({
          title: `Generating Scene ${i + 1}`,
          description: "Creating image..."
        });

        const imageUrl = await generateImage(scenes[i]);
        images.push(imageUrl);
      }

      setGeneratedImages(images);
      
      toast({
        title: "Storyboard Complete",
        description: `Generated ${images.length} scenes.`
      });

    } catch (error) {
      console.error('Storyboard generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate storyboard",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!plotContent || !generatedImages.length) {
      toast({
        title: "Missing Content",
        description: "Please generate a script and storyboard first.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const scenes = generatedImages.map((imageUrl, index) => ({
        description: `Scene ${index + 1}`,
        imageUrl
      }));

      await storyboardService.save({
        title,
        script: plotContent,
        scenes
      });

      toast({
        title: "Saved",
        description: "Your storyboard has been saved successfully."
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save storyboard",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Enter storyboard title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-xs font-medium"
        />
        <Input
          placeholder="Enter your story prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow font-mono"
          disabled={isGenerating}
        />
        <SpeechInput onTranscript={handleSpeechInput} />
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Character 1</label>
          <Textarea
            value={ch1Content || ''}
            readOnly
            className="h-[100px] font-mono text-sm resize-none bg-muted"
            placeholder="Character 1 will appear here after generation..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Character 2</label>
          <Textarea
            value={ch2Content || ''}
            readOnly
            className="h-[100px] font-mono text-sm resize-none bg-muted"
            placeholder="Character 2 will appear here after generation..."
          />
        </div>
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

      <div className="flex justify-between">
        <Button
          onClick={handleGenerateStoryboard}
          disabled={!plotContent || isGenerating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? (
            <>
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
              Generating Storyboard...
            </>
          ) : (
            <>
              <Icons.image className="mr-2 h-4 w-4" />
              Generate Storyboard
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            dispatch(updatePlot(''))
            dispatch(updateCh1(''))
            dispatch(updateCh2(''))
            setPrompt('')
          }}
          disabled={isGenerating || !plotContent}
        >
          Reset All
        </Button>
      </div>

      {generatedImages.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {generatedImages.map((url, index) => (
              <div 
                key={index} 
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setShowStoryboard(true)}
              >
                <img 
                  src={url} 
                  alt={`Scene ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                  Scene {index + 1}
                </div>
              </div>
            ))}
          </div>

          <Storyboard 
            images={generatedImages}
            open={showStoryboard}
            onClose={() => setShowStoryboard(false)}
          />
        </>
      )}

      <div className="flex justify-between">
        <Button
          onClick={handleSave}
          disabled={saving || !plotContent || !generatedImages.length}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <>
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Icons.save className="mr-2 h-4 w-4" />
              Save Storyboard
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useToast } from '@/hooks/use-toast'
import { SpeechInput } from '@/components/SpeechInput'
import { useAppDispatch, useAppSelector } from '@/hooks/use-store'
import { selectPlot, updatePlot } from '@/store/plotSlice'
import { generateScript } from '@/lib/perplexity'
import { generateImage } from '@/lib/together'
import { TerminalPrompt } from '@/components/TerminalPrompt'
import { CustomizationOptions } from '@/types'
import { useSession } from '@/contexts/session-context'

export const ScriptEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const plotContent = useAppSelector(selectPlot);
  const { toast } = useToast();
  const { session } = useSession();

  const handleGenerateScript = async (options?: CustomizationOptions) => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a story prompt before generating.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Use options in the script generation if provided
      const script = await generateScript(session, prompt, options);
      dispatch(updatePlot(script));
      
      toast({
        title: "Generation Complete",
        description: "Your script has been generated successfully."
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptSubmit = () => {
    setIsSubmitted(true);
    setShowTerminal(true);
  };

  const handleCustomizationSubmit = (options: CustomizationOptions) => {
    setShowTerminal(false);
    handleGenerateScript(options);
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(plotContent || '');
      toast({
        title: "Copied",
        description: "Script copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy script",
        variant: "destructive"
      });
    }
  };

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
      const imageUrl = await generateImage(session, plotContent);
      setGeneratedImages([...generatedImages, imageUrl]);
      
      toast({
        title: "Generation Complete",
        description: "Your storyboard has been generated."
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

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-6">
      <div className="flex gap-4 items-start">
        <div className="flex-1 flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt..."
            className={`
              min-h-[100px] max-h-[200px] resize-none flex-1 text-lg
              transition-all duration-300
              ${isSubmitted ? `
                bg-black border-[#66ff66]/30 text-[#66ff66]
                font-mono shadow-[0_0_10px_rgba(102,255,102,0.1)]
                placeholder:text-[#66ff66]/50
              ` : ''}
            `}
            readOnly={isSubmitted}
          />
          <div className="flex flex-col gap-2">
            <SpeechInput 
              onTranscript={setPrompt}
              disabled={isSubmitted}
            />
            <Button 
              onClick={handlePromptSubmit}
              disabled={isGenerating || !prompt.trim() || isSubmitted}
              size="icon"
              className={`
                h-12 w-12 transition-all duration-300
                ${isSubmitted ? 'opacity-0' : ''}
              `}
            >
              {isGenerating ? (
                <Icons.loading className="h-6 w-6 animate-spin" />
              ) : (
                <Icons.submit className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {plotContent && (
        <div className="relative">
          <Textarea
            value={plotContent}
            readOnly
            className="min-h-[400px] max-h-[600px] font-mono text-base resize-none p-6"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              onClick={handleCopyScript} 
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm"
            >
              <Icons.copy className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleGenerateStoryboard}
              disabled={isGenerating}
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm"
            >
              {isGenerating ? (
                <Icons.loading className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.image className="h-4 w-4" />
              )}
            </Button>
            <Button 
              onClick={() => {
                dispatch(updatePlot(''));
                setGeneratedImages([]);
              }}
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm"
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {generatedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {generatedImages.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`Generated scene ${index + 1}`}
              className="w-full rounded-lg shadow-lg"
            />
          ))}
        </div>
      )}

      {showTerminal && (
        <TerminalPrompt
          prompt={prompt}
          onSubmit={(options) => {
            handleCustomizationSubmit(options);
            setIsSubmitted(false);
          }}
          onCancel={() => {
            setShowTerminal(false);
            setIsSubmitted(false);
          }}
        />
      )}
    </div>
  );
};
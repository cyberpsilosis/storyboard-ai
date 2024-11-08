import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { generateCharacterImage } from '@/lib/together'
import { useCredits } from '@/contexts/credits-context'
import { useSession } from '@/contexts/session-context'

interface TerminalPromptProps {
  onSubmit: (options: CustomizationOptions) => void;
  onCancel: () => void;
  prompt: string;
}

interface CustomizationOptions {
  genre: string;
  tone: string;
  length: string;
}

interface Character {
  name: string;
  description: string;
  imageUrl?: string;
}

const CHARACTER_DESCRIPTORS = {
  PROTAGONIST: [
    "Central figure in",
    "Key player within",
    "Primary character of",
    "Leading force in",
    "Main presence throughout"
  ],
  SUPPORTING: [
    "Integral support in",
    "Critical ally within",
    "Key secondary figure in",
    "Essential companion through",
    "Vital presence in"
  ]
};

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({ onSubmit, onCancel, prompt }) => {
  const [showScriptTerminal, setShowScriptTerminal] = useState(false);
  const [currentScriptLine, setCurrentScriptLine] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const scriptRef = useRef<string[]>([]);
  const [currentOptions] = useState<CustomizationOptions>({
    genre: 'SCI-FI',
    tone: 'MYSTERIOUS',
    length: 'MEDIUM'
  });
  const { refreshCredits } = useCredits();
  const { session } = useSession();

  const typewriterEffect = async (text: string) => {
    const lines = text.split('\n');
    scriptRef.current = lines;
    
    for (let i = 0; i < lines.length; i++) {
      setCurrentScriptLine(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  const handleGenerateScript = async () => {
    try {
      const characterData = [
        {
          name: "Character 1",
          description: `${getRandomElement(CHARACTER_DESCRIPTORS.PROTAGONIST)} ${prompt}, embodying ${currentOptions.genre.toLowerCase()} elements with a ${currentOptions.tone.toLowerCase()} disposition`,
        },
        {
          name: "Character 2",
          description: `${getRandomElement(CHARACTER_DESCRIPTORS.SUPPORTING)} ${prompt}, embodying ${currentOptions.genre.toLowerCase()} elements with a ${currentOptions.tone.toLowerCase()} disposition`,
        }
      ];

      const charactersWithImages = await Promise.all(
        characterData.map(async (char) => {
          const imageUrl = await handleGenerateCharacter(char);
          return { ...char, imageUrl };
        })
      );

      setCharacters(charactersWithImages);
      
      setShowScriptTerminal(true);
      await typewriterEffect(`
> INITIALIZING SCRIPT GENERATION...
> ANALYZING PROMPT: "${prompt}"
> APPLYING PARAMETERS:
  - GENRE: ${currentOptions.genre}
  - TONE: ${currentOptions.tone}
  - LENGTH: ${currentOptions.length}
> GENERATING CONTENT...

[Generated script content will appear here line by line]
      `);

      await refreshCredits();
      onSubmit(currentOptions);
    } catch (error) {
      console.error('Error in script generation:', error);
    }
  };

  const handleGenerateCharacter = async (char: any) => {
    try {
      const imageUrl = await generateCharacterImage(session, char.description);
      return { ...char, imageUrl };
    } catch (error) {
      console.error('Error generating character image:', error);
      return char;
    }
  };

  return (
    <div className="grid grid-cols-[1fr,auto] gap-4 mt-4">
      {/* Script Terminal */}
      {showScriptTerminal && (
        <div className="animate-glitch-in w-full bg-black border border-[#66ff66]/30 rounded-lg shadow-2xl overflow-hidden dark:bg-[#0a0a0a]">
          <div className="bg-[#66ff66]/10 px-4 py-2 flex justify-between items-center border-b border-[#66ff66]/30 dark:bg-[#66ff66]/5">
            <div className="text-[#66ff66] font-mono text-sm">SCRIPT GENERATION v1.0</div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
          </div>
          
          <div className="p-4 font-mono text-[#66ff66] space-y-1 h-[600px] overflow-auto">
            {scriptRef.current.slice(0, currentScriptLine + 1).map((line, index) => (
              <div key={index} className="flex">
                <span className="text-[#66ff66]/50 mr-2">{'>>'}</span>
                <span className={index === currentScriptLine ? 'animate-typing' : ''}>
                  {line}
                </span>
              </div>
            ))}
            <div className="animate-pulse">_</div>
          </div>
        </div>
      )}

      {/* Character Cards Terminal */}
      <div className="w-80 bg-black border border-[#66ff66]/30 rounded-lg shadow-2xl overflow-hidden dark:bg-[#0a0a0a]">
        <div className="bg-[#66ff66]/10 px-4 py-2 flex justify-between items-center border-b border-[#66ff66]/30 dark:bg-[#66ff66]/5">
          <div className="text-[#66ff66] font-mono text-sm">CHARACTER PROFILES</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-[#66ff66]/50 hover:text-[#66ff66] hover:bg-[#66ff66]/10"
          >
            <Icons.close className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          {characters.map((char, index) => (
            <div key={index} className="border border-[#66ff66]/30 rounded-lg p-3 space-y-3 dark:border-[#66ff66]/20">
              {char.imageUrl ? (
                <img 
                  src={char.imageUrl} 
                  alt={char.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-48 bg-[#66ff66]/5 rounded-md flex items-center justify-center">
                  <Icons.loading className="w-8 h-8 animate-spin text-[#66ff66]/30" />
                </div>
              )}
              <div className="space-y-1">
                <div className="text-[#66ff66] font-bold">{char.name}</div>
                <div className="text-[#66ff66]/70 text-sm">{char.description}</div>
              </div>
            </div>
          ))}
          
          {!showScriptTerminal && (
            <Button
              onClick={handleGenerateScript}
              className="w-full bg-[#66ff66]/20 text-[#66ff66] hover:bg-[#66ff66]/30 dark:bg-[#66ff66]/10 dark:hover:bg-[#66ff66]/20"
            >
              <Icons.submit className="mr-2 h-4 w-4" />
              GENERATE SCRIPT
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 
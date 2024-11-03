import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SpeechInputProps {
  onTranscript: (text: string) => void;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        onTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={startListening}
      className={`transition-all duration-300 ${
        isListening 
          ? 'bg-red-100 dark:bg-red-900 ring-2 ring-red-500' 
          : 'hover:bg-red-50 dark:hover:bg-red-900/50'
      }`}
    >
      <Icons.mic className={`h-4 w-4 transition-colors duration-300 ${
        isListening ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
      }`} />
    </Button>
  );
}; 
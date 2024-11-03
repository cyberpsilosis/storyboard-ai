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
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
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
      className={`transition-all duration-200 ${
        isListening 
          ? 'bg-red-100 dark:bg-red-900 animate-pulse ring-2 ring-red-500' 
          : ''
      }`}
    >
      <Icons.mic className={`h-4 w-4 ${
        isListening ? 'text-red-500' : ''
      }`} />
    </Button>
  );
}; 
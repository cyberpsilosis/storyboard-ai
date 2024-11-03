import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SpeechInputProps {
  onTranscript: (text: string) => void;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if ('webkitSpeechRecognition' in window) {
      // Start new recognition instance
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;
        onTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Only set listening to false if we meant to stop
        if (recognitionRef.current === null) {
          setIsListening(false);
        } else {
          // Restart if we didn't mean to stop
          recognition.start();
        }
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
      onClick={toggleListening}
      className={`transition-all duration-300 ${
        isListening 
          ? 'bg-red-100 dark:bg-red-900 ring-2 ring-red-500 animate-pulse' 
          : 'hover:bg-red-50 dark:hover:bg-red-900/50'
      }`}
      aria-pressed={isListening}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      <Icons.mic className={`h-4 w-4 transition-colors duration-300 ${
        isListening ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
      }`} />
    </Button>
  );
}; 
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

interface SpeechInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      toast({
        title: "Stopped Listening",
        description: "Speech recognition turned off"
      });
      return;
    }

    if ('webkitSpeechRecognition' in window) {
      try {
        recognitionRef.current = new (window as any).webkitSpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          toast({
            title: "Listening",
            description: "Speak your story prompt..."
          });
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
          stopListening();
          
          let errorMessage = "Failed to start speech recognition";
          switch (event.error) {
            case 'network':
              errorMessage = "Network error occurred. Check your connection.";
              break;
            case 'not-allowed':
              errorMessage = "Microphone access denied. Please allow microphone access.";
              break;
            case 'no-speech':
              errorMessage = "No speech detected. Please try again.";
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive"
          });
        };

        recognition.onend = () => {
          // Only restart if we're still supposed to be listening
          if (recognitionRef.current && isListening) {
            recognition.start();
          } else {
            stopListening();
          }
        };

        recognition.start();
      } catch (error) {
        console.error('Speech recognition setup error:', error);
        stopListening();
        toast({
          title: "Error",
          description: "Failed to initialize speech recognition",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive"
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

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
      disabled={disabled}
    >
      <Icons.mic className={`h-4 w-4 transition-colors duration-300 ${
        isListening ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
      }`} />
    </Button>
  );
}; 
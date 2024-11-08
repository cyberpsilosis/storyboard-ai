import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"

interface UsageResponse {
  total_credits: number;
  used_credits: number;
}

export const TokenUsage: React.FC = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchCredits = async () => {
    try {
      const response = await fetch('https://api.together.xyz/v1/usage', {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data: UsageResponse = await response.json();
      const remainingCredits = data.total_credits - data.used_credits;
      setCredits(remainingCredits);
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast({
        title: "Error",
        description: "Failed to fetch token usage",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCredits();
    // Refresh every 5 minutes
    const interval = setInterval(fetchCredits, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (credits === null) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span>Credits: ${(credits / 100).toFixed(2)}</span>
      </div>
    </div>
  );
}; 
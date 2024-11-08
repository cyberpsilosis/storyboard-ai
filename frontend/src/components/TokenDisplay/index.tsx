import React, { useState, useEffect } from 'react'

interface UsageResponse {
  total_credits: number;
  used_credits: number;
}

interface TokenDisplayProps {
  onUpdate?: (credits: number) => void;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ onUpdate }) => {
  const [credits, setCredits] = useState<number | null>(null);

  const handleFetchCredits = async () => {
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
      onUpdate?.(remainingCredits);
      return remainingCredits;
    } catch (error) {
      console.error('Error fetching credits:', error);
      return null;
    }
  };

  // Fetch credits on mount and every 5 minutes
  useEffect(() => {
    handleFetchCredits();
    const interval = setInterval(handleFetchCredits, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-black border border-green-500 rounded-md font-mono text-sm">
      <span className="text-green-500">$</span>
      <span className="text-green-500">
        {credits !== null ? (credits / 100).toFixed(2) : '-.--'}
      </span>
    </div>
  );
}; 
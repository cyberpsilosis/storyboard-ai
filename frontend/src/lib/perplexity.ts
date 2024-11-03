const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
}

export const generateScript = async (prompt: string): Promise<string> => {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key not configured');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a creative script writer and character designer."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Perplexity API error:', {
        status: response.status,
        error: errorData
      });
      throw new Error(`API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Script generation error:', error);
    throw error;
  }
} 
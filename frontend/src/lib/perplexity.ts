const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityResponse {
  choices: {
    text: string;
    index: number;
    finish_reason: string;
  }[];
}

export const generateScript = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "pplx-7b-chat",
        messages: [{
          role: "system",
          content: "You are a creative script writer. Generate engaging and detailed scripts based on the given prompt."
        }, {
          role: "user",
          content: prompt
        }],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0].text;
  } catch (error) {
    console.error('Script generation error:', error);
    throw error;
  }
} 
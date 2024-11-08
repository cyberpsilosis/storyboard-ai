const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }[];
}

import { CustomizationOptions } from '@/types'

// Token counting based on Llama tokenization rules
function countTokens(text: string): number {
  // Llama uses byte-pair encoding (BPE) similar to GPT models
  // Average English text has about 1.3 tokens per word
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  
  // Count special characters (they often become separate tokens)
  const specialChars = text.match(/[.,!?;:'"()\[\]{}|\\/<>-]/g)?.length || 0;
  
  // Count numbers (they often split into multiple tokens)
  const numbers = text.match(/\d+/g)?.join('').length || 0;
  const numberTokens = Math.ceil(numbers / 2); // Numbers typically split into 2-digit tokens
  
  // Count uppercase letters (potential subword boundaries)
  const upperCase = text.match(/[A-Z]/g)?.length || 0;
  
  // Base token count from words
  let tokenCount = Math.ceil(wordCount * 1.3);
  
  // Add special characters (most become individual tokens)
  tokenCount += specialChars;
  
  // Add number tokens
  tokenCount += numberTokens;
  
  // Add potential subword splits from uppercase letters
  tokenCount += Math.ceil(upperCase * 0.3); // Assume 30% of uppercase letters cause splits
  
  // Add overhead for special tokens
  tokenCount += 2; // For start and end tokens
  
  return tokenCount;
}

export const generateScript = async (session: any, prompt: string, options?: CustomizationOptions): Promise<string> => {
  const model = "sonar-huge-online";
  
  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key not configured');
  }

  try {
    console.log('Making request with prompt:', prompt);

    // Add options to the prompt if provided
    let enhancedPrompt = prompt;
    if (options) {
      enhancedPrompt += `\n\nStyle: ${options.genre}, Tone: ${options.tone}, Length: ${options.length}`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-huge-128k-online",
        messages: [
          {
            role: "system",
            content: "You are a creative script writer and character designer."
          },
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 0.9,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Full API error response:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Parsed error:', errorJson);
      } catch (e) {
        console.error('Raw error text:', errorText);
      }
      
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data: PerplexityResponse = await response.json();
    console.log('API response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    // Deduct credits after successful generation
    await deductTextCredits(session, model, enhancedPrompt, data.choices[0].message.content);

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Script generation error:', error);
    throw error;
  }
}

export const generateStoryboardScenes = async (session: any, script: string): Promise<string[]> => {
  const model = "sonar-huge-online";
  const scenePrompt = `Analyze this script and create 5 key scene descriptions for image generation.
    Each scene should be a vivid, detailed description that captures a crucial moment.
    Format each scene as a single paragraph, separated by ||| delimiters.
    Focus on visual elements, setting, character positions, and mood.
    Script:
    ${script}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-huge-128k-online",
        messages: [
          {
            role: "system",
            content: "You are a visual scene director. Create detailed, vivid scene descriptions for image generation."
          },
          {
            role: "user",
            content: scenePrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    const scenes = data.choices[0].message.content.split('|||').map(scene => scene.trim());

    // Deduct credits after successful generation
    await deductTextCredits(session, model, scenePrompt, data.choices[0].message.content);

    return scenes;
  } catch (error) {
    console.error('Scene generation error:', error);
    throw error;
  }
}

const deductTextCredits = async (session: any, model: string, inputText: string, outputText: string): Promise<number> => {
  try {
    const inputTokens = countTokens(inputText);
    const outputTokens = countTokens(outputText);

    const response = await fetch('http://localhost:3001/api/credits/deduct/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        inputTokens,
        outputTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to deduct credits');
    }

    const data = await response.json();
    return data.remaining;
  } catch (error) {
    console.error('Error deducting text credits:', error);
    throw error;
  }
};

export const generateTitle = async (session: any, prompt: string): Promise<string> => {
  const model = "sonar-small-online";
  try {
    const titlePrompt = `Create a short, creative title for this story prompt. Return ONLY the title, no quotes or extra text:
    "${prompt}"`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a creative title generator. Create short, engaging titles."
          },
          {
            role: "user",
            content: titlePrompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const title = data.choices[0].message.content.trim();

    // Deduct credits after successful generation
    await deductTextCredits(session, model, titlePrompt, title);

    return title;
  } catch (error) {
    console.error('Title generation error:', error);
    throw error;
  }
};

export const fetchPerplexityCredits = async (session: any): Promise<number> => {
  try {
    const response = await fetch('http://localhost:3001/api/credits/perplexity', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.credits || 0;
  } catch (error) {
    console.error('Error fetching Perplexity credits:', error);
    throw error;
  }
}; 
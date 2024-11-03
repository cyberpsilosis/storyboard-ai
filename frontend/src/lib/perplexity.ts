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

export const generateScript = async (prompt: string): Promise<string> => {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key not configured');
  }

  try {
    console.log('Making request with prompt:', prompt);

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
            content: prompt
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

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Script generation error:', error);
    throw error;
  }
}

export const generateStoryboardScenes = async (script: string): Promise<string[]> => {
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
    return scenes;
  } catch (error) {
    console.error('Scene generation error:', error);
    throw error;
  }
}

export const generateTitle = async (prompt: string): Promise<string> => {
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
        model: "llama-3.1-sonar-huge-128k-online",
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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Title generation error:', error);
    throw error;
  }
}; 
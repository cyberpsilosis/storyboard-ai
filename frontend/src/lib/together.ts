const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;

interface GenerationResponse {
  status: string;
  output: Array<{
    image: string;
  }>;
}

export const generateImage = async (prompt: string): Promise<string> => {
  if (!TOGETHER_API_KEY) {
    console.error('Together API key missing:', import.meta.env);
    throw new Error('Together API key not configured');
  }

  try {
    console.log('Generating image with prompt:', prompt);

    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt,
        n: 1,
        steps: 12,
        width: 1024,
        height: 768
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Together API error:', error);
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data: GenerationResponse = await response.json();
    console.log('Together API response:', data);

    if (!data.output?.[0]?.image) {
      console.error('Invalid response format:', data);
      throw new Error('No image generated');
    }

    // The image is already a base64 string
    return data.output[0].image;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
} 
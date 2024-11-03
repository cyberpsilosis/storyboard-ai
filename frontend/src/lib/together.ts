const TOGETHER_API_KEY = import.meta.env.EXT_PUBLIC_TOGETHER_API_KEY;

interface GenerationResponse {
  images: string[];
}

export const generateImage = async (prompt: string): Promise<string> => {
  if (!TOGETHER_API_KEY) {
    throw new Error('Together API key not configured');
  }

  try {
    console.log('Generating image with prompt:', prompt);

    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        prompt: prompt,
        negative_prompt: "text, watermark, logo, blurry, distorted, low quality",
        num_inference_steps: 30,
        width: 1024,
        height: 768,
        guidance_scale: 7.5,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Together API error:', error);
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data: GenerationResponse = await response.json();
    console.log('Together API response:', data);

    if (!data.images?.[0]) {
      throw new Error('No image generated');
    }

    return data.images[0];
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
} 
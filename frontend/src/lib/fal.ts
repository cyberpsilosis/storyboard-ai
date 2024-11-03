const FAL_KEY = import.meta.env.VITE_FAL_KEY;

interface GenerationResponse {
  images: string[];
}

export const generateImage = async (prompt: string): Promise<string> => {
  if (!FAL_KEY) {
    throw new Error('FAL API key not configured');
  }

  try {
    console.log('Generating image with prompt:', prompt);

    const response = await fetch('https://110602490-fast-sd-xl.fal.run/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: "text, watermark, logo, blurry, distorted, low quality",
        num_inference_steps: 30,
        safety_checker: false,
        width: 1024,
        height: 768,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('FAL API error:', error);
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data: GenerationResponse = await response.json();
    console.log('FAL API response:', data);

    if (!data.images?.[0]) {
      throw new Error('No image generated');
    }

    return data.images[0];
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
} 
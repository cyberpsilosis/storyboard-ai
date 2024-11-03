const FAL_KEY = import.meta.env.NEXT_PUBLIC_FAL_KEY;

interface GenerationResponse {
  images: string[];
}

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://110602490-fast-sd-xl.fal.run', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: "text, watermark, logo, blurry, distorted, low quality",
        num_inference_steps: 30,
        guidance_scale: 7.5,
        width: 1024,
        height: 768,
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: GenerationResponse = await response.json();
    return data.images[0];
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
} 
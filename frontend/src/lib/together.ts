const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;

interface GenerationResponse {
  id: string;
  model: string;
  object: string;
  data: Array<{
    b64_json?: string;
    url?: string;
  }>;
}

const createCinematicPrompt = (sceneDescription: string): string => {
  return `Cinematic storyboard frame, professional film production quality:
  ${sceneDescription}
  
  Technical details: Shot on Arri Alexa, anamorphic lens, natural lighting with subtle lens flares,
  35mm film grain, shallow depth of field, professional color grading, 2.39:1 aspect ratio.
  
  Style reference: Similar to films by Roger Deakins, Emmanuel Lubezki, and Bradford Young.
  Photorealistic, high production value, subtle film imperfections, natural lens distortion,
  professional composition following rule of thirds and golden ratio.
  
  Additional details: Subtle film grain, authentic lens characteristics, natural chromatic aberration,
  realistic lighting and shadows, cinematic color palette, professional depth staging.`.trim();
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!TOGETHER_API_KEY) {
    console.error('Together API key missing:', import.meta.env);
    throw new Error('Together API key not configured');
  }

  try {
    const cinematicPrompt = createCinematicPrompt(prompt);
    console.log('Generating image with cinematic prompt:', cinematicPrompt);

    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: cinematicPrompt,
        negative_prompt: "cartoon, animation, illustration, drawing, painting, sketch, anime, manga, 3D render, digital art, watermark, text, blurry, deformed, low quality, unrealistic lighting",
        n: 1,
        steps: 12,
        width: 1024,
        height: 432,  // Changed to match 2.39:1 cinematic aspect ratio
        cfg_scale: 8.0,  // Increased for more prompt adherence
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Together API error:', error);
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data: GenerationResponse = await response.json();
    console.log('Together API response:', data);

    if (!data.data?.[0]?.b64_json && !data.data?.[0]?.url) {
      console.error('Invalid response format:', data);
      throw new Error('No image generated');
    }

    if (data.data[0].b64_json) {
      return `data:image/png;base64,${data.data[0].b64_json}`;
    } else if (data.data[0].url) {
      return data.data[0].url;
    }

    throw new Error('No valid image data found');
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
} 
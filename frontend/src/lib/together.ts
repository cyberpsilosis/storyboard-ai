const TOGETHER_API_KEY = import.meta.env.EXT_PUBLIC_TOGETHER_API_KEY;

interface GenerationResponse {
  output: {
    choices: [{
      image: string;
    }];
  };
}

export const generateImage = async (prompt: string): Promise<string> => {
  if (!TOGETHER_API_KEY) {
    throw new Error('Together API key not configured');
  }

  try {
    console.log('Generating image with prompt:', prompt);

    const response = await fetch('https://api.together.xyz/v1/image/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt,
        negative_prompt: "text, watermark, logo, blurry, distorted, low quality, bad anatomy, bad proportions",
        n: 1,
        steps: 25,
        width: 1024,
        height: 768,
        seed: Math.floor(Math.random() * 1000000),
        guidance_scale: 7.0,
        scheduler: "dpm++_2m_karras"
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Together API error:', error);
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data: GenerationResponse = await response.json();
    console.log('Together API response:', data);

    if (!data.output?.choices?.[0]?.image) {
      throw new Error('No image generated');
    }

    return data.output.choices[0].image;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
} 
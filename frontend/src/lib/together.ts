export const fetchCredits = async (session: any): Promise<{ text: number; image: number }> => {
  try {
    const response = await fetch('http://localhost:3001/api/credits/together', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return {
      text: data.text_credits || 0,
      image: data.image_credits || 0
    };
  } catch (error) {
    console.error('Error fetching credits:', error);
    throw error;
  }
};

export const deductImageCredits = async (session: any, count: number = 1): Promise<number> => {
  try {
    const response = await fetch('http://localhost:3001/api/credits/deduct/image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ count })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to deduct credits');
    }

    const data = await response.json();
    return data.remaining;
  } catch (error) {
    console.error('Error deducting image credits:', error);
    throw error;
  }
};

export const generateCharacterImage = async (session: any, description: string): Promise<string> => {
  // First deduct credits
  await deductImageCredits(session);

  // Then generate image - square format for character portraits
  try {
    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: `Portrait of ${description}, highly detailed, cinematic lighting, professional photography, 4k, realistic`,
        n: 1,
        width: 1024,
        height: 1024,  // Square format for character portraits
        negative_prompt: "blurry, low quality, distorted, deformed, ugly, bad anatomy",
        num_inference_steps: 20,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};

export const generateStoryboardImage = async (session: any, description: string): Promise<string> => {
  // First deduct credits
  await deductImageCredits(session);

  // Then generate image - cinematic aspect ratio for storyboards
  try {
    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: `${description}, cinematic composition, film scene, movie storyboard style, highly detailed, dramatic lighting, 4k`,
        n: 1,
        width: 1792,    // 16:9 aspect ratio (1792x1024)
        height: 1024,   // Standard cinematic ratio
        negative_prompt: "blurry, low quality, distorted, deformed, ugly, bad anatomy",
        num_inference_steps: 20,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};

// For backwards compatibility
export const generateImage = generateStoryboardImage;
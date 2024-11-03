import Together from "together-ai";

const together = new Together({ 
  apiKey: import.meta.env.EXT_PUBLIC_TOGETHER_API_KEY 
});

export const generateImage = async (prompt: string): Promise<string> => {
  if (!import.meta.env.EXT_PUBLIC_TOGETHER_API_KEY) {
    throw new Error('Together API key not configured');
  }

  try {
    console.log('Generating image with prompt:', prompt);

    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell",
      prompt,
      n: 1,
      steps: 25,
      width: 1024,
      height: 768
    });

    console.log('Together API response:', response);

    if (!response.data?.[0]?.b64_json) {
      throw new Error('No image generated');
    }

    return `data:image/png;base64,${response.data[0].b64_json}`;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
} 
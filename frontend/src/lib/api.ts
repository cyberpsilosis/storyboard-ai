const API_URL = import.meta.env.VITE_API_URL

interface GenerateStoryboardRequest {
  plot: string
  ch1: string
  ch2: string
}

export const api = {
  generateStoryboard: async (data: GenerateStoryboardRequest) => {
    const response = await fetch(`${API_URL}/book/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to generate storyboard')
    }

    return response.json()
  }
} 
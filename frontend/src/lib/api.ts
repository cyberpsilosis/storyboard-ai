interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchTogetherApi<T>(): Promise<ApiResponse<T>> {
  try {
    const mockCredits = 1000; // Mock credit amount for development
    
    // Return mock data for now
    return {
      data: {
        credits: mockCredits
      } as T
    };
    
    // TODO: Implement real API call when CORS is resolved
    /*
    const response = await fetch(`https://api.together.xyz/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { data };
    */
  } catch (error) {
    console.error('API error:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 
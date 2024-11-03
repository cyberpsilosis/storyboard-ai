import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const TOGETHER_API_URL = 'https://api.together.xyz/v1'
const API_KEY = process.env.TOGETHER_API_KEY

if (!API_KEY) {
  throw new Error('Together AI API key is not configured')
}

export const generateStoryboard = async (prompt: string) => {
  try {
    const response = await axios.post(
      `${TOGETHER_API_URL}/completions`,
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `Create a detailed storyboard from the following script:\n\n${prompt}`,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data.choices[0].text
  } catch (error) {
    console.error('Error generating storyboard:', error)
    throw new Error('Failed to generate storyboard')
  }
} 
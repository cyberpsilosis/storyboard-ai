import express from 'express';

const router = express.Router();

router.get('/credits', async (_req, res) => {
  try {
    const response = await fetch('https://api.together.xyz/v1/billing/credits', {
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Together credits:', error);
    res.status(500).json({ error: 'Failed to fetch Together credits' });
  }
});

export default router; 
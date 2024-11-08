import express, { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to verify authentication
const requireAuth = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void | Response> => {
  try {
    console.log('Auth middleware - headers:', JSON.stringify(req.headers, null, 2));
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('No authorization header');
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token.slice(0, 20) + '...');
    
    // Initialize Supabase client for auth check
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(401).json({ error: 'Invalid token', details: error });
    }
    
    if (!user) {
      console.log('No user found for token');
      return res.status(401).json({ error: 'No user found' });
    }
    
    console.log('Auth successful for user:', user.id);
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Authentication failed', details: err });
  }
};

// Get credits from Supabase database
async function getUserCredits(userId: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      // Create initial credits record with your current amounts
      const { data: newData, error: insertError } = await supabase
        .from('user_credits')
        .insert([
          { 
            user_id: userId,
            text_credits: 448,  // $4.48 stored in cents
            image_credits: 592  // $5.92 stored in cents
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }
    throw error;
  }

  return data;
}

// Update costs based on Perplexity and Together/Flux pricing
const COSTS = {
  PERPLEXITY: {
    ONLINE: {
      SONAR_SMALL_ONLINE: 0.0002,   // Per token
      SONAR_MEDIUM_ONLINE: 0.0004,   // Per token
      SONAR_LARGE_ONLINE: 0.0006,    // Per token
      SONAR_HUGE_ONLINE: 0.001       // Per token
    }
  },
  TOGETHER: {
    IMAGE: {
      FLUX_SCHNELL: 0.001  // $0.001 per image with FLUX.1-schnell
    }
  }
};

// Update credits in database
async function updateUserCredits(userId: string, updates: { text_credits?: number, image_credits?: number }) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from('user_credits')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Add deduction endpoints
router.post('/deduct/text', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { model, inputTokens, outputTokens } = req.body;
    
    // Calculate cost based on model
    let cost = 0;
    if (model.includes('sonar')) {
      // Perplexity charges for both input and output tokens
      const totalTokens = inputTokens + outputTokens;
      const modelKey = model.toUpperCase() as keyof typeof COSTS.PERPLEXITY.ONLINE;
      cost = totalTokens * COSTS.PERPLEXITY.ONLINE[modelKey];
    } else {
      // If not a known model, return error
      return res.status(400).json({ error: 'Invalid model specified' });
    }

    // Get current credits
    const credits = await getUserCredits(req.user.id);
    
    // Check if enough credits
    if (credits.text_credits < cost) {
      return res.status(402).json({ error: 'Insufficient text credits' });
    }

    // Update credits
    const updatedCredits = await updateUserCredits(req.user.id, {
      text_credits: credits.text_credits - cost
    });

    return res.json({ 
      deducted: cost,
      remaining: updatedCredits.text_credits,
      details: {
        inputTokens,
        outputTokens,
        model,
        rate: COSTS.PERPLEXITY.ONLINE[model.toUpperCase() as keyof typeof COSTS.PERPLEXITY.ONLINE]
      }
    });
  } catch (error: any) {
    console.error('Text credit deduction error:', error);
    return res.status(500).json({ 
      error: 'Failed to deduct credits',
      details: error.message
    });
  }
});

router.post('/deduct/image', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { count = 1 } = req.body;
    const cost = count * COSTS.TOGETHER.IMAGE.FLUX_SCHNELL;

    // Get current credits
    const credits = await getUserCredits(req.user.id);
    
    // Check if enough credits
    if (credits.image_credits < cost) {
      return res.status(402).json({ error: 'Insufficient image credits' });
    }

    // Update credits
    const updatedCredits = await updateUserCredits(req.user.id, {
      image_credits: credits.image_credits - cost
    });

    return res.json({ 
      deducted: cost,
      remaining: updatedCredits.image_credits,
      details: {
        count,
        rate: COSTS.TOGETHER.IMAGE.FLUX_SCHNELL,
        model: 'black-forest-labs/FLUX.1-schnell'
      }
    });
  } catch (error: any) {
    console.error('Image credit deduction error:', error);
    return res.status(500).json({ 
      error: 'Failed to deduct credits',
      details: error.message
    });
  }
});

router.get('/together', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const credits = await getUserCredits(req.user.id);
    res.json({ 
      text_credits: credits.text_credits,
      image_credits: credits.image_credits
    });
  } catch (error: any) {
    console.error('Together credits route error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch credits',
      details: error.message
    });
  }
});

router.get('/perplexity', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const credits = await getUserCredits(req.user.id);
    res.json({ credits: credits.text_credits });
  } catch (error: any) {
    console.error('Perplexity credits route error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch credits',
      details: error.message
    });
  }
});

export default router;
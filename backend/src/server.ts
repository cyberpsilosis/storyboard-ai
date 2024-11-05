import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import creditsRouter from './routes/credits';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Authorization']
}));

// Add preflight handling
app.options('*', cors());

app.use(express.json());

// Basic health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Log all requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  next();
});

// Use credits routes
app.use('/api/credits', creditsRouter);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Something broke!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('Environment variables:', {
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY ? 'present' : 'missing',
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY ? 'present' : 'missing',
    SUPABASE_URL: process.env.SUPABASE_URL ? 'present' : 'missing',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'present' : 'missing'
  });
}); 
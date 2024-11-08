import express from 'express';
import creditsRouter from './routes/credits';

const app = express();

app.use('/api/credits', creditsRouter);

// ... rest of your app setup 
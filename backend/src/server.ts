import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.config';
import { connectDB } from './config/db';
import './config/redis'; // Initialize redis
import { globalLimiter } from './middlewares/rateLimit.middleware';
import routes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

// Webhook payload needs raw buffer for signature verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', globalLimiter);
app.use('/api', routes);

// Error Middleware (must be last)
app.use(errorMiddleware);

import { initScheduler } from './scheduler';

// Initialize server
const startServer = async () => {
  await connectDB();
  
  // Start the scheduler
  initScheduler();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();

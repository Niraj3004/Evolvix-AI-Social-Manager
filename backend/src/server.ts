import express from 'express';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.config';
import { connectDB } from './config/db';
import './config/redis'; // Initialize redis
import { globalLimiter } from './middlewares/rateLimit.middleware';
import routes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

import { initSocket } from './config/socket';
import { createServer } from 'http';

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0, 
  profilesSampleRate: 1.0,
});

Sentry.setupExpressErrorHandler(app);

const httpServer = createServer(app);

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

// Initialize Socket.io
initSocket(httpServer).catch(console.error);

import { initScheduler } from './scheduler';

// Initialize server
const startServer = async () => {
  await connectDB();
  
  // Start the scheduler
  initScheduler();

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();

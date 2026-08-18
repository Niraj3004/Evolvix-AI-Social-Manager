import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.config';
import { connectDB } from './config/db';
import './config/redis'; // Initialize redis
import routes from './routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error Middleware (must be last)
app.use(errorMiddleware);

// Initialize server
const startServer = async () => {
  await connectDB();
  
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();

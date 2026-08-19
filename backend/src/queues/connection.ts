import Redis from 'ioredis';
import { env } from '../config/env.config';

// BullMQ requires maxRetriesPerRequest to be null
export const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

connection.on('error', (err) => {
  console.error('BullMQ Redis connection error:', err);
});

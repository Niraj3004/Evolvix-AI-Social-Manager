import Redis from 'ioredis';
import { env } from './env.config';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('[BACKEND] Redis connected');
});

redis.on('error', (err) => {
  console.error('[BACKEND] Redis connection error:', err.message);
});

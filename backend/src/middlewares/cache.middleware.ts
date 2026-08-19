import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { env } from '../config/env.config';

let redisClient: ReturnType<typeof createClient>;

(async () => {
  redisClient = createClient({ url: env.REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis Cache Error', err));
  await redisClient.connect();
})();

export const cacheMiddleware = (durationInSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.orgId}:${req.originalUrl}`;
    
    try {
      const cachedResponse = await redisClient.get(key);
      if (cachedResponse) {
        console.log(`[Cache] HIT for ${key}`);
        return res.json(JSON.parse(cachedResponse));
      }

      console.log(`[Cache] MISS for ${key}`);
      
      // Override res.json to cache the response before sending it
      const originalJson = res.json.bind(res);
      res.json = ((body: any) => {
        redisClient.setEx(key, durationInSeconds, JSON.stringify(body))
          .catch(err => console.error('Redis SetEx Error:', err));
        return originalJson(body);
      }) as any;

      next();
    } catch (err) {
      console.error('[Cache] Middleware Error:', err);
      next();
    }
  };
};

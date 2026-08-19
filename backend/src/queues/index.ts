import { Queue } from 'bullmq';
import { connection } from './connection';

const defaultJobOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  removeOnComplete: true,
  removeOnFail: false, // Acts as a Dead-Letter Queue
};

export const contentQueue = new Queue('content', { connection, defaultJobOptions });
export const designQueue = new Queue('design', { connection, defaultJobOptions });
export const publishQueue = new Queue('publish', { connection, defaultJobOptions });
export const analyticsQueue = new Queue('analytics', { connection, defaultJobOptions });
export const testQueue = new Queue('test', { connection, defaultJobOptions });

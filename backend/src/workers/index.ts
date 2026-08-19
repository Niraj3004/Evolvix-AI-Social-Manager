import { Worker, Job } from 'bullmq';
import { connection } from '../queues/connection';
import { connectDB } from '../config/db';

console.log('Worker process starting...');

const startWorkers = async () => {
  // Connect to the DB so workers can read/write data
  await connectDB();

  // Test worker to verify retry and backoff logic
  new Worker('test', async (job: Job) => {
    console.log(`[Test Worker] Processing job ${job.id}`);
    
    if (job.data.fail) {
      console.log(`[Test Worker] Job ${job.id} simulating failure...`);
      throw new Error('Simulated failure');
    }
    
    console.log(`[Test Worker] Job ${job.id} completed successfully`);
  }, { connection });

  // Stubs for future prompts (B7, B8, etc)
  new Worker('content', async (job: Job) => {
    console.log(`[Content Worker] Processing ${job.id}`, job.data);
  }, { connection, concurrency: 5 });

  new Worker('design', async (job: Job) => {
    console.log(`[Design Worker] Processing ${job.id}`, job.data);
  }, { connection, concurrency: 5 });

  new Worker('publish', async (job: Job) => {
    console.log(`[Publish Worker] Processing ${job.id}`, job.data);
    // In B7, we will actually call the Social Adapters here.
  }, { connection, concurrency: 5 });

  new Worker('analytics', async (job: Job) => {
    console.log(`[Analytics Worker] Processing ${job.id}`, job.data);
  }, { connection, concurrency: 2 });

  console.log('Workers started successfully, listening for jobs.');
};

startWorkers().catch(console.error);

import { Worker, Job } from 'bullmq';
import { connection } from '../queues/connection';
import { connectDB, prisma } from '../config/db';

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
    console.log(`[Publish Worker] Processing job ${job.id}`, job.data);
    
    const { scheduledPostId, orgId, contentId } = job.data;
    
    // Fetch the post, content, and the brand's social account
    const post = await prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
      include: {
        content: {
          include: {
            brand: {
              include: {
                socialAccounts: true
              }
            }
          }
        }
      }
    });

    if (!post) throw new Error('ScheduledPost not found');
    
    const account = post.content.brand.socialAccounts.find((a: any) => a.platform === post.content.platform);
    if (!account) throw new Error(`No connected social account for platform ${post.content.platform}`);

    // Decrypt token
    const tokenRecord = await prisma.oAuthToken.findFirst({
      where: { socialAccountId: account.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!tokenRecord) throw new Error('OAuth token missing');

    const { decrypt } = require('../utils/encryption');
    const decryptedToken = decrypt(tokenRecord.encryptedToken);

    // Call Social Adapter Stub
    console.log(`[Publish Worker] Publishing to ${account.platform} with token: ${decryptedToken.substring(0, 5)}***`);
    console.log(`[Publish Worker] Body: ${post.content.body}`);

    // Update status to PUBLISHED
    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: { status: 'PUBLISHED' },
    });

    console.log(`[Publish Worker] Successfully published job ${job.id}`);
  }, { connection, concurrency: 5 });

  new Worker('analytics', async (job: Job) => {
    console.log(`[Analytics Worker] Processing ${job.id}`, job.data);
  }, { connection, concurrency: 2 });

  console.log('Workers started successfully, listening for jobs.');
};

startWorkers().catch(console.error);

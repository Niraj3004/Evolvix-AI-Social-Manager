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

    // Call Social Adapter via PublishingService
    const { PublishingService } = require('../services/publishing.service');
    const platformPostId = await PublishingService.publish(account.platform, decryptedToken, account.accountId, post.content.body);
    
    console.log(`[Publish Worker] Successfully published job ${job.id}, platform Post ID: ${platformPostId}`);

    // Update status to PUBLISHED and save platformPostId
    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: { 
        status: 'PUBLISHED',
        platformPostId: platformPostId 
      },
    });
  }, { connection, concurrency: 5 });

  new Worker('analytics', async (job: Job) => {
    console.log(`[Analytics Worker] Processing job ${job.id}`);
    
    // In production, this would be a scheduled job that iterates over all published posts
    // For this implementation, we will process a specific scheduledPostId
    const { scheduledPostId } = job.data;
    if (!scheduledPostId) {
      console.log('[Analytics Worker] Running cron job to fetch metrics for all recent posts...');
      const recentPosts = await prisma.scheduledPost.findMany({
        where: { status: 'PUBLISHED', platformPostId: { not: null } },
        take: 50,
        include: {
          content: { include: { brand: { include: { socialAccounts: true } } } }
        }
      });

      for (const post of recentPosts) {
        if (!post.platformPostId) continue;
        const account = post.content.brand.socialAccounts.find((a: any) => a.platform === post.content.platform);
        if (!account) continue;

        try {
          const tokenRecord = await prisma.oAuthToken.findFirst({
            where: { socialAccountId: account.id },
            orderBy: { createdAt: 'desc' },
          });
          if (!tokenRecord) continue;

          const { decrypt } = require('../utils/encryption');
          const decryptedToken = decrypt(tokenRecord.encryptedToken);

          const { PublishingService } = require('../services/publishing.service');
          const metrics = await PublishingService.fetchMetrics(account.platform, decryptedToken, account.accountId, post.platformPostId);

          const updatedAnalytics = await prisma.analytics.upsert({
            where: { scheduledPostId: post.id },
            update: metrics,
            create: {
              ...metrics,
              scheduledPostId: post.id,
              orgId: post.orgId,
              brandId: post.content.brandId
            }
          });
          console.log(`[Analytics Worker] Updated metrics for post ${post.id}`);

          // Broadcast real-time event to the org
          try {
            const { createClient } = require('redis');
            const redisPub = createClient({ url: process.env.REDIS_URL });
            await redisPub.connect();
            // Emit a message that socket.io redis adapter will understand or we can just pub to a channel
            // The simplest way to trigger socket.io across processes is using the Emitter or pub/sub.
            await redisPub.publish(`socket.io#/#org_${post.orgId}#`, Buffer.from(JSON.stringify(['analytics_updated', updatedAnalytics])));
            await redisPub.disconnect();
          } catch (pubErr) {
            console.error('Redis pub error', pubErr);
          }

          // Fetch org owner and send Post Published email
          try {
            const ownerMembership = await prisma.membership.findFirst({
              where: { organizationId: post.orgId, role: 'OWNER' },
              include: { user: true }
            });

            if (ownerMembership && ownerMembership.user.email) {
              const { emailService } = require('../services/email.service');
              // Optionally we can construct the post URL if we have it, for now we leave it empty
              await emailService.sendPostPublishedEmail(ownerMembership.user.email, account.platform);
            }
          } catch (emailErr) {
             console.error('Failed to send published email', emailErr);
          }

        } catch (e) {
          console.error(`[Analytics Worker] Failed to fetch metrics for post ${post.id}:`, e);
        }
      }
    }
  }, { connection, concurrency: 2 });

  console.log('Workers started successfully, listening for jobs.');
};

startWorkers().catch(console.error);

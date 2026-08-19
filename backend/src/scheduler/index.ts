import cron from 'node-cron';
import { prisma } from '../config/db';
import { publishQueue } from '../queues';

export const initScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('[Scheduler] Checking for scheduled posts...');
      const now = new Date();

      const duePosts = await prisma.scheduledPost.findMany({
        where: {
          status: 'PENDING',
          scheduledFor: {
            lte: now,
          },
        },
      });

      if (duePosts.length === 0) {
        return;
      }

      console.log(`[Scheduler] Found ${duePosts.length} posts due for publishing.`);

      for (const post of duePosts) {
        // Enqueue the post to the publish queue
        await publishQueue.add(`publish-${post.id}`, {
          scheduledPostId: post.id,
          orgId: post.orgId,
          contentId: post.contentId,
        });

        // Update status to QUEUED
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'QUEUED' },
        });

        console.log(`[Scheduler] Enqueued post ${post.id}`);
      }
    } catch (error) {
      console.error('[Scheduler] Error processing scheduled posts:', error);
    }
  });

  console.log('[Scheduler] Initialized node-cron scheduler.');
};

import cron from 'node-cron';
import { prisma } from './config/db';
import { calendarAgent } from './agents/calendar.agent';
import { orchestrator } from './agents/orchestrator';

console.log('[Cron] Initializing Zero-Touch Automation Service...');

// Run every Monday at 9:00 AM (or we can just run it instantly for testing)
// For this SaaS, we will run a daily check at 9 AM.
cron.schedule('0 9 * * *', async () => {
  console.log('[Cron] Waking up. Starting daily content generation cycle...');
  
  try {
    // 1. Fetch all active organizations and their brands
    const organizations = await prisma.organization.findMany({
      include: {
        brands: true
      }
    });

    for (const org of organizations) {
      for (const brand of org.brands) {
        console.log(`[Cron] Processing Brand: ${brand.name} (Org: ${org.id})`);
        
        // 2. Calendar Agent decides what to post today
        const calendarState = await calendarAgent.execute({
          orgId: org.id,
          brandId: brand.id,
          brandData: brand as any,
          platform: 'linkedin',
          topic: '' // To be filled by the agent
        });

        console.log(`[Cron] Calendar Agent decided today's topic: "${calendarState.topic}"`);

        // 3. Trigger the full Orchestrator pipeline with this auto-generated topic
        // We run it async so it doesn't block the cron loop
        orchestrator.runContentJob(org.id, brand.id, calendarState.topic!, 'linkedin')
          .then((finalState) => {
            console.log(`[Cron] Successfully generated full post for ${brand.name}!`);
            console.log(`[Cron] Image URL: ${finalState.designData?.imageUrl}`);
            
            // In the future, we will save this to ScheduledPost table here.
          })
          .catch((err) => {
            console.error(`[Cron] Failed to generate post for ${brand.name}:`, err);
          });
      }
    }
  } catch (error) {
    console.error('[Cron] Error during daily cycle:', error);
  }
});

console.log('[Cron] Scheduled Zero-Touch Automation Service.');

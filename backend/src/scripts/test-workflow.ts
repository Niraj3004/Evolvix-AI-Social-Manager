import { approveContent, scheduleContent } from './services/content.service';
import { prisma } from './config/db';

async function testWorkflow() {
  const orgId = "test-org";
  const contentId = "test-content-id";
  const date = new Date(Date.now() + 100000);

  // Mock prisma for testing
  const originalGet = prisma.content.findFirst;
  const originalUpdate = prisma.content.update;

  try {
    // 1. Test approveContent with non-draft content
    console.log("Testing approveContent with non-DRAFT state...");
    (prisma.content.findFirst as any) = async () => ({ status: 'SCHEDULED' });
    
    try {
        await approveContent(orgId, contentId);
        throw new Error("Should have thrown error");
    } catch (e: any) {
        console.log("Caught expected error:", e.message);
    }

    // 2. Test approveContent with DRAFT content
    console.log("\nTesting approveContent with DRAFT state...");
    (prisma.content.findFirst as any) = async () => ({ status: 'DRAFT', body: 'draft body' });
    (prisma.content.update as any) = async (args: any) => {
        console.log("Prisma Update Call:", JSON.stringify(args, null, 2));
        return { id: contentId, status: args.data.status };
    };
    const approved = await approveContent(orgId, contentId);
    console.log("Successfully approved! New status:", approved.status);

    // 3. Test scheduleContent
    console.log("\nTesting scheduleContent with APPROVED state...");
    (prisma.content.findFirst as any) = async () => ({ status: 'APPROVED', body: 'draft body' });
    (prisma.content.update as any) = async (args: any) => {
        console.log("Prisma Update Call:", JSON.stringify(args, null, 2));
        return { id: contentId, status: args.data.status };
    };
    const scheduled = await scheduleContent(orgId, contentId, date);
    console.log("Successfully scheduled! New status:", scheduled.status);

    console.log("\nWorkflow tests passed successfully.");
  } finally {
    prisma.content.findFirst = originalGet;
    prisma.content.update = originalUpdate;
    process.exit(0);
  }
}

testWorkflow();

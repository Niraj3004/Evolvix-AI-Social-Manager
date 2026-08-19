import { contentAgent } from './content.agent';
import { ragService } from '../services/rag.service';

async function testAgent() {
  const orgId = "test-org";
  const brandId = "test-brand";
  const topic = "We are launching a new AI feature that automates scheduling.";
  
  // Mock RAG retrieval for this test
  const originalRetrieve = ragService.retrieve;
  ragService.retrieve = async () => {
    return [{ content: "Our brand voice is exciting, bold, and tech-forward. We sell AI software." }];
  };

  // Mock gateway.chat to avoid actual API calls if keys are missing
  const { gateway } = require('../config/ai');
  const originalChat = gateway.chat;
  gateway.chat = async (orgId: string, messages: any[]) => {
    const systemPrompt = messages[0].content;
    
    // Simulate LLM returning JSON based on the platform requested
    if (systemPrompt.includes('LinkedIn')) {
        return { text: `{"caption": "Exciting news! We're launching our new AI scheduling feature. 🚀\\n\\nAutomation is the future of work.", "hooks": ["Are you tired of manual scheduling?"], "hashtags": ["#AI", "#Productivity"], "script": ""}` };
    } else {
        return { text: `{"caption": "BIG REVEAL 😱 Our new AI scheduler is here! 🔥 Link in bio to try it now!!", "hooks": ["Guess what just dropped?"], "hashtags": ["#AI", "#Tech", "#Launch", "#Software", "#Innovation", "#Startup", "#Automate", "#Future", "#Tools", "#SocialMedia"], "script": ""}` };
    }
  };

  try {
    console.log("Testing LinkedIn Content Generation...");
    const linkedin = await contentAgent.generatePlatformContent(orgId, brandId, topic, "linkedin");
    console.log("LinkedIn Result:", JSON.stringify(linkedin, null, 2));

    console.log("\nTesting Instagram Content Generation...");
    const insta = await contentAgent.generatePlatformContent(orgId, brandId, topic, "instagram");
    console.log("Instagram Result:", JSON.stringify(insta, null, 2));

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    ragService.retrieve = originalRetrieve;
    gateway.chat = originalChat;
    process.exit(0);
  }
}

testAgent();

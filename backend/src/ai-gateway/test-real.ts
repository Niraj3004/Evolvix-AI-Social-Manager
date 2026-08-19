import { env } from '../config/env.config';
import { gateway, groqProvider, geminiProvider, openRouterProvider } from '../config/ai';

async function testConfig() {
  console.log(`Current AI_COMPUTE_MODE: ${env.AI_COMPUTE_MODE}`);
  
  // Access private providers array for testing purposes using any cast
  const providers = (gateway as any).providers;
  
  console.log('Provider Order:');
  providers.forEach((p: any, index: number) => {
    console.log(`${index + 1}. ${p.id} (${p.modelName})`);
  });

  if (env.AI_COMPUTE_MODE === 'CPU') {
    if (providers[0].id !== 'groq') {
      throw new Error("Expected groq to be first in CPU mode");
    }
  } else {
    if (providers[0].id !== 'openrouter') {
      throw new Error("Expected openrouter to be first in GPU mode");
    }
  }
  
  console.log('\nTest passed: Providers are ordered correctly based on env flag.');
  process.exit(0);
}

testConfig().catch(console.error);

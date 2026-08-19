import { OpenAICompatProvider } from './providers/openai-compat.provider';
import { AIGateway } from './gateway';
import { redis } from '../config/redis';
import { LLMMessage } from './interfaces';

async function runTests() {
  console.log("Starting AI Gateway Tests...");
  
  // 1. Setup Providers
  // Provider 1: Invalid key to force an error
  const failingProvider = new OpenAICompatProvider(
    'groq-failing',
    'https://api.groq.com/openai/v1',
    'invalid_key',
    'llama3-8b-8192'
  );
  
  // Provider 2: Since we don't have a real key right now, let's mock the fetch call globally
  // just for testing to prove the fallback and caching works without exposing a real API key.
  const successProvider = new OpenAICompatProvider(
    'mock-success',
    'https://mock.api/v1',
    'valid_key',
    'mock-model'
  );

  const originalFetch = global.fetch;
  let fetchCallCount = 0;
  
  // Mock fetch
  global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    fetchCallCount++;
    if (url.toString().includes('api.groq.com')) {
      // Simulate 401 Unauthorized for the failing provider
      return new Response('{"error": "Unauthorized"}', { status: 401, statusText: 'Unauthorized' });
    }
    
    // Simulate successful response for the second provider
    if (url.toString().includes('mock.api')) {
      return new Response(JSON.stringify({
        choices: [{ message: { content: 'Mock response success!' } }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    return originalFetch(url, init);
  };

  const gateway = new AIGateway([failingProvider, successProvider]);
  
  const orgId = "test-org-123";
  const messages: LLMMessage[] = [{ role: 'user', content: 'Hello World' }];
  
  try {
    // Test 1: Fallback (Provider 1 fails, Provider 2 succeeds)
    console.log("Test 1: Fallback logic...");
    const response1 = await gateway.chat(orgId, messages);
    console.log("Response:", response1.text);
    if (response1.text !== 'Mock response success!') {
      throw new Error("Test 1 failed: Expected mock response");
    }
    console.log("Test 1 Passed: Fallback worked.");

    // Test 2: Cache Check (Should not increment fetchCallCount)
    console.log("Test 2: Cache logic...");
    const prevFetchCount = fetchCallCount;
    const response2 = await gateway.chat(orgId, messages);
    console.log("Response (from cache):", response2.text);
    
    if (fetchCallCount !== prevFetchCount) {
      throw new Error("Test 2 failed: Cache was bypassed, fetch was called again.");
    }
    console.log("Test 2 Passed: Cache hit successfully.");

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Cleanup
    global.fetch = originalFetch;
    await redis.quit(); // Close redis connection so script exits
    process.exit(0);
  }
}

runTests();

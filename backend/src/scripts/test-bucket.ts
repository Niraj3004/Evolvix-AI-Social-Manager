import { gateway } from './config/ai';

async function run() {
  console.log("1. Using ChatGPT/LLM to generate the perfect image prompt...");
  
  const designInstruction = `
    Analyze this specific digital marketing design request and create a flawless image generation prompt for FLUX.
    
    The user wants an exact replica of this poster concept:
    - Text at the very top (small): "Morphiaas DIGITAL MARKETING AGENCY"
    - Huge bold title text: "BUSINESS WITHOUT" (black), "DIGITAL" (black), "MARKETING" (red)
    - Central visual: A silver metal bucket tipped over on a white floor. Pouring out of the bucket are various 3D social media icons (YouTube play button in red, Facebook 'f' in black, Instagram camera in black, LinkedIn 'in' in black, and generic hashtags/likes).
    - Bottom text 1: "IS LIKE FISH" (FISH is red, rest is black)
    - Bottom text 2: "WITHOUT WATER" (WATER is red, rest is black)
    - Bottom text 3 (inside a rounded box): "WE CREATE STRATEGIES THAT DRIVE GROWTH." (DRIVE GROWTH is red, rest is black).
    
    Background: Clean white/off-white studio lighting.
    Style: Ultra-realistic 3D rendering mixed with high-end corporate graphic design. Flawless typography integration.
    
    Return ONLY the image prompt string. Do not include quotes or any other text.
  `;

  try {
    const chatResponse = await gateway.chat('test-org', [{ role: 'user', content: designInstruction }]);
    const generatedPrompt = chatResponse.text.trim();
    
    console.log('\n--- Generated Prompt by AI ---');
    console.log(generatedPrompt);
    
    console.log("\n2. Sending generated prompt to Hugging Face FLUX API...");
    const imageUrl = await gateway.generateImage('test-org', generatedPrompt);
    
    console.log('\n--- SUCCESS! ---');
    console.log('Final Image URL:', imageUrl);
  } catch (error: any) {
    console.error('\n--- FAILED ---');
    console.error(error.message);
    console.log("\nIf this failed with 'fetch failed', your internet connection is still blocking Hugging Face! Please turn on a VPN.");
  }
}

run();

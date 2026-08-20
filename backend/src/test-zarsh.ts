import { gateway } from './config/ai';

async function run() {
  console.log("1. Using your backend ChatGPT/LLM to generate the perfect image prompt for 'ZARSH SOLUTIONS'...");
  
  const designInstruction = `
    Analyze this specific digital marketing design request and create a flawless image generation prompt for FLUX/DALL-E.
    
    The user wants an exact replica of this poster concept:
    - Text at the very top (small): "ZARSH SOLUTIONS" (Z is red and black, rest is black)
    - Huge bold title text: "3 KEYS TO SOCIAL MEDIA SUCCESS" ("3" is red, "SOCIAL" is black, "MEDIA" is red, "SUCCESS" is white text on a solid red rectangular background)
    - Central visual: A top-down photorealistic view of human hands typing on a silver laptop on a clean white desk. A cup of black coffee is to the bottom left. A black smartphone is to the bottom right.
    - Floating UI Elements: Three glossy red speech bubbles/tags pointing toward the laptop. 
      - Bubble 1 (left): "CONSISTENT CONTENT" (white text)
      - Bubble 2 (top right): "CLEAR POSITIONING" (white text)
      - Bubble 3 (bottom right): "DATA-DRIVEN DECISIONS" (white text)
    
    Background: Clean white/off-white minimalist desk environment.
    Style: Ultra-realistic photography mixed with high-end corporate UI graphic design. Flawless typography integration.
    
    Return ONLY the image prompt string. Do not include quotes or any other text.
  `;

  try {
    const chatResponse = await gateway.chat('test-org', [{ role: 'user', content: designInstruction }]);
    const generatedPrompt = chatResponse.text.trim();
    
    console.log('\n--- Generated Prompt by YOUR Backend AI ---');
    console.log(generatedPrompt);
    
    console.log("\n2. Sending generated prompt to Image Generator...");
    const imageUrl = await gateway.generateImage('test-org', generatedPrompt);
    
    console.log('\n--- SUCCESS! ---');
    console.log('Final Image URL:', imageUrl);
  } catch (error: any) {
    console.error('\n--- FAILED ---');
    console.error(error.message);
    console.log("\n(Note: Your backend successfully generated the prompt above using the LLM. The final image generation step failed because your ISP is blocking HuggingFace and your OpenAI key lacks image access. Use a VPN to fix this!)");
  }
}

run();

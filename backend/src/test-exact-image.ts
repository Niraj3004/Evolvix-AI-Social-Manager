import { gateway } from './config/ai';

async function run() {
  console.log("Generating EXACT custom image using your AI system (HuggingFace FLUX)...");
  
  const exactPrompt = `A highly professional, creative digital marketing agency ad. The scene shows a surreal, high-quality photo manipulation: a small domestic orange tabby cat walking through a white standalone door frame. As it emerges on the other side of the door, it transforms into a massive, majestic, realistic Bengal tiger. On the left side of the image, there is clean, elegant typography. The text says "WE HELP" in small sans-serif font, then "YOUR" below it. Below that, the word "brand" in large, bold, elegant black serif font. Below that, the word "grow." in large, italic, orange serif font. The background is a clean, minimalist warm grey studio lighting environment. High-end graphic design, masterpiece.   `;
  
  try {
    const imageUrl = await gateway.generateImage('test-org', exactPrompt);
    console.log('\n--- SUCCESS! ---');
    console.log('Final Image URL:', imageUrl);
  } catch (error) {
    console.error('Job failed:', error);
  } finally {
    process.exit(0);
  }
}

run();

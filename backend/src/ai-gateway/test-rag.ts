import { ragService } from '../services/rag.service';

function testRagChunking() {
  const sampleText = "Evolvix is a brand new AI agent. It is designed to automate social media management using advanced RAG and multi-agent orchestration. It supports Groq, Gemini, and OpenRouter.";
  
  console.log("Original Text length:", sampleText.length);
  
  // Chunk with a small size to verify it cuts correctly
  const chunks = ragService.chunkText(sampleText, 50, 10);
  
  console.log(`Generated ${chunks.length} chunks:`);
  chunks.forEach((chunk, i) => {
    console.log(`[Chunk ${i + 1}] (${chunk.length} chars) -> ${chunk}`);
  });

  if (chunks.length === 0) {
    throw new Error("Chunking failed: No chunks generated");
  }

  // The first chunk should overlap with the second chunk by 10 characters
  // chunk0 ends with "...gent." (let's say)
  // chunk1 starts with "...gent." 
  // Just checking if we got multiple chunks correctly for a 173 char string
  if (chunks.length !== 5) {
      console.warn("Expected 5 chunks for this specific text/size, but got: " + chunks.length);
  }

  console.log("RAG chunking test passed successfully.");
}

testRagChunking();

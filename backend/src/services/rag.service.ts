import { gateway } from '../config/ai';
import { prisma } from '../config/db';

export class RagService {
  /**
   * Slices a long document into smaller overlapping chunks.
   * Uses basic character count for simplicity (e.g. 500 chars with 50 chars overlap).
   */
  chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
      const chunk = text.slice(i, i + chunkSize);
      chunks.push(chunk);
      i += chunkSize - overlap;
    }
    return chunks;
  }

  /**
   * Embeds a document and saves its chunks and embeddings to the database.
   */
  async processDocument(orgId: string, brandId: string, brandDocumentId: string, text: string) {
    const chunks = this.chunkText(text);

    // Call Gateway to embed chunks (the Gateway routes this to the correct provider!)
    const response = await gateway.embed(orgId, chunks);

    const embeddings = response.embeddings;

    // Save each chunk to the database
    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      const embedding = embeddings[i];

      // Convert number array to string format for Postgres vector: '[1.0, 2.0, ...]'
      const embeddingStr = `[${embedding.join(',')}]`;

      // Use raw SQL to insert the vector due to Unsupported("vector") type
      await prisma.$executeRaw`
        INSERT INTO "BrandDocumentChunk" ("id", "brandDocumentId", "orgId", "brandId", "content", "embedding", "createdAt")
        VALUES (
          gen_random_uuid(),
          ${brandDocumentId},
          ${orgId},
          ${brandId},
          ${content},
          ${embeddingStr}::vector,
          NOW()
        )
      `;
    }
  }

  /**
   * Retrieves the most relevant chunks for a given query, org, and brand.
   */
  async retrieve(orgId: string, brandId: string, query: string, k: number = 5): Promise<any[]> {
    // 1. Embed the query using the Gateway
    const response = await gateway.embed(orgId, [query]);
    const queryEmbedding = response.embeddings[0];
    const queryEmbeddingStr = `[${queryEmbedding.join(',')}]`;

    // 2. Perform raw SQL similarity search
    // Using <=> operator for cosine distance (standard for OpenAI/Gemini vectors)
    const nearestChunks = await prisma.$queryRaw<any[]>`
      SELECT 
        "id", 
        "brandDocumentId", 
        "content",
        1 - ("embedding" <=> ${queryEmbeddingStr}::vector) as similarity
      FROM "BrandDocumentChunk"
      WHERE "orgId" = ${orgId} AND "brandId" = ${brandId}
      ORDER BY "embedding" <=> ${queryEmbeddingStr}::vector
      LIMIT ${k}
    `;

    return nearestChunks;
  }
}

export const ragService = new RagService();

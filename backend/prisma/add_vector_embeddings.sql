-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  brand_id text NOT NULL,
  content text NOT NULL,
  embedding vector(768)
);

-- Create an HNSW index for fast nearest-neighbor search
CREATE INDEX ON embeddings USING hnsw (embedding vector_l2_ops);

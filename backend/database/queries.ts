import pool from "./db";

export const storeQuestion = async (
  question: string,
  answer: string,
  embedding: number[]
) => {
  const embeddingArray = Array.from(embedding); // ✅ Convert Float32Array to plain array
  const formattedEmbedding = `[${embeddingArray.join(",")}]`; // ✅ Ensure correct PostgreSQL vector format

  try {
    await pool.query(
      "INSERT INTO questions (question, answer, embedding, created_at) VALUES ($1, $2, $3::vector(384), NOW())",
      [question, answer, formattedEmbedding] // ✅ Pass correctly formatted embedding
    );
  } catch (error) {
    console.error("Error storing question:", error);
  }
};

export const getRecentQuestions = async (limit: number = 10) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT question, answer, language, created_at FROM questions ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    return result.rows;
  } finally {
    client.release();
  }
};

export const findSimilarQuestion = async (embedding: number[]) => {
  const formattedEmbedding = embedding.join(",");

  const query = `
        SELECT question, answer, embedding <=> $1::vector(384) AS similarity
        FROM questions
        ORDER BY similarity ASC
        LIMIT 1;
    `;

  const { rows } = await pool.query(query, [`[${formattedEmbedding}]`]);

  if (rows.length === 0) {
    console.warn("⚠ No similar question found in the database.");
    return null;
  }

  // Define similarity threshold (lower is better)
  const SIMILARITY_THRESHOLD = 0.4;
  console.log("similarity: ", rows[0]?.similarity);

  return rows.length > 0 && rows[0]?.similarity < SIMILARITY_THRESHOLD
    ? rows[0]
    : null;
};

export const getEmbedding = async (text: string): Promise<any> => {
  const { pipeline } = await import("@xenova/transformers");
  const model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const embedding = await model(text, { pooling: "mean", normalize: true });

  return embedding.data;
};

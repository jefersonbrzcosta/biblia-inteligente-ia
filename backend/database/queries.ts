import pool from "./db";

export const storeQuestion = async (
  question: string,
  answer: string,
  embedding: number[],
  bibleReference: string // ✅ New field
) => {
  const embeddingArray = Array.from(embedding);
  const formattedEmbedding = `[${embeddingArray.join(",")}]`;

  try {
    await pool.query(
      `INSERT INTO questions (question, answer, embedding, bible_reference, created_at)
       VALUES ($1, $2, $3::vector(384), $4, NOW())`,
      [question, answer, formattedEmbedding, bibleReference] // ✅ Matches the DB schema
    );
    console.log("✅ Question stored successfully with Bible reference!");
  } catch (error) {
    console.error("❌ Error storing question:", error);
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
  const embeddingArray = Array.from(embedding);
  const formattedEmbedding = `[${embeddingArray.join(",")}]`;

  const query = `
        SELECT question, answer, bible_reference, bible_text, embedding <=> $1 AS similarity
        FROM questions
        ORDER BY similarity ASC
        LIMIT 1;
    `;

  const { rows } = await pool.query(query, [formattedEmbedding]);

  // Define similarity threshold (lower is better)
  const SIMILARITY_THRESHOLD = 0.4;
  console.log("Similarity: ", rows[0]?.similarity);

  return rows.length > 0 && rows[0].similarity < SIMILARITY_THRESHOLD
    ? {
        answer: rows[0].answer,
        bible_reference: rows[0].bible_reference || "Sem contexto",
        bible_text: rows[0].bible_text || "",
      }
    : null;
};

export const getEmbedding = async (text: string): Promise<any> => {
  const { pipeline } = await import("@xenova/transformers");
  const model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const embedding = await model(text, { pooling: "mean", normalize: true });

  return embedding.data;
};

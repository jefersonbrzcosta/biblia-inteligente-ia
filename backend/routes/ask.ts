import { Router } from "express";
import axios from "axios";
import {
  getEmbedding,
  findSimilarQuestion,
  storeQuestion,
} from "../database/queries";
import extractBibleReferences from "../utils/extractBibleReferences";
const router = Router();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post("/", async (req, res) => {
  try {
    const { question, language = "pt" } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Step 1: Generate AI embedding
    const embedding = await getEmbedding(question);

    // Step 2: Search for a similar question in the local database
    const existing = await findSimilarQuestion(embedding);
    if (existing) {
      console.log("✅ Found similar question in database, skipping GPT call.");
      return res.json({
        answer: existing.answer,
        bible_reference: existing.bible_reference || "Sem contexto",
      });
    }

    // Step 3: Call GPT only if no similar answer is found
    console.log("🤖 No match found. Calling GPT...");
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em Bíblia e sempre responde em Português do Brasil. Sempre forneça as referências bíblicas exatas no formato: Livro X, Capítulo Y, Versículo Z.",
          },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content;

    // Extract Bible references from the response
    const bibleReferences = extractBibleReferences(answer);
    const formattedBibleReference =
      bibleReferences.length > 0 ? bibleReferences.join("; ") : "Sem contexto";

    // Step 4: Store the new question, answer, and AI embedding
    await storeQuestion(question, answer, embedding, formattedBibleReference);
    console.log("🤖 DONE");

    res.json({
      answer,
      bible_reference: formattedBibleReference,
    });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;

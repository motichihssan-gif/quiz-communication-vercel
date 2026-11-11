import { getRedis, requireMethod } from "../lib/redis.js";
import { PUBLIC_QUESTIONS, QUESTION_DURATION_MS } from "../lib/quiz.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, "GET")) return;
  try {
    const redis = getRedis();
    const startedAt = await redis.get("quiz:startedAt");
    return res.status(200).json({
      startedAt: startedAt ? Number(startedAt) : null,
      serverNow: Date.now(),
      durationMs: QUESTION_DURATION_MS,
      questions: PUBLIC_QUESTIONS,
      totalQuestions: PUBLIC_QUESTIONS.length
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur." });
  }
}

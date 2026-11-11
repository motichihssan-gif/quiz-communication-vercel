import { getRedis, requireMethod, teacherAuthorized } from "../lib/redis.js";
import { QUESTIONS } from "../lib/quiz.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;
  if (!teacherAuthorized(req)) return res.status(401).json({ error: "Code enseignant incorrect." });

  try {
    const redis = getRedis();
    const action = req.body?.action;

    if (action === "start") {
      const keys = ["quiz:startedAt", "quiz:scores", "quiz:correct", "quiz:bonuses"];
      for (const question of QUESTIONS) {
        keys.push(`quiz:answers:${question.id}`, `quiz:winner:${question.id}`);
      }
      await redis.del(...keys);
      const startedAt = Date.now() + 2500;
      await redis.set("quiz:startedAt", String(startedAt));
      return res.status(200).json({ ok: true, startedAt });
    }

    if (action === "stop") {
      await redis.del("quiz:startedAt");
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Action inconnue." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur." });
  }
}

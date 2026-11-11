import { getRedis, requireMethod } from "../lib/redis.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, "POST")) return;
  try {
    const name = String(req.body?.name || "").trim().replace(/\s+/g, " ");
    const studentId = String(req.body?.studentId || "").trim();
    if (name.length < 2 || name.length > 35 || !/^[a-zA-Z0-9_-]{8,80}$/.test(studentId)) {
      return res.status(400).json({ error: "Saisissez un prénom ou nom valide." });
    }
    const redis = getRedis();
    const existing = await redis.hget("quiz:students", studentId);
    if (existing && existing !== name) {
      return res.status(409).json({ error: "Identifiant étudiant déjà utilisé." });
    }
    await redis.hset("quiz:students", { [studentId]: name });
    return res.status(200).json({ ok: true, studentId, name });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur." });
  }
}

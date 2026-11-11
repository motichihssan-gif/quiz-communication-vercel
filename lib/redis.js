import { Redis } from "@upstash/redis";

let redisInstance;

export function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Configuration Upstash manquante. Ajoutez UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN.");
  }
  if (!redisInstance) {
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
  }
  return redisInstance;
}

export function requireMethod(req, res, method) {
  if (req.method !== method) {
    res.setHeader("Allow", method);
    res.status(405).json({ error: "Méthode non autorisée." });
    return false;
  }
  return true;
}

export function teacherAuthorized(req) {
  const pin = req.body?.pin || req.headers["x-teacher-pin"];
  return Boolean(process.env.TEACHER_PIN && pin === process.env.TEACHER_PIN);
}

const crypto = require("crypto");

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 8 * 60 * 60; // 8 heures

function createSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;

  const signature = crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
    .update(String(expiresAt))
    .digest("hex");

  return `${expiresAt}.${signature}`;
}

function verifySession(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookieHeader = req.headers.cookie || "";

  const cookies = cookieHeader.split(";").reduce((result, item) => {
    const parts = item.trim().split("=");
    result[parts[0]] = parts.slice(1).join("=");
    return result;
  }, {});

  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expiresAt, receivedSignature] = parts;

  if (!/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(expiresAt)
    .digest("hex");

  const received = Buffer.from(receivedSignature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length) return false;

  return crypto.timingSafeEqual(received, expected);
}

module.exports = { createSession, verifySession, COOKIE_NAME, SESSION_DURATION };

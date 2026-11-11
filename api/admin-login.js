
const crypto = require("crypto");
const {
  createSession,
  COOKIE_NAME,
  SESSION_DURATION
} = require("../lib/admin-auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    return res.status(500).json({
      error: "Configuration administrateur manquante."
    });
  }

  const password = req.body && req.body.password;

  if (typeof password !== "string") {
    return res.status(400).json({ error: "Mot de passe obligatoire." });
  }

  const received = Buffer.from(password);
  const expected = Buffer.from(adminPassword);

  const passwordIsValid =
    received.length === expected.length &&
    crypto.timingSafeEqual(received, expected);

  if (!passwordIsValid) {
    return res.status(401).json({ error: "Mot de passe incorrect." });
  }

  const session = createSession();

  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${session}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${SESSION_DURATION}`
  );

  return res.status(200).json({ success: true });
};

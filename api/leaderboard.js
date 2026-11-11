
const { verifySession } = require("../lib/admin-auth");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Méthode non autorisée."
    });
  }

  // Vérifier la session administrateur
  if (!verifySession(req)) {
    return res.status(401).json({
      error: "Accès réservé à l'administrateur."
    });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      error: "Configuration Supabase manquante."
    });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/quiz_leaderboard?select=student_name,correct_count,bonus_count,total_score&order=total_score.desc,correct_count.desc&limit=100`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: "Impossible de récupérer les résultats."
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Classement indisponible."
    });
  }
};

const { getAuth } = require("@clerk/express");

/**
 * Pobranie profilu zalogowanego użytkownika
 * @param {object} req - obiekt żądania Express (z req.user ustawionym w authMiddleware)
 * @param {object} res - obiekt odpowiedzi Express
 */
async function getProfile(req, res) {
  try {
    const { userId, sessionClaims } = getAuth(req);

    // walidacja userId
    if (!userId) return res.status(401).json({ error: "Nieautoryzowany użytkownik" });

    res.json({
      userId,
      email: sessionClaims?.email,
      role: sessionClaims?.publicMetadata?.role || "user"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

module.exports = { getProfile};

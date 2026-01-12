const jwt = require('jsonwebtoken');

/**
 * Middleware autoryzacyjny
 * Sprawdza obecność i poprawność tokenu JWT w nagłówku Authorization
 * @param {object} req - obiekt żądania Express
 * @param {object} res - obiekt odpowiedzi Express
 * @param {function} next - funkcja przekazania sterowania do następnego middleware
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Brak tokenu' });
  }

  const token = authHeader.split(" ").pop(); // pobranie tokenu po "Bearer"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // zapisuje id i rolę użytkownika w req.user
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token wygasł" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Nieprawidłowy token" });
    }
    // inne błędy serwera
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Middleware sprawdzający rolę użytkownika
 * @param {Array<string>} allowedRoles - lista ról, które mają dostęp
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Brak dostępu" });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };

const jwt = require('jsonwebtoken');
const { getAuth  } = require('@clerk/express');

/**
 * Middleware autoryzacyjny
 * Sprawdza obecność i poprawność tokenu JWT w nagłówku Authorization
 * @param {object} req - obiekt żądania Express
 * @param {object} res - obiekt odpowiedzi Express
 * @param {function} next - funkcja przekazania sterowania do następnego middleware
 */
function authMiddleware(req, res, next) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Brak autoryzacji" });
  }

  next();
}

/**
 * Middleware sprawdzający rolę użytkownika
 * @param {Array<string>} allowedRoles - lista ról, które mają dostęp
 */
function roleMiddleware(allowedRoles) {
  return async (req, res, next) => {
    const { sessionClaims } = getAuth(req);

    const role = sessionClaims?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Brak dostępu" });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };

const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

/**
 * Pobranie profilu zalogowanego użytkownika
 * @param {object} req - obiekt żądania Express (z req.user ustawionym w authMiddleware)
 * @param {object} res - obiekt odpowiedzi Express
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.id; // id użytkownika z tokenu JWT
    // walidacja userId
    if (!userId) return res.status(401).json({ error: "Nieautoryzowany użytkownik" });

    const user = await userModel.findUserById(userId);
    if (!user) return res.status(404).json({ error: "Użytkownik nie istnieje" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Zmiana hasła zalogowanego użytkownika
 * @param {object} req - obiekt żądania Express (req.body: oldPassword, newPassword)
 * @param {object} res - obiekt odpowiedzi Express
 */
async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  // walidacja danych wejściowych
  if (!oldPassword || !newPassword) 
    return res.status(400).json({ error: "Podaj stare i nowe hasło" });
  if (newPassword.length < 6) 
    return res.status(400).json({ error: "Nowe hasło musi mieć co najmniej 6 znaków" });

  const userId = req.user.id;
  if (!userId) return res.status(401).json({ error: "Niepoprawny użytkownik" });

  const user = await userModel.findUserById(userId);
  if (!user) return res.status(404).json({ error: "Użytkownik nie istnieje" });

  const userPassword = await userModel.getUserPasswordHash(userId);
  const match = await bcrypt.compare(oldPassword, userPassword.password_hash);
  if (!match) return res.status(400).json({ error: "Stare hasło niepoprawne" });

  try {
    // Zmiana hasła
    await userModel.changePassword(userId, newPassword);
    res.json({ message: "Hasło zmienione" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Dezaktywacja konta użytkownika
 * @param {object} req - obiekt żądania Express
 * @param {object} res - obiekt odpowiedzi Express
 */
async function deactivateAccount(req, res) {
  const userId = req.user.id;
  // walidacja userId
  if (!userId) return res.status(401).json({ error: "Niepoprawny użytkownik" });

  const user = await userModel.findUserById(userId);
  if (!user) return res.status(404).json({ error: "Użytkownik nie istnieje" });

  try {
    // Dezaktywacja konta
    await userModel.deactivateUser(userId);
    res.json({ message: "Konto zdezaktywowane" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

module.exports = { getProfile, changePassword, deactivateAccount };

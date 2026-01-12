const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

/**
 * Rejestracja nowego użytkownika
 */
async function register(req, res) {
  try {
    const { login, email, password } = req.body;
    
    // Walidacja danych wejściowych
    if (!login || !email || !password)
      return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Hasło musi mieć minimum 6 znaków' });
    if (login.length < 3)
      return res.status(400).json({ error: 'Login musi mieć minimum 3 znaki' });
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ error: 'Niepoprawny email' });
    
    // Sprawdzenie, czy login lub email już istnieją
    const existingEmail = await userModel.findUserByEmail(email);
    const existingLogin = await userModel.findUserByLogin(login);
    if (existingEmail) return res.status(400).json({ error: 'Email już istnieje' });
    if (existingLogin) return res.status(400).json({ error: 'Login już istnieje' });

    // Tworzenie użytkownika
    const user = await userModel.createUser(login, email, password);
    res.json(user);

  } catch (err) {
    console.error("Błąd rejestracji:", err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
}

/**
 * Logowanie użytkownika
 */
async function login(req, res) {
  try {
    const { login, password } = req.body;

    // Walidacja danych wejściowych
    if (!login || !password)
      return res.status(400).json({ error: 'Podaj login i hasło' });

    const user = await userModel.findUserByLogin(login);
    if (!user) return res.status(400).json({ error: 'Nieprawidłowy login lub hasło' });

    // Sprawdzenie, czy konto aktywne
    if (user.is_active === false)
      return res.status(403).json({ error: 'Konto jest zdezaktywowane' });

    // Weryfikacja hasła
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Nieprawidłowy login lub hasło' });

    // Generowanie tokena JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, login: user.login, role: user.role, email: user.email });

  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
}

/**
 * Odświeżenie tokena JWT
 */
async function refreshToken(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Brak tokenu" });

    // Pobranie tokena z nagłówka
    const token = authHeader.split(" ").pop();

    let decoded;
    try {
      // ignoreExpiration pozwala odświeżyć wygasły token
      decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    } catch (err) {
      return res.status(401).json({ error: "Nieprawidłowy token" });
    }

    // Sprawdzenie, czy użytkownik istnieje
    const user = await userModel.findUserById(decoded.id);
    if (!user) return res.status(401).json({ error: "Użytkownik nie istnieje" });

    // Generowanie nowego tokena
    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // nowy token ważny 1h
    );

    res.status(200).json({ token: newToken });

  } catch (err) {
    console.error("Błąd refreshToken:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

module.exports = { register, login, refreshToken };

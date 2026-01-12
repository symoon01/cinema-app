// Import konfiguracji połączenia z bazą danych
const pool = require('../config/db');
// Import biblioteki do haszowania haseł
const bcrypt = require('bcrypt');

/**
 * Tworzy nowego użytkownika w bazie danych.
 * Hasło zostaje zhashowane.
 * @param {string} login - login użytkownika
 * @param {string} email - adres email użytkownika
 * @param {string} password - hasło użytkownika
 * @returns {object} nowo utworzony użytkownik (id, login, email, rola)
 */
async function createUser(login, email, password) {
  const hash = await bcrypt.hash(password, 10);
  const res = await pool.query(
    `INSERT INTO users (login, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, login, email, role`,
    [login, email, hash, 'USER']
  );
  return res.rows[0];
}

/**
 * Znajduje użytkownika po adresie email
 * @param {string} email 
 * @returns {object|null} użytkownik lub null
 */
async function findUserByEmail(email) {
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return res.rows[0];
}

/**
 * Znajduje użytkownika po loginie
 * @param {string} login 
 * @returns {object|null} użytkownik lub null
 */
async function findUserByLogin(login) {
  const res = await pool.query(
    'SELECT * FROM users WHERE login = $1',
    [login]
  );
  return res.rows[0];
}

/**
 * Znajduje użytkownika po ID
 * @param {number} id 
 * @returns {object|null} użytkownik (id, login, email, rola, data utworzenia) lub null
 */
async function findUserById(id) {
  const res = await pool.query(
    'SELECT id, login, email, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return res.rows[0];
}

/**
 * Pobiera hash hasła użytkownika po jego ID
 * @param {number} userId 
 * @returns {object} { password_hash }
 */
async function getUserPasswordHash(userId) {
  const res = await pool.query(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId]
  );
  return res.rows[0];
}

/**
 * Zmienia hasło użytkownika
 * @param {number} userId 
 * @param {string} newPassword 
 * @returns {boolean} true jeśli operacja zakończona sukcesem
 */
async function changePassword(userId, newPassword) {
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query(
    "UPDATE users SET password_hash=$1 WHERE id=$2",
    [hash, userId]
  );
  return true;
}

/**
 * Dezaktywuje konto użytkownika (ustawia is_active=false)
 * @param {number} userId 
 * @returns {boolean} true jeśli operacja zakończona sukcesem
 */
async function deactivateUser(userId) {
  await pool.query(
    "UPDATE users SET is_active=false WHERE id=$1",
    [userId]
  );
  return true;
}

// Eksport funkcji do użycia w kontrolerach
module.exports = {
  createUser,
  findUserByEmail,
  findUserByLogin,
  findUserById,
  getUserPasswordHash,
  changePassword,
  deactivateUser
};

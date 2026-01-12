// Import konfiguracji połączenia z bazą danych
const pool = require('../config/db');

/**
 * Pobiera wszystkie seanse wraz z informacjami o filmach.
 * @returns {Array} Lista seansów
 */
async function getAllScreenings() {
  const res = await pool.query(`
    SELECT s.id, m.title, s.movie_id, m.description, m.category, s.screening_time, s.hall_number
    FROM screenings s
    JOIN movies m ON s.movie_id = m.id
    ORDER BY s.screening_time
  `);
  return res.rows;
}

/**
 * Pobiera szczegóły pojedynczego seansu po jego ID.
 * @param {number} screeningId - ID seansu
 * @returns {object} Szczegóły seansu
 */
async function getScreeningById(screeningId) {
  const res = await pool.query(
    `SELECT s.id, m.title, m.description, m.category, s.screening_time, s.hall_number
     FROM screenings s
     JOIN movies m ON s.movie_id = m.id
     WHERE s.id = $1`,
    [screeningId]
  );
  return res.rows[0];
}

/**
 * Pobiera film powiązany z danym seansem.
 * @param {number} screeningId - ID seansu
 * @returns {object} Film
 */
async function getMovieByScreeningId(screeningId) {
  const res = await pool.query(`
    SELECT m.* FROM movies m
    JOIN screenings s ON s.movie_id = m.id
    WHERE s.id = $1
  `, [screeningId]);
  return res.rows[0];
}

/**
 * Pobiera wszystkie aktywne seanse (w przyszłości).
 * @returns {Array} Lista aktywnych seansów
 */
async function getAllActiveScreenings() {
  const res = await pool.query(`
    SELECT s.id, m.title, m.description, m.category, s.screening_time, s.hall_number
    FROM screenings s
    JOIN movies m ON s.movie_id = m.id
    WHERE s.screening_time > NOW()
    ORDER BY s.screening_time
  `);
  return res.rows;
}

/**
 * Sprawdza, czy dany seans jest aktywny (czy jeszcze nie minął).
 * @param {number} screeningId - ID seansu
 * @returns {boolean} true jeśli seans jest w przyszłości
 */
async function check_if_screening_is_active(screeningId) {
  const res = await pool.query(`
    SELECT s.id
    FROM screenings s
    WHERE s.screening_time > NOW() AND s.id=$1
  `, [screeningId]);
  return res.rows.length > 0;
}

/**
 * Sprawdza, czy seans powiązany z rezerwacją jest aktywny.
 * @param {number} reservationId - ID rezerwacji
 * @returns {boolean} true jeśli seans jest w przyszłości
 */
async function check_if_reservation_screening_is_active(reservationId) {
  const res = await pool.query(`
    SELECT s.screening_time
    FROM reservations r
    JOIN screenings s ON r.screening_id = s.id
    WHERE r.id = $1
  `, [reservationId]);

  if (res.rows.length === 0) return false;

  const screeningTime = new Date(res.rows[0].screening_time);
  return screeningTime > new Date();
}

/**
 * Tworzy nowy seans.
 * @param {number} movieId - ID filmu
 * @param {string|Date} screeningTime - Data i godzina seansu
 * @param {number} hallNumber - Numer sali
 * @returns {object} Stworzony seans
 */
async function createScreening(movieId, screeningTime, hallNumber) {
  const res = await pool.query(
    `INSERT INTO screenings (movie_id, screening_time, hall_number)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [movieId, screeningTime, hallNumber]
  );
  return res.rows[0];
}

/**
 * Usuwa seans po ID.
 * @param {number} id - ID seansu
 */
async function deleteScreening(id) {
  await pool.query("DELETE FROM screenings WHERE id = $1", [id]);
}

/**
 * Sprawdza, czy seans ma przypisane rezerwacje.
 * @param {number} screeningId - ID seansu
 * @returns {boolean} true jeśli istnieją rezerwacje
 */
async function hasReservations(screeningId) {
  const res = await pool.query(
    "SELECT COUNT(*) FROM reservations WHERE screening_id=$1",
    [screeningId]
  );
  return Number(res.rows[0].count) > 0;
}

/**
 * Aktualizuje dane seansu.
 * @param {number} id - ID seansu
 * @param {string|Date} screeningTime - Nowa data i godzina
 * @param {number} hallNumber - Numer sali
 * @param {number} movie_id - ID filmu
 */
async function updateScreening(id, screeningTime, hallNumber, movie_id) {
  await pool.query(
    "UPDATE screenings SET screening_time=$1, hall_number=$2, movie_id=$3 WHERE id=$4",
    [screeningTime, hallNumber, movie_id, id]
  );
}

/**
 * Sprawdza, czy sala jest dostępna w podanym czasie (brak kolizji z innymi seansami).
 * @param {number} hallNumber - Numer sali
 * @param {string|Date} screeningTime - Czas nowego seansu
 * @param {number} duration - Czas trwania filmu w minutach
 * @param {number|null} excludeScreeningId - ID seansu do wykluczenia z sprawdzenia (przy aktualizacji)
 * @returns {boolean} true jeśli sala jest wolna
 */
async function isHallAvailable(hallNumber, screeningTime, duration, excludeScreeningId = null) {
  const res = await pool.query(`
    SELECT s.id, m.duration, s.screening_time
    FROM screenings s
    JOIN movies m ON s.movie_id = m.id
    WHERE s.hall_number=$1
  `, [hallNumber]);

  const newStart = new Date(screeningTime);
  const newEnd = new Date(newStart.getTime() + duration * 60000); // przeliczenie minut na ms

  for (const s of res.rows) {
    const existingStart = new Date(s.screening_time);
    const existingEnd = new Date(existingStart.getTime() + s.duration * 60000);

    // sprawdzenie kolizji
    if (newStart < existingEnd && newEnd > existingStart && s.id != excludeScreeningId) {
      return false; // kolizja
    }
  }
  return true;
}

// Eksport funkcji do kontrolerów
module.exports = { 
  getAllScreenings, createScreening, deleteScreening, updateScreening, hasReservations,
  isHallAvailable, getScreeningById, getAllActiveScreenings, getMovieByScreeningId,
  check_if_screening_is_active, check_if_reservation_screening_is_active 
};

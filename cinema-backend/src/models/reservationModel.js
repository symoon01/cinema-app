const pool = require('../config/db');

/**
 * Tworzy rezerwację miejsca dla użytkownika na konkretny seans
 * @param {number} userId - ID użytkownika
 * @param {number} screeningId - ID seansu
 * @param {number} seatId - ID miejsca
 * @returns {object} - zapis rezerwacji z bazy
 */
async function createReservation(userId, screeningId, seatId) {
  const res = await pool.query(
    'INSERT INTO reservations (user_id, screening_id, seat_id) VALUES ($1, $2, $3) RETURNING *',
    [userId, screeningId, seatId]
  );
  return res.rows[0];
}

/**
 * Sprawdza, czy dane miejsce na danym seansie jest już zarezerwowane
 * @param {number} screeningId - ID seansu
 * @param {number} seatId - ID miejsca
 * @returns {boolean} - true jeśli miejsce jest zajęte, false jeśli wolne
 */
async function check_if_seat_is_reserved(screeningId, seatId) {
  const res = await pool.query(
    'SELECT * FROM reservations WHERE screening_id=$1 AND seat_id=$2',
    [screeningId, seatId]
  );
  return res.rows.length > 0;
}

/**
 * Pobiera wszystkie rezerwacje danego użytkownika
 * @param {number} userId - ID użytkownika
 * @returns {Array} - lista rezerwacji wraz z informacjami o seansie, filmie i miejscu
 */
async function getReservationsByUser(userId) {
  const res = await pool.query(`
    SELECT r.id, k.seat_number, k.row_number, r.screening_id, s.screening_time, m.title, s.hall_number
    FROM reservations r
    JOIN screenings s ON r.screening_id = s.id
    JOIN movies m ON s.movie_id = m.id
    JOIN seats k ON r.seat_id = k.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
  `, [userId]);
  return res.rows;
}

/**
 * Anuluje rezerwację o podanym ID
 * @param {number} reservationId - ID rezerwacji
 * @param {number} userId - ID użytkownika do weryfikacji własności rezerwacji
 * @returns {boolean} - zawsze true (zakłada poprawne wykonanie zapytania)
 */
async function cancelReservation(reservationId, userId) {
  await pool.query("DELETE FROM reservations WHERE id=$1 AND user_id=$2", [reservationId, userId]);
  return true;
}

/**
 * Sprawdza, czy dana rezerwacja należy do podanego użytkownika
 * @param {number} reservationId - ID rezerwacji
 * @param {number} userId - ID użytkownika
 * @returns {boolean} - true jeśli rezerwacja należy do użytkownika
 */
async function check_if_reservation_belongs_to_user(reservationId, userId) {
  const res = await pool.query(
    'SELECT * FROM reservations WHERE id=$1 AND user_id=$2',
    [reservationId, userId]
  );
  return res.rows.length > 0;
}

module.exports = {
  createReservation,
  getReservationsByUser,
  cancelReservation,
  check_if_seat_is_reserved,
  check_if_reservation_belongs_to_user
};

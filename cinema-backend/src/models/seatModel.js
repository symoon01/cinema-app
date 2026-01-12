// Import konfiguracji połączenia z bazą danych
const pool = require('../config/db');

/**
 * Pobiera wszystkie miejsca dla danego seansu wraz z informacją, czy są zarezerwowane.
 * @param {number} screeningId - ID seansu
 * @returns {Array} Lista miejsc (seat_id, row_number, seat_number, reserved)
 */
async function getSeatsByScreening(screeningId) {
  const res = await pool.query(`
    SELECT s.id AS seat_id, s.row_number, s.seat_number,
           CASE WHEN r.id IS NULL THEN false ELSE true END AS reserved
    FROM seats s
    LEFT JOIN reservations r
      ON r.seat_id = s.id AND r.screening_id = $1
    WHERE s.hall_number = (
      SELECT hall_number FROM screenings WHERE id = $1
    )
    ORDER BY s.row_number, s.seat_number
  `, [screeningId]);

  return res.rows;
}

/**
 * Pobiera dane pojedynczego miejsca po jego ID.
 * @param {number} seatId - ID miejsca
 * @returns {object|null} Miejsce lub null jeśli nie istnieje
 */
async function getSeatById(seatId) {
  const res = await pool.query(
    `SELECT * FROM seats WHERE id=$1`,
    [seatId]
  );
  return res.rows[0] || null;
}

/**
 * Sprawdza, czy dana sala istnieje w tabeli miejsc.
 * @param {number} hall_number - numer sali
 * @returns {boolean} true jeśli sala istnieje, false jeśli nie
 */
async function check_if_hall_exists(hall_number) {
  const res = await pool.query(
    "SELECT 1 FROM seats WHERE hall_number=$1 LIMIT 1",
    [hall_number]
  );
  return res.rows.length > 0;
}

// Eksport funkcji do użycia w kontrolerach
module.exports = { getSeatsByScreening, check_if_hall_exists, getSeatById };

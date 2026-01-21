const pool = require("../config/db");

/**
 * Pobiera wszystkie filmy z bazy posortowane alfabetycznie po tytule
 * @returns {Array} - lista filmów
 */
async function getAllMovies() {
  const res = await pool.query(`
    SELECT id, title, duration, description, category
    FROM movies
    ORDER BY title
  `);
  return res.rows;
}

/**
 * Tworzy nowy film w bazie
 * @param {string} title - tytuł filmu
 * @param {number} duration - czas trwania filmu w minutach
 * @param {string} category - kategoria filmu
 * @param {string} description - opis filmu
 * @returns {object} - zapis filmu z bazy
 */
async function createMovie(title, duration, category, description) {
  const res = await pool.query(
    "INSERT INTO movies (title, duration, category, description) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, duration, category, description]
  );
  return res.rows[0];
}

/**
 * Usuwa film o podanym ID
 * @param {number} id - ID filmu
 */
async function deleteMovie(id) {
  await pool.query("DELETE FROM movies WHERE id = $1", [id]);
}

/**
 * Aktualizuje dane filmu o podanym ID
 * @param {number} id - ID filmu
 * @param {string} title - nowy tytuł filmu
 * @param {number} duration - nowy czas trwania w minutach
 * @param {string} category - nowa kategoria
 * @param {string} description - nowy opis
 */
async function updateMovie(id, title, duration, category, description) {
  await pool.query(
    "UPDATE movies SET title=$1, duration=$2, category=$3, description=$4 WHERE id=$5",
    [title, duration, category, description, id]
  );
}

/**
 * Wyszukuje film po ID (zwraca obiekt lub undefined)
 * @param {number} id - ID filmu
 * @returns {object|undefined} - film lub undefined jeśli nie istnieje
 */
async function findMovieById(id) {
  const res = await pool.query("SELECT * FROM movies WHERE id=$1", [id]);
  return res.rows[0];
}

/**
 * Wyszukuje film po ID (zwraca obiekt lub null)
 * @param {number} id - ID filmu
 * @returns {object|null} - film lub null jeśli nie istnieje
 */
async function getMovieById(id) {
  const res = await pool.query("SELECT * FROM movies WHERE id=$1", [id]);
  return res.rows[0] || null;
}

/**
 * Sprawdza, czy film jest w jakimkolwiek aktywnym seansie (przyszłym)
 * @param {number} movieId - ID filmu
 * @returns {boolean} - true jeśli film jest w aktywnych seansach
 */
async function check_if_movie_is_in_active_screenings(movieId) {
  const res = await pool.query(
    "SELECT * FROM screenings WHERE movie_id=$1 AND screening_time > (now() AT TIME ZONE 'Europe/Warsaw')",
    [movieId]
  );
  return res.rows.length > 0;
}

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
  updateMovie,
  findMovieById,
  getMovieById,
  check_if_movie_is_in_active_screenings
};

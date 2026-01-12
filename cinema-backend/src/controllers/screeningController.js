const screeningModel = require('../models/screeningModel');
const movieModel = require('../models/movieModel');
const seatModel = require('../models/seatModel');

/**
 * Pobranie wszystkich seansów
 */
async function getScreenings(req, res) {
  try {
    const screenings = await screeningModel.getAllScreenings();
    res.json(screenings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
}

/**
 * Pobranie wszystkich aktywnych seansów (w przyszłości)
 */
async function getActiveScreenings(req, res) {
  try {
    const screenings = await screeningModel.getAllActiveScreenings();
    res.json(screenings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
}

/**
 * Utworzenie nowego seansu
 */
async function createScreening(req, res) {
  try {
    const { movie_id, screening_time, hall_number } = req.body;

    // Walidacja danych wejściowych
    if (!movie_id || !screening_time || !hall_number)
      return res.status(400).json({ error: "Brak danych" });

    const hallNumber = Number(hall_number);
    if (!Number.isInteger(hallNumber) || hallNumber <= 0)
      return res.status(400).json({ error: "Numer sali musi być dodatnią liczbą" });

    const screeningDate = new Date(screening_time);
    if (isNaN(screeningDate.getTime()))
      return res.status(400).json({ error: "Nieprawidłowa data seansu" });
    if (screeningDate <= new Date())
      return res.status(400).json({ error: "Seans musi być w przyszłości" });

    // Sprawdzenie filmu
    const movie = await movieModel.findMovieById(movie_id);
    if (!movie) return res.status(400).json({ error: "Nie istnieje film o podanym ID" });
    if (movie.duration === null) return res.status(400).json({ error: "Film nie ma ustawionego czasu trwania" });

    // Sprawdzenie sali
    const hallExists = await seatModel.check_if_hall_exists(hallNumber);
    if (!hallExists) return res.status(400).json({ error: "Sala nie istnieje" });

    // Sprawdzenie dostępności sali w danym czasie
    const isAvailable = await screeningModel.isHallAvailable(hallNumber, screening_time, movie.duration);
    if (!isAvailable) return res.status(400).json({ error: "Sala jest zajęta w tym czasie" });

    // Tworzenie seansu
    const screening = await screeningModel.createScreening(movie_id, screening_time, hallNumber);
    res.status(201).json(screening);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Usunięcie seansu
 */
async function deleteScreening(req, res) {
  try {
    const { id } = req.params;
    // Walidacja ID seansu
    if (!id || isNaN(Number(id))) return res.status(400).json({ error: "Nieprawidłowe ID seansu" });

    const screening = await screeningModel.getScreeningById(id);
    if (!screening) return res.status(404).json({ error: "Seans nie znaleziony" });

    await screeningModel.deleteScreening(id);
    res.status(204).end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Pobranie seansu po ID
 */
async function getScreeningById(req, res) {
  try {
    const { id } = req.params;
    // Walidacja ID seansu
    if (!id || isNaN(Number(id))) return res.status(400).json({ error: "Nieprawidłowe ID seansu" });

    const screening = await screeningModel.getScreeningById(id);
    if (!screening) return res.status(404).json({ error: "Seans nie znaleziony" });

    res.json(screening);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Edycja seansu
 */
async function editScreening(req, res) {
  try {
    const { id } = req.params;
    const { movie_id, screening_time, hall_number } = req.body;

    // Walidacja danych wejściowych
    if (!id || isNaN(Number(id))) return res.status(400).json({ error: "Nieprawidłowe ID seansu" });
    if (!movie_id || !screening_time || !hall_number) return res.status(400).json({ error: "Brak danych" });

    const hallNumber = Number(hall_number);
    if (!Number.isInteger(hallNumber) || hallNumber <= 0) return res.status(400).json({ error: "Numer sali musi być dodatnią liczbą" });

    const screeningDate = new Date(screening_time);
    if (isNaN(screeningDate.getTime())) return res.status(400).json({ error: "Nieprawidłowa data seansu" });

    // Pobranie istniejącego seansu
    const existingScreening = await screeningModel.getScreeningById(id);
    if (!existingScreening) return res.status(404).json({ error: "Seans nie istnieje" });

    const currentStart = new Date(existingScreening.screening_time);
    if (new Date() >= currentStart) return res.status(400).json({ error: "Seans już się rozpoczął lub zakończył - brak możliwości edycji" });

    // Sprawdzenie filmu
    const movie = await movieModel.findMovieById(movie_id);
    if (!movie) return res.status(400).json({ error: "Nie istnieje film o podanym ID" });
    if (movie.duration === null) return res.status(400).json({ error: "Film nie ma ustawionego czasu trwania" });

    // Sprawdzenie sali
    const hallExists = await seatModel.check_if_hall_exists(hallNumber);
    if (!hallExists) return res.status(400).json({ error: "Sala nie istnieje" });

    // Sprawdzenie dostępności sali
    const isAvailable = await screeningModel.isHallAvailable(hallNumber, screening_time, movie.duration, id);
    if (!isAvailable) return res.status(400).json({ error: "Sala jest zajęta w tym czasie" });

    // Sprawdzenie, czy seans ma już rezerwacje
    const blocked = await screeningModel.hasReservations(id);
    if (blocked) return res.status(400).json({ error: "Seans ma rezerwacje – brak edycji" });

    await screeningModel.updateScreening(id, screening_time, hallNumber, movie_id);
    res.json({ message: "Seans zaktualizowany" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd edycji seansu" });
  }
}

module.exports = {
  getScreenings,
  getActiveScreenings,
  createScreening,
  deleteScreening,
  getScreeningById,
  editScreening
};

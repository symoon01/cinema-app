const movieModel = require("../models/movieModel");

/**
 * Pobranie wszystkich filmów
 */
async function getMovies(req, res) {
  try {
    const movies = await movieModel.getAllMovies();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Dodanie nowego filmu
 */
async function addMovie(req, res) {
  try {
    const { title, duration, category, description } = req.body;

    // Walidacja danych wejściowych
    if (!title || !duration || !category || !description)
      return res.status(400).json({ error: "Niepełne dane" });

    const dur = Number(duration);
    if (dur <= 0) return res.status(400).json({ error: "Czas trwania musi być większy niż 0" });
    if (title.length > 100) return res.status(400).json({ error: "Tytuł filmu nie może przekraczać 100 znaków" });
    if (description.length > 250) return res.status(400).json({ error: "Opis filmu nie może przekraczać 250 znaków" });
    if (category.length > 50) return res.status(400).json({ error: "Kategoria filmu nie może przekraczać 50 znaków" });

    // Tworzenie filmu
    const movie = await movieModel.createMovie(title, dur, category, description);
    res.status(201).json(movie);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Usunięcie filmu
 */
async function deleteMovie(req, res) {
  try {
    const { id } = req.params;
    // Walidacja ID filmu
    if (!id || isNaN(Number(id))) return res.status(400).json({ error: "Nieprawidłowe ID filmu" });

    const existingMovie = await movieModel.findMovieById(id);
    if (!existingMovie) return res.status(404).json({ error: "Film o podanym ID nie istnieje" });

    // Usunięcie filmu
    await movieModel.deleteMovie(id);
    res.status(204).end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
}

/**
 * Edycja filmu
 */
async function editMovie(req, res) {
  try {
    const { id } = req.params;
    // Walidacja ID filmu
    if (!id || isNaN(Number(id))) return res.status(400).json({ error: "Nieprawidłowe ID filmu" });

    const { title, duration, category, description } = req.body;

    // Walidacja danych
    if (!title || !duration || !category || !description)
      return res.status(400).json({ error: "Niepełne dane" });

    const dur = Number(duration);
    if (dur <= 0) return res.status(400).json({ error: "Czas trwania musi być większy niż 0" });
    if (title.length > 100) return res.status(400).json({ error: "Tytuł filmu nie może przekraczać 100 znaków" });
    if (description.length > 250) return res.status(400).json({ error: "Opis filmu nie może przekraczać 250 znaków" });
    if (category.length > 50) return res.status(400).json({ error: "Kategoria filmu nie może przekraczać 50 znaków" });

    // Sprawdzenie czy film istnieje
    const existingMovie = await movieModel.findMovieById(id);
    if (!existingMovie) return res.status(404).json({ error: "Film o podanym ID nie istnieje" });

    // Blokada edycji czasu trwania jeśli film jest używany w aktywnych seansach
    const isUsedInScreenings = await movieModel.check_if_movie_is_in_active_screenings(id);
    const durationChanged = existingMovie.duration !== dur;
    if (isUsedInScreenings && durationChanged)
      return res.status(400).json({ error: "Film jest używany w seansach – brak edycji czasu trwania" });

    // Aktualizacja filmu
    await movieModel.updateMovie(id, title, dur, category, description);
    res.json({ message: "Film zaktualizowany" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd edycji filmu" });
  }
}

module.exports = { getMovies, addMovie, deleteMovie, editMovie };

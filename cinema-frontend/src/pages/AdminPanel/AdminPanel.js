import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import MovieModal from "./MovieModal";
import ScreeningModal from "./ScreeningModal";
import MovieColumn from "./MovieColumn";
import ScreeningColumn from "./ScreeningColumn";
import './AdminPanel.css';

export default function AdminPanel() {
  const { user } = useContext(AuthContext); // pobranie danych użytkownika z kontekstu
  const [movies, setMovies] = useState([]); // lista filmów
  const [screenings, setScreenings] = useState([]); // lista seansów

  // Stan dla edycji/dodawania filmów
  const [editingMovie, setEditingMovie] = useState(null);
  const [addMovieModal, setAddMovieModal] = useState(false);
  const [movieForm, setMovieForm] = useState({ title: "", duration: "", category: "", description: "" });

  // Stan dla edycji/dodawania seansów
  const [editingScreening, setEditingScreening] = useState(null);
  const [addScreeningModal, setAddScreeningModal] = useState(false);
  const [screeningForm, setScreeningForm] = useState({ movie_id: "", screening_time: "", hall_number: "" });

  // Filtrowanie i sortowanie
  const [movieFilter, setMovieFilter] = useState("");
  const [movieSort, setMovieSort] = useState("title-asc");
  const [screeningFilter, setScreeningFilter] = useState("");
  const [screeningSort, setScreeningSort] = useState("time-desc");

  const authHeader = { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" };

  // Pobranie filmów i seansów po załadowaniu użytkownika
  useEffect(() => { 
    if (user?.token) { 
      fetchMovies(); 
      fetchScreenings(); 
    } 
  }, [user?.token]);

  // Pobranie listy filmów
  const fetchMovies = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/movies`, { headers: authHeader });
      setMovies(await res.json());
    } catch (err) {
      console.error(err); 
      toast.error("Błąd ładowania filmów");
    }
  };

  // Pobranie listy seansów
  const fetchScreenings = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/screenings`, { headers: authHeader });
      setScreenings(await res.json());
    } catch (err) { 
      console.error(err); 
      toast.error("Błąd ładowania seansów");
    }
  };

  // Funkcja zapisująca film (dodawanie lub edycja)
  const saveMovie = async (isEdit) => {
    const data = isEdit ? editingMovie : movieForm;

    // Walidacja formularza
    if (!data.title || !data.duration || !data.description || !data.category)
      return toast.error("Brakuje danych w formularzu");
    if (Number(data.duration) <= 0) return toast.error("Czas trwania musi być większy niż 0");
    if (data.title.length > 100) return toast.error("Tytuł filmu nie może przekraczać 100 znaków");
    if (data.description.length > 250) return toast.error("Opis filmu nie może przekraczać 250 znaków");
    if (data.category.length > 50) return toast.error("Kategoria filmu nie może przekraczać 50 znaków");

    const url = isEdit 
      ? `${process.env.REACT_APP_API_URL}/api/admin/movies/${editingMovie.id}` 
      : `${process.env.REACT_APP_API_URL}/api/admin/movies`;

    const res = await fetch(url, { 
      method: isEdit ? "PUT" : "POST", 
      headers: authHeader, 
      body: JSON.stringify(data) 
    });

    if (res.ok) {
      toast.success("Zapisano pomyślnie");
      setEditingMovie(null); 
      setAddMovieModal(false);
      setMovieForm({ title: "", duration: "", category: "", description: "" });
      fetchMovies(); 
      fetchScreenings();
    } else toast.error((await res.json()).error || "Błąd zapisu filmu");
  };

  // Funkcja usuwająca film
  const deleteMovie = async (id) => {
    if (!window.confirm("Usunąć film? Usunie też seanse")) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/movies/${id}`, { method: "DELETE", headers: authHeader });
    if (res.ok) { 
      toast.success("Film usunięty pomyślnie"); 
      fetchMovies(); 
      fetchScreenings(); 
    } else toast.error((await res.json()).error || "Błąd usuwania filmu");
  };

  // Dodawanie nowego seansu
  const addScreening = async () => {
    // Walidacja formularza
    if (!screeningForm.movie_id || !screeningForm.screening_time || !screeningForm.hall_number)
      return toast.error("Uzupełnij wszystkie pola");
    const hallNumber = Number(screeningForm.hall_number);
    if (!Number.isInteger(hallNumber) || hallNumber <= 0) return toast.error("Numer sali musi być dodatnią liczbą");
    const screeningDate = new Date(screeningForm.screening_time);
    if (isNaN(screeningDate.getTime())) return toast.error("Nieprawidłowa data seansu");
    if (screeningDate <= new Date()) return toast.error("Seans musi być w przyszłości");

    const payload = { ...screeningForm, movie_id: Number(screeningForm.movie_id), hall_number: hallNumber };
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/screenings`, { method: "POST", headers: authHeader, body: JSON.stringify(payload) });
    const data = await res.json();
    if (res.ok) { 
      toast.success("Dodano seans"); 
      setAddScreeningModal(false); 
      setScreeningForm({ movie_id: "", screening_time: "", hall_number: "" }); 
      fetchScreenings(); 
    } else toast.error(data.error || "Błąd dodawania seansu");
  };

  // Aktualizacja istniejącego seansu
  const updateScreening = async () => {
    // Walidacja formularza
    if (!editingScreening.movie_id) return toast.error("Wybierz film");
    if (!editingScreening.screening_time) return toast.error("Podaj datę i godzinę seansu");
    const hallNumber = Number(editingScreening.hall_number);
    if (!Number.isInteger(hallNumber) || hallNumber <= 0) return toast.error("Numer sali musi być dodatnią liczbą");
    const screeningDate = new Date(editingScreening.screening_time);
    if (isNaN(screeningDate.getTime())) return toast.error("Nieprawidłowa data seansu");
    
    const payload = { ...editingScreening, movie_id: Number(editingScreening.movie_id), hall_number: hallNumber };
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/screenings/${editingScreening.id}`, { method: "PUT", headers: authHeader, body: JSON.stringify(payload) });
    const data = await res.json();
    if (res.ok) { 
      toast.success("Seans zaktualizowany pomyślnie"); 
      setEditingScreening(null); 
      fetchScreenings(); 
    } else toast.error(data.error || "Błąd aktualizacji seansu");
  };

  // Usuwanie seansu
  const deleteScreening = async (id) => {
    if (!window.confirm("Usunąć seans?")) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/screenings/${id}`, { method: "DELETE", headers: authHeader });
    if(res.ok) toast.success("Seans usunięty pomyślnie");
    else toast.error((await res.json()).error || "Błąd usuwania seansu");
    fetchScreenings();
  };

  // Filtrowanie i sortowanie filmów
  const filteredMovies = movies
    .filter(m => m.title.toLowerCase().includes(movieFilter.toLowerCase()))
    .sort((a, b) => movieSort === "title-asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));

  // Filtrowanie i sortowanie seansów
  const filteredScreenings = screenings
    .filter(s => s.title.toLowerCase().includes(screeningFilter.toLowerCase()))
    .sort((a, b) => screeningSort === "time-asc" ? new Date(a.screening_time) - new Date(b.screening_time) : new Date(b.screening_time) - new Date(a.screening_time));

  return (
    <div className="admin-container">
      <h1>Panel administratora</h1>
      <div className="admin-columns">
        {/* Kolumna filmów */}
        <MovieColumn 
          setAddMovieModal={setAddMovieModal}
          movieFilter={movieFilter} setMovieFilter={setMovieFilter}
          movieSort={movieSort} setMovieSort={setMovieSort}
          filteredMovies={filteredMovies}
          setEditingMovie={setEditingMovie}
          deleteMovie={deleteMovie}
        />
        {/* Kolumna seansów */}
        <ScreeningColumn 
          setAddScreeningModal={setAddScreeningModal}
          screeningFilter={screeningFilter} setScreeningFilter={setScreeningFilter}
          screeningSort={screeningSort} setScreeningSort={setScreeningSort}
          filteredScreenings={filteredScreenings}
          setEditingScreening={setEditingScreening}
          deleteScreening={deleteScreening}
        />
      </div>

      {/* MODALE */}
      {(editingMovie || addMovieModal) && (
        <MovieModal 
          editingMovie={editingMovie} setEditingMovie={setEditingMovie}
          movieForm={movieForm} setMovieForm={setMovieForm}
          setAddMovieModal={setAddMovieModal} saveMovie={saveMovie} 
        />
      )}
      {(editingScreening || addScreeningModal) && (
        <ScreeningModal 
          editingScreening={editingScreening} setEditingScreening={setEditingScreening}
          screeningForm={screeningForm} setScreeningForm={setScreeningForm}
          setAddScreeningModal={setAddScreeningModal} movies={movies}
          addScreening={addScreening} updateScreening={updateScreening} 
        />
      )}
    </div>
  );
}

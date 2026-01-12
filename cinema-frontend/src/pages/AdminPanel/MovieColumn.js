import React from 'react';
import { MovieItem } from "./MovieItem";

export default function MovieColumn({ 
  setAddMovieModal,             // funkcja do otwarcia modala dodawania filmu
  movieFilter, setMovieFilter,  // stan i setter filtra wyszukiwania filmów
  movieSort, setMovieSort,      // stan i setter sortowania filmów
  filteredMovies,               // przefiltrowana i posortowana lista filmów
  setEditingMovie,              // setter dla edytowanego filmu
  deleteMovie                   // funkcja do usuwania filmu
}) {
  return (
    <div className="admin-column">
      {/* Nagłówek kolumny */}
      <h2>Filmy</h2>

      {/* Przycisk otwierający modal dodawania filmu */}
      <button className="add-button" onClick={() => setAddMovieModal(true)}>Dodaj film</button>

      {/* Pole wyszukiwania i sortowania */}
      <div className="filter-sort">
        <input 
          placeholder="Szukaj..." 
          value={movieFilter} 
          onChange={e => setMovieFilter(e.target.value)} // aktualizacja filtra
        />
        <select value={movieSort} onChange={e => setMovieSort(e.target.value)}>
          <option value="title-asc">A-Z</option>
          <option value="title-desc">Z-A</option>
        </select>
      </div>

      {/* Lista wyświetlanych filmów */}
      <div className="admin-list">
        {filteredMovies.map(m => (
          <MovieItem 
            key={m.id} 
            movie={m} 
            onEdit={setEditingMovie} // przekazanie funkcji edycji filmu
            onDelete={deleteMovie}   // przekazanie funkcji usuwania filmu
          />
        ))}
      </div>
    </div>
  );
}

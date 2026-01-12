import React from 'react';

export default function ScreeningColumn({ 
  setAddScreeningModal,                 // funkcja do otwarcia modala dodawania seansu
  screeningFilter, setScreeningFilter,  // stan i setter filtra wyszukiwania seansów
  screeningSort, setScreeningSort,      // stan i setter sortowania seansów
  filteredScreenings,                   // przefiltrowana i posortowana lista seansów
  setEditingScreening,                  // setter dla seansu, który chcemy edytować
  deleteScreening                       // funkcja do usuwania seansu
}) {
  // Funkcja do przygotowania danych do edycji – konwertuje czas na lokalny format dla input type="datetime-local"
  const handleEditClick = (s) => {
    const date = new Date(s.screening_time);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // korekta strefy czasowej
    setEditingScreening({ ...s, screening_time: local.toISOString().slice(0, 16) }); // zapis do stanu
  };

  return (
    <div className="admin-column">
      {/* Nagłówek kolumny */}
      <h2>Seanse</h2>
      {/* Przycisk dodawania seansu */}
      <button className="add-button" onClick={() => setAddScreeningModal(true)}>Dodaj seans</button>

      {/* Filtr i sortowanie */}
      <div className="filter-sort">
        <input 
          placeholder="Szukaj..." 
          value={screeningFilter} 
          onChange={e => setScreeningFilter(e.target.value)} 
        />
        <select value={screeningSort} onChange={e => setScreeningSort(e.target.value)}>
          <option value="time-asc">najstarsze</option>
          <option value="time-desc">najnowsze</option>
        </select>
      </div>

      {/* Lista seansów */}
      <div className="admin-list">
        {filteredScreenings.map(s => (
          <div key={s.id} className="admin-item">
            {/* Wyświetlenie tytułu, czasu seansu i sali */}
            {s.title} – {new Date(s.screening_time).toLocaleString()} (Sala {s.hall_number})

            {/* Akcje edycji i usuwania */}
            <div className="admin-actions">
              <button className="edit-button" onClick={() => handleEditClick(s)}>Edytuj</button>
              <button className="delete-button" onClick={() => deleteScreening(s.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

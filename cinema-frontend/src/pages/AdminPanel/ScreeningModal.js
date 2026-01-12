import React from 'react';

export default function ScreeningModal({ 
  editingScreening, setEditingScreening,    // aktualnie edytowany seans i setter
  screeningForm, setScreeningForm,          // dane nowego seansu i setter
  setAddScreeningModal,                     // do zamykania modala
  movies,                                   // lista dostępnych filmów do wyboru
  addScreening,                             // funkcja dodania nowego seansu
  updateScreening                           // funkcja aktualizacji istniejącego seansu
}) {
  // sprawdczenie czy seans jest edytowany
  const isEdit = !!editingScreening;        
  
  // jeśli edytowany, użycie danych edytowanego seansu, inaczej formularza nowego seansu
  const data = isEdit ? editingScreening : screeningForm;

  // aktualizacja danych formularza podczas wpisywania
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditingScreening({ ...editingScreening, [name]: value }); // aktualizacja edytowanego seansu
    } else {
      setScreeningForm({ ...screeningForm, [name]: value });       // aktualizacja nowego seansu
    }
  };

  // funkcja zamykająca modal i resetująca formularze
  const close = () => {
    setEditingScreening(null);
    setAddScreeningModal(false);
    setScreeningForm({ movie_id: "", screening_time: "", hall_number: "" });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {/* nagłówek zależny od trybu */}
        <h3>{isEdit ? "Edytuj seans" : "Dodaj seans"}</h3>

        {/* wybór filmu */}
        <label>Film</label>
        <select 
          name="movie_id" 
          value={String(data.movie_id || "")}
          onChange={handleChange}
        >
          <option value="">-- wybierz film --</option>
          {movies.map(m => <option key={m.id} value={String(m.id)}>{m.title}</option>)}
        </select>

        {/* data i godzina seansu */}
        <label>Data i godzina</label>
        <input 
          name="screening_time" 
          type="datetime-local" 
          value={data.screening_time ? data.screening_time.slice(0, 16) : ""} // slice usuwa sekundy
          onChange={handleChange} 
        />

        {/* numer sali */}
        <label>Sala</label>
        <input name="hall_number" type="number" value={data.hall_number} onChange={handleChange} />

        {/* przyciski zapis/ anuluj */}
        <div className="modal-buttons">
          <button className="save-button" onClick={isEdit ? updateScreening : addScreening}>Zapisz</button>
          <button className="cancel-button" onClick={close}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}

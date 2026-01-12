import React from 'react';

export default function MovieModal({ 
  editingMovie, setEditingMovie,   // obiekt filmu
  movieForm, setMovieForm,         // dane formularza
  setAddMovieModal,                // do zamykania modala
  saveMovie                        // funkcja zapisująca film (POST lub PUT)
}) {
  const isEdit = !!editingMovie; // czy film jest edytowany
  const data = isEdit ? editingMovie : movieForm; // dane formularza

  // Obsługa zmiany wartości w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditingMovie({ ...editingMovie, [name]: value }); // aktualizacja przy edycji
    } else {
      setMovieForm({ ...movieForm, [name]: value }); // aktualizacja przy dodawaniu
    }
  };

  // Zamknięcie modala i reset formularza
  const close = () => {
    setEditingMovie(null);
    setAddMovieModal(false);
    setMovieForm({ title: "", duration: "", category: "", description: "" });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Nagłówek modala */}
        <h3>{isEdit ? "Edytuj film" : "Dodaj film"}</h3>

        {/* Pola formularza */}
        <label>Tytuł</label>
        <input name="title" value={data.title} onChange={handleChange} />

        <label>Czas trwania (min)</label>
        <input name="duration" type="number" value={data.duration} onChange={handleChange} />

        <label>Kategoria</label>
        <input name="category" value={data.category || ''} onChange={handleChange} />

        <label>Opis</label>
        <textarea name="description" value={data.description || ''} onChange={handleChange} />

        {/* Przyciski akcji */}
        <div className="modal-buttons">
          <button className="save-button" onClick={() => saveMovie(isEdit)}>Zapisz</button>
          <button className="cancel-button" onClick={close}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}

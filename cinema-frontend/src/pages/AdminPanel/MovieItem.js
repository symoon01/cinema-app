export const MovieItem = ({ movie, onEdit, onDelete }) => (
  <div className="admin-item">
    {/* Tytuł filmu, czas trwania i opcjonalnie kategoria */}
    <strong>{movie.title}</strong> ({movie.duration} min) {movie.category && `| ${movie.category}`}

    {/* Opis filmu – skracany do 150 znaków jeśli jest dłuższy */}
    {movie.description && (
      <p>{movie.description.length > 150 ? movie.description.slice(0, 150) + "..." : movie.description}</p>
    )}

    {/* Przyciski akcji: edytuj i usuń */}
    <div className="admin-actions">
      <button className="edit-button" onClick={() => onEdit(movie)}>Edytuj</button>
      <button className="delete-button" onClick={() => onDelete(movie.id)}>Usuń</button>
    </div>
  </div>
);
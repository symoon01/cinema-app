import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import './MyReservations.css';
import { toast } from 'react-toastify';

export default function MyReservations() {
  const { user, logout } = useContext(AuthContext); // pobranie tokena użytkownika i funkcji wylogowania z kontekstu
  const [reservations, setReservations] = useState([]); // przechowywanie listy rezerwacji

  // pobranie rezerwacji użytkownika po załadowaniu komponentu lub zmianie tokena
  useEffect(() => {
    if (!user?.token) return; // brak tokena -> brak akcji

    const fetchReservations = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/my`, {
          headers: { 'Authorization': `Bearer ${user.token}` }, // uwierzytelnienie tokenem
        });

        if (res.ok) {
          const data = await res.json(); // odczyt danych z odpowiedzi
          setReservations(data); // zapisanie rezerwacji w stanie
        } else if (res.status === 401) {
          logout(); // token wygasł -> wylogowanie
        } else {
          console.error("Błąd pobierania rezerwacji:", res.status); // logowanie innych błędów
        }
      } catch (err) {
        console.error("Błąd fetch:", err); // obsługa błędów sieciowych
      }
    };

    fetchReservations(); // wywołanie funkcji pobierania
  }, [user?.token, logout]);

  // obsługa anulowania rezerwacji
  const handleCancel = async (id) => {
    if (!window.confirm("Na pewno anulować rezerwację?")) return; // potwierdzenie akcji

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` }, // uwierzytelnienie tokenem
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message); // komunikat powodzenia
      setReservations(reservations.filter(r => r.id !== id)); // usunięcie anulowanej rezerwacji ze stanu
    } else {
      toast.error(data.error); // wyświetlenie błędu
    }
  };

  // wyświetlenie komunikatu, jeśli brak rezerwacji
  if (reservations.length === 0) {
    return <p style={{ padding: 20 }}>Nie masz żadnych rezerwacji</p>;
  }

  // renderowanie listy rezerwacji
  return (
    <div className="myreservations-container">
      {reservations.map(r => {
        const screeningDate = new Date(r.screening_time); // konwersja daty seansu
        const isPast = screeningDate <= new Date(); // sprawdzenie, czy seans już się odbył

        return (
          <div
            key={r.id}
            className={`reservation-card ${isPast ? 'past' : ''}`} // wyróżnienie zakończonych seansów
          >
            <h3>{r.title}</h3>
            <p><strong>Seans:</strong> {screeningDate.toLocaleString()}</p>
            <p><strong>Sala:</strong> {r.hall_number}</p>
            <p><strong>Miejsce:</strong> rząd {r.row_number}, miejsce {r.seat_number}</p>

            {/* przycisk anulowania dostępny tylko dla przyszłych seansów */}
            {!isPast && (
              <button className="cancel-btn" onClick={() => handleCancel(r.id)}>
                Anuluj
              </button>
            )}

            {/* etykieta zakończonego seansu */}
            {isPast && (
              <span className="finished-label">Zakończony</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from "react";
import './MyReservations.css';
import { toast } from 'react-toastify';
import { useUser, useClerk, useAuth  } from "@clerk/clerk-react";

export default function MyReservations() {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();

  const [reservations, setReservations] = useState([]); // przechowywanie listy rezerwacji

  // pobranie rezerwacji użytkownika po załadowaniu komponentu lub zmianie tokena
  useEffect(() => {
    if (!isSignedIn) return; // brak tokena -> brak akcji

    const fetchReservations = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/my`, {
          headers: { 'Authorization': `Bearer ${token || ""}` } // uwierzytelnienie tokenem
        });

        if (res.ok) {
          const data = await res.json(); // odczyt danych z odpowiedzi
          setReservations(data); // zapisanie rezerwacji w stanie
        } else if (res.status === 401) {
          await signOut(); // token wygasł -> wylogowanie
        } else {
          console.error("Błąd pobierania rezerwacji:", res.status); // logowanie innych błędów
        }
      } catch (err) {
        console.error("Błąd fetch:", err); // obsługa błędów sieciowych
      }
    };

    fetchReservations(); // wywołanie funkcji pobierania
  }, [isSignedIn, getToken, signOut]); // zależności: isSignedIn, getToken, signOut

  // obsługa anulowania rezerwacji
  const handleCancel = async (id) => {
    const token = await getToken();
    if (!window.confirm("Na pewno anulować rezerwację?")) return; // potwierdzenie akcji

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/${id}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token || ""}` } // uwierzytelnienie tokenem
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

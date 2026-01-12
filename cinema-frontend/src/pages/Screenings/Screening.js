import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './Screening.css'; // import stylów dla komponentu
import { toast } from 'react-toastify';

export default function Screening() {
  const { id } = useParams(); // pobranie ID seansu z URL
  const { user } = useContext(AuthContext); // pobranie tokenu i danych użytkownika
  const [seats, setSeats] = useState([]); // lista miejsc w sali
  const [movieInfo, setMovieInfo] = useState(null); // informacje o filmie
  const [screeningTime, setScreeningTime] = useState(null); // data i godzina seansu
  const [hallNumber, setHallNumber] = useState(null); // numer sali

  // pobranie miejsc z serwera
  const fetchSeats = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/seats/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setSeats(Array.isArray(data) ? data : []); // zapisanie miejsc
      else toast.error(data.error || "Błąd ładowania miejsc");
    } catch (err) {
      console.error(err);
      toast.error("Błąd sieci podczas pobierania miejsc");
    }
  };

  // pobranie informacji o filmie z serwera
  const fetchMovie = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/screenings/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // zapisanie informacji o filmie i seansie
        setMovieInfo({
          title: data.title,
          category: data.category,
          description: data.description
        });
        setScreeningTime(data.screening_time);
        setHallNumber(data.hall_number);
      } else {
        toast.error(data.error || "Błąd ładowania informacji o filmie");
      }
    } catch (err) {
      console.error(err);
      toast.error("Błąd sieci podczas pobierania filmu");
    }
  };

  // wywołanie pobrania danych przy załadowaniu komponentu lub zmianie ID seansu
  useEffect(() => {
    fetchSeats();
    fetchMovie();
  }, [id]);

  // rezerwacja miejsca
  const handleReserve = async (seatId) => {
    const seat = seats.find(s => s.seat_id == seatId);
    //potwierdzenie rezerwacji
    if (!window.confirm(`Na pewno chcesz zarezerwować miejsce ${seat.seat_number} w rzędzie ${seat.row_number} ?`)) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ screeningId: id, seatId })
      });
      const data = await res.json();
      if (res.ok) {
        // wyświetlenie komunikatu o sukcesie i odświeżenie miejsc
        toast.success(`Zarezerwowano miejsce ${seat.seat_number} w rzędzie ${seat.row_number}`);
        fetchSeats();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Błąd sieci");
    }
  };

  // pogrupowanie miejsc w rzędach
  const getRows = (seats) => {
    const rows = {};
    seats.forEach(seat => {
      if (!rows[seat.row_number]) rows[seat.row_number] = [];
      rows[seat.row_number].push(seat);
    });
    return Object.keys(rows)
      .sort((a, b) => a - b) // sortowanie rzędów po numerach
      .map(rowNumber => rows[rowNumber]);
  };

  const totalSeats = seats.length; // całkowita liczba miejsc
  const freeSeats = seats.filter(seat => !seat.reserved).length; // liczba wolnych miejsc

  if (!movieInfo) return <p>Ładowanie informacji o seansie...</p>; // wyświetlenie komunikatu podczas ładowania

  return (
    <div style={{ padding: 20 }}>
      {/* ===== INFORMACJE O FILMIE ===== */}
      <div style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
        <h1>{movieInfo.title}</h1>
        {movieInfo.category && <p><strong>Kategoria:</strong> {movieInfo.category}</p>}
        {movieInfo.description && <p>{movieInfo.description}</p>}
        {screeningTime && <p><strong>Data seansu:</strong> {new Date(screeningTime).toLocaleString()}</p>}
        {hallNumber && <p><strong>Sala:</strong> {hallNumber}</p>}
        <p><strong>Dostępne miejsca:</strong> {freeSeats} / {totalSeats}</p>
      </div>

      {/* ===== LEGENDA ===== */}
      <div style={{ marginBottom: 10 }}>
        <span style={{ background: '#28a745', color: 'white', padding: '5px 10px', borderRadius: 5, marginRight: 10 }}>Wolne</span>
        <span style={{ background: '#dc3545', color: 'white', padding: '5px 10px', borderRadius: 5 }}>Zajęte</span>
      </div>

      {/* ===== MIEJSCA ===== */}
      <div style={{ marginTop: 10 }}>
        {getRows(seats).map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
            {row.map(seat => (
              <button
                key={seat.seat_id}
                disabled={seat.reserved} // zablokowanie przycisku dla zajętych miejsc
                className={`seat ${seat.reserved ? 'reserved' : 'available'}`}
                onClick={() => handleReserve(seat.seat_id)} // rezerwacja miejsca po kliknięciu
              >
                {seat.seat_number}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

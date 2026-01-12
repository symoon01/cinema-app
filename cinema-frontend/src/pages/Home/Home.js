import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import './Home.css';
import { toast } from 'react-toastify';

export default function Home() {
  const [screenings, setScreenings] = useState([]); // przechowywanie listy aktywnych seansów
  const navigate = useNavigate(); // umożliwia nawigację do strony seansu
  const { user } = useContext(AuthContext); // pobranie danych zalogowanego użytkownika (jeśli istnieje)

  // pobranie aktywnych seansów przy pierwszym renderze lub zmianie tokena użytkownika
  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/screenings/active`, {
          method: 'GET'
        });

        const data = await res.json();
        setScreenings(Array.isArray(data) ? data : []); // ustawienie listy seansów, zapewnienie tablicy
      } catch (err) {
        console.error(err);
        toast.error("Błąd ładowania seansów"); // wyświetlenie komunikatu w przypadku błędu
      }
    };

    fetchScreenings(); // wywołanie funkcji pobierającej seanse
  }, [user?.token]);

  return (
    <div className="home-container">
      <h1 className="home-title">Dostępne seanse</h1>

      {/* lista kart seansów */}
      <div className="screenings-list">
        {screenings.map(screening => (
          <div key={screening.id} className="screening-card">
            {/* tytuł filmu */}
            <h2 className="screening-title">{screening.title}</h2>

            {/* kategoria filmu */}
            <p className="screening-category">{screening.category}</p>

            {/* opis filmu z ograniczeniem do 150 znaków */}
            <p className="screening-description">
              {screening.description.length > 150
                ? screening.description.slice(0, 150) + "..."
                : screening.description
              }
            </p>

            {/* data i godzina seansu */}
            <p className="screening-time">{new Date(screening.screening_time).toLocaleString()}</p>

            {/* numer sali */}
            <p className="screening-hall">Sala {screening.hall_number}</p>

            {/* przycisk rezerwacji – przeniesienie do strony konkretnego seansu */}
            <button 
              className="reserve-button"
              onClick={() => navigate(`/screening/${screening.id}`)}
            >
              Zarezerwuj
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

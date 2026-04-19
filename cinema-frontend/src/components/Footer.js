import { Link } from "react-router-dom";
import "./Footer.css";
import { useUser } from "@clerk/clerk-react";

export default function Footer() {
  const { isSignedIn } = useUser();

  return (
    <footer className="footer">
      {/* LEWA SEKCJA - logo i opis */}
      <div className="footer-section">
        <h3 className="footer-logo">MyCinema</h3>
        <p className="footer-desc">
          Strona stworzona w ramach projektu z zajęć.<br />
          System rezerwacji miejsc w kinie.
        </p>
      </div>

      {/* ŚRODKOWA SEKCJA - kontakt */}
      <div className="footer-section footer-center">
        <p>Kontakt:</p>
        <a href="mailto:kontakt@mycinema.pl">kontakt@mycinema.pl</a>
      </div>

      {/* PRAWA SEKCJA - linki w zależności od stanu logowania */}
      <div className="footer-section footer-right">
        {/* Jeśli zalogowany, wyświetl link do strony głównej */}
        {isSignedIn &&
        <Link to="/" className="footer-btn">Home</Link>
        }

        {/* Jeśli niezalogowany, wyświetl przyciski logowania i rejestracji */}
        {!isSignedIn && (
          <>
            <Link to="/login" className="footer-btn footer-btn-green">
              Zaloguj
            </Link>
            <Link to="/register" className="footer-btn footer-btn-green">
              Zarejestruj
            </Link>
          </>
        )}
      </div>
    </footer>
  );
}

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import './Navbar.css';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useContext(AuthContext); // pobranie stanu autoryzacji z kontekstu
  const navigate = useNavigate(); // hook do programowej nawigacji

  // Obsługa wylogowania
  const handleLogout = () => {
    logout(); // reset stanu w AuthContext
    toast.success("Wylogowano pomyślnie"); // powiadomienie użytkownika
    navigate("/login"); // przekierowanie na stronę logowania
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Link do strony głównej */}
        <Link to="/">Home</Link>

        {/* Linki dostępne tylko dla zalogowanych użytkowników */}
        {isLoggedIn && <Link to="/myreservations">Moje rezerwacje</Link>}
        {isLoggedIn && <Link to="/profile">Profil</Link>}
        
        {/* Link do panelu admina – tylko dla użytkowników z rolą ADMIN */}
        {isLoggedIn && user?.role === "ADMIN" && <Link to="/admin">Panel Administratora</Link>}
      </div>

      <div className="nav-right">
        {isLoggedIn && user ? (
          <>
            {/* Powitanie zalogowanego użytkownika */}
            <span className="welcome">Witaj, {user.username}</span>

            {/* Przycisk wylogowania */}
            <button className="logout-btn" onClick={handleLogout}>Wyloguj</button>
          </>
        ) : (
          <>
            {/* Przyciski logowania i rejestracji dla niezalogowanych */}
            <Link to="/login"><button className="login-btn">Zaloguj</button></Link>
            <Link to="/register"><button className="register-btn">Zarejestruj</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

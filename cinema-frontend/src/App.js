import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Screening from "./pages/Screenings/Screening";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import MyReservations from "./pages/MyReservations/MyReservations";
import Profile from "./pages/Profile/Profile";

import "./App.css";
import { ToastContainer } from 'react-toastify';

function App() {
  const { loading, isLoggedIn, user, login, logout } = useContext(AuthContext);

  // Odświeżanie tokena co 30 minut, jeśli użytkownik jest zalogowany
  useEffect(() => {
    if (!user?.token || !isLoggedIn) return;

    const refreshToken = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/refreshtoken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          // Token odświeżony – aktualizacja w kontekście
          const data = await response.json();
          login({ ...user, token: data.token });
        } else if (response.status === 401) {
          // Token nieważny lub wygasł – wymuszenie wylogowania
          console.warn("Token nieważny lub wygasł – wylogowanie");
          logout();
        } else {
          // Inny błąd serwera
          console.error("Błąd odświeżania tokena:", response.status, response.statusText);
        }
      } catch (err) {
        // Błąd sieci lub serwera
        console.error("Błąd sieci podczas odświeżania tokena:", err);
        logout();
      }
    };

    const intervalId = setInterval(refreshToken, 30 * 60 * 1000); // 30 minut
    return () => clearInterval(intervalId); // czyszczenie interwału przy zmianie user lub wylogowaniu
  }, [isLoggedIn, user, login, logout]);

  // Wyświetlenie komunikatu ładowania, dopóki AuthContext nie załaduje stanu
  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <Router>
      {/* Kontener powiadomień */}
      <ToastContainer autoClose={1500} />

      {/* Nawigacja */}
      <Navbar />

      <div className="app-wrapper">
        <Routes>
          {/* Strona główna */}
          <Route path="/" element={<Home />} />

          {/* Szczegóły seansu – dostępne tylko dla zalogowanych */}
          <Route path="/screening/:id" element={isLoggedIn ? <Screening /> : <Navigate to="/login" />} />

          {/* Panel administratora – tylko dla zalogowanych z rolą ADMIN */}
          <Route path="/admin" element={isLoggedIn && user?.role === "ADMIN" ? <AdminPanel /> : <Navigate to="/" />} />

          {/* Logowanie i rejestracja */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Moje rezerwacje – dostępne tylko dla zalogowanych */}
          <Route path="/myreservations" element={isLoggedIn ? <MyReservations /> : <Navigate to="/login" />} />

          {/* Profil użytkownika – dostępne tylko dla zalogowanych */}
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>

      {/* Stopka */}
      <Footer />
    </Router>
  );
}

export default App;

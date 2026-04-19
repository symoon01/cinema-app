import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, useUser } from "@clerk/clerk-react";

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
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "ADMIN";

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
          <Route path="/screening/:id" element={
              <SignedIn>
                <Screening />
              </SignedIn>
            }
          />

          {/* Panel administratora – tylko dla zalogowanych z rolą ADMIN */}
          <Route path="/admin" element={
              <SignedIn>
              {isAdmin ? (
                <AdminPanel />
              ) : (
                <Navigate to="/" />
              )}
              </SignedIn>
            }
            
          />

          {/* Logowanie i rejestracja */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Moje rezerwacje – dostępne tylko dla zalogowanych */}
          <Route path="/myreservations" element={              
              <SignedIn>
                <MyReservations />
              </SignedIn>
            }
          />

          {/* Profil użytkownika – dostępne tylko dla zalogowanych */}
          <Route path="/profile" element={              
              <SignedIn>
                <Profile />
              </SignedIn>
            }
          />
        </Routes>
      </div>

      {/* Stopka */}
      <Footer />
    </Router>
  );
}

export default App;

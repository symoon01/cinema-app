import React, { createContext, useState, useEffect } from "react";

// Tworzenie kontekstu autoryzacji
export const AuthContext = createContext();

// Provider autoryzacji dla całej aplikacji
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Obiekt użytkownika: { token, username, role, email }
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Flaga zalogowania
  const [loading, setLoading] = useState(true); // Flaga ładowania przy inicjalizacji

  // Sprawdzenie danych w localStorage przy starcie aplikacji
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (token) {
      // Jeśli token istnieje, ustawiamy stan użytkownika i zalogowania
      setUser({ token, username, email, role });
      setIsLoggedIn(true);
    }
    setLoading(false); // zakończenie ładowania
  }, []);

  // Funkcja logowania – zapisuje token i dane użytkownika w localStorage i stanie kontekstu
  const login = (data) => {
    localStorage.setItem("jwtToken", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);

    setUser(data); // aktualizacja stanu użytkownika
    setIsLoggedIn(true); // oznaczenie użytkownika jako zalogowanego
  };

  // Funkcja wylogowania – usuwa dane z localStorage i resetuje stan kontekstu
  const logout = () => {
    localStorage.clear(); // czyszczenie całego localStorage
    setUser(null); // reset użytkownika
    setIsLoggedIn(false); // reset flagi zalogowania
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {children /* renderowanie dzieci w kontekście */}
    </AuthContext.Provider>
  );
}

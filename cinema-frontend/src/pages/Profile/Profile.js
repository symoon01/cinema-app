import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, logout } = useContext(AuthContext); // pobranie tokena i funkcji wylogowania z kontekstu
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null); // przechowywanie danych profilu
  const [oldPassword, setOldPassword] = useState(""); // przechowywanie starego hasła
  const [newPassword, setNewPassword] = useState(""); // przechowywanie nowego hasła

  const authHeader = { Authorization: `Bearer ${user.token}` }; // nagłówek autoryzacji

  // pobranie danych profilu przy załadowaniu komponentu
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/me`, { headers: authHeader });
      if (res.ok) setProfile(await res.json()); // zapisanie danych profilu w stanie
      else logout(); // brak autoryzacji -> wylogowanie
    };
    fetchProfile();
  }, [user.token]);

  // zmiana hasła użytkownika
  const handleChangePassword = async (e) => {
    e.preventDefault();
    // walidacja pól
    if (!oldPassword || !newPassword) {
      toast.error("Wszystkie pola są wymagane");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Nowe hasło musi mieć minimum 6 znaków");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("hasła nie mogą być takie same");
      return;
    }

    // wysłanie żądania zmiany hasła
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/password`, {
      method: "PUT",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    const data = await res.json();

    if (res.ok) {
      toast.success("Hasło zmienione pomyślnie"); // komunikat powodzenia
      setOldPassword(""); // wyczyszczenie pola starego hasła
      setNewPassword(""); // wyczyszczenie pola nowego hasła
    } else {
      toast.error(data.error || "Błąd zmiany hasła"); // wyświetlenie błędu
    }
  };

  // dezaktywacja konta
  const handleDeactivate = async () => {
    if (!window.confirm("Czy na pewno chcesz zdezaktywować konto?")) return; // potwierdzenie akcji
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      method: "DELETE",
      headers: authHeader
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(data.message); // komunikat powodzenia
      logout(); // wylogowanie po dezaktywacji
    } else {
      toast.error(data.error || "Błąd dezaktywacji konta"); // wyświetlenie błędu
    }
  };

  // wyświetlenie komunikatu podczas ładowania danych profilu
  if (!profile) return <div className="profile-container">Ładowanie...</div>;

  // renderowanie informacji profilu, formularza zmiany hasła i przycisku dezaktywacji
  return (
    <div className="profile-container">
      <h1>Profil użytkownika</h1>

      {/* informacje o profilu */}
      <div className="profile-info">
        <p><strong>Login:</strong> {profile.login}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Rola:</strong> {profile.role}</p>
        <p><strong>Utworzono:</strong> {new Date(profile.created_at).toLocaleString()}</p>
      </div>

      {/* formularz zmiany hasła */}
      <h2>Zmień hasło</h2>
      <form onSubmit={handleChangePassword} className="profile-form">
        <label>Stare hasło</label>
        <input
          type="password"
          placeholder="Stare hasło"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <label>Nowe hasło</label>
        <input
          type="password"
          placeholder="Nowe hasło"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="change-password-btn">Zmień hasło</button>
      </form>

      {/* przycisk dezaktywacji konta */}
      <h2>Dezaktywacja konta</h2>
      <button className="deactivate-btn" onClick={handleDeactivate}>
        Dezaktywuj konto
      </button>
    </div>
  );
}
